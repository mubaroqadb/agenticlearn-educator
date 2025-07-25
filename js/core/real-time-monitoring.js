// ===== REAL-TIME MONITORING SYSTEM =====

// Note: This module will use global objects that are loaded dynamically
// import { apiClient } from './api-client.js';
// import { mathCalculations } from './mathematical-calculations.js';
// import { UIComponents } from '../components/ui-components.js';
// import { formatDate, formatTime, showSuccess, showError } from './utils.js';

// ===== UTILITY FUNCTIONS =====

function formatTime(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
}

function showSuccess(message) {
    console.log(`✅ ${message}`);
    if (window.UIComponents) {
        window.UIComponents.showNotification(message, 'success', 3000);
    }
}

function showError(message) {
    console.error(`❌ ${message}`);
    if (window.UIComponents) {
        window.UIComponents.showNotification(message, 'error', 5000);
    }
}

export class RealTimeMonitoring {
    constructor() {
        this.isActive = false;
        this.intervals = new Map();
        this.websocket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.lastUpdate = null;
        this.monitoringData = {
            students: [],
            activities: [],
            analytics: {},
            systemHealth: {}
        };
    }

    // ===== INITIALIZATION =====

    async initialize() {
        console.log('🔄 Initializing Real-time Monitoring System...');
        try {
            await this.startPolling();
            this.setupWebSocket();
            this.setupEventListeners();
            this.isActive = true;
            console.log('✅ Real-time Monitoring System initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Real-time Monitoring:', error);
            return false;
        }
    }

    // ===== POLLING SYSTEM =====

    startPolling() {
        this.stopPolling(); // Clear any existing intervals

        // Student data polling (every 30 seconds)
        this.intervals.set('students', setInterval(async () => {
            try {
                await this.updateStudentData();
            } catch (error) {
                console.error('Student data polling error:', error);
            }
        }, 30000));

        // Activity feed polling (every 15 seconds)
        this.intervals.set('activities', setInterval(async () => {
            try {
                await this.updateActivityFeed();
            } catch (error) {
                console.error('Activity feed polling error:', error);
            }
        }, 15000));

        // Analytics polling (every 2 minutes)
        this.intervals.set('analytics', setInterval(async () => {
            try {
                await this.updateAnalytics();
            } catch (error) {
                console.error('Analytics polling error:', error);
            }
        }, 120000));

        // System health polling (every 5 minutes)
        this.intervals.set('health', setInterval(async () => {
            try {
                await this.updateSystemHealth();
            } catch (error) {
                console.error('System health polling error:', error);
            }
        }, 300000));

        console.log('✅ Real-time polling started');
    }

    stopPolling() {
        this.intervals.forEach((interval, key) => {
            clearInterval(interval);
            this.intervals.delete(key);
        });
        console.log('🛑 Real-time polling stopped');
    }

    // ===== DATA UPDATE METHODS =====

    async updateStudentData() {
        try {
            // Use global educatorAPI if available
            if (!window.educatorAPI) {
                console.warn('educatorAPI not available for student data update');
                return;
            }

            const response = await window.educatorAPI.request('/api/agenticlearn/educator/students/list');
            if (response && response.success && response.data) {
                const previousData = this.monitoringData.students;
                this.monitoringData.students = response.data;

                // Detect changes and notify
                this.detectStudentChanges(previousData, response.data);

                // Update UI if student page is active
                if (this.isPageActive('students')) {
                    this.updateStudentUI(response.data);
                }

                this.lastUpdate = new Date();
                this.updateLastUpdateTime();
            }
        } catch (error) {
            console.error('Failed to update student data:', error);
        }
    }

    async updateActivityFeed() {
        try {
            // Simulate activity feed data (replace with actual API call)
            const activities = await this.generateActivityFeed();
            this.monitoringData.activities = activities;
            
            // Update UI if dashboard is active
            if (this.isPageActive('beranda')) {
                this.updateActivityFeedUI(activities);
            }
        } catch (error) {
            console.error('Failed to update activity feed:', error);
        }
    }

    async updateAnalytics() {
        try {
            // Use global educatorAPI if available
            if (!window.educatorAPI) {
                console.warn('educatorAPI not available for analytics update');
                return;
            }

            const response = await window.educatorAPI.request('/api/agenticlearn/educator/analytics/dashboard');
            if (response && response.success && response.data) {
                this.monitoringData.analytics = response.data;

                // Update analytics UI if active
                if (this.isPageActive('analytics') || this.isPageActive('beranda')) {
                    this.updateAnalyticsUI(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to update analytics:', error);
        }
    }

    async updateSystemHealth() {
        try {
            // Calculate system health metrics
            const health = {
                uptime: this.calculateUptime(),
                responseTime: await this.measureResponseTime(),
                activeUsers: this.monitoringData.students.filter(s => s.status === 'online').length,
                systemLoad: Math.random() * 100, // Simulate system load
                timestamp: new Date().toISOString()
            };
            
            this.monitoringData.systemHealth = health;
            this.updateSystemHealthUI(health);
        } catch (error) {
            console.error('Failed to update system health:', error);
        }
    }

    // ===== WEBSOCKET SYSTEM =====

    setupWebSocket() {
        // Note: WebSocket URL should come from backend configuration
        const wsUrl = 'wss://api.agenticlearn.com/ws/educator'; // Replace with actual URL
        
        try {
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = () => {
                console.log('✅ WebSocket connected');
                this.reconnectAttempts = 0;
                showSuccess('Real-time connection established');
            };
            
            this.websocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('WebSocket message parsing error:', error);
                }
            };
            
            this.websocket.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.attemptReconnect();
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('WebSocket setup failed:', error);
            // Fall back to polling only
        }
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'student_update':
                this.handleStudentUpdate(data.payload);
                break;
            case 'new_activity':
                this.handleNewActivity(data.payload);
                break;
            case 'system_alert':
                this.handleSystemAlert(data.payload);
                break;
            case 'analytics_update':
                this.handleAnalyticsUpdate(data.payload);
                break;
            default:
                console.log('Unknown WebSocket message type:', data.type);
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Attempting WebSocket reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.setupWebSocket();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.log('❌ Max WebSocket reconnection attempts reached');
            showError('Real-time connection lost. Using polling mode.');
        }
    }

    // ===== CHANGE DETECTION =====

    detectStudentChanges(previousData, currentData) {
        if (!previousData || previousData.length === 0) return;
        
        const changes = [];
        
        currentData.forEach(current => {
            const previous = previousData.find(p => p.student_id === current.student_id);
            if (previous) {
                // Check for status changes
                if (previous.status !== current.status) {
                    changes.push({
                        type: 'status_change',
                        student: current,
                        from: previous.status,
                        to: current.status
                    });
                }
                
                // Check for progress changes
                if (previous.progress_percentage !== current.progress_percentage) {
                    const progressDiff = current.progress_percentage - previous.progress_percentage;
                    if (progressDiff >= 5) { // Significant progress
                        changes.push({
                            type: 'progress_milestone',
                            student: current,
                            progress: progressDiff
                        });
                    }
                }
                
                // Check for risk level changes
                if (previous.risk_level !== current.risk_level) {
                    changes.push({
                        type: 'risk_change',
                        student: current,
                        from: previous.risk_level,
                        to: current.risk_level
                    });
                }
            }
        });
        
        // Process changes
        changes.forEach(change => this.processStudentChange(change));
    }

    processStudentChange(change) {
        switch (change.type) {
            case 'status_change':
                if (change.to === 'online') {
                    this.showNotification(`${change.student.name} is now online`, 'info');
                }
                break;
            case 'progress_milestone':
                this.showNotification(`${change.student.name} made significant progress (+${change.progress}%)`, 'success');
                break;
            case 'risk_change':
                if (change.to === 'high') {
                    this.showNotification(`⚠️ ${change.student.name} is now at high risk`, 'warning');
                }
                break;
        }
    }

    // ===== UI UPDATE METHODS =====

    updateStudentUI(students) {
        const container = document.getElementById('students-list');
        if (container) {
            // Update student cards with real-time data
            students.forEach(student => {
                const studentCard = container.querySelector(`[data-student-id="${student.student_id}"]`);
                if (studentCard) {
                    this.updateStudentCard(studentCard, student);
                }
            });
        }
    }

    updateStudentCard(card, student) {
        // Update status indicator
        const statusElement = card.querySelector('.student-status');
        if (statusElement) {
            statusElement.textContent = student.status;
            statusElement.className = `student-status status-${student.status}`;
        }
        
        // Update progress bar
        const progressBar = card.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = `${student.progress_percentage}%`;
        }
        
        // Update last active time
        const lastActiveElement = card.querySelector('.last-active');
        if (lastActiveElement) {
            lastActiveElement.textContent = `Last active: ${formatTime(student.last_activity)}`;
        }
    }

    updateActivityFeedUI(activities) {
        const container = document.getElementById('activity-feed');
        if (container) {
            const activitiesHTML = activities.map(activity => `
                <div class="activity-item" style="
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--accent);
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                ">
                    <div style="
                        width: 40px;
                        height: 40px;
                        background: ${this.getActivityColor(activity.type)};
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1rem;
                        flex-shrink: 0;
                    ">
                        ${this.getActivityIcon(activity.type)}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: var(--gray-800);">
                            ${activity.title}
                        </div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">
                            ${activity.description}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--gray-500);">
                            ${formatTime(activity.timestamp)}
                        </div>
                    </div>
                </div>
            `).join('');
            
            container.innerHTML = activitiesHTML;
        }
    }

    updateLastUpdateTime() {
        const elements = document.querySelectorAll('#last-update-time, .last-update');
        elements.forEach(element => {
            if (element) {
                element.textContent = formatTime(this.lastUpdate);
            }
        });
    }

    // ===== UTILITY METHODS =====

    isPageActive(pageId) {
        const page = document.getElementById(`page-${pageId}`);
        return page && page.classList.contains('active');
    }

    showNotification(message, type) {
        if (window.UIComponents) {
            window.UIComponents.showNotification(message, type, 5000);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    getActivityColor(type) {
        const colors = {
            login: 'var(--success)',
            progress: 'var(--primary)',
            completion: 'var(--info)',
            message: 'var(--warning)',
            alert: 'var(--error)'
        };
        return colors[type] || 'var(--gray-500)';
    }

    getActivityIcon(type) {
        const icons = {
            login: '👋',
            progress: '📈',
            completion: '✅',
            message: '💬',
            alert: '⚠️'
        };
        return icons[type] || '📌';
    }

    async generateActivityFeed() {
        try {
            // Get real activity data from backend
            const studentsResponse = await window.educatorAPI?.request('/api/agenticlearn/educator/students/list');
            if (studentsResponse && studentsResponse.success && studentsResponse.data) {
                // Transform student data into activity feed
                const activities = studentsResponse.data.map((student, index) => ({
                    id: `act_${student.student_id}`,
                    type: student.days_since_active <= 1 ? 'login' : 'progress',
                    title: `${student.name} ${student.days_since_active <= 1 ? 'recently active' : 'making progress'}`,
                    description: `Progress: ${student.progress_percentage}% | Score: ${student.average_score}% | Risk: ${student.risk_level}`,
                    timestamp: student.last_active
                }));

                return activities.slice(0, 5); // Limit to 5 most recent
            }

            // If no backend data available, return empty array
            return [];
        } catch (error) {
            console.error('Failed to load real activity feed:', error);
            return [];
        }
    }

    calculateUptime() {
        // Calculate system uptime (simplified)
        const startTime = localStorage.getItem('system_start_time') || Date.now();
        const uptime = Date.now() - parseInt(startTime);
        return Math.floor(uptime / (1000 * 60 * 60)); // Hours
    }

    async measureResponseTime() {
        const start = Date.now();
        try {
            if (window.educatorAPI) {
                await window.educatorAPI.request('/api/agenticlearn/educator/analytics/dashboard');
                return Date.now() - start;
            }
            return -1;
        } catch (error) {
            return -1; // Error indicator
        }
    }

    // ===== CLEANUP =====

    destroy() {
        this.stopPolling();
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.isActive = false;
        console.log('🛑 Real-time Monitoring System destroyed');
    }
}

// Create and export singleton instance
export const realTimeMonitoring = new RealTimeMonitoring();

// Make it globally available
window.realTimeMonitoring = realTimeMonitoring;
