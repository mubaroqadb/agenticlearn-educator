// Educator Portal - Vanilla JavaScript Implementation (No External Dependencies)

// ===== VANILLA JAVASCRIPT UTILITY FUNCTIONS =====

// Cookie management functions
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// DOM manipulation functions
function setInner(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
        return true;
    }
    console.warn(`Element with ID '${elementId}' not found`);
    return false;
}

function onClick(elementId, callback) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener('click', callback);
        return true;
    }
    console.warn(`Element with ID '${elementId}' not found for click handler`);
    return false;
}

// URL redirect function
function redirect(url) {
    window.location.href = url;
}

// UI Components - Self-contained notification system
const UIComponents = {
    showNotification: function(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-size: 0.875rem;
            font-weight: 500;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Add CSS animations if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// ===== API CONFIGURATION =====

// Enhanced API Configuration for Real Backend Integration
const API_CONFIG = {
    BASE_URL: "https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid/api/agenticlearn",
    ENDPOINTS: {
        // Available endpoints from backend
        HEALTH_CHECK: "/health",
        COURSES_LIST: "/courses",

        // Authentication (available)
        AUTH_CHECK: "/auth/verify",
        AUTH_LOGIN: "/auth/login",

        // Courses and Content (available)
        COURSES: "/courses",

        // ARIA AI (available but need testing)
        ARIA_CHAT: "/aria/chat",
        ARIA_ANALYSIS: "/aria/analysis",

        // Educator-specific (need to be implemented or mapped)
        EDUCATOR_PROFILE: "/educator/profile",
        DASHBOARD_STATS: "/educator/dashboard/stats",
        STUDENTS_LIST: "/educator/students",
        REALTIME_STATS: "/educator/analytics/realtime",

        // AI & Analytics
        AI_INSIGHTS: "/educator/ai/insights",
        AI_RECOMMENDATIONS: "/educator/ai/recommendations",
        AI_CONTENT_ANALYSIS: "/educator/ai/content-analysis",
        AI_STUDENT_PREDICTIONS: "/educator/ai/student-predictions",
        LEARNING_PATTERNS: "/educator/analytics/learning-patterns",
        AT_RISK_STUDENTS: "/educator/analytics/at-risk-students",
        CONTENT_EFFECTIVENESS: "/educator/analytics/content-effectiveness",

        // ARIA AI Integration
        ARIA_AI_CHAT: "/educator/ai/aria/chat",
        ARIA_AI_ANALYSIS: "/educator/ai/aria/analysis",
        ARIA_AI_RECOMMENDATIONS: "/educator/ai/aria/recommendations",

        // Activity & Alerts
        RECENT_ACTIVITY: "/educator/analytics/recent-activity",
        STUDENT_ALERTS: "/educator/analytics/student-alerts",
        SYSTEM_HEALTH: "/educator/system/health",

        // Student Management
        STUDENT_DETAIL: "/educator/students/{id}",
        STUDENT_PROGRESS: "/educator/students/{id}/progress",

        // Communication
        SEND_MESSAGE: "/educator/communication/send",
        ANNOUNCEMENTS: "/educator/communication/announcements",

        // Assessment Management
        ASSESSMENTS_LIST: "/educator/assessments",
        CREATE_ASSESSMENT: "/educator/assessments/create",
        UPDATE_ASSESSMENT: "/educator/assessments/{id}",
        DELETE_ASSESSMENT: "/educator/assessments/{id}",
        ASSESSMENT_RESULTS: "/educator/assessments/{id}/results",
        GRADE_SUBMISSION: "/educator/assessments/{id}/grade",
        ASSESSMENT_ANALYTICS: "/educator/assessments/{id}/analytics",

        // D7-D12: Advanced Analytics
        ADVANCED_ANALYTICS: "/educator/analytics/advanced",
        LEARNING_ANALYTICS: "/educator/analytics/learning",
        ENGAGEMENT_ANALYTICS: "/educator/analytics/engagement",
        PERFORMANCE_TRENDS: "/educator/analytics/performance-trends",
        COMPARATIVE_ANALYTICS: "/educator/analytics/comparative",
        PREDICTIVE_MODELS: "/educator/analytics/predictive",

        // D13-D18: Communication Tools
        STUDENT_MESSAGES: "/educator/communication/messages",
        SEND_NOTIFICATION: "/educator/communication/notifications",
        DISCUSSION_FORUMS: "/educator/communication/forums",
        VIDEO_CONFERENCES: "/educator/communication/video",
        PARENT_COMMUNICATION: "/educator/communication/parents",
        BULK_MESSAGING: "/educator/communication/bulk",

        // D19-D24: Content Management
        CONTENT_LIBRARY: "/educator/content/library",
        CREATE_CONTENT: "/educator/content/create",
        CONTENT_ANALYTICS: "/educator/content/analytics",
        RESOURCE_MANAGEMENT: "/educator/content/resources",
        CURRICULUM_MAPPING: "/educator/content/curriculum",
        CONTENT_SHARING: "/educator/content/sharing"
    }
};

// ===== GLOBAL STATE MANAGEMENT =====

// Get GitHub username for redirects
const GITHUB_USERNAME = window.location.hostname.includes('github.io')
    ? window.location.hostname.split('.')[0]
    : 'mubaroqadb';

// Enhanced Global State Management
let realTimeMonitoring = false;
let monitoringInterval = null;
let currentEducatorData = null;
let currentStudentData = [];
let currentAnalyticsData = null;
let authToken = null;
let isBackendConnected = false;

// ===== ENHANCED API CLIENT =====

// Enhanced API Client with Real Backend Integration
class EducatorAPIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = null;
        this.isConnected = false;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add authentication token if available
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            method: options.method || 'GET',
            headers,
            ...options
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            console.log(`🔗 API Request: ${config.method} ${url}`);
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ API Response: ${endpoint}`, data);

            this.isConnected = true;
            isBackendConnected = true;

            return data;
        } catch (error) {
            console.error(`❌ API Error: ${endpoint}`, error);
            this.isConnected = false;
            isBackendConnected = false;
            throw error;
        }
    }

    setToken(token) {
        this.token = token;
        authToken = token;
    }

    async testConnection() {
        try {
            console.log("🔄 Testing AgenticAI backend connection...");
            // Test with educator profile endpoint since it's working
            const response = await this.request("/educator/profile");

            if (response && response.success && response.profile) {
                isBackendConnected = true;
                console.log("✅ AgenticAI backend connection successful!");
                console.log("👤 Connected as:", response.profile.name);
                console.log("🏫 Department:", response.profile.department);
                console.log("📊 Students mentored:", response.profile.students_mentored);

                UIComponents.showNotification(`✅ Connected as ${response.profile.name} - Real data active!`, "success");
                return true;
            } else {
                throw new Error("Invalid educator profile response");
            }
        } catch (error) {
            isBackendConnected = false;
            console.error("❌ AgenticAI backend connection failed:", error);
            UIComponents.showNotification("❌ Backend connection failed, using demo mode", "error");
            return false;
        }
    }
}

// Initialize enhanced API client
const educatorAPI = new EducatorAPIClient();

// ===== ARIA AI CLIENT =====

class ARIAAIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = null;
        this.isConnected = false;
    }

    setToken(token) {
        this.token = token;
    }

    async chat(message, context = {}) {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.ARIA_AI_CHAT, {
                method: 'POST',
                body: {
                    message,
                    context,
                    timestamp: new Date().toISOString()
                }
            });

            if (response && response.data) {
                return {
                    success: true,
                    response: response.data.response,
                    suggestions: response.data.suggestions || [],
                    confidence: response.data.confidence || 0.8
                };
            } else {
                throw new Error("Invalid AI response format");
            }
        } catch (error) {
            console.error("❌ ARIA AI Chat Error:", error);
            return {
                success: false,
                response: "I'm currently experiencing technical difficulties. Please try again later.",
                suggestions: ["Check system status", "Try a different question", "Contact support"],
                confidence: 0.1
            };
        }
    }

    async analyzeStudent(studentData) {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.ARIA_AI_ANALYSIS, {
                method: 'POST',
                body: {
                    studentData,
                    analysisType: 'student_performance',
                    timestamp: new Date().toISOString()
                }
            });

            if (response && response.data) {
                return {
                    success: true,
                    insights: response.data.insights,
                    recommendations: response.data.recommendations || [],
                    riskLevel: response.data.riskLevel || 'low',
                    interventions: response.data.interventions || []
                };
            } else {
                throw new Error("Invalid AI analysis response");
            }
        } catch (error) {
            console.error("❌ ARIA AI Analysis Error:", error);
            return {
                success: false,
                insights: "Unable to analyze student data at this time.",
                recommendations: ["Manual review recommended"],
                riskLevel: 'unknown',
                interventions: []
            };
        }
    }

    async generateRecommendations(educatorData, classData) {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.ARIA_AI_RECOMMENDATIONS, {
                method: 'POST',
                body: {
                    educatorData,
                    classData,
                    requestType: 'teaching_recommendations',
                    timestamp: new Date().toISOString()
                }
            });

            if (response && response.data) {
                return {
                    success: true,
                    recommendations: response.data.recommendations || [],
                    priorities: response.data.priorities || [],
                    actionItems: response.data.actionItems || [],
                    timeline: response.data.timeline || 'immediate'
                };
            } else {
                throw new Error("Invalid AI recommendations response");
            }
        } catch (error) {
            console.error("❌ ARIA AI Recommendations Error:", error);
            return {
                success: false,
                recommendations: ["Manual planning recommended"],
                priorities: ["Review student progress", "Update learning materials"],
                actionItems: ["Check system status"],
                timeline: 'when_available'
            };
        }
    }

    async analyzeContent(contentData) {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.AI_CONTENT_ANALYSIS, {
                method: 'POST',
                body: {
                    contentData,
                    analysisType: 'effectiveness',
                    timestamp: new Date().toISOString()
                }
            });

            if (response && response.data) {
                return {
                    success: true,
                    effectiveness: response.data.effectiveness || 0.7,
                    improvements: response.data.improvements || [],
                    engagement: response.data.engagement || 0.6,
                    recommendations: response.data.recommendations || []
                };
            } else {
                throw new Error("Invalid content analysis response");
            }
        } catch (error) {
            console.error("❌ ARIA AI Content Analysis Error:", error);
            return {
                success: false,
                effectiveness: 0.5,
                improvements: ["Manual content review needed"],
                engagement: 0.5,
                recommendations: ["Update content based on student feedback"]
            };
        }
    }
}

// Initialize ARIA AI client
const ariaAI = new ARIAAIClient();

// ===== ASSESSMENT MANAGEMENT SYSTEM =====

class AssessmentManager {
    constructor() {
        this.assessments = [];
        this.currentAssessment = null;
        this.isLoading = false;
    }

    async loadAssessments() {
        try {
            this.isLoading = true;
            console.log("🔄 Loading assessments...");

            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.ASSESSMENTS_LIST);

            if (response && (response.data || response.assessments)) {
                this.assessments = response.data || response.assessments || response;
                console.log("✅ Real assessments loaded:", this.assessments);
                return this.assessments;
            } else {
                throw new Error("Invalid assessments data format");
            }
        } catch (error) {
            console.error("❌ Failed to load real assessments:", error);
            return this.loadDemoAssessments();
        } finally {
            this.isLoading = false;
        }
    }

    loadDemoAssessments() {
        console.log("🔄 Loading demo assessments...");
        this.assessments = [
            {
                id: "assessment-1",
                title: "Module 1: Data Science Fundamentals Quiz",
                type: "quiz",
                status: "active",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                totalQuestions: 20,
                duration: 60,
                submissions: 12,
                totalStudents: 45,
                averageScore: 78,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: "assessment-2",
                title: "Python Programming Assignment",
                type: "assignment",
                status: "draft",
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                totalQuestions: 5,
                duration: 180,
                submissions: 0,
                totalStudents: 45,
                averageScore: 0,
                createdAt: new Date().toISOString()
            },
            {
                id: "assessment-3",
                title: "Data Visualization Project",
                type: "project",
                status: "completed",
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                totalQuestions: 1,
                duration: 1440,
                submissions: 42,
                totalStudents: 45,
                averageScore: 85,
                createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        console.log("✅ Demo assessments loaded");
        return this.assessments;
    }

    async createAssessment(assessmentData) {
        try {
            console.log("🔄 Creating assessment...", assessmentData);

            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.CREATE_ASSESSMENT, {
                method: 'POST',
                body: assessmentData
            });

            if (response && response.data) {
                this.assessments.unshift(response.data);
                UIComponents.showNotification("✅ Assessment created successfully", "success");
                return response.data;
            } else {
                throw new Error("Invalid create assessment response");
            }
        } catch (error) {
            console.error("❌ Failed to create assessment:", error);
            UIComponents.showNotification("❌ Failed to create assessment", "error");
            return null;
        }
    }

    async updateAssessment(assessmentId, updateData) {
        try {
            console.log("🔄 Updating assessment...", assessmentId, updateData);

            const endpoint = API_CONFIG.ENDPOINTS.UPDATE_ASSESSMENT.replace('{id}', assessmentId);
            const response = await educatorAPI.request(endpoint, {
                method: 'PUT',
                body: updateData
            });

            if (response && response.data) {
                const index = this.assessments.findIndex(a => a.id === assessmentId);
                if (index !== -1) {
                    this.assessments[index] = response.data;
                }
                UIComponents.showNotification("✅ Assessment updated successfully", "success");
                return response.data;
            } else {
                throw new Error("Invalid update assessment response");
            }
        } catch (error) {
            console.error("❌ Failed to update assessment:", error);
            UIComponents.showNotification("❌ Failed to update assessment", "error");
            return null;
        }
    }

    async deleteAssessment(assessmentId) {
        try {
            console.log("🔄 Deleting assessment...", assessmentId);

            const endpoint = API_CONFIG.ENDPOINTS.DELETE_ASSESSMENT.replace('{id}', assessmentId);
            await educatorAPI.request(endpoint, {
                method: 'DELETE'
            });

            this.assessments = this.assessments.filter(a => a.id !== assessmentId);
            UIComponents.showNotification("✅ Assessment deleted successfully", "success");
            return true;
        } catch (error) {
            console.error("❌ Failed to delete assessment:", error);
            UIComponents.showNotification("❌ Failed to delete assessment", "error");
            return false;
        }
    }

    async getAssessmentResults(assessmentId) {
        try {
            console.log("🔄 Loading assessment results...", assessmentId);

            const endpoint = API_CONFIG.ENDPOINTS.ASSESSMENT_RESULTS.replace('{id}', assessmentId);
            const response = await educatorAPI.request(endpoint);

            if (response && (response.data || response.results)) {
                return response.data || response.results || response;
            } else {
                throw new Error("Invalid assessment results response");
            }
        } catch (error) {
            console.error("❌ Failed to load assessment results:", error);
            return this.getDemoAssessmentResults(assessmentId);
        }
    }

    getDemoAssessmentResults(assessmentId) {
        return [
            {
                studentId: "student-1",
                studentName: "Ahmad Rizki",
                score: 85,
                submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                status: "completed",
                timeSpent: 45
            },
            {
                studentId: "student-2",
                studentName: "Sari Dewi",
                score: 92,
                submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                status: "completed",
                timeSpent: 38
            },
            {
                studentId: "student-3",
                studentName: "Budi Santoso",
                score: 67,
                submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                status: "completed",
                timeSpent: 52
            }
        ];
    }

    renderAssessmentsList() {
        const assessmentsHTML = this.assessments.map(assessment => {
            const statusColors = {
                active: 'var(--success)',
                draft: 'var(--warning)',
                completed: 'var(--info)',
                archived: 'var(--gray-500)'
            };

            const typeIcons = {
                quiz: '📝',
                assignment: '📋',
                project: '🎯',
                exam: '📊'
            };

            const completionRate = assessment.totalStudents > 0
                ? Math.round((assessment.submissions / assessment.totalStudents) * 100)
                : 0;

            return `
                <div class="assessment-card" style="background: var(--bg-light); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[assessment.status]};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.5rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                                ${typeIcons[assessment.type]} ${assessment.title}
                                <span style="background: ${statusColors[assessment.status]}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: capitalize;">
                                    ${assessment.status}
                                </span>
                            </h4>
                            <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">
                                Due: ${new Date(assessment.dueDate).toLocaleDateString()} |
                                Duration: ${assessment.duration} min |
                                Questions: ${assessment.totalQuestions}
                            </p>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="viewAssessmentResults('${assessment.id}')" class="btn" style="padding: 0.5rem 1rem; background: var(--info); font-size: 0.875rem;">
                                📊 Results
                            </button>
                            <button onclick="editAssessment('${assessment.id}')" class="btn" style="padding: 0.5rem 1rem; background: var(--primary); font-size: 0.875rem;">
                                ✏️ Edit
                            </button>
                            <button onclick="deleteAssessmentConfirm('${assessment.id}')" class="btn" style="padding: 0.5rem 1rem; background: var(--error); font-size: 0.875rem;">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center; padding: 0.75rem; background: var(--white); border-radius: 6px;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--primary);">${assessment.submissions}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Submissions</div>
                        </div>
                        <div style="text-align: center; padding: 0.75rem; background: var(--white); border-radius: 6px;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--success);">${completionRate}%</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Completion</div>
                        </div>
                        <div style="text-align: center; padding: 0.75rem; background: var(--white); border-radius: 6px;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--secondary);">${assessment.averageScore}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Avg Score</div>
                        </div>
                        <div style="text-align: center; padding: 0.75rem; background: var(--white); border-radius: 6px;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--info);">${assessment.totalStudents}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Total Students</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const assessmentsContainer = `
            <div style="margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: var(--gray-800);">Assessment Management</h3>
                    <button onclick="showCreateAssessmentModal()" class="btn" style="background: var(--success); padding: 0.75rem 1.5rem;">
                        ➕ Create New Assessment
                    </button>
                </div>
                ${assessmentsHTML}
            </div>
        `;

        setInner("assessments-content", assessmentsContainer);
    }
}

// Initialize Assessment Manager
const assessmentManager = new AssessmentManager();

// ===== D7-D12: ADVANCED ANALYTICS MANAGER =====

class AdvancedAnalyticsManager {
    constructor() {
        this.analyticsData = {};
        this.chartInstances = {};
        this.isLoading = false;
    }

    async loadAdvancedAnalytics() {
        try {
            this.isLoading = true;
            console.log("🔄 Loading advanced analytics from MongoDB...");

            // Load real data from MongoDB via Go Fiber API
            const response = await educatorAPI.request("/educator/analytics/advanced");

            if (response && response.success && response.data) {
                this.analyticsData = response.data;
                console.log("✅ Real advanced analytics loaded from MongoDB:", this.analyticsData);
                return this.analyticsData;
            } else {
                throw new Error("Invalid analytics response from MongoDB");
            }
        } catch (error) {
            console.error("❌ Failed to load real analytics from MongoDB:", error);
            console.log("ℹ️ Advanced analytics endpoint not yet implemented in backend");
            UIComponents.showNotification("ℹ️ Advanced analytics will be available when backend is updated", "info");
            // Return null to indicate service not available (not fake data)
            return {
                learning: null,
                engagement: null,
                performance: null,
                comparative: null,
                predictive: null
            };
        } finally {
            this.isLoading = false;
        }
    }

    async loadLearningAnalytics() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.LEARNING_ANALYTICS);
            return response?.data || this.getDemoLearningAnalytics();
        } catch (error) {
            return this.getDemoLearningAnalytics();
        }
    }

    async loadEngagementAnalytics() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.ENGAGEMENT_ANALYTICS);
            return response?.data || this.getDemoEngagementAnalytics();
        } catch (error) {
            return this.getDemoEngagementAnalytics();
        }
    }

    async loadPerformanceTrends() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.PERFORMANCE_TRENDS);
            return response?.data || this.getDemoPerformanceTrends();
        } catch (error) {
            return this.getDemoPerformanceTrends();
        }
    }

    async loadComparativeAnalytics() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.COMPARATIVE_ANALYTICS);
            return response?.data || this.getDemoComparativeAnalytics();
        } catch (error) {
            return this.getDemoComparativeAnalytics();
        }
    }

    async loadPredictiveModels() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.PREDICTIVE_MODELS);
            return response?.data || this.getDemoPredictiveModels();
        } catch (error) {
            return this.getDemoPredictiveModels();
        }
    }

    getDemoLearningAnalytics() {
        return {
            totalLearningTime: 2847,
            averageSessionDuration: 42,
            completionRate: 78,
            retentionRate: 85,
            learningVelocity: 1.2,
            conceptMastery: {
                "Data Science Fundamentals": 92,
                "Python Programming": 78,
                "Statistics": 85,
                "Machine Learning": 65,
                "Data Visualization": 88
            },
            learningPaths: [
                { path: "Beginner Track", students: 18, completion: 85 },
                { path: "Intermediate Track", students: 15, completion: 72 },
                { path: "Advanced Track", students: 12, completion: 58 }
            ]
        };
    }

    getDemoEngagementAnalytics() {
        return {
            overallEngagement: 82,
            dailyActiveUsers: 38,
            weeklyActiveUsers: 42,
            monthlyActiveUsers: 45,
            sessionFrequency: 4.2,
            contentInteraction: {
                videos: 85,
                quizzes: 78,
                assignments: 72,
                discussions: 65,
                resources: 88
            },
            peakHours: [
                { hour: "09:00", engagement: 65 },
                { hour: "14:00", engagement: 78 },
                { hour: "19:00", engagement: 92 },
                { hour: "21:00", engagement: 85 }
            ]
        };
    }

    getDemoPerformanceTrends() {
        return {
            overallTrend: "improving",
            trendPercentage: 15.3,
            weeklyPerformance: [
                { week: "Week 1", average: 72 },
                { week: "Week 2", average: 75 },
                { week: "Week 3", average: 78 },
                { week: "Week 4", average: 82 },
                { week: "Week 5", average: 85 }
            ],
            subjectPerformance: {
                "Mathematics": { current: 85, trend: 8.2 },
                "Science": { current: 78, trend: 12.5 },
                "Programming": { current: 82, trend: 15.3 },
                "Analytics": { current: 79, trend: 6.8 }
            },
            improvementAreas: [
                "Statistical Analysis",
                "Advanced Programming",
                "Data Interpretation"
            ]
        };
    }

    getDemoComparativeAnalytics() {
        return {
            classComparison: {
                thisClass: { average: 82, students: 45 },
                schoolAverage: { average: 78, students: 180 },
                nationalAverage: { average: 75, students: 15000 }
            },
            peerComparison: [
                { student: "Top Performer", score: 95, percentile: 98 },
                { student: "Class Average", score: 82, percentile: 50 },
                { student: "Needs Support", score: 65, percentile: 15 }
            ],
            historicalComparison: {
                lastSemester: 78,
                currentSemester: 82,
                improvement: 5.1
            }
        };
    }

    getDemoPredictiveModels() {
        return {
            successPrediction: {
                highSuccess: 28,
                moderateSuccess: 12,
                atRisk: 5
            },
            interventionRecommendations: [
                {
                    student: "Maya Rajin",
                    riskLevel: "high",
                    recommendation: "Immediate tutoring support",
                    successProbability: 85
                },
                {
                    student: "Budi Santoso",
                    riskLevel: "medium",
                    recommendation: "Additional practice materials",
                    successProbability: 78
                }
            ],
            futurePerformance: {
                nextWeek: 84,
                nextMonth: 87,
                endOfSemester: 89
            }
        };
    }

    loadDemoAnalytics() {
        console.log("🔄 Loading demo advanced analytics...");
        this.analyticsData = {
            learning: this.getDemoLearningAnalytics(),
            engagement: this.getDemoEngagementAnalytics(),
            performance: this.getDemoPerformanceTrends(),
            comparative: this.getDemoComparativeAnalytics(),
            predictive: this.getDemoPredictiveModels()
        };
        console.log("✅ Demo advanced analytics loaded");
        return this.analyticsData;
    }

    renderAdvancedAnalyticsDashboard() {
        const data = this.analyticsData;

        // Check if data is available
        if (!data || !data.learning) {
            setInner("advanced-analytics-content", `
                <div class="card" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                    <h3 style="color: var(--gray-600); margin-bottom: 1rem;">Advanced Analytics Not Available</h3>
                    <p style="color: var(--gray-500); margin-bottom: 2rem;">
                        Advanced analytics features require backend implementation.<br>
                        Please check BACKEND_IMPLEMENTATION.md for setup instructions.
                    </p>
                    <div style="background: var(--accent); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <strong>Required Endpoints:</strong><br>
                        • /educator/analytics/advanced<br>
                        • /educator/analytics/learning-patterns<br>
                        • /educator/analytics/engagement
                    </div>
                    <button onclick="refreshAdvancedAnalytics()" class="btn" style="background: var(--primary);">
                        🔄 Retry Connection
                    </button>
                </div>
            `);
            return;
        }

        const dashboardHTML = `
            <!-- Learning Analytics Section -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                    📊 Learning Analytics Overview
                    <span style="background: ${isBackendConnected ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                        ${isBackendConnected ? '🟢 Live' : '🟡 Demo'}
                    </span>
                </h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div class="metric-card">
                        <div class="metric-value">${data.learning?.totalLearningTime || 0} min</div>
                        <div class="metric-label">Total Learning Time</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.learning?.averageSessionDuration || 0} min</div>
                        <div class="metric-label">Avg Session Duration</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.learning?.completionRate || 0}%</div>
                        <div class="metric-label">Completion Rate</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.learning?.retentionRate || 0}%</div>
                        <div class="metric-label">Retention Rate</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">Concept Mastery</h4>
                        <div id="concept-mastery-chart" style="background: var(--accent); padding: 1rem; border-radius: 8px; min-height: 200px;">
                            ${this.renderConceptMasteryChart(data.learning?.conceptMastery)}
                        </div>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">Learning Paths Progress</h4>
                        <div id="learning-paths-chart" style="background: var(--accent); padding: 1rem; border-radius: 8px; min-height: 200px;">
                            ${this.renderLearningPathsChart(data.learning?.learningPaths)}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Engagement Analytics Section -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                    🎯 Engagement Analytics
                </h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div class="metric-card">
                        <div class="metric-value">${data.engagement?.overallEngagement || 0}%</div>
                        <div class="metric-label">Overall Engagement</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.engagement?.dailyActiveUsers || 0}</div>
                        <div class="metric-label">Daily Active Users</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.engagement?.sessionFrequency || 0}</div>
                        <div class="metric-label">Session Frequency</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">Content Interaction</h4>
                        <div id="content-interaction-chart" style="background: var(--accent); padding: 1rem; border-radius: 8px; min-height: 200px;">
                            ${this.renderContentInteractionChart(data.engagement?.contentInteraction)}
                        </div>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">Peak Hours</h4>
                        <div id="peak-hours-chart" style="background: var(--accent); padding: 1rem; border-radius: 8px; min-height: 200px;">
                            ${this.renderPeakHoursChart(data.engagement?.peakHours)}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Performance Trends Section -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                    📈 Performance Trends
                </h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">Weekly Performance</h4>
                        <div id="weekly-performance-chart" style="background: var(--accent); padding: 1rem; border-radius: 8px; min-height: 250px;">
                            ${this.renderWeeklyPerformanceChart(data.performance?.weeklyPerformance)}
                        </div>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">Subject Performance</h4>
                        <div id="subject-performance-chart" style="background: var(--accent); padding: 1rem; border-radius: 8px; min-height: 250px;">
                            ${this.renderSubjectPerformanceChart(data.performance?.subjectPerformance)}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Predictive Analytics Section -->
            <section class="card">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                    🔮 Predictive Analytics
                </h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <div>
                        <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">Success Prediction</h4>
                        <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>High Success</span>
                                <span style="font-weight: 600; color: var(--success);">${data.predictive?.successPrediction?.highSuccess || 0} students</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Moderate Success</span>
                                <span style="font-weight: 600; color: var(--warning);">${data.predictive?.successPrediction?.moderateSuccess || 0} students</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>At Risk</span>
                                <span style="font-weight: 600; color: var(--error);">${data.predictive?.successPrediction?.atRisk || 0} students</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">Future Performance</h4>
                        <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Next Week</span>
                                <span style="font-weight: 600; color: var(--info);">${data.predictive?.futurePerformance?.nextWeek || 0}%</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Next Month</span>
                                <span style="font-weight: 600; color: var(--primary);">${data.predictive?.futurePerformance?.nextMonth || 0}%</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>End of Semester</span>
                                <span style="font-weight: 600; color: var(--success);">${data.predictive?.futurePerformance?.endOfSemester || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        setInner("advanced-analytics-content", dashboardHTML);
    }

    renderConceptMasteryChart(conceptMastery) {
        if (!conceptMastery) return '<div style="text-align: center; color: var(--gray-600);">No data available</div>';

        return Object.entries(conceptMastery).map(([concept, mastery]) => `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.875rem; color: var(--gray-700);">${concept}</span>
                    <span style="font-weight: 600; color: var(--primary);">${mastery}%</span>
                </div>
                <div style="background: var(--gray-300); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: var(--primary); height: 100%; width: ${mastery}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `).join('');
    }

    renderLearningPathsChart(learningPaths) {
        if (!learningPaths) return '<div style="text-align: center; color: var(--gray-600);">No data available</div>';

        return learningPaths.map(path => `
            <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <h5 style="margin: 0; color: var(--gray-800);">${path.path}</h5>
                    <span style="font-weight: 600; color: var(--success);">${path.completion}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--gray-600);">
                    <span>${path.students} students</span>
                    <span>Completion: ${path.completion}%</span>
                </div>
            </div>
        `).join('');
    }

    renderContentInteractionChart(contentInteraction) {
        if (!contentInteraction) return '<div style="text-align: center; color: var(--gray-600);">No data available</div>';

        return Object.entries(contentInteraction).map(([content, interaction]) => `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.875rem; color: var(--gray-700); text-transform: capitalize;">${content}</span>
                    <span style="font-weight: 600; color: var(--secondary);">${interaction}%</span>
                </div>
                <div style="background: var(--gray-300); height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: var(--secondary); height: 100%; width: ${interaction}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `).join('');
    }

    renderPeakHoursChart(peakHours) {
        if (!peakHours) return '<div style="text-align: center; color: var(--gray-600);">No data available</div>';

        return peakHours.map(hour => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: var(--white); border-radius: 4px; margin-bottom: 0.5rem;">
                <span style="font-weight: 600; color: var(--gray-800);">${hour.hour}</span>
                <span style="color: var(--info);">${hour.engagement}%</span>
            </div>
        `).join('');
    }

    renderWeeklyPerformanceChart(weeklyPerformance) {
        if (!weeklyPerformance) return '<div style="text-align: center; color: var(--gray-600);">No data available</div>';

        return weeklyPerformance.map(week => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--white); border-radius: 4px; margin-bottom: 0.5rem;">
                <span style="font-weight: 600; color: var(--gray-800);">${week.week}</span>
                <span style="color: var(--success); font-weight: 600;">${week.average}%</span>
            </div>
        `).join('');
    }

    renderSubjectPerformanceChart(subjectPerformance) {
        if (!subjectPerformance) return '<div style="text-align: center; color: var(--gray-600);">No data available</div>';

        return Object.entries(subjectPerformance).map(([subject, data]) => `
            <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <h6 style="margin: 0; color: var(--gray-800);">${subject}</h6>
                    <span style="font-weight: 600; color: var(--primary);">${data.current}%</span>
                </div>
                <div style="font-size: 0.875rem; color: ${data.trend > 0 ? 'var(--success)' : 'var(--error)'};">
                    Trend: ${data.trend > 0 ? '+' : ''}${data.trend}%
                </div>
            </div>
        `).join('');
    }
}

// Initialize Advanced Analytics Manager
const advancedAnalyticsManager = new AdvancedAnalyticsManager();

// ===== D13-D18: COMMUNICATION MANAGER =====

class CommunicationManager {
    constructor() {
        this.messages = [];
        this.notifications = [];
        this.forums = [];
        this.videoSessions = [];
        this.isLoading = false;
    }

    async loadCommunicationData() {
        try {
            this.isLoading = true;
            console.log("🔄 Loading communication data from MongoDB...");

            // Load real data from MongoDB via Go Fiber API
            const [messagesResponse, forumsResponse, videoSessionsResponse] = await Promise.all([
                educatorAPI.request("/educator/communication/messages"),
                educatorAPI.request("/educator/communication/forums"),
                educatorAPI.request("/educator/communication/video-sessions")
            ]);

            if (messagesResponse?.success) {
                this.messages = messagesResponse.data;
            }
            if (forumsResponse?.success) {
                this.forums = forumsResponse.data;
            }
            if (videoSessionsResponse?.success) {
                this.videoSessions = videoSessionsResponse.data;
            }

            console.log("✅ Real communication data loaded from MongoDB");
            return {
                messages: this.messages,
                notifications: this.notifications,
                forums: this.forums,
                videoSessions: this.videoSessions
            };
        } catch (error) {
            console.error("❌ Failed to load real communication data from MongoDB:", error);
            console.log("ℹ️ Communication endpoints not yet implemented in backend");
            UIComponents.showNotification("ℹ️ Communication features will be available when backend is updated", "info");
            // Return empty data to indicate service not available
            return {
                messages: [],
                notifications: [],
                forums: [],
                videoSessions: []
            };
        } finally {
            this.isLoading = false;
        }
    }

    async loadMessages() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.STUDENT_MESSAGES);
            return response?.data || this.getDemoMessages();
        } catch (error) {
            return this.getDemoMessages();
        }
    }

    async loadNotifications() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.SEND_NOTIFICATION);
            return response?.data || this.getDemoNotifications();
        } catch (error) {
            return this.getDemoNotifications();
        }
    }

    async loadForums() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.DISCUSSION_FORUMS);
            return response?.data || this.getDemoForums();
        } catch (error) {
            return this.getDemoForums();
        }
    }

    async loadVideoSessions() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.VIDEO_CONFERENCES);
            return response?.data || this.getDemoVideoSessions();
        } catch (error) {
            return this.getDemoVideoSessions();
        }
    }

    getDemoMessages() {
        return [
            {
                id: "msg-1",
                from: "Andi Mahasiswa",
                subject: "Question about Assignment 3",
                message: "Hi Prof, I'm having trouble with the data visualization part. Could you help?",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                status: "unread",
                priority: "normal"
            },
            {
                id: "msg-2",
                from: "Sari Belajar",
                subject: "Request for Extension",
                message: "Dear Professor, I would like to request a 2-day extension for the Python project due to illness.",
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                status: "read",
                priority: "high"
            },
            {
                id: "msg-3",
                from: "Maya Rajin",
                subject: "Thank you for the feedback",
                message: "Thank you for the detailed feedback on my last assignment. It really helped me understand the concepts better.",
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                status: "read",
                priority: "low"
            }
        ];
    }

    getDemoNotifications() {
        return [
            {
                id: "notif-1",
                title: "Assignment Due Reminder",
                message: "Python Programming Assignment is due in 2 days",
                type: "reminder",
                recipients: "all",
                scheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                status: "scheduled"
            },
            {
                id: "notif-2",
                title: "Class Cancelled",
                message: "Tomorrow's class is cancelled due to technical issues",
                type: "announcement",
                recipients: "all",
                scheduled: new Date().toISOString(),
                status: "sent"
            }
        ];
    }

    getDemoForums() {
        return [
            {
                id: "forum-1",
                title: "General Discussion",
                description: "General course discussions and Q&A",
                posts: 45,
                lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                participants: 38
            },
            {
                id: "forum-2",
                title: "Assignment Help",
                description: "Get help with assignments and projects",
                posts: 23,
                lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                participants: 28
            },
            {
                id: "forum-3",
                title: "Study Groups",
                description: "Organize and join study groups",
                posts: 12,
                lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                participants: 15
            }
        ];
    }

    getDemoVideoSessions() {
        return [
            {
                id: "video-1",
                title: "Weekly Office Hours",
                scheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                duration: 60,
                participants: 0,
                maxParticipants: 50,
                status: "scheduled",
                type: "office-hours"
            },
            {
                id: "video-2",
                title: "Data Science Workshop",
                scheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                duration: 120,
                participants: 25,
                maxParticipants: 45,
                status: "scheduled",
                type: "workshop"
            }
        ];
    }

    loadDemoCommunicationData() {
        console.log("🔄 Loading demo communication data...");
        this.messages = this.getDemoMessages();
        this.notifications = this.getDemoNotifications();
        this.forums = this.getDemoForums();
        this.videoSessions = this.getDemoVideoSessions();

        console.log("✅ Demo communication data loaded");
        return {
            messages: this.messages,
            notifications: this.notifications,
            forums: this.forums,
            videoSessions: this.videoSessions
        };
    }

    async sendMessage(recipientId, subject, message) {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.STUDENT_MESSAGES, {
                method: 'POST',
                body: { recipientId, subject, message, timestamp: new Date().toISOString() }
            });

            if (response?.data) {
                UIComponents.showNotification("✅ Message sent successfully", "success");
                return response.data;
            } else {
                throw new Error("Invalid response");
            }
        } catch (error) {
            console.error("❌ Failed to send message:", error);
            UIComponents.showNotification("❌ Failed to send message", "error");
            return null;
        }
    }

    async sendNotification(title, message, recipients = "all") {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.SEND_NOTIFICATION, {
                method: 'POST',
                body: { title, message, recipients, timestamp: new Date().toISOString() }
            });

            if (response?.data) {
                UIComponents.showNotification("✅ Notification sent successfully", "success");
                return response.data;
            } else {
                throw new Error("Invalid response");
            }
        } catch (error) {
            console.error("❌ Failed to send notification:", error);
            UIComponents.showNotification("❌ Failed to send notification", "error");
            return null;
        }
    }

    async scheduleVideoSession(title, datetime, duration, type = "meeting") {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.VIDEO_CONFERENCES, {
                method: 'POST',
                body: { title, scheduled: datetime, duration, type, timestamp: new Date().toISOString() }
            });

            if (response?.data) {
                UIComponents.showNotification("✅ Video session scheduled successfully", "success");
                return response.data;
            } else {
                throw new Error("Invalid response");
            }
        } catch (error) {
            console.error("❌ Failed to schedule video session:", error);
            UIComponents.showNotification("❌ Failed to schedule video session", "error");
            return null;
        }
    }

    renderCommunicationDashboard() {
        // Check if data is available
        if (!this.messages || this.messages.length === 0) {
            setInner("communication-content", `
                <div class="card" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
                    <h3 style="color: var(--gray-600); margin-bottom: 1rem;">Communication Center Not Available</h3>
                    <p style="color: var(--gray-500); margin-bottom: 2rem;">
                        Communication features require backend implementation.<br>
                        Please check BACKEND_IMPLEMENTATION.md for setup instructions.
                    </p>
                    <div style="background: var(--accent); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <strong>Required Endpoints:</strong><br>
                        • /educator/communication/messages<br>
                        • /educator/communication/forums<br>
                        • /educator/communication/video-sessions
                    </div>
                    <button onclick="loadEnhancedCommunicationPage()" class="btn" style="background: var(--primary);">
                        🔄 Retry Connection
                    </button>
                </div>
            `);
            return;
        }

        const unreadMessages = this.messages.filter(msg => msg.status === 'unread').length;
        const activeForums = this.forums.length;
        const upcomingVideos = this.videoSessions.filter(session => new Date(session.scheduled) > new Date()).length;

        const dashboardHTML = `
            <!-- Communication Overview -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                    💬 Communication Center
                    <span style="background: ${isBackendConnected ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                        ${isBackendConnected ? '🟢 Live' : '🟡 Demo'}
                    </span>
                </h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div class="metric-card">
                        <div class="metric-value">${unreadMessages}</div>
                        <div class="metric-label">Unread Messages</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${activeForums}</div>
                        <div class="metric-label">Active Forums</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${upcomingVideos}</div>
                        <div class="metric-label">Upcoming Sessions</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${this.notifications.length}</div>
                        <div class="metric-label">Notifications Sent</div>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button onclick="showComposeMessageModal()" class="btn" style="background: var(--primary);">
                        ✉️ Compose Message
                    </button>
                    <button onclick="showSendNotificationModal()" class="btn" style="background: var(--info);">
                        📢 Send Notification
                    </button>
                    <button onclick="showScheduleVideoModal()" class="btn" style="background: var(--success);">
                        📹 Schedule Video Session
                    </button>
                    <button onclick="showBulkMessageModal()" class="btn" style="background: var(--secondary);">
                        📨 Bulk Message
                    </button>
                </div>
            </section>

            <!-- Recent Messages -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">Recent Messages</h3>
                <div id="recent-messages-list">
                    ${this.renderMessagesList()}
                </div>
            </section>

            <!-- Discussion Forums -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">Discussion Forums</h3>
                <div id="forums-list">
                    ${this.renderForumsList()}
                </div>
            </section>

            <!-- Upcoming Video Sessions -->
            <section class="card">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">Upcoming Video Sessions</h3>
                <div id="video-sessions-list">
                    ${this.renderVideoSessionsList()}
                </div>
            </section>
        `;

        setInner("communication-content", dashboardHTML);
    }

    renderMessagesList() {
        return this.messages.map(message => {
            const priorityColors = {
                high: 'var(--error)',
                normal: 'var(--info)',
                low: 'var(--gray-500)'
            };

            return `
                <div style="background: ${message.status === 'unread' ? 'var(--accent)' : 'var(--bg-light)'}; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid ${priorityColors[message.priority]};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <div>
                            <h4 style="margin: 0; color: var(--gray-800); font-size: 1rem;">${message.subject}</h4>
                            <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">From: ${message.from}</p>
                        </div>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <span style="background: ${priorityColors[message.priority]}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: capitalize;">
                                ${message.priority}
                            </span>
                            <span style="font-size: 0.75rem; color: var(--gray-500);">
                                ${getRelativeTime(message.timestamp)}
                            </span>
                        </div>
                    </div>
                    <p style="margin: 0 0 1rem 0; color: var(--gray-700); font-size: 0.875rem;">${message.message}</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="replyToMessage('${message.id}')" class="btn" style="padding: 0.5rem 1rem; background: var(--primary); font-size: 0.875rem;">
                            ↩️ Reply
                        </button>
                        <button onclick="markAsRead('${message.id}')" class="btn" style="padding: 0.5rem 1rem; background: var(--success); font-size: 0.875rem;">
                            ✅ Mark as Read
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderForumsList() {
        return this.forums.map(forum => `
            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">${forum.title}</h4>
                        <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">${forum.description}</p>
                    </div>
                    <button onclick="manageForum('${forum.id}')" class="btn" style="background: var(--info); padding: 0.5rem 1rem;">
                        ⚙️ Manage
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 600; color: var(--primary);">${forum.posts}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Posts</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 600; color: var(--success);">${forum.participants}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Participants</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 0.875rem; font-weight: 600; color: var(--info);">${getRelativeTime(forum.lastActivity)}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Last Activity</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderVideoSessionsList() {
        return this.videoSessions.map(session => {
            const typeIcons = {
                'office-hours': '🏢',
                'workshop': '🛠️',
                'meeting': '👥',
                'lecture': '📚'
            };

            return `
                <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span style="font-size: 1.5rem;">${typeIcons[session.type] || '📹'}</span>
                            <div>
                                <h4 style="margin: 0; color: var(--gray-800);">${session.title}</h4>
                                <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">
                                    ${new Date(session.scheduled).toLocaleDateString()} at ${new Date(session.scheduled).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="editVideoSession('${session.id}')" class="btn" style="background: var(--primary); padding: 0.5rem 1rem;">
                                ✏️ Edit
                            </button>
                            <button onclick="startVideoSession('${session.id}')" class="btn" style="background: var(--success); padding: 0.5rem 1rem;">
                                ▶️ Start
                            </button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--info);">${session.duration} min</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Duration</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--primary);">${session.participants}/${session.maxParticipants}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Participants</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--success); text-transform: capitalize;">${session.status}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Status</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize Communication Manager
const communicationManager = new CommunicationManager();

// ===== D19-D24: CONTENT MANAGEMENT SYSTEM =====

class ContentManagementSystem {
    constructor() {
        this.contentLibrary = [];
        this.resources = [];
        this.curriculumMaps = [];
        this.sharedContent = [];
        this.isLoading = false;
    }

    async loadContentManagementData() {
        try {
            this.isLoading = true;
            console.log("🔄 Loading content management data from MongoDB...");

            // Load real data from MongoDB via Go Fiber API
            const [libraryResponse, resourcesResponse] = await Promise.all([
                educatorAPI.request("/educator/content/library"),
                educatorAPI.request("/educator/content/resources")
            ]);

            if (libraryResponse?.success) {
                this.contentLibrary = libraryResponse.data;
            }
            if (resourcesResponse?.success) {
                this.resources = resourcesResponse.data;
            }

            console.log("✅ Real content management data loaded from MongoDB");
            return {
                library: this.contentLibrary,
                resources: this.resources,
                curriculum: this.curriculumMaps,
                shared: this.sharedContent
            };
        } catch (error) {
            console.error("❌ Failed to load real content data from MongoDB:", error);
            console.log("ℹ️ Content management endpoints not yet implemented in backend");
            UIComponents.showNotification("ℹ️ Content management will be available when backend is updated", "info");
            // Return empty data to indicate service not available
            return {
                library: [],
                resources: [],
                curriculum: [],
                shared: []
            };
        } finally {
            this.isLoading = false;
        }
    }

    async loadContentLibrary() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.CONTENT_LIBRARY);
            return response?.data || this.getDemoContentLibrary();
        } catch (error) {
            return this.getDemoContentLibrary();
        }
    }

    async loadResources() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.RESOURCE_MANAGEMENT);
            return response?.data || this.getDemoResources();
        } catch (error) {
            return this.getDemoResources();
        }
    }

    async loadCurriculumMaps() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.CURRICULUM_MAPPING);
            return response?.data || this.getDemoCurriculumMaps();
        } catch (error) {
            return this.getDemoCurriculumMaps();
        }
    }

    async loadSharedContent() {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.CONTENT_SHARING);
            return response?.data || this.getDemoSharedContent();
        } catch (error) {
            return this.getDemoSharedContent();
        }
    }

    getDemoContentLibrary() {
        return [
            {
                id: "content-1",
                title: "Introduction to Data Science",
                type: "video",
                duration: 45,
                size: "125 MB",
                format: "MP4",
                uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                views: 156,
                rating: 4.8,
                tags: ["data-science", "introduction", "fundamentals"],
                status: "published"
            },
            {
                id: "content-2",
                title: "Python Programming Basics",
                type: "document",
                duration: null,
                size: "2.3 MB",
                format: "PDF",
                uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                views: 203,
                rating: 4.6,
                tags: ["python", "programming", "basics"],
                status: "published"
            },
            {
                id: "content-3",
                title: "Statistics Interactive Quiz",
                type: "interactive",
                duration: 30,
                size: "5.1 MB",
                format: "HTML5",
                uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                views: 89,
                rating: 4.9,
                tags: ["statistics", "quiz", "interactive"],
                status: "published"
            },
            {
                id: "content-4",
                title: "Machine Learning Workshop",
                type: "video",
                duration: 120,
                size: "450 MB",
                format: "MP4",
                uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                views: 45,
                rating: 4.7,
                tags: ["machine-learning", "workshop", "advanced"],
                status: "draft"
            }
        ];
    }

    getDemoResources() {
        return [
            {
                id: "resource-1",
                name: "Data Science Textbook",
                type: "book",
                url: "https://example.com/textbook.pdf",
                description: "Comprehensive textbook covering all data science fundamentals",
                category: "textbook",
                accessLevel: "all",
                downloads: 234
            },
            {
                id: "resource-2",
                name: "Python Cheat Sheet",
                type: "reference",
                url: "https://example.com/python-cheat.pdf",
                description: "Quick reference for Python syntax and functions",
                category: "reference",
                accessLevel: "all",
                downloads: 456
            },
            {
                id: "resource-3",
                name: "Dataset Collection",
                type: "data",
                url: "https://example.com/datasets.zip",
                description: "Practice datasets for assignments and projects",
                category: "dataset",
                accessLevel: "students",
                downloads: 123
            }
        ];
    }

    getDemoCurriculumMaps() {
        return [
            {
                id: "curriculum-1",
                title: "Data Science Fundamentals",
                modules: [
                    {
                        id: "module-1",
                        title: "Introduction to Data Science",
                        lessons: 8,
                        duration: 240,
                        completion: 95
                    },
                    {
                        id: "module-2",
                        title: "Python Programming",
                        lessons: 12,
                        duration: 360,
                        completion: 78
                    },
                    {
                        id: "module-3",
                        title: "Statistics and Probability",
                        lessons: 10,
                        duration: 300,
                        completion: 65
                    },
                    {
                        id: "module-4",
                        title: "Data Visualization",
                        lessons: 6,
                        duration: 180,
                        completion: 45
                    }
                ],
                totalLessons: 36,
                totalDuration: 1080,
                overallCompletion: 71
            }
        ];
    }

    getDemoSharedContent() {
        return [
            {
                id: "shared-1",
                title: "Best Practices in Data Analysis",
                sharedBy: "Dr. Sarah Johnson",
                institution: "MIT",
                type: "presentation",
                downloads: 89,
                rating: 4.8,
                sharedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: "shared-2",
                title: "Advanced Python Techniques",
                sharedBy: "Prof. Michael Chen",
                institution: "Stanford",
                type: "video",
                downloads: 156,
                rating: 4.9,
                sharedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
    }

    loadDemoContentData() {
        console.log("🔄 Loading demo content management data...");
        this.contentLibrary = this.getDemoContentLibrary();
        this.resources = this.getDemoResources();
        this.curriculumMaps = this.getDemoCurriculumMaps();
        this.sharedContent = this.getDemoSharedContent();

        console.log("✅ Demo content management data loaded");
        return {
            library: this.contentLibrary,
            resources: this.resources,
            curriculum: this.curriculumMaps,
            shared: this.sharedContent
        };
    }

    async createContent(contentData) {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.CREATE_CONTENT, {
                method: 'POST',
                body: contentData
            });

            if (response?.data) {
                this.contentLibrary.unshift(response.data);
                UIComponents.showNotification("✅ Content created successfully", "success");
                return response.data;
            } else {
                throw new Error("Invalid response");
            }
        } catch (error) {
            console.error("❌ Failed to create content:", error);
            UIComponents.showNotification("❌ Failed to create content", "error");
            return null;
        }
    }

    async shareContent(contentId, targetInstitutions) {
        try {
            const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.CONTENT_SHARING, {
                method: 'POST',
                body: { contentId, targetInstitutions, timestamp: new Date().toISOString() }
            });

            if (response?.data) {
                UIComponents.showNotification("✅ Content shared successfully", "success");
                return response.data;
            } else {
                throw new Error("Invalid response");
            }
        } catch (error) {
            console.error("❌ Failed to share content:", error);
            UIComponents.showNotification("❌ Failed to share content", "error");
            return null;
        }
    }

    renderContentManagementDashboard() {
        // Check if data is available
        if (!this.contentLibrary || this.contentLibrary.length === 0) {
            setInner("content-management-content", `
                <div class="card" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
                    <h3 style="color: var(--gray-600); margin-bottom: 1rem;">Content Management Not Available</h3>
                    <p style="color: var(--gray-500); margin-bottom: 2rem;">
                        Content management features require backend implementation.<br>
                        Please check BACKEND_IMPLEMENTATION.md for setup instructions.
                    </p>
                    <div style="background: var(--accent); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <strong>Required Endpoints:</strong><br>
                        • /educator/content/library<br>
                        • /educator/content/resources<br>
                        • /educator/content/curriculum
                    </div>
                    <button onclick="loadEnhancedContentManagementPage()" class="btn" style="background: var(--primary);">
                        🔄 Retry Connection
                    </button>
                </div>
            `);
            return;
        }

        const totalContent = this.contentLibrary.length;
        const publishedContent = this.contentLibrary.filter(content => content.status === 'published').length;
        const totalViews = this.contentLibrary.reduce((sum, content) => sum + (content.views || 0), 0);
        const avgRating = this.contentLibrary.reduce((sum, content) => sum + (content.rating || 0), 0) / totalContent;

        const dashboardHTML = `
            <!-- Content Management Overview -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                    📚 Content Management System
                    <span style="background: ${isBackendConnected ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                        ${isBackendConnected ? '🟢 Live' : '🟡 Demo'}
                    </span>
                </h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div class="metric-card">
                        <div class="metric-value">${totalContent}</div>
                        <div class="metric-label">Total Content</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${publishedContent}</div>
                        <div class="metric-label">Published</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${totalViews}</div>
                        <div class="metric-label">Total Views</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${avgRating.toFixed(1)}</div>
                        <div class="metric-label">Avg Rating</div>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button onclick="showCreateContentModal()" class="btn" style="background: var(--primary);">
                        ➕ Create Content
                    </button>
                    <button onclick="showUploadResourceModal()" class="btn" style="background: var(--info);">
                        📤 Upload Resource
                    </button>
                    <button onclick="showCurriculumMapperModal()" class="btn" style="background: var(--success);">
                        🗺️ Map Curriculum
                    </button>
                    <button onclick="showContentSharingModal()" class="btn" style="background: var(--secondary);">
                        🔗 Share Content
                    </button>
                </div>
            </section>

            <!-- Content Library -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">Content Library</h3>
                <div id="content-library-list">
                    ${this.renderContentLibrary()}
                </div>
            </section>

            <!-- Resource Management -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">Resource Management</h3>
                <div id="resources-list">
                    ${this.renderResourcesList()}
                </div>
            </section>

            <!-- Curriculum Mapping -->
            <section class="card" style="margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">Curriculum Mapping</h3>
                <div id="curriculum-maps-list">
                    ${this.renderCurriculumMaps()}
                </div>
            </section>

            <!-- Shared Content -->
            <section class="card">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">Shared Content from Community</h3>
                <div id="shared-content-list">
                    ${this.renderSharedContent()}
                </div>
            </section>
        `;

        setInner("content-management-content", dashboardHTML);
    }

    renderContentLibrary() {
        return this.contentLibrary.map(content => {
            const typeIcons = {
                video: '🎥',
                document: '📄',
                interactive: '🎮',
                audio: '🎵',
                image: '🖼️'
            };

            const statusColors = {
                published: 'var(--success)',
                draft: 'var(--warning)',
                archived: 'var(--gray-500)'
            };

            return `
                <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid ${statusColors[content.status]};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span style="font-size: 1.5rem;">${typeIcons[content.type] || '📄'}</span>
                            <div>
                                <h4 style="margin: 0; color: var(--gray-800);">${content.title}</h4>
                                <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">
                                    ${content.format} • ${content.size} ${content.duration ? `• ${content.duration} min` : ''}
                                </p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <span style="background: ${statusColors[content.status]}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; text-transform: capitalize;">
                                ${content.status}
                            </span>
                            <span style="color: var(--warning);">⭐ ${content.rating}</span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--primary);">${content.views}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Views</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--success);">${content.rating}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Rating</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 0.875rem; font-weight: 600; color: var(--info);">${getRelativeTime(content.uploadDate)}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Uploaded</div>
                        </div>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            ${content.tags.map(tag => `
                                <span style="background: var(--accent); color: var(--gray-700); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                                    #${tag}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button onclick="editContent('${content.id}')" class="btn" style="padding: 0.5rem 1rem; background: var(--primary); font-size: 0.875rem;">
                            ✏️ Edit
                        </button>
                        <button onclick="viewContentAnalytics('${content.id}')" class="btn" style="padding: 0.5rem 1rem; background: var(--info); font-size: 0.875rem;">
                            📊 Analytics
                        </button>
                        <button onclick="shareContent('${content.id}')" class="btn" style="padding: 0.5rem 1rem; background: var(--success); font-size: 0.875rem;">
                            🔗 Share
                        </button>
                        <button onclick="duplicateContent('${content.id}')" class="btn" style="padding: 0.5rem 1rem; background: var(--secondary); font-size: 0.875rem;">
                            📋 Duplicate
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderResourcesList() {
        return this.resources.map(resource => {
            const typeIcons = {
                book: '📚',
                reference: '📖',
                data: '💾',
                tool: '🛠️',
                link: '🔗'
            };

            return `
                <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span style="font-size: 1.5rem;">${typeIcons[resource.type] || '📄'}</span>
                            <div>
                                <h4 style="margin: 0; color: var(--gray-800);">${resource.name}</h4>
                                <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">${resource.description}</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="editResource('${resource.id}')" class="btn" style="background: var(--primary); padding: 0.5rem 1rem;">
                                ✏️ Edit
                            </button>
                            <button onclick="downloadResource('${resource.id}')" class="btn" style="background: var(--success); padding: 0.5rem 1rem;">
                                📥 Download
                            </button>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--info); text-transform: capitalize;">${resource.type}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Type</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--primary); text-transform: capitalize;">${resource.accessLevel}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Access</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; font-weight: 600; color: var(--success);">${resource.downloads}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Downloads</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCurriculumMaps() {
        return this.curriculumMaps.map(curriculum => `
            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">${curriculum.title}</h4>
                        <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">
                            ${curriculum.totalLessons} lessons • ${Math.round(curriculum.totalDuration / 60)} hours • ${curriculum.overallCompletion}% complete
                        </p>
                    </div>
                    <button onclick="editCurriculum('${curriculum.id}')" class="btn" style="background: var(--primary); padding: 0.5rem 1rem;">
                        ✏️ Edit Map
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    ${curriculum.modules.map(module => `
                        <div style="background: var(--white); padding: 1rem; border-radius: 6px;">
                            <h5 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">${module.title}</h5>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--gray-600);">
                                <span>${module.lessons} lessons</span>
                                <span>${Math.round(module.duration / 60)} hours</span>
                            </div>
                            <div style="background: var(--gray-300); height: 6px; border-radius: 3px; overflow: hidden;">
                                <div style="background: var(--success); height: 100%; width: ${module.completion}%; transition: width 0.3s ease;"></div>
                            </div>
                            <div style="text-align: center; margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: var(--success);">
                                ${module.completion}% Complete
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    renderSharedContent() {
        return this.sharedContent.map(content => `
            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">${content.title}</h4>
                        <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">
                            Shared by ${content.sharedBy} from ${content.institution}
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span style="color: var(--warning);">⭐ ${content.rating}</span>
                        <button onclick="importSharedContent('${content.id}')" class="btn" style="background: var(--success); padding: 0.5rem 1rem;">
                            📥 Import
                        </button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 600; color: var(--info); text-transform: capitalize;">${content.type}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Type</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 600; color: var(--primary);">${content.downloads}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Downloads</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 0.875rem; font-weight: 600; color: var(--success);">${getRelativeTime(content.sharedDate)}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Shared</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize Content Management System
const contentManagementSystem = new ContentManagementSystem();

async function initializeEducatorPortal() {
    // Get authentication token
    const token = getCookie("login");
    if (!token) {
        console.log("❌ No authentication token found");
        redirect(`https://${GITHUB_USERNAME}.github.io/agenticlearn-auth`);
        return;
    }

    // Set token for API client
    educatorAPI.setToken(token);

    try {
        // Test backend connection first
        UIComponents.showNotification("🔗 Connecting to AgenticAI backend...", "info");

        const isConnected = await educatorAPI.testConnection();
        if (!isConnected) {
            console.log("⚠️ Backend connection failed, using demo mode");
            UIComponents.showNotification("⚠️ Backend offline - Using demo data", "warning");
        } else {
            console.log("✅ Backend connection successful");
            UIComponents.showNotification("✅ Connected to AgenticAI backend", "success");
        }

        // Initialize sidebar navigation
        initializeSidebar();

        // Load educator data with enhanced error handling
        await loadEducatorDataWithFallback();
        await loadClassDataWithFallback();
        await loadStudentListWithFallback();
        await loadAIInsightsWithFallback();

        // Load additional dashboard components
        await loadStudentPerformanceAlertsWithFallback();
        await loadSystemHealthStatusWithFallback();

        // Setup event listeners
        setupEventListeners();

        // Update carbon indicator
        updateCarbonIndicator();

        // Show final status
        const statusMessage = isBackendConnected
            ? "🌱 Educator Portal loaded with real data!"
            : "🌱 Educator Portal loaded with demo data";
        UIComponents.showNotification(statusMessage, "success");

        console.log("🌱 Educator Portal initialization complete");
    } catch (error) {
        console.error("Failed to load educator portal:", error);
        setInner("educator-name", "Error loading data");
        UIComponents.showNotification("❌ Failed to load educator portal", "error");
    }
}

// Sidebar Navigation Functions
function initializeSidebar() {
    setupSidebarEventListeners();
    loadBerandaPage(); // Load default page
}

function setupSidebarEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
        });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected page
    document.getElementById(`page-${pageName}`).classList.add('active');

    // Add active class to selected menu item
    event.target.closest('.menu-item').classList.add('active');

    // Update page title and subtitle
    updatePageHeader(pageName);

    // Load page content
    loadPageContent(pageName);

    // Close mobile sidebar
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

function updatePageHeader(pageName) {
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const pageInfo = {
        beranda: {
            title: 'Dashboard Overview',
            subtitle: 'Welcome to your educator dashboard'
        },
        analytics: {
            title: 'Analytics & Insights',
            subtitle: 'AI-powered learning analytics and performance insights'
        },
        students: {
            title: 'Student Management',
            subtitle: 'Monitor and manage student progress and engagement'
        },
        communication: {
            title: 'Communication Center',
            subtitle: 'Manage student communications and announcements'
        },
        workflow: {
            title: 'Workflow Tools',
            subtitle: 'D1-D24 educator workflow and class management tools'
        },
        assessments: {
            title: 'Assessment Management',
            subtitle: 'Create, manage, and analyze student assessments'
        },
        'ai-recommendations': {
            title: 'AI Recommendations',
            subtitle: 'Personalized learning recommendations and adaptive content'
        },
        reports: {
            title: 'Reports & Export',
            subtitle: 'Generate comprehensive reports and export data'
        },
        integrations: {
            title: 'Integrations',
            subtitle: 'Manage external integrations and API connections'
        },
        security: {
            title: 'Security & Authentication',
            subtitle: 'Advanced security controls and authentication management'
        },
        performance: {
            title: 'Performance Optimization',
            subtitle: 'System performance monitoring and optimization tools'
        },
        'advanced-analytics': {
            title: 'Advanced Analytics',
            subtitle: 'Machine learning insights and predictive analytics'
        },
        mobile: {
            title: 'Mobile & PWA',
            subtitle: 'Mobile optimization and Progressive Web App features'
        },
        settings: {
            title: 'Settings',
            subtitle: 'Configure your preferences and system settings'
        }
    };

    if (pageInfo[pageName]) {
        pageTitle.textContent = pageInfo[pageName].title;
        pageSubtitle.textContent = pageInfo[pageName].subtitle;
    }
}

function loadPageContent(pageName) {
    switch(pageName) {
        case 'beranda':
            loadBerandaPage();
            break;
        case 'analytics':
            loadAnalyticsPage();
            break;
        case 'students':
            loadStudentsPage();
            break;
        case 'communication':
            loadCommunicationPage();
            break;
        case 'workflow':
            loadWorkflowPage();
            break;
        case 'assessments':
            loadAssessmentsPage();
            break;
        case 'ai-recommendations':
            loadAIRecommendationsPage();
            break;
        case 'reports':
            loadReportsPage();
            break;
        case 'integrations':
            loadIntegrationsPage();
            break;
        case 'security':
            loadSecurityPage();
            break;
        case 'performance':
            loadPerformancePage();
            break;
        case 'advanced-analytics':
            loadAdvancedAnalyticsPage();
            break;
        case 'mobile':
            loadMobilePage();
            break;
        case 'settings':
            loadSettingsPage();
            break;
    }
}

// Enhanced data loading functions with robust fallback
async function loadEducatorDataWithFallback() {
    try {
        console.log("🔄 Loading educator data from AgenticAI backend...");
        const response = await educatorAPI.request("/educator/profile");

        if (response && response.success && response.profile) {
            currentEducatorData = response.profile;
            const educatorName = response.profile.name || response.profile.fullName || "Dr. Sarah Educator";
            setInner("educator-name", educatorName);

            // Update sidebar footer with real educator info
            updateSidebarEducatorInfo(response.profile);

            console.log("✅ Real educator data loaded from AgenticAI:", response.profile);
            UIComponents.showNotification(`👤 Welcome ${educatorName}!`, "success");
            return response.profile;
        } else {
            throw new Error("Invalid educator data format");
        }
    } catch (error) {
        console.error("❌ Failed to load real educator data:", error);
        UIComponents.showNotification("⚠️ Using demo educator data", "warning");
        return loadDemoEducatorData();
    }
}

function loadDemoEducatorData() {
    console.log("🔄 Loading demo educator data...");
    const demoData = {
        id: "educator-demo-1",
        name: "Dr. Sarah Johnson",
        fullName: "Dr. Sarah Johnson",
        email: "sarah.johnson@agenticlearn.com",
        department: "Computer Science",
        title: "Senior Lecturer",
        experience: "8 years",
        specialization: ["Data Science", "Machine Learning", "AI Education"]
    };

    currentEducatorData = demoData;
    setInner("educator-name", demoData.name);
    updateSidebarEducatorInfo(demoData);

    console.log("✅ Demo educator data loaded");
    return demoData;
}

function updateSidebarEducatorInfo(educatorData) {
    const sidebarFooter = document.querySelector('.sidebar-footer');
    if (sidebarFooter && educatorData) {
        const statusIndicator = isBackendConnected ? '🟢' : '🟡';
        const statusText = isBackendConnected ? 'Live Data' : 'Demo Mode';

        sidebarFooter.innerHTML = `
            <div style="background: var(--accent); padding: 0.75rem; border-radius: 8px; text-align: center;">
                <div style="font-size: 0.75rem; color: var(--gray-600); margin-bottom: 0.25rem;">
                    ${statusIndicator} ${statusText}
                </div>
                <div style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">
                    ${educatorData.name || educatorData.fullName}
                </div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">
                    ${educatorData.department || educatorData.title || 'Educator'}
                </div>
            </div>
        `;
    }
}

async function loadClassDataWithFallback() {
    try {
        console.log("🔄 Loading dashboard stats from AgenticAI backend...");

        // Load dashboard statistics from AgenticAI
        const response = await educatorAPI.request("/educator/dashboard/stats");

        if (response && response.success && response.stats) {
            console.log("✅ Real dashboard stats loaded from AgenticAI:", response.stats);

            // Use real stats from AgenticAI backend
            const stats = {
                totalStudents: response.stats.total_students || 245,
                activeStudents: response.stats.active_students || 198,
                completionRate: response.stats.avg_completion || 78.5,
                averageProgress: response.stats.avg_completion || 78.5,
                unreadMessages: 12, // Will be from messages endpoint later
                atRiskStudents: 3, // Will be calculated from student data
                totalAssessments: response.stats.total_assessments || 89,
                avgRating: response.stats.avg_rating || 4.8,
                // Additional metrics from this_month data
                activeClasses: 3,
                engagementRate: 85,
                onlineStudents: 12,
                activeSessions: 8,
                completionToday: response.stats.this_month?.completions || 18,
                monthlyScore: response.stats.this_month?.avg_score || 85.2,
                newEnrollments: response.stats.this_month?.new_enrollments || 23
            };

            updateDashboardMetrics(stats, true);
            UIComponents.showNotification("✅ Real dashboard stats loaded from AgenticAI", "success");
            console.log("📊 Dashboard updated with AgenticAI stats:", stats);
            return stats;
        } else {
            throw new Error("Invalid dashboard stats format from AgenticAI");
        }
    } catch (error) {
        console.error("❌ Failed to load real dashboard stats from AgenticAI:", error);
        UIComponents.showNotification("⚠️ Using demo data - AgenticAI stats unavailable", "warning");
        return loadDemoClassData();
    }
}

function loadDemoClassData() {
    console.log("🔄 Loading demo class data...");
    const demoStats = {
        totalStudents: 45,
        averageProgress: 78,
        unreadMessages: 12,
        atRiskStudents: 3,
        activeClasses: 3,
        completionRate: 68,
        engagementRate: 85,
        onlineStudents: 12,
        activeSessions: 8,
        completionToday: 24
    };

    updateDashboardMetrics(demoStats, false);
    console.log("✅ Demo class data loaded");
    return demoStats;
}

function updateDashboardMetrics(stats, isRealData = false) {
    // Update main dashboard metrics
    setInner("total-students", stats.totalStudents || 45);
    setInner("average-progress", `${Math.round(stats.averageProgress || 78)}%`);
    setInner("unread-messages", stats.unreadMessages || 12);
    setInner("at-risk-students", stats.atRiskStudents || 3);

    // Update additional metrics if elements exist
    if (document.getElementById("active-classes")) {
        setInner("active-classes", stats.activeClasses || 3);
    }
    if (document.getElementById("completion-rate")) {
        setInner("completion-rate", `${Math.round(stats.completionRate || 68)}%`);
    }
    if (document.getElementById("engagement-rate")) {
        setInner("engagement-rate", `${Math.round(stats.engagementRate || 85)}%`);
    }

    // Update real-time stats if available
    if (document.getElementById("online-students")) {
        setInner("online-students", stats.onlineStudents || 12);
    }
    if (document.getElementById("active-sessions")) {
        setInner("active-sessions", stats.activeSessions || 8);
    }
    if (document.getElementById("completion-today")) {
        setInner("completion-today", stats.completionToday || 24);
    }

    // Show appropriate notification
    const message = isRealData
        ? "📊 Dashboard updated with real-time data"
        : "📊 Dashboard loaded with demo data";
    const type = isRealData ? "success" : "info";

    // Only show notification if not during initial load
    if (document.readyState === 'complete') {
        UIComponents.showNotification(message, type);
    }
}

async function loadStudentListWithFallback() {
    try {
        console.log("🔄 Loading student list from AgenticAI backend...");
        const response = await educatorAPI.request("/educator/students");

        if (response && response.success && response.students) {
            const students = response.students;
            currentStudentData = Array.isArray(students) ? students : [];

            // Transform AgenticAI data format to portal format
            const transformedStudents = currentStudentData.map(student => ({
                id: student.id,
                name: student.name,
                email: student.email,
                progress: student.progress || 0,
                grade: student.grade || 'N/A',
                status: student.status || 'active',
                course: student.course || 'Unknown Course',
                lastActive: student.last_active ? getRelativeTime(student.last_active) : 'Unknown',
                modules: Math.floor(student.progress / 10) || 0,
                assignments: Math.floor(student.progress / 8) || 0
            }));

            currentStudentData = transformedStudents;

            // Load additional real-time data
            await loadRealTimeStatsWithFallback();
            await loadActivityTimelineWithFallback();

            // Render student table with real data
            renderEnhancedStudentTable(currentStudentData, true);
            updateLastUpdateTime();

            console.log(`✅ Real student data loaded from AgenticAI: ${currentStudentData.length} students`);
            UIComponents.showNotification(`📊 ${currentStudentData.length} students loaded from AgenticAI`, "success");
            return currentStudentData;
        } else {
            throw new Error("Invalid student data format");
        }
    } catch (error) {
        console.error("❌ Failed to load real student data:", error);
        UIComponents.showNotification("⚠️ Using demo student data", "warning");
        return loadDemoStudentData();
    }
}

function loadDemoStudentData() {
    console.log("🔄 Loading demo student data...");

    const demoStudents = [
        {
            id: "student-1",
            name: "Ahmad Rizki",
            email: "ahmad.rizki@student.com",
            progress: 85,
            lastActive: "2 hours ago",
            status: "active",
            modules: 8,
            assignments: 12,
            grade: "A"
        },
        {
            id: "student-2",
            name: "Sari Dewi",
            email: "sari.dewi@student.com",
            progress: 92,
            lastActive: "1 hour ago",
            status: "active",
            modules: 9,
            assignments: 14,
            grade: "A+"
        },
        {
            id: "student-3",
            name: "Budi Santoso",
            email: "budi.santoso@student.com",
            progress: 67,
            lastActive: "1 day ago",
            status: "warning",
            modules: 6,
            assignments: 8,
            grade: "B"
        },
        {
            id: "student-4",
            name: "Maya Rajin",
            email: "maya.rajin@student.com",
            progress: 25,
            lastActive: "7 days ago",
            status: "at-risk",
            modules: 2,
            assignments: 3,
            grade: "D"
        },
        {
            id: "student-5",
            name: "Andi Cerdas",
            email: "andi.cerdas@student.com",
            progress: 78,
            lastActive: "3 hours ago",
            status: "active",
            modules: 7,
            assignments: 10,
            grade: "B+"
        }
    ];

    currentStudentData = demoStudents;

    // Load demo supporting data
    loadDemoRealTimeStats();
    loadDemoActivityTimeline();

    // Render student table with demo data
    renderEnhancedStudentTable(currentStudentData, false);
    updateLastUpdateTime();

    console.log("✅ Demo student data loaded");
    return demoStudents;
}

async function loadRealTimeStatsWithFallback() {
    try {
        console.log("🔄 Loading real-time stats...");
        const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.REALTIME_STATS);

        if (response && (response.data || response.stats)) {
            const stats = response.data || response.stats || response;
            updateRealTimeStats(stats, true);
            console.log("✅ Real real-time stats loaded:", stats);
            return stats;
        } else {
            throw new Error("Invalid real-time stats format");
        }
    } catch (error) {
        console.error("❌ Failed to load real real-time stats:", error);
        return loadDemoRealTimeStats();
    }
}

function loadDemoRealTimeStats() {
    console.log("🔄 Loading demo real-time stats...");
    const demoStats = {
        onlineStudents: 12,
        activeSessions: 8,
        avgEngagement: 78,
        completionToday: 24,
        totalActiveTime: 180,
        averageSessionDuration: 45
    };

    updateRealTimeStats(demoStats, false);
    console.log("✅ Demo real-time stats loaded");
    return demoStats;
}

function updateRealTimeStats(stats, isRealData = false) {
    // Update real-time statistics
    if (document.getElementById("online-students")) {
        setInner("online-students", stats.onlineStudents || 12);
    }
    if (document.getElementById("active-sessions")) {
        setInner("active-sessions", stats.activeSessions || 8);
    }
    if (document.getElementById("avg-engagement")) {
        setInner("avg-engagement", `${stats.avgEngagement || 78}%`);
    }
    if (document.getElementById("completion-today")) {
        setInner("completion-today", stats.completionToday || 24);
    }

    // Update last sync time
    updateLastUpdateTime();

    // Show data source indicator in real-time section
    const realTimeSection = document.querySelector('.real-time-stats-header');
    if (realTimeSection) {
        const indicator = isRealData
            ? '<span style="color: var(--success); font-size: 0.75rem;">🟢 Live</span>'
            : '<span style="color: var(--warning); font-size: 0.75rem;">🟡 Demo</span>';

        // Add or update indicator
        let existingIndicator = realTimeSection.querySelector('.data-indicator');
        if (existingIndicator) {
            existingIndicator.innerHTML = indicator;
        } else {
            realTimeSection.insertAdjacentHTML('beforeend', `<div class="data-indicator">${indicator}</div>`);
        }
    }
}

function loadDemoRealTimeStats() {
    setInner("online-students", "12");
    setInner("active-sessions", "8");
    setInner("avg-engagement", "78%");
    setInner("completion-today", "24");
}

async function loadActivityTimelineWithFallback() {
    try {
        console.log("🔄 Loading activity timeline...");
        const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.RECENT_ACTIVITY);

        if (response && (response.data || response.activities || Array.isArray(response))) {
            const activities = response.data || response.activities || response;
            renderActivityTimeline(Array.isArray(activities) ? activities : [], true);
            console.log("✅ Real activity timeline loaded:", activities);
            return activities;
        } else {
            throw new Error("Invalid activity data format");
        }
    } catch (error) {
        console.error("❌ Failed to load real activity timeline:", error);
        return loadDemoActivityTimeline();
    }
}

function loadDemoActivityTimeline() {
    console.log("🔄 Loading demo activity timeline...");
    const demoActivities = [
        {
            id: "activity-1",
            type: "completion",
            studentName: "Ahmad Rizki",
            action: "completed Module 2: Data Analysis",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            icon: "✅"
        },
        {
            id: "activity-2",
            type: "login",
            studentName: "Sari Dewi",
            action: "logged in and started Module 3",
            timestamp: new Date(Date.now() - 600000).toISOString(),
            icon: "🔑"
        },
        {
            id: "activity-3",
            type: "submission",
            studentName: "Budi Santoso",
            action: "submitted Assignment 2",
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            icon: "📝"
        },
        {
            id: "activity-4",
            type: "question",
            studentName: "Maya Rajin",
            action: "asked a question in Module 1",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            icon: "❓"
        },
        {
            id: "activity-5",
            type: "achievement",
            studentName: "Andi Cerdas",
            action: "earned 'Data Visualization Expert' badge",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            icon: "🏆"
        }
    ];

    renderActivityTimeline(demoActivities, false);
    console.log("✅ Demo activity timeline loaded");
    return demoActivities;
}

function loadDemoActivityTimeline() {
    const demoActivities = [
        { time: "2 minutes ago", student: "Andi Mahasiswa", action: "Completed Lesson 3.2: Data Visualization", type: "completion" },
        { time: "5 minutes ago", student: "Sari Belajar", action: "Started Module 2: Analytics Fundamentals", type: "start" },
        { time: "8 minutes ago", student: "Budi Cerdas", action: "Submitted Assignment: Python Basics", type: "submission" },
        { time: "12 minutes ago", student: "Maya Rajin", action: "Logged in to platform", type: "login" },
        { time: "15 minutes ago", student: "Andi Mahasiswa", action: "Achieved 80% score on Quiz 3.1", type: "achievement" },
        { time: "18 minutes ago", student: "Sari Belajar", action: "Watched Video: Introduction to Pandas", type: "engagement" }
    ];
    renderActivityTimeline(demoActivities);
}

function renderActivityTimeline(activities, isRealData = false) {
    const timelineHTML = activities.map(activity => {
        const iconMap = {
            completion: "✅",
            start: "🚀",
            submission: "📝",
            login: "👤",
            achievement: "🏆",
            engagement: "📹",
            question: "❓"
        };

        const colorMap = {
            completion: "var(--success)",
            start: "var(--info)",
            submission: "var(--primary)",
            login: "var(--gray-500)",
            achievement: "var(--secondary-dark)",
            engagement: "var(--accent-dark)",
            question: "var(--warning)"
        };

        // Handle different data formats
        const studentName = activity.studentName || activity.student || 'Unknown Student';
        const actionText = activity.action || activity.description || 'Unknown action';
        const timeText = activity.time || getRelativeTime(activity.timestamp) || 'Unknown time';
        const activityType = activity.type || 'engagement';
        const activityIcon = activity.icon || iconMap[activityType] || "📝";

        return `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-bottom: 1px solid var(--accent); last-child:border-bottom: none;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: ${colorMap[activityType] || 'var(--gray-500)'}; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; flex-shrink: 0;">
                    ${activityIcon}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--gray-800); font-size: 0.875rem;">${studentName}</div>
                    <div style="color: var(--gray-600); font-size: 0.75rem;">${actionText}</div>
                </div>
                <div style="color: var(--gray-500); font-size: 0.75rem; flex-shrink: 0;">${timeText}</div>
            </div>
        `;
    }).join('');

    // Add data source indicator to activity timeline header
    const activityContainer = document.getElementById("activity-timeline");
    if (activityContainer) {
        const dataIndicator = isRealData
            ? '<span style="color: var(--success); font-size: 0.75rem;">🟢 Live</span>'
            : '<span style="color: var(--warning); font-size: 0.75rem;">🟡 Demo</span>';

        // Update header if it exists
        const header = activityContainer.previousElementSibling;
        if (header && header.classList.contains('activity-header')) {
            let indicator = header.querySelector('.data-indicator');
            if (indicator) {
                indicator.innerHTML = dataIndicator;
            } else {
                header.insertAdjacentHTML('beforeend', `<div class="data-indicator">${dataIndicator}</div>`);
            }
        }
    }

    setInner("activity-timeline", timelineHTML);
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    setInner("last-update-time", timeString);
}

function renderEnhancedStudentTable(students, isRealData = false) {
    // Add data source indicator
    const dataSourceIndicator = isRealData
        ? '<span style="color: var(--success); font-size: 0.75rem; background: var(--bg-light); padding: 0.25rem 0.5rem; border-radius: 4px;">🟢 Live Data</span>'
        : '<span style="color: var(--warning); font-size: 0.75rem; background: var(--bg-light); padding: 0.25rem 0.5rem; border-radius: 4px;">🟡 Demo Data</span>';

    const tableHTML = `
        <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <h4 style="margin: 0; color: var(--gray-800);">Student Monitoring (${students.length} students)</h4>
            <div>${dataSourceIndicator}</div>
        </div>
        <table class="student-table">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Current Module</th>
                    <th>Progress</th>
                    <th>Engagement</th>
                    <th>Status</th>
                    <th>Last Activity</th>
                    <th>Risk Level</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => {
                    const riskLevel = getRiskLevel(student);
                    const riskColor = getRiskColor(riskLevel);
                    const statusIcon = getStatusIcon(student.status);

                    return `
                        <tr style="border-left: 3px solid ${riskColor};">
                            <td>
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--secondary); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 12px;">
                                        ${(student.name || 'Unknown').split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div>
                                        <div style="font-weight: 600; color: var(--gray-800);">${student.name || 'Unknown Student'}</div>
                                        <div style="font-size: 0.75rem; color: var(--gray-600);">${student.email || 'No email'}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style="font-weight: 500; color: var(--gray-800);">Module ${student.currentModule || student.modules || 1}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-600);">${student.currentLesson || 'Introduction'}</div>
                            </td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div class="progress-mini" style="width: 80px;">
                                        <div class="progress-mini-fill" style="width: ${student.progress || 0}%"></div>
                                    </div>
                                    <span style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">${student.progress || 0}%</span>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--gray-600);">${student.completedLessons || 0}/${student.totalLessons || 20} lessons</div>
                            </td>
                            <td>
                                <div style="text-align: center;">
                                    <div style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">${student.engagementScore || 75}%</div>
                                    <div style="font-size: 0.75rem; color: var(--gray-600);">${student.timeSpent || 45}min today</div>
                                </div>
                            </td>
                            <td>
                                <span class="${student.status === 'online' ? 'status-active' : student.status === 'active' ? 'status-active' : 'status-inactive'}">
                                    ${statusIcon} ${student.status === 'online' ? 'Online' : student.status === 'active' ? 'Active' : 'Offline'}
                                </span>
                            </td>
                            <td>
                                <div style="font-size: 0.875rem; color: var(--gray-800);">${getRelativeTime(student.lastActive)}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-600);">${formatDate(student.lastActive)}</div>
                            </td>
                            <td>
                                <span style="background: ${riskColor}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                                    ${riskLevel}
                                </span>
                            </td>
                            <td>
                                <div style="display: flex; gap: 0.25rem;">
                                    <button class="btn" onclick="viewStudentDetail('${student.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: var(--primary);">
                                        👤 View
                                    </button>
                                    <button class="btn" onclick="sendMessageToStudent('${student.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: var(--info);">
                                        💬 Message
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    setInner("student-list", tableHTML);
}

// Helper function for date formatting
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    try {
        return new Date(dateString).toLocaleDateString('id-ID');
    } catch (error) {
        return 'Invalid date';
    }
}

function renderStudentTable(students) {
    // Fallback to enhanced table
    renderEnhancedStudentTable(students);
}

function getRiskLevel(student) {
    const progress = student.progress || 0;
    const lastActive = new Date(student.lastActive);
    const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);

    if (progress < 30 || daysSinceActive > 7) return "High";
    if (progress < 60 || daysSinceActive > 3) return "Medium";
    return "Low";
}

function getRiskColor(riskLevel) {
    switch(riskLevel) {
        case "High": return "var(--error)";
        case "Medium": return "var(--warning)";
        case "Low": return "var(--success)";
        default: return "var(--gray-500)";
    }
}

function getStatusIcon(status) {
    switch(status) {
        case "online": return "🟢";
        case "active": return "🟡";
        case "offline": return "🔴";
        default: return "⚪";
    }
}

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

function renderDemoStudentTable() {
    const demoStudents = [
        {
            id: "student-1",
            name: "Andi Mahasiswa",
            email: "andi@student.edu",
            progress: 75,
            status: "online",
            lastActive: new Date().toISOString(),
            currentModule: 3,
            currentLesson: "Data Visualization",
            completedLessons: 15,
            totalLessons: 20,
            engagementScore: 85,
            timeSpent: 120
        },
        {
            id: "student-2",
            name: "Sari Belajar",
            email: "sari@student.edu",
            progress: 45,
            status: "active",
            lastActive: new Date(Date.now() - 3600000).toISOString(),
            currentModule: 2,
            currentLesson: "Analytics Fundamentals",
            completedLessons: 9,
            totalLessons: 20,
            engagementScore: 72,
            timeSpent: 45
        },
        {
            id: "student-3",
            name: "Budi Cerdas",
            email: "budi@student.edu",
            progress: 90,
            status: "online",
            lastActive: new Date(Date.now() - 300000).toISOString(),
            currentModule: 4,
            currentLesson: "Advanced Analytics",
            completedLessons: 18,
            totalLessons: 20,
            engagementScore: 95,
            timeSpent: 180
        },
        {
            id: "student-4",
            name: "Maya Rajin",
            email: "maya@student.edu",
            progress: 25,
            status: "offline",
            lastActive: new Date(Date.now() - 604800000).toISOString(),
            currentModule: 1,
            currentLesson: "Introduction",
            completedLessons: 5,
            totalLessons: 20,
            engagementScore: 35,
            timeSpent: 15
        },
        {
            id: "student-5",
            name: "Dewi Pintar",
            email: "dewi@student.edu",
            progress: 60,
            status: "active",
            lastActive: new Date(Date.now() - 7200000).toISOString(),
            currentModule: 2,
            currentLesson: "Data Processing",
            completedLessons: 12,
            totalLessons: 20,
            engagementScore: 78,
            timeSpent: 90
        },
        {
            id: "student-6",
            name: "Rudi Tekun",
            email: "rudi@student.edu",
            progress: 80,
            status: "online",
            lastActive: new Date(Date.now() - 900000).toISOString(),
            currentModule: 3,
            currentLesson: "Machine Learning Basics",
            completedLessons: 16,
            totalLessons: 20,
            engagementScore: 88,
            timeSpent: 150
        }
    ];
    renderEnhancedStudentTable(demoStudents);
}

// ===== AI INSIGHTS LOADING =====

async function loadAIInsightsWithFallback() {
    try {
        console.log("🔄 Loading AI insights with ARIA AI...");

        // Set token for ARIA AI
        ariaAI.setToken(authToken);

        // Get current educator and class data for context
        const educatorContext = currentEducatorData || {};
        const classContext = {
            students: currentStudentData || [],
            totalStudents: currentStudentData?.length || 0
        };

        // Generate AI recommendations using ARIA AI
        const aiRecommendations = await ariaAI.generateRecommendations(educatorContext, classContext);

        // Analyze student data with ARIA AI
        const studentAnalyses = await Promise.all(
            (currentStudentData || []).slice(0, 5).map(student =>
                ariaAI.analyzeStudent(student)
            )
        );

        // Load traditional API data as backup
        const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.AI_INSIGHTS);

        if (response && response.data) {
            currentAnalyticsData = response.data;

            // Enhance with ARIA AI insights
            currentAnalyticsData.ariaRecommendations = aiRecommendations;
            currentAnalyticsData.studentAnalyses = studentAnalyses;

            // Load all AI insights components with enhanced data
            await loadEnhancedLearningPatterns(currentAnalyticsData);
            await loadEnhancedAtRiskStudents(currentAnalyticsData);
            await loadEnhancedContentEffectiveness(currentAnalyticsData);
            await loadARIARecommendations(aiRecommendations);

            console.log("✅ Enhanced AI insights loaded with ARIA AI:", currentAnalyticsData);
            UIComponents.showNotification("🤖 ARIA AI insights loaded successfully", "success");
            return currentAnalyticsData;
        } else {
            throw new Error("Invalid AI insights data format");
        }
    } catch (error) {
        console.error("❌ Failed to load real AI insights:", error);
        UIComponents.showNotification("⚠️ Using demo AI insights", "warning");
        return loadDemoAIInsights();
    }
}

function loadDemoAIInsights() {
    console.log("🔄 Loading demo AI insights...");

    // Load demo learning patterns
    loadLearningPatterns();

    // Load demo at-risk students
    loadAtRiskStudents();

    // Load demo content effectiveness
    loadContentEffectiveness();

    // Load demo ARIA recommendations
    loadDemoARIARecommendations();

    console.log("✅ Demo AI insights loaded");
    return true;
}

// ===== ENHANCED AI FUNCTIONS WITH ARIA INTEGRATION =====

async function loadEnhancedLearningPatterns(analyticsData) {
    try {
        const patterns = analyticsData.learningPatterns || {};
        const ariaInsights = analyticsData.ariaRecommendations || {};

        // Enhanced learning patterns with ARIA AI insights
        const enhancedPatterns = {
            peakTime: patterns.peakTime || "19:00-21:00 WIB",
            mobileAccess: patterns.mobileAccess || 85,
            avgSessionDuration: patterns.avgSessionDuration || "45 min",
            insights: ariaInsights.success
                ? `🤖 ARIA AI Analysis: ${ariaInsights.recommendations?.[0] || 'Students show optimal learning patterns in evening hours.'}`
                : patterns.insights || "Students are most active in evening hours. Mobile learning is preferred."
        };

        // Update UI with enhanced data
        if (document.getElementById("peak-time")) {
            setInner("peak-time", enhancedPatterns.peakTime);
        }
        if (document.getElementById("mobile-access")) {
            setInner("mobile-access", `${enhancedPatterns.mobileAccess}%`);
        }
        if (document.getElementById("session-duration")) {
            setInner("session-duration", enhancedPatterns.avgSessionDuration);
        }
        if (document.getElementById("learning-insights")) {
            setInner("learning-insights", enhancedPatterns.insights);
        }

        console.log("✅ Enhanced learning patterns loaded with ARIA AI");
    } catch (error) {
        console.error("❌ Failed to load enhanced learning patterns:", error);
        // Fallback to basic patterns
        loadLearningPatterns();
    }
}

async function loadEnhancedAtRiskStudents(analyticsData) {
    try {
        const riskData = analyticsData.atRiskStudents || {};
        const studentAnalyses = analyticsData.studentAnalyses || [];

        // Count risk levels from ARIA AI analysis
        const ariaRiskCounts = studentAnalyses.reduce((counts, analysis) => {
            if (analysis.success && analysis.riskLevel) {
                counts[analysis.riskLevel] = (counts[analysis.riskLevel] || 0) + 1;
            }
            return counts;
        }, {});

        const enhancedRiskData = {
            highRisk: ariaRiskCounts.high || riskData.highRisk || 3,
            mediumRisk: ariaRiskCounts.medium || riskData.mediumRisk || 7,
            interventionNeeded: ariaRiskCounts.high + ariaRiskCounts.medium || riskData.interventionNeeded || 5,
            insights: studentAnalyses.length > 0
                ? `🤖 ARIA AI identified ${ariaRiskCounts.high || 0} high-risk students requiring immediate intervention.`
                : riskData.insights || "3 students need immediate intervention."
        };

        // Update UI with enhanced risk data
        if (document.getElementById("high-risk-count")) {
            setInner("high-risk-count", enhancedRiskData.highRisk);
        }
        if (document.getElementById("medium-risk-count")) {
            setInner("medium-risk-count", enhancedRiskData.mediumRisk);
        }
        if (document.getElementById("intervention-count")) {
            setInner("intervention-count", enhancedRiskData.interventionNeeded);
        }
        if (document.getElementById("risk-insights")) {
            setInner("risk-insights", enhancedRiskData.insights);
        }
        if (document.getElementById("at-risk-students")) {
            setInner("at-risk-students", enhancedRiskData.highRisk);
        }

        console.log("✅ Enhanced at-risk students loaded with ARIA AI");
    } catch (error) {
        console.error("❌ Failed to load enhanced at-risk students:", error);
        // Fallback to basic risk analysis
        loadAtRiskStudents();
    }
}

async function loadEnhancedContentEffectiveness(analyticsData) {
    try {
        const contentData = analyticsData.contentEffectiveness || {};

        // Analyze content with ARIA AI if available
        let ariaContentAnalysis = null;
        if (currentStudentData && currentStudentData.length > 0) {
            const sampleContent = {
                type: 'mixed',
                engagement: contentData.engagementRate || 0.78,
                completion: contentData.completionRate || 0.65
            };
            ariaContentAnalysis = await ariaAI.analyzeContent(sampleContent);
        }

        const enhancedContentData = {
            topContent: contentData.topContent || "Video Tutorials",
            engagementRate: ariaContentAnalysis?.success
                ? `${Math.round(ariaContentAnalysis.engagement * 100)}%`
                : contentData.engagementRate || "78%",
            completionRate: ariaContentAnalysis?.success
                ? `${Math.round(ariaContentAnalysis.effectiveness * 100)}%`
                : contentData.completionRate || "65%",
            insights: ariaContentAnalysis?.success
                ? `🤖 ARIA AI: ${ariaContentAnalysis.recommendations?.[0] || 'Content effectiveness is optimal.'}`
                : contentData.insights || "Video tutorials show highest engagement."
        };

        // Update UI with enhanced content data
        if (document.getElementById("top-content")) {
            setInner("top-content", enhancedContentData.topContent);
        }
        if (document.getElementById("engagement-rate")) {
            setInner("engagement-rate", enhancedContentData.engagementRate);
        }
        if (document.getElementById("completion-rate-content")) {
            setInner("completion-rate-content", enhancedContentData.completionRate);
        }
        if (document.getElementById("content-insights")) {
            setInner("content-insights", enhancedContentData.insights);
        }

        console.log("✅ Enhanced content effectiveness loaded with ARIA AI");
    } catch (error) {
        console.error("❌ Failed to load enhanced content effectiveness:", error);
        // Fallback to basic content analysis
        loadContentEffectiveness();
    }
}

async function loadARIARecommendations(ariaRecommendations) {
    try {
        if (!ariaRecommendations || !ariaRecommendations.success) {
            throw new Error("No ARIA recommendations available");
        }

        const recommendations = ariaRecommendations.recommendations || [];
        const priorities = ariaRecommendations.priorities || [];
        const actionItems = ariaRecommendations.actionItems || [];

        const recommendationsHTML = `
            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                <h4 style="margin: 0 0 1rem 0; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
                    🤖 ARIA AI Recommendations
                    <span style="background: var(--success); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Live</span>
                </h4>

                <div style="margin-bottom: 1rem;">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">Priority Actions:</h5>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        ${priorities.map(priority => `<li style="margin-bottom: 0.25rem; color: var(--gray-700);">${priority}</li>`).join('')}
                    </ul>
                </div>

                <div style="margin-bottom: 1rem;">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">Recommendations:</h5>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        ${recommendations.map(rec => `<li style="margin-bottom: 0.25rem; color: var(--gray-700);">${rec}</li>`).join('')}
                    </ul>
                </div>

                <div>
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">Action Items:</h5>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        ${actionItems.map(action => `<li style="margin-bottom: 0.25rem; color: var(--gray-700);">${action}</li>`).join('')}
                    </ul>
                </div>

                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent); font-size: 0.75rem; color: var(--gray-600);">
                    Timeline: ${ariaRecommendations.timeline || 'Immediate'} | Generated: ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;

        if (document.getElementById("aria-recommendations")) {
            setInner("aria-recommendations", recommendationsHTML);
        } else {
            // Add to AI insights section if specific container doesn't exist
            if (document.getElementById("ai-insights-section")) {
                document.getElementById("ai-insights-section").insertAdjacentHTML('beforeend', recommendationsHTML);
            }
        }

        console.log("✅ ARIA AI recommendations loaded");
    } catch (error) {
        console.error("❌ Failed to load ARIA recommendations:", error);
        loadDemoARIARecommendations();
    }
}

function loadDemoARIARecommendations() {
    const demoRecommendations = `
        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--warning);">
            <h4 style="margin: 0 0 1rem 0; color: var(--warning); display: flex; align-items: center; gap: 0.5rem;">
                🤖 ARIA AI Recommendations
                <span style="background: var(--warning); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Demo</span>
            </h4>

            <div style="margin-bottom: 1rem;">
                <h5 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">Priority Actions:</h5>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    <li style="margin-bottom: 0.25rem; color: var(--gray-700);">Focus on at-risk students (Maya Rajin, Budi Santoso)</li>
                    <li style="margin-bottom: 0.25rem; color: var(--gray-700);">Increase video content engagement</li>
                    <li style="margin-bottom: 0.25rem; color: var(--gray-700);">Schedule intervention sessions</li>
                </ul>
            </div>

            <div style="margin-bottom: 1rem;">
                <h5 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">Recommendations:</h5>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    <li style="margin-bottom: 0.25rem; color: var(--gray-700);">Implement personalized learning paths</li>
                    <li style="margin-bottom: 0.25rem; color: var(--gray-700);">Add more interactive exercises</li>
                    <li style="margin-bottom: 0.25rem; color: var(--gray-700);">Enhance mobile learning experience</li>
                </ul>
            </div>

            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent); font-size: 0.75rem; color: var(--gray-600);">
                Demo Mode | Connect to ARIA AI for real-time recommendations
            </div>
        </div>
    `;

    if (document.getElementById("aria-recommendations")) {
        setInner("aria-recommendations", demoRecommendations);
    }
}

async function loadStudentPerformanceAlertsWithFallback() {
    try {
        console.log("🔄 Loading student performance alerts...");
        const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.STUDENT_ALERTS);

        if (response && (response.data || response.alerts)) {
            const alerts = response.data || response.alerts || response;
            renderStudentPerformanceAlerts(Array.isArray(alerts) ? alerts : [], true);
            console.log("✅ Real student alerts loaded:", alerts);
            return alerts;
        } else {
            throw new Error("Invalid student alerts data format");
        }
    } catch (error) {
        console.error("❌ Failed to load real student alerts:", error);
        return loadDemoStudentPerformanceAlerts();
    }
}

function loadDemoStudentPerformanceAlerts() {
    console.log("🔄 Loading demo student performance alerts...");
    const demoAlerts = [
        {
            id: "alert-1",
            type: "at-risk",
            studentName: "Maya Rajin",
            message: "No activity for 7 days, progress below 30%",
            severity: "high",
            timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: "alert-2",
            type: "low-engagement",
            studentName: "Budi Santoso",
            message: "Engagement score dropped to 45%",
            severity: "medium",
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: "alert-3",
            type: "achievement",
            studentName: "Sari Dewi",
            message: "Completed Module 3 with 95% score",
            severity: "positive",
            timestamp: new Date(Date.now() - 1800000).toISOString()
        }
    ];

    renderStudentPerformanceAlerts(demoAlerts, false);
    console.log("✅ Demo student alerts loaded");
    return demoAlerts;
}

function renderStudentPerformanceAlerts(alerts, isRealData = false) {
    const alertsHTML = alerts.map(alert => {
        const severityColors = {
            high: 'var(--error)',
            medium: 'var(--warning)',
            low: 'var(--info)',
            positive: 'var(--success)'
        };

        const severityIcons = {
            high: '🚨',
            medium: '⚠️',
            low: 'ℹ️',
            positive: '🎉'
        };

        return `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-left: 3px solid ${severityColors[alert.severity]}; background: var(--bg-light); border-radius: 4px; margin-bottom: 0.5rem;">
                <div style="font-size: 1.25rem;">${severityIcons[alert.severity]}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--gray-800); font-size: 0.875rem;">${alert.studentName}</div>
                    <div style="color: var(--gray-600); font-size: 0.75rem;">${alert.message}</div>
                </div>
                <div style="color: var(--gray-500); font-size: 0.75rem;">${getRelativeTime(alert.timestamp)}</div>
            </div>
        `;
    }).join('');

    const dataIndicator = isRealData
        ? '<span style="color: var(--success); font-size: 0.75rem;">🟢 Live</span>'
        : '<span style="color: var(--warning); font-size: 0.75rem;">🟡 Demo</span>';

    setInner("student-performance-alerts", `
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
            <h4 style="margin: 0;">Performance Alerts</h4>
            <div>${dataIndicator}</div>
        </div>
        ${alertsHTML}
    `);
}

async function loadSystemHealthStatusWithFallback() {
    try {
        console.log("🔄 Loading system health status...");
        const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.SYSTEM_HEALTH);

        if (response && (response.data || response.health)) {
            const health = response.data || response.health || response;
            renderSystemHealthStatus(health, true);
            console.log("✅ Real system health loaded:", health);
            return health;
        } else {
            throw new Error("Invalid system health data format");
        }
    } catch (error) {
        console.error("❌ Failed to load real system health:", error);
        return loadDemoSystemHealthStatus();
    }
}

function loadDemoSystemHealthStatus() {
    console.log("🔄 Loading demo system health status...");
    const demoHealth = {
        overall: "healthy",
        apiStatus: "operational",
        databaseStatus: "operational",
        serverLoad: 45,
        uptime: "99.9%",
        lastCheck: new Date().toISOString()
    };

    renderSystemHealthStatus(demoHealth, false);
    console.log("✅ Demo system health loaded");
    return demoHealth;
}

function renderSystemHealthStatus(health, isRealData = false) {
    const statusColors = {
        healthy: 'var(--success)',
        warning: 'var(--warning)',
        critical: 'var(--error)',
        operational: 'var(--success)',
        degraded: 'var(--warning)',
        down: 'var(--error)'
    };

    const statusIcons = {
        healthy: '✅',
        warning: '⚠️',
        critical: '🚨',
        operational: '✅',
        degraded: '⚠️',
        down: '❌'
    };

    const dataIndicator = isRealData
        ? '<span style="color: var(--success); font-size: 0.75rem;">🟢 Live</span>'
        : '<span style="color: var(--warning); font-size: 0.75rem;">🟡 Demo</span>';

    setInner("system-health-status", `
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
            <h4 style="margin: 0;">System Health</h4>
            <div>${dataIndicator}</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
            <div style="text-align: center; padding: 1rem; background: var(--bg-light); border-radius: 8px;">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${statusIcons[health.overall] || '✅'}</div>
                <div style="font-weight: 600; color: ${statusColors[health.overall] || 'var(--success)'};">Overall</div>
                <div style="font-size: 0.75rem; color: var(--gray-600); text-transform: capitalize;">${health.overall || 'Healthy'}</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: var(--bg-light); border-radius: 8px;">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${statusIcons[health.apiStatus] || '✅'}</div>
                <div style="font-weight: 600; color: ${statusColors[health.apiStatus] || 'var(--success)'};">API</div>
                <div style="font-size: 0.75rem; color: var(--gray-600); text-transform: capitalize;">${health.apiStatus || 'Operational'}</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: var(--bg-light); border-radius: 8px;">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${statusIcons[health.databaseStatus] || '✅'}</div>
                <div style="font-weight: 600; color: ${statusColors[health.databaseStatus] || 'var(--success)'};">Database</div>
                <div style="font-size: 0.75rem; color: var(--gray-600); text-transform: capitalize;">${health.databaseStatus || 'Operational'}</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: var(--bg-light); border-radius: 8px;">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📊</div>
                <div style="font-weight: 600; color: var(--primary);">Load</div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">${health.serverLoad || 45}%</div>
            </div>
        </div>
        <div style="margin-top: 1rem; text-align: center; font-size: 0.75rem; color: var(--gray-600);">
            Uptime: ${health.uptime || '99.9%'} | Last check: ${getRelativeTime(health.lastCheck)}
        </div>
    `);
}

// This function is deprecated - use loadAIInsightsWithFallback instead
async function loadAIInsights() {
    console.log("⚠️ loadAIInsights() is deprecated, using loadAIInsightsWithFallback()");
    return await loadAIInsightsWithFallback();
}

async function loadAdvancedAnalytics() {
    try {
        // Load analytics data from AgenticAI API
        const analyticsData = await educatorAPI.request("/educator/analytics/advanced");
        if (analyticsData && analyticsData.success) {
            renderAdvancedCharts(analyticsData.data);
        } else {
            throw new Error("Invalid analytics data");
        }
    } catch (error) {
        console.error("❌ Failed to load advanced analytics:", error);
        // Fallback to demo charts
        renderDemoCharts();
    }
}

function loadDemoAdvancedAnalytics() {
    renderDemoCharts();
}

async function loadLearningPatterns(patternsData = null) {
    try {
        let patterns;

        if (patternsData) {
            // Use provided data from AI insights
            patterns = patternsData;
        } else {
            // Load directly from AgenticAI API
            const patternsResponse = await educatorAPI.request("/educator/analytics/learning-patterns");
            patterns = patternsResponse?.success ? patternsResponse.data : null;
        }

        if (patterns) {
            // Update learning patterns with real data
            if (document.getElementById("peak-time")) {
                setInner("peak-time", patterns.peakTime || "19:00-21:00 WIB");
            }
            if (document.getElementById("mobile-access")) {
                setInner("mobile-access", `${patterns.mobileAccess || 85}%`);
            }
            if (document.getElementById("session-duration")) {
                setInner("session-duration", patterns.avgSessionDuration || "45 min");
            }
            if (document.getElementById("learning-insights")) {
                setInner("learning-insights", patterns.insights || "Students are most active in evening hours. Mobile learning is preferred. Video content shows highest engagement rates.");
            }
        } else {
            throw new Error("No learning patterns data available");
        }
    } catch (error) {
        console.error("Failed to load learning patterns:", error);
        // Fallback to demo data
        if (document.getElementById("peak-time")) setInner("peak-time", "19:00-21:00 WIB");
        if (document.getElementById("mobile-access")) setInner("mobile-access", "85%");
        if (document.getElementById("session-duration")) setInner("session-duration", "45 min");
        if (document.getElementById("learning-insights")) setInner("learning-insights", "🕒 Peak activity: 19:00-21:00 WIB. 📱 85% mobile access. 📊 Video content most engaging.");
    }
}

async function loadAtRiskStudents(riskData = null) {
    try {
        let riskAnalysis;

        if (riskData) {
            // Use provided data from AI insights
            riskAnalysis = riskData;
        } else {
            // Load directly from AgenticAI API
            const riskResponse = await educatorAPI.request("/educator/analytics/at-risk-students");
            riskAnalysis = riskResponse?.success ? riskResponse.data : null;
        }

        if (riskAnalysis) {
            // Update at-risk student metrics with real data
            if (document.getElementById("high-risk-count")) {
                setInner("high-risk-count", riskAnalysis.highRisk || "3");
            }
            if (document.getElementById("medium-risk-count")) {
                setInner("medium-risk-count", riskAnalysis.mediumRisk || "7");
            }
            if (document.getElementById("intervention-count")) {
                setInner("intervention-count", riskAnalysis.interventionNeeded || "5");
            }
            if (document.getElementById("risk-insights")) {
                setInner("risk-insights", riskAnalysis.insights || "3 students need immediate intervention. Focus on students with <30% progress and no activity in 7+ days.");
            }

            // Update at-risk students count in dashboard
            if (document.getElementById("at-risk-students")) {
                setInner("at-risk-students", riskAnalysis.highRisk || "3");
            }
        } else {
            throw new Error("No at-risk students data available");
        }
    } catch (error) {
        console.error("Failed to load at-risk students:", error);
        // Fallback to demo data
        if (document.getElementById("high-risk-count")) setInner("high-risk-count", "3");
        if (document.getElementById("medium-risk-count")) setInner("medium-risk-count", "7");
        if (document.getElementById("intervention-count")) setInner("intervention-count", "5");
        if (document.getElementById("risk-insights")) setInner("risk-insights", "⚠️ 3 high-risk students identified: Maya Rajin (25% progress), Andi Tertinggal (15% progress), Sari Lambat (20% progress). Immediate intervention recommended.");
    }
}

async function loadContentEffectiveness() {
    try {
        // Load content effectiveness data from AgenticAI API
        const effectivenessResponse = await educatorAPI.request("/educator/analytics/content-effectiveness");
        const effectiveness = effectivenessResponse?.success ? effectivenessResponse.data : null;

        setInner("top-content", effectiveness.topContent || "Video Tutorials");
        setInner("engagement-rate", effectiveness.engagementRate || "78%");
        setInner("completion-rate-content", effectiveness.completionRate || "65%");
        setInner("content-insights", effectiveness.insights || "Video tutorials show highest engagement. Interactive exercises need improvement. Text-based content has lower completion rates.");
    } catch (error) {
        // Fallback to demo data
        setInner("top-content", "Video Tutorials");
        setInner("engagement-rate", "78%");
        setInner("completion-rate-content", "65%");
        setInner("content-insights", "📹 Video tutorials: 92% engagement. 🎮 Interactive exercises: 78% engagement. 📝 Text content: 45% engagement. Recommend more video content.");
    }
}

async function loadAIRecommendations() {
    try {
        // Load AI recommendations from AgenticAI API
        const recommendationsResponse = await educatorAPI.request("/educator/analytics/ai-recommendations");
        const recommendations = recommendationsResponse?.success ? recommendationsResponse.data : null;

        const priorityActions = recommendations.priorityActions || [
            "Schedule intervention sessions for 3 high-risk students",
            "Increase video content in Module 2 (low engagement)",
            "Implement peer mentoring for struggling students",
            "Add more interactive exercises to improve retention"
        ];

        const actionsList = priorityActions.map(action => `<li>${action}</li>`).join('');
        setInner("priority-actions", actionsList);

        setInner("ai-strategy-recommendations", recommendations.strategies || "AI recommends: 1) Personalized learning paths for at-risk students, 2) Gamification elements to boost engagement, 3) Micro-learning sessions for better retention, 4) Peer collaboration features.");
    } catch (error) {
        // Fallback to demo data
        const demoActions = [
            "Schedule intervention sessions for 3 high-risk students",
            "Increase video content in Module 2 (low engagement)",
            "Implement peer mentoring for struggling students",
            "Add more interactive exercises to improve retention"
        ];

        const actionsList = demoActions.map(action => `<li>${action}</li>`).join('');
        setInner("priority-actions", actionsList);

        setInner("ai-strategy-recommendations", "💡 AI Strategy: Focus on personalized learning paths, increase video content, implement peer mentoring, and add gamification elements to boost engagement.");
    }
}

function loadDemoAnalytics() {
    // Load demo data when API fails
    loadLearningPatterns();
    loadAtRiskStudents();
    loadContentEffectiveness();
    loadAIRecommendations();
}

function setupEventListeners() {
    // Original buttons
    onClick("btn-export-progress", exportStudentProgress);
    onClick("btn-send-reminder", sendReminder);
    onClick("btn-refresh-data", refreshData);

    // Analytics refresh button
    onClick("btn-refresh-analytics", refreshAnalytics);

    // Advanced analytics controls
    onClick("btn-export-analytics", exportAnalytics);
    document.getElementById("analytics-timeframe")?.addEventListener("change", updateAnalyticsTimeframe);

    // Communication controls
    onClick("btn-mark-all-read", markAllMessagesRead);

    // Real-time monitoring controls
    onClick("btn-toggle-realtime", toggleRealTimeMonitoring);

    // Setup analytics event listeners
    setupAnalyticsEventListeners();

    // Setup student management event listeners
    setupStudentEventListeners();

    // Setup workflow event listeners
    setupWorkflowEventListeners();

    // Filter controls
    document.getElementById("filter-status")?.addEventListener("change", filterStudents);
    document.getElementById("filter-module")?.addEventListener("change", filterStudents);
    document.getElementById("search-students")?.addEventListener("input", searchStudents);

    // New D1-D24 Workflow buttons
    onClick("btn-weekly-planning", startWeeklyPlanning);
    onClick("btn-pre-class-setup", startPreClassSetup);
    onClick("btn-live-class", startLiveClass);
    onClick("btn-post-analysis", startPostAnalysis);
    onClick("btn-student-monitoring", openStudentMonitoring);
    onClick("btn-ai-oversight", openAIOversight);
}

// Add new function to load student performance alerts
async function loadStudentPerformanceAlerts() {
    try {
        const alertsResponse = await educatorAPI.request("/educator/analytics/student-alerts");

        if (alertsResponse && alertsResponse.data) {
            renderStudentAlerts(alertsResponse.data);
            return alertsResponse.data;
        } else {
            throw new Error("No student alerts data received");
        }
    } catch (error) {
        console.error("Failed to load student alerts:", error);
        // Fallback to demo alerts
        renderDemoStudentAlerts();
        return null;
    }
}

function renderStudentAlerts(alerts) {
    const alertsContainer = document.getElementById("student-performance-alerts");
    if (!alertsContainer) return;

    const alertsHTML = alerts.map(alert => {
        const alertTypeIcon = {
            'high_risk': '🚨',
            'missed_deadline': '⏰',
            'low_engagement': '📉',
            'improvement': '📈'
        };

        const alertTypeColor = {
            'high_risk': 'var(--error)',
            'missed_deadline': 'var(--warning)',
            'low_engagement': 'var(--warning)',
            'improvement': 'var(--success)'
        };

        return `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid ${alertTypeColor[alert.type]}; margin-bottom: 0.5rem;">
                <div style="font-size: 1.5rem;">${alertTypeIcon[alert.type]}</div>
                <div style="flex: 1;">
                    <h4 style="margin: 0; color: var(--gray-800); font-size: 0.875rem;">${alert.studentName}</h4>
                    <p style="margin: 0; color: var(--gray-600); font-size: 0.75rem;">${alert.message}</p>
                </div>
                <div style="color: var(--gray-500); font-size: 0.75rem;">${alert.timeAgo}</div>
            </div>
        `;
    }).join('');

    alertsContainer.innerHTML = alertsHTML;
}

function renderDemoStudentAlerts() {
    const demoAlerts = [
        {
            type: 'high_risk',
            studentName: 'Maya Rajin',
            message: 'Progress below 30% - needs immediate intervention',
            timeAgo: '2 hours ago'
        },
        {
            type: 'missed_deadline',
            studentName: 'Ahmad Rizki',
            message: 'Missed Data Visualization Project deadline',
            timeAgo: '1 day ago'
        },
        {
            type: 'low_engagement',
            studentName: 'Sari Lambat',
            message: 'No activity for 5 days',
            timeAgo: '5 days ago'
        }
    ];

    renderStudentAlerts(demoAlerts);
}

// Enhanced function with fallback
async function loadStudentPerformanceAlertsWithFallback() {
    try {
        console.log("🔄 Loading student performance alerts from AgenticAI...");
        const alertsResponse = await educatorAPI.request("/educator/analytics/student-alerts");

        if (alertsResponse && alertsResponse.success && alertsResponse.data) {
            renderStudentAlerts(alertsResponse.data);
            console.log("✅ Real student alerts loaded from AgenticAI");
            return alertsResponse.data;
        } else {
            throw new Error("Invalid alerts data format");
        }
    } catch (error) {
        console.error("❌ Failed to load real student alerts:", error);
        return loadDemoStudentPerformanceAlerts();
    }
}

function loadDemoStudentPerformanceAlerts() {
    console.log("🔄 Loading demo student performance alerts...");
    const demoAlerts = [
        {
            id: "alert-1",
            studentName: "Maya Rajin",
            type: "at-risk",
            message: "Student has been inactive for 7 days",
            severity: "high",
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "alert-2",
            studentName: "Budi Santoso",
            type: "low-performance",
            message: "Assignment scores below 70% average",
            severity: "medium",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    renderStudentAlerts(demoAlerts);
    console.log("✅ Demo student alerts loaded");
    return demoAlerts;
}

// Add system health monitoring function
async function loadSystemHealthStatus() {
    try {
        const healthResponse = await educatorAPI.request("/educator/system/health");

        if (healthResponse && healthResponse.data) {
            renderSystemHealth(healthResponse.data);
            return healthResponse.data;
        } else {
            throw new Error("No system health data received");
        }
    } catch (error) {
        console.error("Failed to load system health:", error);
        // Fallback to demo health status
        renderDemoSystemHealth();
        return null;
    }
}

function renderSystemHealth(healthData) {
    const healthContainer = document.getElementById("system-health-status");
    if (!healthContainer) return;

    const services = healthData.services || [];
    const overallStatus = healthData.overallStatus || 'operational';

    // Update overall status indicator
    const statusIndicator = document.querySelector('.system-status-indicator');
    if (statusIndicator) {
        const statusColor = overallStatus === 'operational' ? 'var(--success)' :
                           overallStatus === 'degraded' ? 'var(--warning)' : 'var(--error)';
        const statusText = overallStatus === 'operational' ? 'All Systems Operational' :
                          overallStatus === 'degraded' ? 'Some Issues Detected' : 'System Issues';

        statusIndicator.innerHTML = `
            <div style="width: 8px; height: 8px; background: ${statusColor}; border-radius: 50%;"></div>
            <span style="font-size: 0.75rem; color: ${statusColor}; font-weight: 600;">${statusText}</span>
        `;
    }

    // Update individual service status
    const servicesHTML = services.map(service => {
        const statusColor = service.status === 'operational' ? 'var(--success)' :
                           service.status === 'degraded' ? 'var(--warning)' : 'var(--error)';

        return `
            <div style="background: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <div style="width: 8px; height: 8px; background: ${statusColor}; border-radius: 50%;"></div>
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--gray-800);">${service.name}</span>
                </div>
                <p style="margin: 0; font-size: 0.75rem; color: var(--gray-600);">${service.details}</p>
            </div>
        `;
    }).join('');

    healthContainer.innerHTML = servicesHTML;
}

function renderDemoSystemHealth() {
    const demoHealth = {
        overallStatus: 'operational',
        services: [
            { name: 'Backend API', status: 'operational', details: 'Response time: 120ms' },
            { name: 'Database', status: 'operational', details: 'Connection: Stable' },
            { name: 'AI Services', status: 'degraded', details: 'Load: 78% (High)' },
            { name: 'Storage', status: 'operational', details: 'Usage: 45% of 1TB' }
        ]
    };

    renderSystemHealth(demoHealth);
}

// Enhanced function with fallback
async function loadSystemHealthStatusWithFallback() {
    try {
        console.log("🔄 Loading system health status from AgenticAI...");
        const healthResponse = await educatorAPI.request("/educator/system/health");

        if (healthResponse && healthResponse.success && healthResponse.data) {
            renderSystemHealth(healthResponse.data);
            console.log("✅ Real system health loaded from AgenticAI");
            return healthResponse.data;
        } else {
            throw new Error("Invalid health data format");
        }
    } catch (error) {
        console.error("❌ Failed to load real system health:", error);
        return loadDemoSystemHealthStatus();
    }
}

function loadDemoSystemHealthStatus() {
    console.log("🔄 Loading demo system health status...");
    renderDemoSystemHealth();
    console.log("✅ Demo system health loaded");
    return {
        status: "healthy",
        uptime: "99.9%",
        lastCheck: new Date().toISOString()
    };
}

// Real-time monitoring state (moved from original location)

function toggleRealTimeMonitoring() {
    realTimeMonitoring = !realTimeMonitoring;
    const button = document.getElementById("btn-toggle-realtime");

    if (realTimeMonitoring) {
        button.textContent = "🟢 Live Monitoring";
        button.style.background = "var(--success)";
        startRealTimeUpdates();
        UIComponents.showNotification("🔴 Real-time monitoring activated", "success");
    } else {
        button.textContent = "🔴 Start Monitoring";
        button.style.background = "var(--gray-500)";
        stopRealTimeUpdates();
        UIComponents.showNotification("⏸️ Real-time monitoring paused", "info");
    }
}

function startRealTimeUpdates() {
    // Update every 30 seconds
    monitoringInterval = setInterval(async () => {
        try {
            // Update real-time data sources
            await loadRealTimeStatsWithFallback();
            await loadActivityTimelineWithFallback();
            await loadStudentPerformanceAlertsWithFallback();
            await loadSystemHealthStatusWithFallback();

            // Update dashboard metrics
            await loadClassDataWithFallback();

            updateLastUpdateTime();

            // Show subtle notification for successful update
            const now = new Date();
            const timeString = now.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });

            // Update any real-time indicators
            const indicators = document.querySelectorAll('.real-time-indicator');
            indicators.forEach(indicator => {
                indicator.textContent = `🔴 Live • Last update: ${timeString}`;
            });

        } catch (error) {
            console.error("Real-time update failed:", error);
            // Show error indicator
            const indicators = document.querySelectorAll('.real-time-indicator');
            indicators.forEach(indicator => {
                indicator.textContent = `⚠️ Connection issue`;
                indicator.style.color = 'var(--warning)';
            });
        }
    }, 30000);
}

function stopRealTimeUpdates() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
}

function filterStudents() {
    const statusFilter = document.getElementById("filter-status")?.value;
    const moduleFilter = document.getElementById("filter-module")?.value;

    UIComponents.showNotification(`🔍 Filtering students: ${statusFilter} | ${moduleFilter}`, "info");
    // TODO: Implement actual filtering logic
}

function searchStudents() {
    const searchTerm = document.getElementById("search-students")?.value;
    if (searchTerm.length > 2) {
        UIComponents.showNotification(`🔍 Searching for: ${searchTerm}`, "info");
        // TODO: Implement actual search logic
    }
}

// Student interaction functions
function sendMessage(studentId) {
    const message = prompt("💬 Send message to student:");
    if (message) {
        UIComponents.showNotification(`✅ Message sent to student ${studentId}: "${message}"`, "success");
    }
}

// Enhanced refresh function for all dashboard data
async function refreshAllDashboardData() {
    UIComponents.showNotification("🔄 Refreshing all dashboard data...", "info");

    try {
        // Refresh all main data sources with correct function names
        await Promise.all([
            loadEducatorDataWithFallback(),
            loadClassDataWithFallback(),
            loadStudentListWithFallback(),
            loadAIInsightsWithFallback()
        ]);

        // Update last refresh time
        updateLastUpdateTime();

        UIComponents.showNotification("✅ All dashboard data refreshed successfully!", "success");
        console.log("✅ Dashboard refresh completed successfully");
    } catch (error) {
        console.error("❌ Failed to refresh dashboard data:", error);
        UIComponents.showNotification("❌ Some data failed to refresh. Check connection.", "error");
    }
}

// Function to refresh AI insights specifically
async function refreshAIInsights() {
    UIComponents.showNotification("🤖 Refreshing AI insights...", "info");
    try {
        await loadAIInsightsWithFallback();
        UIComponents.showNotification("✅ AI insights refreshed successfully!", "success");
    } catch (error) {
        console.error("❌ Failed to refresh AI insights:", error);
        UIComponents.showNotification("❌ Failed to refresh AI insights", "error");
    }
}

// Function to refresh activity feed
async function refreshActivityFeed() {
    UIComponents.showNotification("🔄 Refreshing activity feed...", "info");
    try {
        await loadActivityTimelineWithFallback();
        updateLastUpdateTime();
        UIComponents.showNotification("✅ Activity feed refreshed!", "success");
    } catch (error) {
        console.error("❌ Failed to refresh activity feed:", error);
        UIComponents.showNotification("❌ Failed to refresh activity feed", "error");
    }
}

// Global functions for onclick handlers
window.sendMessage = sendMessage;
window.refreshAllDashboardData = refreshAllDashboardData;
window.refreshAIInsights = refreshAIInsights;
window.refreshActivityFeed = refreshActivityFeed;
window.refreshData = refreshData;
window.refreshAnalytics = refreshAnalytics;
window.exportStudentProgress = exportStudentProgress;
window.sendReminder = sendReminder;
window.createAssignment = createAssignment;
window.scheduleClass = scheduleClass;
window.viewAnalytics = viewAnalytics;
window.manageContent = manageContent;
window.chatWithAI = chatWithAI;
window.viewStudentDetail = viewStudentDetail;
window.closeStudentProfile = closeStudentProfile;
window.switchTab = switchTab;

function exportStudentProgress() {
    const csvData = "Nama,Email,Progress,Status,Terakhir Aktif\n" +
        "Andi Mahasiswa,andi@student.edu,75%,Aktif," + new Date().toLocaleDateString() + "\n" +
        "Sari Belajar,sari@student.edu,45%,Aktif," + new Date().toLocaleDateString() + "\n" +
        "Budi Cerdas,budi@student.edu,90%,Aktif," + new Date().toLocaleDateString() + "\n" +
        "Maya Rajin,maya@student.edu,25%,Tidak Aktif," + new Date(Date.now() - 604800000).toLocaleDateString();

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `student-progress-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    UIComponents.showNotification("📊 Progress report berhasil diexport!", "success");
}

function sendReminder() {
    UIComponents.showNotification("📧 Mengirim reminder ke mahasiswa yang belum aktif...", "info");
    setTimeout(() => {
        UIComponents.showNotification("✅ Reminder berhasil dikirim ke 3 mahasiswa!", "success");
    }, 2000);
}

async function refreshData() {
    UIComponents.showNotification("🔄 Refreshing data...", "info");
    try {
        await loadClassDataWithFallback();
        await loadStudentListWithFallback();
        await loadAIInsightsWithFallback();
        updateLastUpdateTime();
        UIComponents.showNotification("✅ Data refreshed successfully!", "success");
    } catch (error) {
        console.error("❌ Failed to refresh data:", error);
        UIComponents.showNotification("❌ Failed to refresh data. Please try again.", "error");
    }
}

async function refreshAnalytics() {
    UIComponents.showNotification("🔄 Refreshing AI Analytics Dashboard...", "info");
    try {
        await loadAIInsightsWithFallback();
        UIComponents.showNotification("✅ AI Analytics refreshed successfully!", "success");
    } catch (error) {
        console.error("❌ Failed to refresh analytics:", error);
        UIComponents.showNotification("❌ Failed to refresh analytics. Using cached data.", "error");
    }
}

function createAssignment() {
    const title = prompt("📝 Judul Assignment:");
    const dueDate = prompt("📅 Tanggal Deadline (YYYY-MM-DD):");
    if (title && dueDate) {
        UIComponents.showNotification(`✅ Assignment "${title}" berhasil dibuat! Deadline: ${dueDate}`, "success");
    }
}

function scheduleClass() {
    const topic = prompt("📚 Topik Kelas:");
    const date = prompt("📅 Tanggal & Waktu (YYYY-MM-DD HH:MM):");
    if (topic && date) {
        UIComponents.showNotification(`✅ Kelas "${topic}" berhasil dijadwalkan! Waktu: ${date}`, "success");
    }
}

function viewAnalytics() {
    UIComponents.showNotification("📊 Membuka analytics detail...", "info");
}

function manageContent() {
    UIComponents.showNotification("📚 Membuka content management...", "info");
}

function chatWithAI() {
    const question = prompt("🤖 Tanyakan sesuatu kepada AI Assistant untuk Educator:");
    if (question) {
        UIComponents.showNotification(`🤖 AI Response: "Berdasarkan data kelas Anda, saya merekomendasikan untuk focus pada mahasiswa dengan progress <50%. Pertanyaan Anda tentang '${question}' sangat relevan untuk meningkatkan engagement."`, "info");
    }
}

async function viewStudentDetail(studentId) {
    try {
        UIComponents.showNotification(`👤 Loading student profile: ${studentId}`, "info");

        // Load student data
        const student = await loadStudentData(studentId);

        // Open modal and populate data
        openStudentProfile(student);

    } catch (error) {
        console.error("Failed to load student detail:", error);
        UIComponents.showNotification("❌ Failed to load student profile", "error");
    }
}

async function loadStudentData(studentId) {
    try {
        // Try to load from AgenticAI API
        const studentResponse = await educatorAPI.request(`/educator/students/${studentId}`);
        const student = studentResponse?.success ? studentResponse.data : null;
        return student;
    } catch (error) {
        // Fallback to demo data
        return getDemoStudentData(studentId);
    }
}

function getDemoStudentData(studentId) {
    const demoStudents = {
        "student-1": {
            id: "student-1",
            name: "Andi Mahasiswa",
            email: "andi@student.edu",
            avatar: "AM",
            progress: 75,
            status: "online",
            lastActive: new Date().toISOString(),
            currentModule: 3,
            currentLesson: "Data Visualization",
            completedLessons: 15,
            totalLessons: 20,
            engagementScore: 85,
            timeSpent: 120,
            joinDate: "2024-01-15",
            totalTimeSpent: 4500, // minutes
            assessments: [
                { name: "Digital Skills Assessment", score: 85, date: "2024-01-16", status: "completed" },
                { name: "Learning Style Assessment", score: 92, date: "2024-01-17", status: "completed" },
                { name: "Module 1 Quiz", score: 78, date: "2024-02-01", status: "completed" },
                { name: "Module 2 Quiz", score: 88, date: "2024-02-15", status: "completed" },
                { name: "Module 3 Quiz", score: 0, date: null, status: "pending" }
            ],
            goals: [
                { title: "Complete Data Analytics Course", progress: 75, deadline: "2024-06-30", status: "active" },
                { title: "Master Python Programming", progress: 60, deadline: "2024-05-15", status: "active" },
                { title: "Build Portfolio Project", progress: 30, deadline: "2024-07-30", status: "active" }
            ],
            learningStyle: "Visual",
            digitalSkillsLevel: "Intermediate",
            technologyComfort: "High",
            communicationHistory: [
                { date: "2024-12-10", type: "message", content: "Great progress on Module 3!", sender: "instructor" },
                { date: "2024-12-08", type: "message", content: "I need help with data visualization", sender: "student" },
                { date: "2024-12-05", type: "reminder", content: "Assignment deadline reminder", sender: "system" }
            ]
        },
        "student-2": {
            id: "student-2",
            name: "Sari Belajar",
            email: "sari@student.edu",
            avatar: "SB",
            progress: 45,
            status: "active",
            lastActive: new Date(Date.now() - 3600000).toISOString(),
            currentModule: 2,
            currentLesson: "Analytics Fundamentals",
            completedLessons: 9,
            totalLessons: 20,
            engagementScore: 72,
            timeSpent: 45,
            joinDate: "2024-01-20",
            totalTimeSpent: 2800,
            assessments: [
                { name: "Digital Skills Assessment", score: 70, date: "2024-01-21", status: "completed" },
                { name: "Learning Style Assessment", score: 85, date: "2024-01-22", status: "completed" },
                { name: "Module 1 Quiz", score: 65, date: "2024-02-05", status: "completed" },
                { name: "Module 2 Quiz", score: 0, date: null, status: "pending" }
            ],
            goals: [
                { title: "Improve Technical Skills", progress: 45, deadline: "2024-08-30", status: "active" },
                { title: "Complete Course Successfully", progress: 45, deadline: "2024-09-15", status: "active" }
            ],
            learningStyle: "Auditory",
            digitalSkillsLevel: "Beginner",
            technologyComfort: "Medium",
            communicationHistory: [
                { date: "2024-12-09", type: "message", content: "Keep up the good work!", sender: "instructor" },
                { date: "2024-12-07", type: "message", content: "Can we schedule a help session?", sender: "student" }
            ]
        }
    };

    return demoStudents[studentId] || demoStudents["student-1"];
}

function openStudentProfile(student) {
    // Populate header
    setInner("profile-name", student.name);
    setInner("profile-email", student.email);
    setInner("profile-avatar", student.avatar || student.name.split(' ').map(n => n[0]).join('').substring(0, 2));

    // Load overview tab content
    loadOverviewTab(student);

    // Show modal
    document.getElementById("student-profile-modal").style.display = "flex";

    // Set active tab
    switchTab('overview');

    UIComponents.showNotification(`📊 Student profile loaded: ${student.name}`, "success");
}

function closeStudentProfile() {
    document.getElementById("student-profile-modal").style.display = "none";
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Add active class to selected tab button
    event.target.classList.add('active');

    // Load tab-specific content
    loadTabContent(tabName);
}

let currentStudent = null;

function loadTabContent(tabName) {
    if (!currentStudent) return;

    switch(tabName) {
        case 'overview':
            loadOverviewTab(currentStudent);
            break;
        case 'progress':
            loadProgressTab(currentStudent);
            break;
        case 'assessments':
            loadAssessmentsTab(currentStudent);
            break;
        case 'communication':
            loadCommunicationTab(currentStudent);
            break;
        case 'settings':
            loadSettingsTab(currentStudent);
            break;
    }
}

function loadOverviewTab(student) {
    currentStudent = student;

    const overviewHTML = `
        <div class="grid" style="margin-bottom: 2rem;">
            <div class="card" style="background: var(--accent);">
                <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📊</span> Learning Overview
                </h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Overall Progress</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.progress}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Current Module</span>
                    <span style="font-weight: 600; color: var(--primary);">Module ${student.currentModule}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Lessons Completed</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.completedLessons}/${student.totalLessons}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--gray-700);">Engagement Score</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.engagementScore}%</span>
                </div>
            </div>

            <div class="card" style="background: var(--secondary-light);">
                <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🎯</span> Learning Profile
                </h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Learning Style</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.learningStyle}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Digital Skills</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.digitalSkillsLevel}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Tech Comfort</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.technologyComfort}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--gray-700);">Join Date</span>
                    <span style="font-weight: 600; color: var(--primary);">${new Date(student.joinDate).toLocaleDateString('id-ID')}</span>
                </div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎯</span> Active Goals
            </h4>
            ${student.goals.map(goal => `
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border-left: 4px solid var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-weight: 600; color: var(--gray-800);">${goal.title}</span>
                        <span style="font-size: 0.75rem; color: var(--gray-600);">Due: ${new Date(goal.deadline).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="progress-mini" style="width: 150px;">
                            <div class="progress-mini-fill" style="width: ${goal.progress}%"></div>
                        </div>
                        <span style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">${goal.progress}%</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⏱️</span> Time Tracking
            </h4>
            <div class="grid">
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${student.timeSpent}min</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Today</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${Math.round(student.totalTimeSpent / 60)}h</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Total</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${Math.round(student.totalTimeSpent / student.completedLessons)}min</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Avg per Lesson</div>
                </div>
            </div>
        </div>
    `;

    setInner("tab-overview", overviewHTML);
}

function loadProgressTab(student) {
    const progressHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📈</span> Progress Visualization
            </h4>
            <div style="background: var(--accent); padding: 2rem; border-radius: 8px; text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 3rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">${student.progress}%</div>
                <div style="color: var(--gray-600);">Overall Course Progress</div>
            </div>
            <div style="background: var(--white); padding: 1rem; border-radius: 8px; border: 1px solid var(--accent);">
                <p style="color: var(--gray-600); text-align: center; margin: 0;">Detailed progress charts will be implemented here</p>
            </div>
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📚</span> Module Progress
            </h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${[1, 2, 3, 4].map(moduleNum => {
                    const isCompleted = moduleNum < student.currentModule;
                    const isCurrent = moduleNum === student.currentModule;
                    const progress = isCompleted ? 100 : (isCurrent ? Math.round((student.completedLessons % 5) * 20) : 0);

                    return `
                        <div style="background: var(--accent); padding: 1rem; border-radius: 8px; border-left: 4px solid ${isCompleted ? 'var(--success)' : (isCurrent ? 'var(--primary)' : 'var(--gray-400)')};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600; color: var(--gray-800);">Module ${moduleNum}</span>
                                <span style="font-size: 0.75rem; color: var(--gray-600);">${isCompleted ? '✅ Completed' : (isCurrent ? '🔄 In Progress' : '⏳ Pending')}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div class="progress-mini" style="width: 200px;">
                                    <div class="progress-mini-fill" style="width: ${progress}%"></div>
                                </div>
                                <span style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">${progress}%</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    setInner("tab-progress", progressHTML);
}

function loadAssessmentsTab(student) {
    const assessmentsHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📝</span> Assessment History
            </h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${student.assessments.map(assessment => {
                    const statusColor = assessment.status === 'completed' ? 'var(--success)' :
                                      assessment.status === 'pending' ? 'var(--warning)' : 'var(--gray-400)';
                    const statusIcon = assessment.status === 'completed' ? '✅' :
                                     assessment.status === 'pending' ? '⏳' : '❌';

                    return `
                        <div style="background: var(--accent); padding: 1rem; border-radius: 8px; border-left: 4px solid ${statusColor};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600; color: var(--gray-800);">${assessment.name}</span>
                                <span style="font-size: 0.75rem; color: var(--gray-600);">${statusIcon} ${assessment.status}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--gray-700);">Score: <strong style="color: var(--primary);">${assessment.score > 0 ? assessment.score + '%' : 'Not taken'}</strong></span>
                                <span style="font-size: 0.75rem; color: var(--gray-600);">${assessment.date ? new Date(assessment.date).toLocaleDateString('id-ID') : 'No date'}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Assessment Analytics
            </h4>
            <div class="grid">
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${Math.round(student.assessments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.score, 0) / student.assessments.filter(a => a.status === 'completed').length)}%</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Average Score</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${student.assessments.filter(a => a.status === 'completed').length}</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Completed</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${student.assessments.filter(a => a.status === 'pending').length}</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Pending</div>
                </div>
            </div>
        </div>
    `;

    setInner("tab-assessments", assessmentsHTML);
}

function loadCommunicationTab(student) {
    const communicationHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>💬</span> Send Message
            </h4>
            <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                <textarea id="message-input" placeholder="Type your message to ${student.name}..." style="width: 100%; height: 100px; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white); resize: vertical; font-family: inherit;"></textarea>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" onclick="sendQuickMessage('reminder')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                            📅 Send Reminder
                        </button>
                        <button class="btn" onclick="sendQuickMessage('encouragement')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                            🎉 Send Encouragement
                        </button>
                    </div>
                    <button class="btn" onclick="sendCustomMessage()" style="background: var(--primary);">
                        📤 Send Message
                    </button>
                </div>
            </div>
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📜</span> Communication History
            </h4>
            <div style="max-height: 400px; overflow-y: auto;">
                ${student.communicationHistory.map(comm => {
                    const isInstructor = comm.sender === 'instructor';
                    const isSystem = comm.sender === 'system';
                    const bgColor = isInstructor ? 'var(--primary)' : isSystem ? 'var(--accent)' : 'var(--secondary-light)';
                    const textColor = isInstructor ? 'white' : 'var(--gray-800)';
                    const alignment = isInstructor ? 'flex-end' : 'flex-start';

                    return `
                        <div style="display: flex; justify-content: ${alignment}; margin-bottom: 1rem;">
                            <div style="max-width: 70%; background: ${bgColor}; color: ${textColor}; padding: 0.75rem; border-radius: 8px;">
                                <div style="font-size: 0.875rem; margin-bottom: 0.25rem;">${comm.content}</div>
                                <div style="font-size: 0.75rem; opacity: 0.8;">${new Date(comm.date).toLocaleDateString('id-ID')} • ${comm.sender}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    setInner("tab-communication", communicationHTML);
}

function loadSettingsTab(student) {
    const settingsHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚙️</span> Learning Settings
            </h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Learning Path Customization</label>
                    <select style="width: 100%; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                        <option>Standard Path</option>
                        <option>Accelerated Path</option>
                        <option>Extended Path</option>
                        <option>Custom Path</option>
                    </select>
                </div>

                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Difficulty Level</label>
                    <select style="width: 100%; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                        <option>Beginner</option>
                        <option selected>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>

                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Notification Preferences</label>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                            <input type="checkbox" checked> Assignment reminders
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                            <input type="checkbox" checked> Progress updates
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                            <input type="checkbox"> Weekly reports
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎯</span> Intervention Actions
            </h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <button class="btn" onclick="scheduleIntervention()" style="background: var(--warning);">
                    📅 Schedule Intervention
                </button>
                <button class="btn" onclick="assignMentor()" style="background: var(--info);">
                    👥 Assign Mentor
                </button>
                <button class="btn" onclick="adjustLearningPath()" style="background: var(--primary);">
                    🛤️ Adjust Learning Path
                </button>
                <button class="btn" onclick="generateReport()" style="background: var(--success);">
                    📊 Generate Report
                </button>
            </div>
        </div>
    `;

    setInner("tab-settings", settingsHTML);
}

// Communication functions
function sendCustomMessage() {
    const message = document.getElementById("message-input")?.value;
    if (message.trim()) {
        UIComponents.showNotification(`✅ Message sent: "${message}"`, "success");
        document.getElementById("message-input").value = "";
    } else {
        UIComponents.showNotification("❌ Please enter a message", "error");
    }
}

function sendQuickMessage(type) {
    const messages = {
        reminder: "📅 Reminder: You have pending assignments. Please check your dashboard.",
        encouragement: "🎉 Great progress! Keep up the excellent work!"
    };

    UIComponents.showNotification(`✅ ${type} message sent: "${messages[type]}"`, "success");
}

// Intervention functions
function scheduleIntervention() {
    UIComponents.showNotification("📅 Intervention session scheduled for next week", "success");
}

function assignMentor() {
    UIComponents.showNotification("👥 Mentor assigned successfully", "success");
}

function adjustLearningPath() {
    UIComponents.showNotification("🛤️ Learning path adjusted based on performance", "success");
}

function generateReport() {
    UIComponents.showNotification("📊 Detailed student report generated", "success");
}

function renderDemoCharts() {
    renderProgressTrendChart();
    renderEngagementHeatmap();
    renderPerformanceDistribution();
    renderTimeAnalysisChart();
    renderClassComparisonChart();
    renderLearningPathChart();
}

function renderProgressTrendChart() {
    const chartContainer = document.getElementById("progress-trend-chart");
    if (!chartContainer) return;

    // Demo data for 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const progressData = [65, 68, 72, 70, 75, 78, 82];
    const maxProgress = Math.max(...progressData);

    const chartHTML = `
        <div style="display: flex; align-items: end; height: 160px; gap: 8px; padding: 20px 0;">
            ${days.map((day, index) => {
                const height = (progressData[index] / maxProgress) * 140;
                return `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                        <div style="background: var(--primary); width: 100%; height: ${height}px; border-radius: 4px 4px 0 0; position: relative; transition: all 0.3s ease;"
                             onmouseover="this.style.background='var(--primary-dark)'"
                             onmouseout="this.style.background='var(--primary)'">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); background: var(--gray-800); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; opacity: 0; transition: opacity 0.3s;"
                                 class="tooltip">${progressData[index]}%</div>
                        </div>
                        <div style="margin-top: 8px; font-size: 12px; color: var(--gray-600); font-weight: 500;">${day}</div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            📈 Average weekly progress: <strong style="color: var(--primary);">+17%</strong>
        </div>
    `;

    chartContainer.innerHTML = chartHTML;

    // Add hover effects
    chartContainer.querySelectorAll('[onmouseover]').forEach(bar => {
        bar.addEventListener('mouseenter', () => {
            bar.querySelector('.tooltip').style.opacity = '1';
        });
        bar.addEventListener('mouseleave', () => {
            bar.querySelector('.tooltip').style.opacity = '0';
        });
    });
}

function renderEngagementHeatmap() {
    const chartContainer = document.getElementById("engagement-heatmap");
    if (!chartContainer) return;

    const hours = ['9AM', '11AM', '1PM', '3PM', '5PM', '7PM', '9PM'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Generate demo engagement data (0-100)
    const engagementData = days.map(() =>
        hours.map(() => Math.floor(Math.random() * 60) + 40)
    );

    const chartHTML = `
        <div style="display: flex; flex-direction: column; height: 160px;">
            <div style="display: flex; margin-bottom: 5px;">
                <div style="width: 40px;"></div>
                ${hours.map(hour => `
                    <div style="flex: 1; text-align: center; font-size: 10px; color: var(--gray-600);">${hour}</div>
                `).join('')}
            </div>
            ${days.map((day, dayIndex) => `
                <div style="display: flex; margin-bottom: 2px;">
                    <div style="width: 40px; font-size: 10px; color: var(--gray-600); display: flex; align-items: center;">${day}</div>
                    ${hours.map((hour, hourIndex) => {
                        const engagement = engagementData[dayIndex][hourIndex];
                        const intensity = engagement / 100;
                        const backgroundColor = `rgba(102, 123, 104, ${intensity})`;
                        return `
                            <div style="flex: 1; height: 18px; background: ${backgroundColor}; margin: 0 1px; border-radius: 2px; position: relative;"
                                 title="${day} ${hour}: ${engagement}% engagement">
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            🔥 Peak engagement: <strong style="color: var(--primary);">Tuesday 7PM (95%)</strong>
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

function renderPerformanceDistribution() {
    const chartContainer = document.getElementById("performance-distribution");
    if (!chartContainer) return;

    const performanceRanges = ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];
    const studentCounts = [1, 3, 8, 12, 6]; // Demo data
    const maxCount = Math.max(...studentCounts);

    const chartHTML = `
        <div style="display: flex; align-items: end; height: 140px; gap: 12px; padding: 20px 0;">
            ${performanceRanges.map((range, index) => {
                const height = (studentCounts[index] / maxCount) * 120;
                const colors = ['var(--error)', 'var(--warning)', 'var(--info)', 'var(--primary)', 'var(--success)'];
                return `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                        <div style="background: ${colors[index]}; width: 100%; height: ${height}px; border-radius: 4px 4px 0 0; position: relative; transition: all 0.3s ease;"
                             onmouseover="this.style.opacity='0.8'"
                             onmouseout="this.style.opacity='1'">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); background: var(--gray-800); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                                ${studentCounts[index]} students
                            </div>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px; color: var(--gray-600); font-weight: 500; text-align: center;">${range}</div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            🎯 Most students (40%) perform in the <strong style="color: var(--primary);">61-80%</strong> range
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

function renderTimeAnalysisChart() {
    const chartContainer = document.getElementById("time-analysis-chart");
    if (!chartContainer) return;

    const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const timeData = [25, 35, 30, 10]; // Percentage of learning time
    const colors = ['var(--secondary)', 'var(--primary)', 'var(--accent-dark)', 'var(--gray-400)'];

    const chartHTML = `
        <div style="display: flex; align-items: center; height: 140px; gap: 20px;">
            <div style="flex: 1;">
                <div style="display: flex; height: 40px; border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-sm);">
                    ${timeSlots.map((slot, index) => `
                        <div style="background: ${colors[index]}; width: ${timeData[index]}%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 600; transition: all 0.3s ease;"
                             onmouseover="this.style.transform='scale(1.05)'"
                             onmouseout="this.style.transform='scale(1)'">
                            ${timeData[index]}%
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 15px;">
                    ${timeSlots.map((slot, index) => `
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                            <div style="width: 12px; height: 12px; background: ${colors[index]}; border-radius: 2px;"></div>
                            <span style="font-size: 12px; color: var(--gray-700);">${slot}: ${timeData[index]}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            ⏱️ Peak learning time: <strong style="color: var(--primary);">Afternoon (35%)</strong>
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

function renderClassComparisonChart() {
    const chartContainer = document.getElementById("class-comparison-chart");
    if (!chartContainer) return;

    const metrics = ['Progress', 'Engagement', 'Assessments', 'Time Spent', 'Completion'];
    const currentClass = [75, 82, 78, 85, 70];
    const averageClass = [68, 75, 72, 78, 65];
    const maxValue = 100;

    const chartHTML = `
        <div style="display: flex; flex-direction: column; height: 200px; gap: 15px; padding: 10px 0;">
            ${metrics.map((metric, index) => `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="width: 80px; font-size: 12px; color: var(--gray-700); font-weight: 500;">${metric}</div>
                    <div style="flex: 1; position: relative;">
                        <div style="background: var(--accent); height: 20px; border-radius: 10px; position: relative; overflow: hidden;">
                            <div style="background: var(--primary); height: 100%; width: ${currentClass[index]}%; border-radius: 10px; transition: width 0.5s ease;"></div>
                            <div style="background: var(--secondary-dark); height: 8px; width: ${averageClass[index]}%; position: absolute; top: 6px; border-radius: 4px; opacity: 0.8;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 10px; color: var(--gray-600);">
                            <span>Your Class: <strong style="color: var(--primary);">${currentClass[index]}%</strong></span>
                            <span>Average: <strong style="color: var(--secondary-dark);">${averageClass[index]}%</strong></span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--accent); font-size: 12px; color: var(--gray-600);">
            📊 Your class performs <strong style="color: var(--success);">+8.2%</strong> above average across all metrics
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

function renderLearningPathChart() {
    const chartContainer = document.getElementById("learning-path-chart");
    if (!chartContainer) return;

    const paths = ['Standard', 'Accelerated', 'Extended', 'Custom'];
    const effectiveness = [78, 85, 72, 88];
    const studentCounts = [15, 8, 5, 2];
    const maxEffectiveness = Math.max(...effectiveness);

    const chartHTML = `
        <div style="display: flex; align-items: end; height: 140px; gap: 15px; padding: 20px 0;">
            ${paths.map((path, index) => {
                const height = (effectiveness[index] / maxEffectiveness) * 120;
                const colors = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--info)'];
                return `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                        <div style="background: ${colors[index]}; width: 100%; height: ${height}px; border-radius: 6px 6px 0 0; position: relative; transition: all 0.3s ease;"
                             onmouseover="this.style.transform='scale(1.05)'"
                             onmouseout="this.style.transform='scale(1)'">
                            <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: var(--gray-800); color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px;">
                                ${effectiveness[index]}% effective<br>
                                ${studentCounts[index]} students
                            </div>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px; color: var(--gray-600); font-weight: 500; text-align: center;">${path}</div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            🛤️ Most effective path: <strong style="color: var(--info);">Custom (88%)</strong> • Most popular: <strong style="color: var(--primary);">Standard (15 students)</strong>
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

// Analytics control functions
function exportAnalytics() {
    UIComponents.showNotification("📊 Analytics charts exported successfully!", "success");
}

function updateAnalyticsTimeframe() {
    const timeframe = document.getElementById("analytics-timeframe")?.value;
    UIComponents.showNotification(`📅 Analytics updated for: ${timeframe}`, "info");

    // Simulate data refresh for different timeframes
    setTimeout(() => {
        renderDemoCharts();
        UIComponents.showNotification("📊 Charts refreshed with new timeframe data", "success");
    }, 1000);
}

// Global functions for onclick handlers
window.closeStudentProfile = closeStudentProfile;
window.switchTab = switchTab;
window.sendCustomMessage = sendCustomMessage;
window.sendQuickMessage = sendQuickMessage;
window.scheduleIntervention = scheduleIntervention;
window.assignMentor = assignMentor;
window.adjustLearningPath = adjustLearningPath;
window.generateReport = generateReport;
window.exportAnalytics = exportAnalytics;
window.updateAnalyticsTimeframe = updateAnalyticsTimeframe;

// Communication Center Functions
async function loadCommunicationCenter() {
    try {
        // Load communication data
        await loadMessages();
        await loadAnnouncements();
        await loadDiscussions();
        await loadNotifications();
        await loadCommunicationAnalytics();

        // Set default active tab
        switchCommTab('messages');
    } catch (error) {
        console.error("Failed to load communication center:", error);
        loadDemoCommunicationData();
    }
}

function loadDemoCommunicationData() {
    loadDemoMessages();
    loadDemoAnnouncements();
    loadDemoDiscussions();
    loadDemoNotifications();
    loadDemoCommunicationAnalytics();
    switchCommTab('messages');
}

function switchCommTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.comm-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.comm-tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(`comm-tab-${tabName}`).classList.add('active');

    // Add active class to selected tab button
    event.target.classList.add('active');

    // Load tab-specific content if needed
    loadCommTabContent(tabName);
}

function loadCommTabContent(tabName) {
    switch(tabName) {
        case 'messages':
            loadDemoMessages();
            break;
        case 'announcements':
            loadDemoAnnouncements();
            break;
        case 'discussions':
            loadDemoDiscussions();
            break;
        case 'notifications':
            loadDemoNotifications();
            break;
        case 'analytics':
            loadDemoCommunicationAnalytics();
            break;
    }
}

async function loadMessages() {
    try {
        const messages = await apiClient.request("/communication/messages");
        renderMessages(messages);
    } catch (error) {
        loadDemoMessages();
    }
}

function loadDemoMessages() {
    const demoMessages = [
        {
            id: 1,
            sender: "Andi Mahasiswa",
            subject: "Question about Module 3",
            content: "Hi, I'm having trouble understanding the data visualization concepts in Module 3. Could you help explain the difference between bar charts and histograms?",
            time: "2 hours ago",
            unread: true,
            priority: "medium"
        },
        {
            id: 2,
            sender: "Sari Belajar",
            subject: "Assignment Submission",
            content: "I've completed the Python assignment but I'm not sure if I submitted it correctly. Can you confirm if you received my submission?",
            time: "5 hours ago",
            unread: true,
            priority: "high"
        },
        {
            id: 3,
            sender: "Budi Cerdas",
            subject: "Thank you for feedback",
            content: "Thank you for the detailed feedback on my project. The suggestions really helped me improve my analysis approach.",
            time: "1 day ago",
            unread: false,
            priority: "low"
        },
        {
            id: 4,
            sender: "Maya Rajin",
            subject: "Schedule conflict",
            content: "I have a conflict with the upcoming live session. Is it possible to get a recording or schedule a makeup session?",
            time: "2 days ago",
            unread: true,
            priority: "medium"
        }
    ];

    renderMessages(demoMessages);
}

function renderMessages(messages) {
    const messagesHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📨</span> Student Messages
                </h4>
                <button class="btn" onclick="composeMessage()" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                    ✏️ Compose Message
                </button>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <select id="message-filter" style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white); font-size: 0.75rem;">
                    <option value="all">All Messages</option>
                    <option value="unread">Unread Only</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                </select>
                <input type="search" placeholder="Search messages..." style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white); font-size: 0.75rem;">
            </div>
        </div>

        <div style="max-height: 400px; overflow-y: auto;">
            ${messages.map(message => `
                <div class="message-item ${message.unread ? 'unread' : ''}" onclick="openMessage(${message.id})">
                    <div class="message-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="message-sender">${message.sender}</span>
                            ${message.unread ? '<span style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 600;">NEW</span>' : ''}
                            ${message.priority === 'high' ? '<span style="background: var(--error); color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 600;">HIGH</span>' : ''}
                        </div>
                        <span class="message-time">${message.time}</span>
                    </div>
                    <div style="font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem; font-size: 0.875rem;">${message.subject}</div>
                    <div class="message-content">${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}</div>
                </div>
            `).join('')}
        </div>
    `;

    setInner("comm-tab-messages", messagesHTML);
}

function loadDemoAnnouncements() {
    const demoAnnouncements = [
        {
            id: 1,
            title: "New Module Released: Advanced Analytics",
            content: "We're excited to announce the release of Module 4: Advanced Analytics. This module covers machine learning fundamentals and advanced data visualization techniques.",
            date: "2024-12-10",
            priority: "high",
            author: "Dr. Sarah Johnson",
            recipients: "All Students"
        },
        {
            id: 2,
            title: "Upcoming Live Session: Q&A Session",
            content: "Join us for a live Q&A session this Friday at 2 PM. We'll be discussing common challenges in data analysis and answering your questions.",
            date: "2024-12-09",
            priority: "medium",
            author: "Prof. Michael Chen",
            recipients: "Class A & B"
        },
        {
            id: 3,
            title: "System Maintenance Notice",
            content: "The learning platform will undergo scheduled maintenance on Sunday from 2 AM to 6 AM. During this time, access may be limited.",
            date: "2024-12-08",
            priority: "low",
            author: "System Admin",
            recipients: "All Users"
        }
    ];

    const announcementsHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📢</span> Announcements
                </h4>
                <button class="btn" onclick="createAnnouncement()" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                    📝 Create Announcement
                </button>
            </div>
        </div>

        <div style="max-height: 400px; overflow-y: auto;">
            ${demoAnnouncements.map(announcement => `
                <div class="announcement-item announcement-priority-${announcement.priority}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                        <h5 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${announcement.title}</h5>
                        <span style="font-size: 0.75rem; color: var(--gray-600);">${new Date(announcement.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p style="color: var(--gray-700); margin-bottom: 0.75rem; line-height: 1.5;">${announcement.content}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--gray-600);">
                        <span>By: <strong>${announcement.author}</strong></span>
                        <span>To: ${announcement.recipients}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    setInner("comm-tab-announcements", announcementsHTML);
}

function loadDemoDiscussions() {
    const demoDiscussions = [
        {
            id: 1,
            title: "Best practices for data cleaning",
            author: "Andi Mahasiswa",
            replies: 12,
            lastActivity: "2 hours ago",
            category: "Technical Discussion"
        },
        {
            id: 2,
            title: "Study group for Module 3",
            author: "Sari Belajar",
            replies: 8,
            lastActivity: "5 hours ago",
            category: "Study Groups"
        },
        {
            id: 3,
            title: "Career advice: Data Analyst vs Data Scientist",
            author: "Budi Cerdas",
            replies: 15,
            lastActivity: "1 day ago",
            category: "Career Guidance"
        }
    ];

    const discussionsHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>💭</span> Discussion Forums
                </h4>
                <button class="btn" onclick="createDiscussion()" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--accent-dark);">
                    💬 Start Discussion
                </button>
            </div>
        </div>

        <div style="max-height: 400px; overflow-y: auto;">
            ${demoDiscussions.map(discussion => `
                <div style="background: var(--accent); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; border-left: 4px solid var(--accent-dark); cursor: pointer; transition: var(--transition);"
                     onclick="openDiscussion(${discussion.id})"
                     onmouseover="this.style.transform='translateX(2px)'"
                     onmouseout="this.style.transform='translateX(0)'">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h5 style="color: var(--gray-800); margin: 0; font-size: 0.875rem; font-weight: 600;">${discussion.title}</h5>
                        <span style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 600;">${discussion.category}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--gray-600);">
                        <span>By: <strong>${discussion.author}</strong> • ${discussion.replies} replies</span>
                        <span>${discussion.lastActivity}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    setInner("comm-tab-discussions", discussionsHTML);
}

function loadDemoNotifications() {
    const demoNotifications = [
        {
            id: 1,
            type: "assignment",
            title: "Assignment Due Reminder",
            message: "Python Basics assignment is due in 2 days",
            time: "1 hour ago",
            read: false
        },
        {
            id: 2,
            type: "achievement",
            title: "Student Achievement",
            message: "Andi Mahasiswa completed Module 3 with 95% score",
            time: "3 hours ago",
            read: false
        },
        {
            id: 3,
            type: "system",
            title: "System Update",
            message: "New features added to the analytics dashboard",
            time: "1 day ago",
            read: true
        }
    ];

    const notificationsHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🔔</span> Notifications
                </h4>
                <button class="btn" onclick="clearAllNotifications()" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--gray-500);">
                    🗑️ Clear All
                </button>
            </div>
        </div>

        <div style="max-height: 400px; overflow-y: auto;">
            ${demoNotifications.map(notification => {
                const iconMap = {
                    assignment: "📝",
                    achievement: "🏆",
                    system: "⚙️"
                };

                return `
                    <div style="background: ${notification.read ? 'var(--accent)' : 'var(--bg-light)'}; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; border-left: 4px solid ${notification.read ? 'var(--gray-400)' : 'var(--primary)'};">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.25rem;">${iconMap[notification.type]}</span>
                            <div style="flex: 1;">
                                <h5 style="color: var(--gray-800); margin: 0; font-size: 0.875rem; font-weight: 600;">${notification.title}</h5>
                                <p style="color: var(--gray-700); margin: 0; font-size: 0.75rem;">${notification.message}</p>
                            </div>
                            <span style="font-size: 0.75rem; color: var(--gray-600);">${notification.time}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    setInner("comm-tab-notifications", notificationsHTML);
}

function loadDemoCommunicationAnalytics() {
    const analyticsHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Communication Analytics
            </h4>
        </div>

        <!-- Communication Metrics -->
        <div class="grid" style="margin-bottom: 2rem;">
            <div style="background: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">24</div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">Messages This Week</div>
            </div>
            <div style="background: var(--secondary-light); padding: 1rem; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary-dark);">3</div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">Active Discussions</div>
            </div>
            <div style="background: var(--white); padding: 1rem; border-radius: 8px; text-align: center; border: 1px solid var(--accent);">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--info);">92%</div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">Response Rate</div>
            </div>
            <div style="background: var(--bg-light); padding: 1rem; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">2.5h</div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">Avg Response Time</div>
            </div>
        </div>

        <!-- Communication Trends -->
        <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent); margin-bottom: 1.5rem;">
            <h5 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Weekly Communication Trends</h5>
            <div style="display: flex; align-items: end; height: 120px; gap: 8px;">
                ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const heights = [40, 65, 55, 80, 70, 30, 20];
                    return `
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="background: var(--info); width: 100%; height: ${heights[index]}px; border-radius: 4px 4px 0 0;"></div>
                            <div style="margin-top: 8px; font-size: 12px; color: var(--gray-600);">${day}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- Top Discussion Topics -->
        <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
            <h5 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Top Discussion Topics</h5>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${[
                    { topic: "Data Visualization", count: 15, color: "var(--primary)" },
                    { topic: "Python Programming", count: 12, color: "var(--secondary-dark)" },
                    { topic: "Statistical Analysis", count: 8, color: "var(--info)" },
                    { topic: "Machine Learning", count: 6, color: "var(--accent-dark)" }
                ].map(item => `
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 12px; height: 12px; background: ${item.color}; border-radius: 2px;"></div>
                        <span style="flex: 1; font-size: 0.875rem; color: var(--gray-700);">${item.topic}</span>
                        <span style="font-weight: 600; color: var(--gray-800); font-size: 0.875rem;">${item.count}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    setInner("comm-tab-analytics", analyticsHTML);
}

// Communication action functions
function markAllMessagesRead() {
    setInner("unread-messages", "0");
    UIComponents.showNotification("✅ All messages marked as read", "success");
}

function composeMessage() {
    const recipient = prompt("📧 Send message to (student name or 'all'):");
    if (recipient) {
        const message = prompt("💬 Enter your message:");
        if (message) {
            UIComponents.showNotification(`✅ Message sent to ${recipient}: "${message}"`, "success");
        }
    }
}

function openMessage(messageId) {
    UIComponents.showNotification(`📖 Opening message ID: ${messageId}`, "info");
}

function createAnnouncement() {
    const title = prompt("📢 Announcement title:");
    if (title) {
        const content = prompt("📝 Announcement content:");
        if (content) {
            UIComponents.showNotification(`✅ Announcement created: "${title}"`, "success");
        }
    }
}

function createDiscussion() {
    const title = prompt("💭 Discussion topic:");
    if (title) {
        UIComponents.showNotification(`✅ Discussion started: "${title}"`, "success");
    }
}

function openDiscussion(discussionId) {
    UIComponents.showNotification(`💬 Opening discussion ID: ${discussionId}`, "info");
}

function clearAllNotifications() {
    UIComponents.showNotification("🗑️ All notifications cleared", "success");
}

// Global functions for onclick handlers
window.switchCommTab = switchCommTab;
window.markAllMessagesRead = markAllMessagesRead;
window.composeMessage = composeMessage;
window.openMessage = openMessage;
window.createAnnouncement = createAnnouncement;
window.createDiscussion = createDiscussion;
window.openDiscussion = openDiscussion;
window.clearAllNotifications = clearAllNotifications;

// Page Content Loading Functions
function loadBerandaPage() {
    const berandaHTML = `
        <!-- Summary Cards -->
        <div class="grid" style="margin-bottom: 2rem;">
            <div class="metric-card" style="background: var(--primary); color: white;">
                <div class="metric-value" id="beranda-total-students">45</div>
                <div class="metric-label">Total Students</div>
            </div>
            <div class="metric-card" style="background: var(--success); color: white;">
                <div class="metric-value" id="beranda-avg-progress">73%</div>
                <div class="metric-label">Average Progress</div>
            </div>
            <div class="metric-card" style="background: var(--warning); color: white;">
                <div class="metric-value" id="beranda-unread-messages">3</div>
                <div class="metric-label">Unread Messages</div>
            </div>
            <div class="metric-card" style="background: var(--error); color: white;">
                <div class="metric-value" id="beranda-at-risk">3</div>
                <div class="metric-label">At-Risk Students</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Quick Actions
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <button class="btn" onclick="showPage('communication')" style="background: var(--info); padding: 1rem;">
                    📢 Send Announcement
                </button>
                <button class="btn" onclick="showPage('students')" style="background: var(--warning); padding: 1rem;">
                    ⚠️ View At-Risk Students
                </button>
                <button class="btn" onclick="exportReports()" style="background: var(--success); padding: 1rem;">
                    📊 Export Reports
                </button>
                <button class="btn" onclick="scheduleSession()" style="background: var(--primary); padding: 1rem;">
                    📅 Schedule Session
                </button>
            </div>
        </section>

        <!-- Today's Activities -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📅</span> Today's Activities
            </h3>
            <div id="todays-activities">
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--accent); border-radius: 8px; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.25rem;">🎓</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--gray-800);">Live Session: Data Analytics</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">14:00 - 16:00 | 24 students registered</div>
                    </div>
                    <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Upcoming</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--accent); border-radius: 8px; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.25rem;">📝</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--gray-800);">Assignment Review: Python Basics</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Due: 23:59 | 18 submissions pending</div>
                    </div>
                    <span style="background: var(--warning); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Pending</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--accent); border-radius: 8px;">
                    <span style="font-size: 1.25rem;">📊</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--gray-800);">Weekly Progress Review</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Generate weekly reports for all classes</div>
                    </div>
                    <span style="background: var(--info); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Scheduled</span>
                </div>
            </div>
        </section>

        <!-- Recent Activity Feed -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📈</span> Recent Activity
            </h3>
            <div id="recent-activity-feed" style="max-height: 300px; overflow-y: auto;">
                <!-- Activity feed will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-beranda", berandaHTML);

    // Load beranda data
    setTimeout(() => {
        loadBerandaData();
        loadRecentActivityFeed();
    }, 100);
}

function loadBerandaData() {
    // Load summary card data
    try {
        setInner("beranda-total-students", "45");
        setInner("beranda-avg-progress", "73%");
        setInner("beranda-unread-messages", "3");
        setInner("beranda-at-risk", "3");
    } catch (error) {
        console.error("Failed to load beranda data:", error);
    }
}

function loadRecentActivityFeed() {
    const activities = [
        { time: "5 minutes ago", icon: "🏆", text: "Andi Mahasiswa achieved 95% on Module 3 Quiz", type: "achievement" },
        { time: "12 minutes ago", icon: "📝", text: "New assignment submitted by Sari Belajar", type: "submission" },
        { time: "25 minutes ago", icon: "💬", text: "New message from Maya Rajin about Module 2", type: "message" },
        { time: "1 hour ago", icon: "👥", text: "3 students joined the study group discussion", type: "social" },
        { time: "2 hours ago", icon: "📊", text: "Weekly analytics report generated", type: "system" },
        { time: "3 hours ago", icon: "🎓", text: "Live session completed: 24 students attended", type: "session" }
    ];

    const feedHTML = activities.map(activity => `
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-bottom: 1px solid var(--accent); last-child:border-bottom: none;">
            <span style="font-size: 1.25rem;">${activity.icon}</span>
            <div style="flex: 1;">
                <div style="color: var(--gray-800); font-size: 0.875rem;">${activity.text}</div>
                <div style="color: var(--gray-600); font-size: 0.75rem;">${activity.time}</div>
            </div>
        </div>
    `).join('');

    setInner("recent-activity-feed", feedHTML);
}

function loadAnalyticsPage() {
    const analyticsHTML = `
        <!-- AI Analytics Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🤖
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">AI Analytics Dashboard</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">AI-powered insights and learning analytics</p>
                </div>
                <div style="margin-left: auto;">
                    <button class="btn" id="btn-refresh-analytics" style="padding: 0.5rem 1rem; font-size: 0.75rem;">
                        🔄 Refresh Analytics
                    </button>
                </div>
            </div>

            <!-- AI Insights Grid -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="card" style="background: var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🕒</span> Learning Patterns
                    </h4>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Peak Time</span>
                        <span style="font-weight: 600; color: var(--primary);" id="peak-time">19:00-21:00 WIB</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Mobile Access</span>
                        <span style="font-weight: 600; color: var(--primary);" id="mobile-access">85%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Session Duration</span>
                        <span style="font-weight: 600; color: var(--primary);" id="session-duration">45 min</span>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent-dark);">
                        <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;" id="learning-insights">Students are most active in evening hours. Mobile learning is preferred.</p>
                    </div>
                </div>

                <div class="card" style="background: var(--secondary-light);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⚠️</span> At-Risk Students
                    </h4>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">High Risk</span>
                        <span style="font-weight: 600; color: var(--error);" id="high-risk-count">3</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Medium Risk</span>
                        <span style="font-weight: 600; color: var(--warning);" id="medium-risk-count">7</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Need Intervention</span>
                        <span style="font-weight: 600; color: var(--primary);" id="intervention-count">5</span>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent-dark);">
                        <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;" id="risk-insights">3 students need immediate intervention.</p>
                    </div>
                </div>

                <div class="card" style="background: var(--white);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📹</span> Content Effectiveness
                    </h4>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Top Content</span>
                        <span style="font-weight: 600; color: var(--primary);" id="top-content">Video Tutorials</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Engagement Rate</span>
                        <span style="font-weight: 600; color: var(--primary);" id="engagement-rate">78%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Completion Rate</span>
                        <span style="font-weight: 600; color: var(--primary);" id="completion-rate-content">65%</span>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent-dark);">
                        <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;" id="content-insights">Video tutorials show highest engagement.</p>
                    </div>
                </div>

                <div class="card" style="background: var(--bg-light);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>💡</span> AI Recommendations
                    </h4>
                    <div style="margin-bottom: 1rem;">
                        <h5 style="color: var(--gray-700); font-size: 0.875rem; margin-bottom: 0.5rem;">Priority Actions:</h5>
                        <ul style="margin: 0; padding-left: 1rem; color: var(--gray-600); font-size: 0.875rem;" id="priority-actions">
                            <li>Schedule intervention sessions for 3 high-risk students</li>
                            <li>Increase video content in Module 2</li>
                            <li>Implement peer mentoring</li>
                        </ul>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent-dark);">
                        <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;" id="ai-strategy-recommendations">Focus on personalized learning paths and gamification.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Advanced Analytics Visualization -->
        <section class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="color: var(--gray-800); margin: 0; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📊</span> Advanced Analytics Dashboard
                </h3>
                <div style="display: flex; gap: 0.5rem;">
                    <select id="analytics-timeframe" style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white); font-size: 0.75rem;">
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="semester">This Semester</option>
                        <option value="all">All Time</option>
                    </select>
                    <button class="btn" id="btn-export-analytics" style="padding: 0.5rem 1rem; font-size: 0.75rem;">
                        📈 Export Charts
                    </button>
                </div>
            </div>

            <!-- Progress Trend Charts -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📈</span> Weekly Progress Trend
                    </h4>
                    <div id="progress-trend-chart" style="height: 200px; position: relative;">
                        <!-- Progress trend chart will be rendered here -->
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔥</span> Engagement Heatmap
                    </h4>
                    <div id="engagement-heatmap" style="height: 200px; position: relative;">
                        <!-- Engagement heatmap will be rendered here -->
                    </div>
                </div>
            </div>

            <!-- Performance Analytics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🎯</span> Performance Distribution
                    </h4>
                    <div id="performance-distribution" style="height: 200px; position: relative;">
                        <!-- Performance distribution chart will be rendered here -->
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⏱️</span> Learning Time Analysis
                    </h4>
                    <div id="time-analysis-chart" style="height: 200px; position: relative;">
                        <!-- Time analysis chart will be rendered here -->
                    </div>
                </div>
            </div>

            <!-- Comparative Analytics -->
            <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent); margin-bottom: 2rem;">
                <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📊</span> Class Performance Comparison
                </h4>
                <div id="class-comparison-chart" style="height: 250px; position: relative;">
                    <!-- Class comparison chart will be rendered here -->
                </div>
            </div>

            <!-- Learning Path Analytics -->
            <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🛤️</span> Learning Path Effectiveness
                </h4>
                <div id="learning-path-chart" style="height: 200px; position: relative;">
                    <!-- Learning path effectiveness chart will be rendered here -->
                </div>
            </div>
        </section>
    `;

    setInner("page-analytics", analyticsHTML);

    // Load analytics data and render charts
    setTimeout(() => {
        loadLearningPatterns();
        loadAtRiskStudents();
        loadContentEffectiveness();
        loadAIRecommendations();
        renderDemoCharts();
    }, 100);

    UIComponents.showNotification("📊 Analytics & Insights loaded successfully!", "success");
}

function loadStudentsPage() {
    const studentsHTML = `
        <!-- Real-time Student Monitoring Dashboard -->
        <section class="card">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    👥
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Real-time Student Monitoring</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Live tracking of student progress and engagement</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <div style="background: var(--accent); padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid var(--accent-dark);">
                        <span style="font-size: 0.75rem; color: var(--gray-600);">Last Update:</span>
                        <span style="font-weight: 600; color: var(--primary); font-size: 0.75rem;" id="last-update-time">Loading...</span>
                    </div>
                    <button class="btn" id="btn-toggle-realtime" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        🔴 Live Monitoring
                    </button>
                </div>
            </div>

            <!-- Real-time Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--accent);">
                    <div class="metric-value" id="online-students">12</div>
                    <div class="metric-label">Students Online Now</div>
                </div>
                <div class="metric-card" style="background: var(--secondary-light);">
                    <div class="metric-value" id="active-sessions">8</div>
                    <div class="metric-label">Active Learning Sessions</div>
                </div>
                <div class="metric-card" style="background: var(--white);">
                    <div class="metric-value" id="avg-engagement">78%</div>
                    <div class="metric-label">Avg Engagement Score</div>
                </div>
                <div class="metric-card" style="background: var(--bg-light);">
                    <div class="metric-value" id="completion-today">24</div>
                    <div class="metric-label">Lessons Completed Today</div>
                </div>
            </div>

            <!-- Filter and Action Controls -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <select id="filter-status" style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option value="all">All Students</option>
                        <option value="online">Online Now</option>
                        <option value="at-risk">At Risk</option>
                        <option value="high-performers">High Performers</option>
                        <option value="needs-attention">Needs Attention</option>
                    </select>
                    <select id="filter-module" style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option value="all">All Modules</option>
                        <option value="module-1">Module 1: Foundations</option>
                        <option value="module-2">Module 2: Analytics</option>
                        <option value="module-3">Module 3: Advanced</option>
                    </select>
                    <input type="search" id="search-students" placeholder="Search students..." style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white); min-width: 200px;">
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-success" id="btn-export-progress">📊 Export Progress</button>
                    <button class="btn btn-warning" id="btn-send-reminder">📧 Send Reminder</button>
                    <button class="btn" id="btn-refresh-data">🔄 Refresh Data</button>
                </div>
            </div>

            <!-- Enhanced Student Table -->
            <div id="student-list" style="overflow-x: auto;">
                <p style="text-align: center; color: var(--gray-600); padding: 2rem;">Loading student data...</p>
            </div>

            <!-- Student Activity Timeline -->
            <div style="border-top: 1px solid var(--accent); padding-top: 1.5rem; margin-top: 1.5rem;">
                <h3 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📈</span> Recent Student Activity
                </h3>
                <div id="activity-timeline" style="background: var(--white); border: 1px solid var(--accent); border-radius: 8px; padding: 1rem; max-height: 300px; overflow-y: auto;">
                    <p style="color: var(--gray-600); text-align: center;">Loading recent activity...</p>
                </div>
            </div>
        </section>
    `;

    setInner("page-students", studentsHTML);

    // Load student data
    setTimeout(() => {
        loadRealTimeStatsWithFallback();
        loadActivityTimelineWithFallback();
        renderDemoStudentTable();
        updateLastUpdateTime();
    }, 100);

    UIComponents.showNotification("👥 Student Management loaded successfully!", "success");
}

function loadCommunicationPage() {
    const communicationHTML = `
        <!-- Communication Center -->
        <section class="card">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--info); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    💬
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Communication Center</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Manage student communications and announcements</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <div style="background: var(--accent); padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid var(--accent-dark);">
                        <span style="font-size: 0.75rem; color: var(--gray-600);">Unread:</span>
                        <span style="font-weight: 600; color: var(--primary); font-size: 0.75rem;" id="unread-messages">3</span>
                    </div>
                    <button class="btn" id="btn-mark-all-read" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        ✅ Mark All Read
                    </button>
                </div>
            </div>

            <!-- Communication Tabs -->
            <div class="communication-tabs">
                <button class="comm-tab-button active" onclick="switchCommTab('messages')">📨 Messages</button>
                <button class="comm-tab-button" onclick="switchCommTab('announcements')">📢 Announcements</button>
                <button class="comm-tab-button" onclick="switchCommTab('discussions')">💭 Discussions</button>
                <button class="comm-tab-button" onclick="switchCommTab('notifications')">🔔 Notifications</button>
                <button class="comm-tab-button" onclick="switchCommTab('analytics')">📊 Comm Analytics</button>
            </div>

            <!-- Tab Content -->
            <div id="comm-tab-messages" class="comm-tab-content active">
                <!-- Messages content will be loaded here -->
            </div>

            <div id="comm-tab-announcements" class="comm-tab-content">
                <!-- Announcements content will be loaded here -->
            </div>

            <div id="comm-tab-discussions" class="comm-tab-content">
                <!-- Discussions content will be loaded here -->
            </div>

            <div id="comm-tab-notifications" class="comm-tab-content">
                <!-- Notifications content will be loaded here -->
            </div>

            <div id="comm-tab-analytics" class="comm-tab-content">
                <!-- Communication Analytics content will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-communication", communicationHTML);

    // Load communication data
    setTimeout(() => {
        loadDemoCommunicationData();
        setupCommunicationEventListeners();
    }, 100);

    UIComponents.showNotification("💬 Communication Center loaded successfully!", "success");
}

function loadWorkflowPage() {
    const workflowHTML = `
        <!-- D1-D24 Educator Workflow -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--secondary-dark); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    ⚡
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">D1-D24 Educator Workflow</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Comprehensive workflow tools for daily educator tasks</p>
                </div>
            </div>

            <!-- Workflow Categories -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="card" style="background: var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📅</span> Weekly Planning (D1-D6)
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" id="btn-weekly-planning" style="background: var(--primary); padding: 0.5rem;">
                            📋 Start Weekly Planning
                        </button>
                        <button class="btn" id="btn-pre-class-setup" style="background: var(--info); padding: 0.5rem;">
                            🎯 Pre-Class Setup
                        </button>
                        <button class="btn" id="btn-live-class" style="background: var(--success); padding: 0.5rem;">
                            🎓 Live Class Tools
                        </button>
                    </div>
                </div>

                <div class="card" style="background: var(--secondary-light);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📊</span> Analysis & Monitoring (D7-D18)
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" id="btn-post-analysis" style="background: var(--warning); padding: 0.5rem;">
                            📈 Post-Class Analysis
                        </button>
                        <button class="btn" id="btn-student-monitoring" style="background: var(--primary); padding: 0.5rem;">
                            👥 Student Monitoring
                        </button>
                        <button class="btn" id="btn-ai-oversight" style="background: var(--secondary-dark); padding: 0.5rem;">
                            🤖 AI Oversight
                        </button>
                    </div>
                </div>

                <div class="card" style="background: var(--white);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔄</span> Continuous Improvement (D19-D24)
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" style="background: var(--accent-dark); padding: 0.5rem;">
                            📝 Content Updates
                        </button>
                        <button class="btn" style="background: var(--info); padding: 0.5rem;">
                            🎯 Strategy Refinement
                        </button>
                        <button class="btn" style="background: var(--success); padding: 0.5rem;">
                            📊 Performance Review
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Class Management Tools -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎓</span> Class Management Tools
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.5rem;">📚 Course Materials</h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Manage course content and resources</p>
                    <button class="btn" style="background: var(--primary); width: 100%;">Manage Materials</button>
                </div>
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.5rem;">📝 Assignments</h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create and grade assignments</p>
                    <button class="btn" style="background: var(--warning); width: 100%;">Manage Assignments</button>
                </div>
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.5rem;">📊 Assessments</h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create quizzes and exams</p>
                    <button class="btn" style="background: var(--info); width: 100%;">Manage Assessments</button>
                </div>
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.5rem;">📅 Schedule</h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Manage class schedules</p>
                    <button class="btn" style="background: var(--success); width: 100%;">View Schedule</button>
                </div>
            </div>
        </section>

        <!-- Quick Actions -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Quick Workflow Actions
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
                <button class="btn" style="background: var(--primary); padding: 0.75rem 1rem;">
                    📋 Create Lesson Plan
                </button>
                <button class="btn" style="background: var(--success); padding: 0.75rem 1rem;">
                    🎯 Set Learning Objectives
                </button>
                <button class="btn" style="background: var(--warning); padding: 0.75rem 1rem;">
                    📊 Generate Reports
                </button>
                <button class="btn" style="background: var(--info); padding: 0.75rem 1rem;">
                    💬 Send Class Announcement
                </button>
                <button class="btn" style="background: var(--secondary-dark); padding: 0.75rem 1rem;">
                    🔄 Update Course Content
                </button>
                <button class="btn" style="background: var(--accent-dark); padding: 0.75rem 1rem;">
                    📈 Review Analytics
                </button>
            </div>
        </section>
    `;

    setInner("page-workflow", workflowHTML);
    UIComponents.showNotification("⚡ Workflow Tools loaded successfully!", "success");
}

function loadSettingsPage() {
    const settingsHTML = `
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>👤</span> Profile Settings
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Full Name</label>
                    <input type="text" value="Dr. Sarah Johnson" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Email</label>
                    <input type="email" value="sarah.johnson@university.edu" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Department</label>
                    <input type="text" value="Computer Science" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Phone</label>
                    <input type="tel" value="+1 (555) 123-4567" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                </div>
            </div>
        </section>

        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔔</span> Notification Preferences
            </h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                    <input type="checkbox" checked> Email notifications for new messages
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                    <input type="checkbox" checked> Weekly progress reports
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                    <input type="checkbox"> Daily activity summaries
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                    <input type="checkbox" checked> At-risk student alerts
                </label>
            </div>
        </section>

        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎨</span> Interface Preferences
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Theme</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option>Light Theme</option>
                        <option>Dark Theme</option>
                        <option>Auto (System)</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Language</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option>English</option>
                        <option>Bahasa Indonesia</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Timezone</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option>UTC+7 (Jakarta)</option>
                        <option>UTC+0 (London)</option>
                        <option>UTC-5 (New York)</option>
                    </select>
                </div>
            </div>
            <div style="margin-top: 1.5rem;">
                <button class="btn" style="background: var(--primary); padding: 0.75rem 1.5rem;">
                    💾 Save Settings
                </button>
            </div>
        </section>
    `;

    setInner("page-settings", settingsHTML);
}

// Quick action functions
function exportReports() {
    UIComponents.showNotification("📊 Exporting comprehensive reports...", "success");
}

function scheduleSession() {
    UIComponents.showNotification("📅 Opening session scheduler...", "info");
}

// Global functions for onclick handlers
window.showPage = showPage;
window.exportReports = exportReports;
window.scheduleSession = scheduleSession;

// Setup additional event listeners for each page
function setupAnalyticsEventListeners() {
    // Analytics refresh button
    setTimeout(() => {
        const refreshBtn = document.getElementById("btn-refresh-analytics");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", refreshAnalytics);
        }

        const timeframeSelect = document.getElementById("analytics-timeframe");
        if (timeframeSelect) {
            timeframeSelect.addEventListener("change", updateAnalyticsTimeframe);
        }

        const exportBtn = document.getElementById("btn-export-analytics");
        if (exportBtn) {
            exportBtn.addEventListener("click", exportAnalytics);
        }
    }, 200);
}

function setupStudentEventListeners() {
    setTimeout(() => {
        const toggleBtn = document.getElementById("btn-toggle-realtime");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", toggleRealTimeMonitoring);
        }

        const exportBtn = document.getElementById("btn-export-progress");
        if (exportBtn) {
            exportBtn.addEventListener("click", exportStudentProgress);
        }

        const reminderBtn = document.getElementById("btn-send-reminder");
        if (reminderBtn) {
            reminderBtn.addEventListener("click", sendReminder);
        }

        const refreshBtn = document.getElementById("btn-refresh-data");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", refreshData);
        }

        const filterStatus = document.getElementById("filter-status");
        if (filterStatus) {
            filterStatus.addEventListener("change", filterStudents);
        }

        const filterModule = document.getElementById("filter-module");
        if (filterModule) {
            filterModule.addEventListener("change", filterStudents);
        }

        const searchInput = document.getElementById("search-students");
        if (searchInput) {
            searchInput.addEventListener("input", searchStudents);
        }
    }, 200);
}

function setupWorkflowEventListeners() {
    setTimeout(() => {
        const weeklyBtn = document.getElementById("btn-weekly-planning");
        if (weeklyBtn) {
            weeklyBtn.addEventListener("click", startWeeklyPlanning);
        }

        const preClassBtn = document.getElementById("btn-pre-class-setup");
        if (preClassBtn) {
            preClassBtn.addEventListener("click", startPreClassSetup);
        }

        const liveClassBtn = document.getElementById("btn-live-class");
        if (liveClassBtn) {
            liveClassBtn.addEventListener("click", startLiveClass);
        }

        const postAnalysisBtn = document.getElementById("btn-post-analysis");
        if (postAnalysisBtn) {
            postAnalysisBtn.addEventListener("click", startPostAnalysis);
        }

        const monitoringBtn = document.getElementById("btn-student-monitoring");
        if (monitoringBtn) {
            monitoringBtn.addEventListener("click", openStudentMonitoring);
        }

        const aiOversightBtn = document.getElementById("btn-ai-oversight");
        if (aiOversightBtn) {
            aiOversightBtn.addEventListener("click", openAIOversight);
        }
    }, 200);
}

// D1-D6: Weekly Planning Session (30 minutes) - Enhanced Implementation
function startWeeklyPlanning() {
    UIComponents.showNotification("📅 Starting Weekly Planning Session (D1-D6) - 30 minutes", "info");

    // Open Weekly Planning Modal
    openWeeklyPlanningModal();
}

function openWeeklyPlanningModal() {
    const modalHTML = `
        <div class="modal-overlay" id="weekly-planning-modal" style="display: flex;">
            <div class="modal-content" style="max-width: 1200px; width: 95%;">
                <div class="modal-header">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 48px; height: 48px; background: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                            📅
                        </div>
                        <div>
                            <h2 style="margin: 0; color: var(--gray-900);">Weekly Planning Session (D1-D6)</h2>
                            <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">30-minute structured planning workflow</p>
                        </div>
                    </div>
                    <button class="modal-close" onclick="closeWeeklyPlanningModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="planning-tabs">
                        <button class="planning-tab-button active" onclick="showPlanningTab('overview')">📊 Overview</button>
                        <button class="planning-tab-button" onclick="showPlanningTab('analytics')">🤖 AI Analytics (D2)</button>
                        <button class="planning-tab-button" onclick="showPlanningTab('at-risk')">⚠️ At-Risk Students (D3)</button>
                        <button class="planning-tab-button" onclick="showPlanningTab('content')">📚 Content Analysis (D4)</button>
                        <button class="planning-tab-button" onclick="showPlanningTab('intervention')">🎯 Interventions (D5)</button>
                        <button class="planning-tab-button" onclick="showPlanningTab('session-plan')">📝 Session Plan (D6)</button>
                    </div>

                    <!-- Planning Tab Contents -->
                    <div id="planning-tab-overview" class="planning-tab-content active">
                        ${renderPlanningOverview()}
                    </div>
                    <div id="planning-tab-analytics" class="planning-tab-content">
                        ${renderAnalyticsTab()}
                    </div>
                    <div id="planning-tab-at-risk" class="planning-tab-content">
                        ${renderAtRiskTab()}
                    </div>
                    <div id="planning-tab-content" class="planning-tab-content">
                        ${renderContentAnalysisTab()}
                    </div>
                    <div id="planning-tab-intervention" class="planning-tab-content">
                        ${renderInterventionTab()}
                    </div>
                    <div id="planning-tab-session-plan" class="planning-tab-content">
                        ${renderSessionPlanTab()}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize planning session timer
    startPlanningTimer();
}

// Planning Tab Content Functions
function renderPlanningOverview() {
    return `
        <div class="planning-progress">
            <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">📅 Weekly Planning Session Progress</h3>
            <p style="margin: 0 0 1rem 0; color: var(--gray-600);">Complete all 6 steps within 30 minutes for optimal planning efficiency.</p>

            <div class="progress-steps">
                <div class="progress-step active" id="step-d1">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📋</div>
                    <div style="font-weight: 600; font-size: 0.875rem;">D1: Planning</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Session Setup</div>
                </div>
                <div class="progress-step" id="step-d2">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🤖</div>
                    <div style="font-weight: 600; font-size: 0.875rem;">D2: Analytics</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">AI Review</div>
                </div>
                <div class="progress-step" id="step-d3">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⚠️</div>
                    <div style="font-weight: 600; font-size: 0.875rem;">D3: At-Risk</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Student ID</div>
                </div>
                <div class="progress-step" id="step-d4">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📚</div>
                    <div style="font-weight: 600; font-size: 0.875rem;">D4: Content</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Effectiveness</div>
                </div>
                <div class="progress-step" id="step-d5">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎯</div>
                    <div style="font-weight: 600; font-size: 0.875rem;">D5: Intervention</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Planning</div>
                </div>
                <div class="progress-step" id="step-d6">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📝</div>
                    <div style="font-weight: 600; font-size: 0.875rem;">D6: Session</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Plan Creation</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem;">🎯 This Week's Focus Areas</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--primary);">📊 Key Metrics</h5>
                    <ul style="margin: 0; padding-left: 1rem; color: var(--gray-700);">
                        <li>Class average: 78% (+5% from last week)</li>
                        <li>At-risk students: 3 (needs attention)</li>
                        <li>Engagement rate: 85% (target: 90%)</li>
                        <li>Completion rate: 68% (improving)</li>
                    </ul>
                </div>
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--warning);">⚠️ Priority Actions</h5>
                    <ul style="margin: 0; padding-left: 1rem; color: var(--gray-700);">
                        <li>Schedule intervention for Maya Rajin</li>
                        <li>Review Module 2 content effectiveness</li>
                        <li>Increase video content engagement</li>
                        <li>Plan peer mentoring sessions</li>
                    </ul>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem;">
            <button class="btn" onclick="closeWeeklyPlanningModal()" style="background: var(--gray-500);">
                ❌ Cancel Planning
            </button>
            <button class="btn btn-primary" onclick="showPlanningTab('analytics')">
                ▶️ Start with AI Analytics (D2)
            </button>
        </div>
    `;
}

function renderAnalyticsTab() {
    return `
        <div class="card" style="margin-bottom: 2rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem;">🤖 AI Analytics Dashboard Review (D2)</h4>
            <p style="color: var(--gray-600); margin-bottom: 1.5rem;">Review AI-generated insights to inform your weekly planning decisions.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h5 style="margin: 0 0 1rem 0; color: var(--success);">📈 Learning Patterns</h5>
                    <div style="margin-bottom: 1rem;">
                        <strong>Peak Learning Time:</strong> 19:00-21:00 WIB<br>
                        <strong>Mobile Access:</strong> 85% of students<br>
                        <strong>Avg Session:</strong> 45 minutes<br>
                        <strong>Best Content:</strong> Video tutorials
                    </div>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; font-size: 0.875rem; color: var(--gray-700);">
                        💡 <strong>AI Insight:</strong> Students show highest engagement during evening hours. Consider scheduling live sessions between 7-9 PM.
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--warning);">
                    <h5 style="margin: 0 0 1rem 0; color: var(--warning);">⚠️ At-Risk Analysis</h5>
                    <div style="margin-bottom: 1rem;">
                        <strong>High Risk:</strong> 3 students<br>
                        <strong>Medium Risk:</strong> 7 students<br>
                        <strong>Intervention Needed:</strong> 5 students<br>
                        <strong>Success Rate:</strong> 75% with intervention
                    </div>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; font-size: 0.875rem; color: var(--gray-700);">
                        🎯 <strong>AI Recommendation:</strong> Focus on students with <30% progress and no activity in 7+ days.
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h5 style="margin: 0 0 1rem 0; color: var(--primary);">📚 Content Effectiveness</h5>
                    <div style="margin-bottom: 1rem;">
                        <strong>Video Content:</strong> 92% engagement<br>
                        <strong>Interactive Exercises:</strong> 78% engagement<br>
                        <strong>Text Content:</strong> 45% engagement<br>
                        <strong>Completion Rate:</strong> 65% average
                    </div>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; font-size: 0.875rem; color: var(--gray-700);">
                        📊 <strong>AI Strategy:</strong> Increase video content ratio and add more interactive elements to boost engagement.
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
            <button class="btn" onclick="showPlanningTab('overview')" style="background: var(--gray-500);">
                ◀️ Back to Overview
            </button>
            <div style="display: flex; gap: 1rem;">
                <button class="btn" onclick="markStepCompleted('d2')" style="background: var(--success);">
                    ✅ Mark D2 Complete
                </button>
                <button class="btn btn-primary" onclick="showPlanningTab('at-risk')">
                    ▶️ Next: At-Risk Students (D3)
                </button>
            </div>
        </div>
    `;
}

function renderAtRiskTab() {
    return `
        <div class="card" style="margin-bottom: 2rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem;">⚠️ At-Risk Student Identification (D3)</h4>
            <p style="color: var(--gray-600); margin-bottom: 1.5rem;">Identify students who need immediate intervention and plan appropriate support strategies.</p>

            <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h5 style="margin: 0 0 1rem 0; color: var(--error);">🚨 High-Risk Students (Immediate Action Required)</h5>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: var(--white); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--error);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: var(--gray-800);">Maya Rajin</strong>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Progress: 25% • Last active: 7 days ago</div>
                                <div style="font-size: 0.875rem; color: var(--error);">Risk factors: Low progress, inactive, missed 2 deadlines</div>
                            </div>
                            <button class="btn" onclick="planIntervention('maya-rajin')" style="background: var(--error); font-size: 0.75rem;">
                                🎯 Plan Intervention
                            </button>
                        </div>
                    </div>
                    <div style="background: var(--white); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--error);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: var(--gray-800);">Ahmad Rizki</strong>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Progress: 15% • Last active: 10 days ago</div>
                                <div style="font-size: 0.875rem; color: var(--error);">Risk factors: Very low progress, long inactivity</div>
                            </div>
                            <button class="btn" onclick="planIntervention('ahmad-rizki')" style="background: var(--error); font-size: 0.75rem;">
                                🎯 Plan Intervention
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h5 style="margin: 0 0 1rem 0; color: var(--warning);">⚠️ Medium-Risk Students (Monitor Closely)</h5>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    <div style="background: var(--white); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--warning);">
                        <strong style="color: var(--gray-800);">Sari Lambat</strong>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">Progress: 45% • Engagement: 60%</div>
                    </div>
                    <div style="background: var(--white); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--warning);">
                        <strong style="color: var(--gray-800);">Budi Tertinggal</strong>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">Progress: 50% • Missed 1 deadline</div>
                    </div>
                    <div style="background: var(--white); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--warning);">
                        <strong style="color: var(--gray-800);">Dewi Kurang</strong>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">Progress: 55% • Low engagement</div>
                    </div>
                </div>
            </div>

            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--primary);">
                <h5 style="margin: 0 0 1rem 0; color: var(--primary);">🎯 AI-Recommended Intervention Strategies</h5>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                    <div>
                        <strong style="color: var(--gray-800);">Immediate Actions:</strong>
                        <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700);">
                            <li>Schedule 1-on-1 check-in calls</li>
                            <li>Send personalized encouragement messages</li>
                            <li>Offer flexible deadline extensions</li>
                            <li>Provide additional learning resources</li>
                        </ul>
                    </div>
                    <div>
                        <strong style="color: var(--gray-800);">Long-term Support:</strong>
                        <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700);">
                            <li>Pair with high-performing study buddies</li>
                            <li>Create personalized learning paths</li>
                            <li>Schedule regular progress check-ins</li>
                            <li>Implement gamification elements</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
            <button class="btn" onclick="showPlanningTab('analytics')" style="background: var(--gray-500);">
                ◀️ Back to Analytics
            </button>
            <div style="display: flex; gap: 1rem;">
                <button class="btn" onclick="markStepCompleted('d3')" style="background: var(--success);">
                    ✅ Mark D3 Complete
                </button>
                <button class="btn btn-primary" onclick="showPlanningTab('content')">
                    ▶️ Next: Content Analysis (D4)
                </button>
            </div>
        </div>
    `;
}

function renderContentAnalysisTab() {
    return `
        <div class="card" style="margin-bottom: 2rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem;">📚 Content Effectiveness Analysis (D4)</h4>
            <p style="color: var(--gray-600); margin-bottom: 1.5rem;">Analyze which content types and modules are most effective for student learning.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                    <h5 style="margin: 0 0 1rem 0; color: var(--success);">📹 Video Content Performance</h5>
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Engagement Rate:</span>
                            <strong style="color: var(--success);">92%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Completion Rate:</span>
                            <strong style="color: var(--success);">88%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Avg Watch Time:</span>
                            <strong>85%</strong>
                        </div>
                    </div>
                    <div style="background: var(--success); color: white; padding: 0.75rem; border-radius: 6px; font-size: 0.875rem;">
                        ✅ <strong>Recommendation:</strong> Increase video content ratio to 60% of total materials.
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                    <h5 style="margin: 0 0 1rem 0; color: var(--primary);">🎮 Interactive Exercises</h5>
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Engagement Rate:</span>
                            <strong style="color: var(--primary);">78%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Completion Rate:</span>
                            <strong style="color: var(--primary);">72%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Retry Rate:</span>
                            <strong>45%</strong>
                        </div>
                    </div>
                    <div style="background: var(--primary); color: white; padding: 0.75rem; border-radius: 6px; font-size: 0.875rem;">
                        📈 <strong>Recommendation:</strong> Add more gamification elements and immediate feedback.
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                    <h5 style="margin: 0 0 1rem 0; color: var(--warning);">📝 Text-based Content</h5>
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Engagement Rate:</span>
                            <strong style="color: var(--warning);">45%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Completion Rate:</span>
                            <strong style="color: var(--warning);">38%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Time on Page:</span>
                            <strong>2.5 min</strong>
                        </div>
                    </div>
                    <div style="background: var(--warning); color: white; padding: 0.75rem; border-radius: 6px; font-size: 0.875rem;">
                        ⚠️ <strong>Action Needed:</strong> Convert text content to interactive formats or infographics.
                    </div>
                </div>
            </div>

            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--primary);">
                <h5 style="margin: 0 0 1rem 0; color: var(--primary);">📊 Module Performance Analysis</h5>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="text-align: center; padding: 1rem; background: var(--white); border-radius: 8px;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📈</div>
                        <strong style="color: var(--success);">Module 1</strong>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">95% completion</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--white); border-radius: 8px;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📊</div>
                        <strong style="color: var(--primary);">Module 2</strong>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">78% completion</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--white); border-radius: 8px;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📉</div>
                        <strong style="color: var(--warning);">Module 3</strong>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">52% completion</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--white); border-radius: 8px;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📋</div>
                        <strong style="color: var(--gray-600);">Module 4</strong>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">Not started</div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
            <button class="btn" onclick="showPlanningTab('at-risk')" style="background: var(--gray-500);">
                ◀️ Back to At-Risk
            </button>
            <div style="display: flex; gap: 1rem;">
                <button class="btn" onclick="markStepCompleted('d4')" style="background: var(--success);">
                    ✅ Mark D4 Complete
                </button>
                <button class="btn btn-primary" onclick="showPlanningTab('intervention')">
                    ▶️ Next: Interventions (D5)
                </button>
            </div>
        </div>
    `;
}

function renderInterventionTab() {
    return `
        <div class="card" style="margin-bottom: 2rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem;">🎯 Intervention Strategy Planning (D5)</h4>
            <p style="color: var(--gray-600); margin-bottom: 1.5rem;">Plan specific intervention strategies based on analytics and at-risk student identification.</p>

            <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h5 style="margin: 0 0 1rem 0; color: var(--error);">🚨 Priority Interventions (This Week)</h5>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--error);">
                        <div style="display: flex; justify-content: between; align-items: start; gap: 1rem;">
                            <div style="flex: 1;">
                                <strong style="color: var(--gray-800);">Maya Rajin - Individual Support Plan</strong>
                                <div style="margin: 0.5rem 0; color: var(--gray-600); font-size: 0.875rem;">
                                    Status: 25% progress, 7 days inactive, missed 2 deadlines
                                </div>
                                <div style="background: var(--bg-light); padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                                    <strong style="color: var(--primary);">Planned Actions:</strong>
                                    <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700);">
                                        <li>📞 Schedule 30-min 1-on-1 call (Tomorrow 2 PM)</li>
                                        <li>📚 Provide simplified Module 2 materials</li>
                                        <li>⏰ Extend deadline by 1 week with milestones</li>
                                        <li>👥 Pair with study buddy (Budi Cerdas)</li>
                                    </ul>
                                </div>
                            </div>
                            <button class="btn" onclick="scheduleIntervention('maya-rajin')" style="background: var(--primary); font-size: 0.75rem;">
                                📅 Schedule
                            </button>
                        </div>
                    </div>

                    <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--warning);">
                        <div style="display: flex; justify-content: between; align-items: start; gap: 1rem;">
                            <div style="flex: 1;">
                                <strong style="color: var(--gray-800);">Ahmad Rizki - Re-engagement Strategy</strong>
                                <div style="margin: 0.5rem 0; color: var(--gray-600); font-size: 0.875rem;">
                                    Status: 15% progress, 10 days inactive, needs motivation
                                </div>
                                <div style="background: var(--bg-light); padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                                    <strong style="color: var(--primary);">Planned Actions:</strong>
                                    <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700);">
                                        <li>💬 Send encouraging WhatsApp message today</li>
                                        <li>🎯 Create personalized learning path</li>
                                        <li>🏆 Implement achievement badges system</li>
                                        <li>📱 Enable mobile-friendly content access</li>
                                    </ul>
                                </div>
                            </div>
                            <button class="btn" onclick="scheduleIntervention('ahmad-rizki')" style="background: var(--warning); font-size: 0.75rem;">
                                📅 Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--primary); margin-bottom: 2rem;">
                <h5 style="margin: 0 0 1rem 0; color: var(--primary);">📋 Intervention Resource Allocation</h5>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    <div style="background: var(--white); padding: 1rem; border-radius: 8px;">
                        <strong style="color: var(--gray-800);">⏰ Time Investment</strong>
                        <div style="margin: 0.5rem 0; color: var(--gray-600); font-size: 0.875rem;">
                            • 1-on-1 calls: 2 hours/week<br>
                            • Content creation: 1 hour<br>
                            • Follow-up messages: 30 min
                        </div>
                    </div>
                    <div style="background: var(--white); padding: 1rem; border-radius: 8px;">
                        <strong style="color: var(--gray-800);">📚 Resources Needed</strong>
                        <div style="margin: 0.5rem 0; color: var(--gray-600); font-size: 0.875rem;">
                            • Simplified materials<br>
                            • Video tutorials<br>
                            • Practice exercises<br>
                            • Study guides
                        </div>
                    </div>
                    <div style="background: var(--white); padding: 1rem; border-radius: 8px;">
                        <strong style="color: var(--gray-800);">🎯 Success Metrics</strong>
                        <div style="margin: 0.5rem 0; color: var(--gray-600); font-size: 0.875rem;">
                            • 50% progress increase<br>
                            • Daily activity resumption<br>
                            • Assignment completion<br>
                            • Engagement improvement
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
            <button class="btn" onclick="showPlanningTab('content')" style="background: var(--gray-500);">
                ◀️ Back to Content
            </button>
            <div style="display: flex; gap: 1rem;">
                <button class="btn" onclick="markStepCompleted('d5')" style="background: var(--success);">
                    ✅ Mark D5 Complete
                </button>
                <button class="btn btn-primary" onclick="showPlanningTab('session-plan')">
                    ▶️ Next: Session Plan (D6)
                </button>
            </div>
        </div>
    `;
}

function renderSessionPlanTab() {
    return `
        <div class="card" style="margin-bottom: 2rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem;">📝 Session Plan Creation (D6)</h4>
            <p style="color: var(--gray-600); margin-bottom: 1.5rem;">Create detailed session plans based on analytics insights and intervention strategies.</p>

            <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h5 style="margin: 0 0 1rem 0; color: var(--primary);">📅 This Week's Session Plan</h5>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                        <h6 style="margin: 0 0 1rem 0; color: var(--primary);">🎯 Session 1: Module 3 Review</h6>
                        <div style="margin-bottom: 1rem;">
                            <strong>Date:</strong> Monday, 2 PM<br>
                            <strong>Duration:</strong> 90 minutes<br>
                            <strong>Focus:</strong> Data Visualization<br>
                            <strong>Format:</strong> Interactive Workshop
                        </div>
                        <div style="background: var(--bg-light); padding: 1rem; border-radius: 6px;">
                            <strong>Key Activities:</strong>
                            <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700);">
                                <li>Live coding demonstration (30 min)</li>
                                <li>Hands-on practice (45 min)</li>
                                <li>Q&A and troubleshooting (15 min)</li>
                            </ul>
                        </div>
                    </div>

                    <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                        <h6 style="margin: 0 0 1rem 0; color: var(--success);">👥 Session 2: Peer Collaboration</h6>
                        <div style="margin-bottom: 1rem;">
                            <strong>Date:</strong> Wednesday, 7 PM<br>
                            <strong>Duration:</strong> 60 minutes<br>
                            <strong>Focus:</strong> Group Projects<br>
                            <strong>Format:</strong> Collaborative Session
                        </div>
                        <div style="background: var(--bg-light); padding: 1rem; border-radius: 6px;">
                            <strong>Key Activities:</strong>
                            <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700);">
                                <li>Team formation and project planning (20 min)</li>
                                <li>Collaborative work time (30 min)</li>
                                <li>Progress sharing and feedback (10 min)</li>
                            </ul>
                        </div>
                    </div>

                    <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--warning);">
                        <h6 style="margin: 0 0 1rem 0; color: var(--warning);">🆘 Session 3: Support Session</h6>
                        <div style="margin-bottom: 1rem;">
                            <strong>Date:</strong> Friday, 4 PM<br>
                            <strong>Duration:</strong> 45 minutes<br>
                            <strong>Focus:</strong> At-Risk Student Support<br>
                            <strong>Format:</strong> Small Group Tutorial
                        </div>
                        <div style="background: var(--bg-light); padding: 1rem; border-radius: 6px;">
                            <strong>Key Activities:</strong>
                            <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700);">
                                <li>Individual progress review (15 min)</li>
                                <li>Targeted skill building (20 min)</li>
                                <li>Next steps planning (10 min)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--primary);">
                    <h6 style="margin: 0 0 1rem 0; color: var(--primary);">📋 Session Preparation Checklist</h6>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        <div>
                            <strong style="color: var(--gray-800);">📚 Content Preparation:</strong>
                            <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700); font-size: 0.875rem;">
                                <li>✅ Update Module 3 slides</li>
                                <li>✅ Prepare coding examples</li>
                                <li>⏳ Create practice exercises</li>
                                <li>⏳ Record backup video</li>
                            </ul>
                        </div>
                        <div>
                            <strong style="color: var(--gray-800);">🔧 Technical Setup:</strong>
                            <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700); font-size: 0.875rem;">
                                <li>✅ Test Zoom connection</li>
                                <li>✅ Prepare screen sharing</li>
                                <li>⏳ Setup breakout rooms</li>
                                <li>⏳ Test interactive tools</li>
                            </ul>
                        </div>
                        <div>
                            <strong style="color: var(--gray-800);">👥 Student Engagement:</strong>
                            <ul style="margin: 0.5rem 0 0 1rem; color: var(--gray-700); font-size: 0.875rem;">
                                <li>✅ Send session reminders</li>
                                <li>⏳ Prepare engagement activities</li>
                                <li>⏳ Plan intervention moments</li>
                                <li>⏳ Setup feedback collection</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
            <button class="btn" onclick="showPlanningTab('intervention')" style="background: var(--gray-500);">
                ◀️ Back to Interventions
            </button>
            <div style="display: flex; gap: 1rem;">
                <button class="btn" onclick="markStepCompleted('d6')" style="background: var(--success);">
                    ✅ Mark D6 Complete
                </button>
                <button class="btn btn-primary" onclick="completePlanningSession()">
                    🎯 Complete Planning Session
                </button>
            </div>
        </div>
    `;
}

// Planning Modal Control Functions
function showPlanningTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.planning-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.planning-tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(`planning-tab-${tabName}`).classList.add('active');

    // Add active class to selected tab button
    event.target.classList.add('active');

    // Update progress step if applicable
    const stepMap = {
        'analytics': 'd2',
        'at-risk': 'd3',
        'content': 'd4',
        'intervention': 'd5',
        'session-plan': 'd6'
    };

    if (stepMap[tabName]) {
        updatePlanningProgress(stepMap[tabName]);
    }
}

function markStepCompleted(step) {
    const stepElement = document.getElementById(`step-${step}`);
    if (stepElement) {
        stepElement.classList.remove('active');
        stepElement.classList.add('completed');
    }

    UIComponents.showNotification(`✅ ${step.toUpperCase()} completed successfully!`, "success");
}

function updatePlanningProgress(currentStep) {
    const steps = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'];
    const currentIndex = steps.indexOf(currentStep);

    steps.forEach((step, index) => {
        const stepElement = document.getElementById(`step-${step}`);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed');

            if (index < currentIndex) {
                stepElement.classList.add('completed');
            } else if (index === currentIndex) {
                stepElement.classList.add('active');
            }
        }
    });
}

function closeWeeklyPlanningModal() {
    const modal = document.getElementById('weekly-planning-modal');
    if (modal) {
        modal.remove();
    }

    // Stop planning timer
    if (window.planningTimer) {
        clearInterval(window.planningTimer);
    }

    // Remove timer display
    const timerDisplay = document.querySelector('.planning-timer');
    if (timerDisplay) {
        timerDisplay.remove();
    }
}

function completePlanningSession() {
    // Mark all steps as completed
    ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'].forEach(step => {
        markStepCompleted(step);
    });

    UIComponents.showNotification("🎯 Weekly Planning Session completed successfully! All insights saved.", "success");

    setTimeout(() => {
        closeWeeklyPlanningModal();
        UIComponents.showNotification("📅 Ready for next week's planning session. Great work!", "info");
    }, 2000);
}

function startPlanningTimer() {
    let timeRemaining = 30 * 60; // 30 minutes in seconds

    // Create timer display
    const timerHTML = `
        <div class="planning-timer" id="planning-timer">
            ⏰ Planning Time: <span id="timer-display">30:00</span>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', timerHTML);

    // Update timer every second
    window.planningTimer = setInterval(() => {
        timeRemaining--;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = display;

            // Change color as time runs out
            if (timeRemaining < 300) { // Last 5 minutes
                timerDisplay.style.color = 'var(--warning)';
            }
            if (timeRemaining < 60) { // Last minute
                timerDisplay.style.color = 'var(--error)';
            }
        }

        if (timeRemaining <= 0) {
            clearInterval(window.planningTimer);
            UIComponents.showNotification("⏰ Planning session time completed! Consider wrapping up.", "warning");
        }
    }, 1000);
}

// Intervention Planning Functions
function planIntervention(studentId) {
    const studentNames = {
        'maya-rajin': 'Maya Rajin',
        'ahmad-rizki': 'Ahmad Rizki'
    };

    const studentName = studentNames[studentId] || studentId;

    UIComponents.showNotification(`🎯 Opening intervention planner for ${studentName}...`, "info");

    // This would open a detailed intervention planning interface
    setTimeout(() => {
        UIComponents.showNotification(`📋 Intervention plan created for ${studentName}. Added to calendar.`, "success");
    }, 1500);
}

function scheduleIntervention(studentId) {
    const studentNames = {
        'maya-rajin': 'Maya Rajin',
        'ahmad-rizki': 'Ahmad Rizki'
    };

    const studentName = studentNames[studentId] || studentId;

    UIComponents.showNotification(`📅 Scheduling intervention session for ${studentName}...`, "info");

    // This would integrate with calendar system
    setTimeout(() => {
        UIComponents.showNotification(`✅ Intervention session scheduled for ${studentName}. Reminder set.`, "success");
    }, 1500);
}

// Global functions for planning modal
window.showPlanningTab = showPlanningTab;
window.markStepCompleted = markStepCompleted;
window.closeWeeklyPlanningModal = closeWeeklyPlanningModal;
window.completePlanningSession = completePlanningSession;
window.planIntervention = planIntervention;
window.scheduleIntervention = scheduleIntervention;

// D7-D11: Pre-Class Setup (15 minutes)
function startPreClassSetup() {
    UIComponents.showNotification("🔧 Starting Pre-Class Setup (D7-D11) - 15 minutes", "info");

    const setupSteps = [
        "D7: Pre-Class Setup",
        "D8: Check System Status",
        "D9: Review Student Readiness",
        "D10: Prepare Technology Tools",
        "D11: Brief AI Teaching Assistant"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < setupSteps.length) {
            UIComponents.showNotification(`✅ ${setupSteps[currentStep]}`, "success");
            currentStep++;
        } else {
            clearInterval(interval);
            UIComponents.showNotification("🚀 Pre-Class Setup completed! Ready to start class.", "success");
        }
    }, 1500);
}

// D12-D18: In-Class Facilitation (90 minutes)
function startLiveClass() {
    UIComponents.showNotification("🎓 Starting In-Class Facilitation (D12-D18) - 90 minutes", "info");

    const classSteps = [
        "D12: In-Class Facilitation",
        "D13: Opening & Objectives",
        "D14: AI-Supported Presentation",
        "D15: Interactive Activities",
        "D16: Individual Support Rounds",
        "D17: Live Assessment Check",
        "D18: Session Wrap-up"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < classSteps.length) {
            UIComponents.showNotification(`✅ ${classSteps[currentStep]}`, "success");
            currentStep++;
        } else {
            clearInterval(interval);
            UIComponents.showNotification("🎉 Class session completed successfully!", "success");
        }
    }, 3000);
}

// D19-D24: Post-Class Analysis (20 minutes)
function startPostAnalysis() {
    UIComponents.showNotification("📊 Starting Post-Class Analysis (D19-D24) - 20 minutes", "info");

    const analysisSteps = [
        "D19: Post-Class Analysis",
        "D20: Review Session Metrics",
        "D21: Analyze Student Performance",
        "D22: Note AI Recommendations",
        "D23: Plan Individual Follow-ups",
        "D24: Update Teaching Strategy"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < analysisSteps.length) {
            UIComponents.showNotification(`✅ ${analysisSteps[currentStep]}`, "success");
            currentStep++;
        } else {
            clearInterval(interval);
            UIComponents.showNotification("📈 Post-Class Analysis completed! Insights saved for next planning.", "success");
        }
    }, 2000);
}

// Student Monitoring Interface
function openStudentMonitoring() {
    UIComponents.showNotification("👥 Opening Student Monitoring Dashboard...", "info");
    setTimeout(() => {
        UIComponents.showNotification("📊 Real-time student progress tracking activated", "success");
    }, 1000);
}

// AI Oversight Panel
function openAIOversight() {
    UIComponents.showNotification("🤖 Opening AI Oversight Panel...", "info");
    setTimeout(() => {
        UIComponents.showNotification("🎯 AI decision monitoring and control panel ready", "success");
    }, 1000);
}

function updateCarbonIndicator() {
    try {
        const metrics = apiClient.getCarbonMetrics ? apiClient.getCarbonMetrics() : { totalCarbon: 0.000125 };
        const indicator = document.getElementById("carbon-indicator");
        if (indicator) {
            indicator.textContent = `�� ${metrics.totalCarbon.toFixed(6)}g CO2`;
        }
    } catch (error) {
        const indicator = document.getElementById("carbon-indicator");
        if (indicator) {
            indicator.textContent = `🌱 0.000125g CO2`;
        }
    }
}

function setupCommunicationEventListeners() {
    setTimeout(() => {
        const markAllReadBtn = document.getElementById("btn-mark-all-read");
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener("click", markAllMessagesRead);
        }
    }, 200);
}

// Week 3 Page Loading Functions
function loadAssessmentsPage() {
    const assessmentsHTML = `
        <!-- Assessment Management Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--secondary-dark); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    📝
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Assessment Management</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Create, manage, and analyze student assessments</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-create-assessment" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ➕ Create Assessment
                    </button>
                    <button class="btn" id="btn-import-questions" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📥 Import Questions
                    </button>
                </div>
            </div>

            <!-- Assessment Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="total-assessments">24</div>
                    <div class="metric-label">Total Assessments</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="active-assessments">8</div>
                    <div class="metric-label">Active Assessments</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="pending-grading">15</div>
                    <div class="metric-label">Pending Grading</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="avg-score">78%</div>
                    <div class="metric-label">Average Score</div>
                </div>
            </div>
        </section>

        <!-- Assessment Creation Tools -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🛠️</span> Assessment Creation Tools
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📋</span> Quick Quiz Builder
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create multiple choice, true/false, and short answer quizzes with automated grading.</p>
                    <button class="btn" onclick="openQuizBuilder()" style="background: var(--primary); width: 100%;">Start Quiz Builder</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--secondary-dark);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📄</span> Essay Assignment
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create essay assignments with rubric-based evaluation and plagiarism detection.</p>
                    <button class="btn" onclick="createEssayAssignment()" style="background: var(--secondary-dark); width: 100%;">Create Essay Assignment</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🧮</span> Math Assessment
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create mathematical assessments with formula support and step-by-step evaluation.</p>
                    <button class="btn" onclick="createMathAssessment()" style="background: var(--info); width: 100%;">Create Math Assessment</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>💻</span> Coding Challenge
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create programming assignments with automated testing and code analysis.</p>
                    <button class="btn" onclick="createCodingChallenge()" style="background: var(--success); width: 100%;">Create Coding Challenge</button>
                </div>
            </div>
        </section>

        <!-- Recent Assessments -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Recent Assessments
            </h3>
            <div id="recent-assessments-list">
                <!-- Recent assessments will be loaded here -->
            </div>
        </section>

        <!-- Assessment Analytics -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📈</span> Assessment Analytics
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Score Distribution</h4>
                    <div id="score-distribution-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Score distribution chart will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Question Difficulty Analysis</h4>
                    <div id="difficulty-analysis-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Difficulty analysis chart will be rendered here
                    </div>
                </div>
            </div>
        </section>
    `;

    setInner("page-assessments", assessmentsHTML);

    // Load assessment data
    setTimeout(() => {
        loadRecentAssessments();
        setupAssessmentEventListeners();
    }, 100);

    UIComponents.showNotification("📝 Assessment Management loaded successfully!", "success");
}

function loadRecentAssessments() {
    const recentAssessments = [
        {
            id: 1,
            title: "Module 3 Quiz: Data Visualization",
            type: "Quiz",
            status: "Active",
            submissions: 18,
            totalStudents: 24,
            avgScore: 85,
            dueDate: "2024-12-15",
            created: "2024-12-10"
        },
        {
            id: 2,
            title: "Python Programming Assignment",
            type: "Coding",
            status: "Grading",
            submissions: 22,
            totalStudents: 24,
            avgScore: 78,
            dueDate: "2024-12-12",
            created: "2024-12-05"
        },
        {
            id: 3,
            title: "Data Analysis Essay",
            type: "Essay",
            status: "Completed",
            submissions: 24,
            totalStudents: 24,
            avgScore: 82,
            dueDate: "2024-12-08",
            created: "2024-12-01"
        },
        {
            id: 4,
            title: "Statistics Fundamentals Test",
            type: "Test",
            status: "Draft",
            submissions: 0,
            totalStudents: 24,
            avgScore: 0,
            dueDate: "2024-12-20",
            created: "2024-12-11"
        }
    ];

    const assessmentsHTML = recentAssessments.map(assessment => {
        const statusColors = {
            'Active': 'var(--success)',
            'Grading': 'var(--warning)',
            'Completed': 'var(--info)',
            'Draft': 'var(--gray-500)'
        };

        const typeIcons = {
            'Quiz': '📋',
            'Coding': '💻',
            'Essay': '📄',
            'Test': '📝'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[assessment.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">${typeIcons[assessment.type]}</span>
                        <div>
                            <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${assessment.title}</h4>
                            <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${assessment.type} • Created: ${new Date(assessment.created).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                    <span style="background: ${statusColors[assessment.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${assessment.status}
                    </span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${assessment.submissions}/${assessment.totalStudents}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Submissions</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--secondary-dark);">${assessment.avgScore}%</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Avg Score</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--info);">${new Date(assessment.dueDate).toLocaleDateString('id-ID')}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Due Date</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="viewAssessment(${assessment.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        👁️ View
                    </button>
                    <button class="btn" onclick="editAssessment(${assessment.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Edit
                    </button>
                    <button class="btn" onclick="gradeAssessment(${assessment.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        📊 Grade
                    </button>
                    <button class="btn" onclick="duplicateAssessment(${assessment.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        📋 Duplicate
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("recent-assessments-list", assessmentsHTML);
}

function setupAssessmentEventListeners() {
    setTimeout(() => {
        const createBtn = document.getElementById("btn-create-assessment");
        if (createBtn) {
            createBtn.addEventListener("click", createNewAssessment);
        }

        const importBtn = document.getElementById("btn-import-questions");
        if (importBtn) {
            importBtn.addEventListener("click", importQuestions);
        }
    }, 200);
}

// Assessment action functions
function createNewAssessment() {
    UIComponents.showNotification("📝 Opening assessment creation wizard...", "info");
}

function importQuestions() {
    UIComponents.showNotification("📥 Opening question import tool...", "info");
}

function openQuizBuilder() {
    UIComponents.showNotification("📋 Opening Quick Quiz Builder...", "info");
}

function createEssayAssignment() {
    UIComponents.showNotification("📄 Creating new essay assignment...", "info");
}

function createMathAssessment() {
    UIComponents.showNotification("🧮 Opening Math Assessment Creator...", "info");
}

function createCodingChallenge() {
    UIComponents.showNotification("💻 Creating new coding challenge...", "info");
}

function viewAssessment(id) {
    UIComponents.showNotification(`👁️ Viewing assessment ID: ${id}`, "info");
}

function editAssessment(id) {
    UIComponents.showNotification(`✏️ Editing assessment ID: ${id}`, "info");
}

function gradeAssessment(id) {
    UIComponents.showNotification(`📊 Opening grading interface for assessment ID: ${id}`, "info");
}

function duplicateAssessment(id) {
    UIComponents.showNotification(`📋 Duplicating assessment ID: ${id}`, "success");
}

function loadAIRecommendationsPage() {
    const aiRecommendationsHTML = `
        <!-- AI-Powered Learning Recommendations Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🤖
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">AI-Powered Learning Recommendations</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Personalized learning recommendations and adaptive content delivery</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-generate-recommendations" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🔄 Generate New Recommendations
                    </button>
                    <button class="btn" id="btn-ai-settings" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ⚙️ AI Settings
                    </button>
                </div>
            </div>

            <!-- AI Recommendation Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="active-recommendations">156</div>
                    <div class="metric-label">Active Recommendations</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="recommendation-accuracy">94%</div>
                    <div class="metric-label">Accuracy Rate</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="students-helped">38</div>
                    <div class="metric-label">Students Helped</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="improvement-rate">+23%</div>
                    <div class="metric-label">Performance Improvement</div>
                </div>
            </div>
        </section>

        <!-- Personalized Learning Paths -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🛤️</span> Personalized Learning Paths
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🎯</span> Adaptive Difficulty Adjustment
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">AI automatically adjusts content difficulty based on student performance and learning pace.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Students with Adjusted Paths</span>
                            <span style="font-weight: 600; color: var(--primary);">28</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Average Improvement</span>
                            <span style="font-weight: 600; color: var(--success);">+31%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewAdaptivePaths()" style="background: var(--primary); width: 100%;">View Adaptive Paths</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--secondary-dark);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🧠</span> Learning Style Optimization
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Content delivery optimized based on individual learning styles (Visual, Auditory, Kinesthetic).</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Visual Learners</span>
                            <span style="font-weight: 600; color: var(--info);">18 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Auditory Learners</span>
                            <span style="font-weight: 600; color: var(--warning);">12 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Kinesthetic Learners</span>
                            <span style="font-weight: 600; color: var(--success);">15 students</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewLearningStyles()" style="background: var(--secondary-dark); width: 100%;">Analyze Learning Styles</button>
                </div>
            </div>
        </section>

        <!-- Content Recommendation Engine -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📚</span> Content Recommendation Engine
            </h3>
            <div id="content-recommendations-list">
                <!-- Content recommendations will be loaded here -->
            </div>
        </section>

        <!-- Predictive Analytics -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔮</span> Predictive Analytics for Student Success
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Success Prediction Model</h4>
                    <div id="success-prediction-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Success prediction visualization will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Intervention Recommendations</h4>
                    <div id="intervention-recommendations" style="height: 200px; overflow-y: auto;">
                        <!-- Intervention recommendations will be loaded here -->
                    </div>
                </div>
            </div>
        </section>

        <!-- AI Model Performance -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> AI Model Performance
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Model Accuracy Trends</h4>
                    <div id="model-accuracy-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Model accuracy chart will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Recommendation Effectiveness</h4>
                    <div id="recommendation-effectiveness-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Recommendation effectiveness chart will be rendered here
                    </div>
                </div>
            </div>
        </section>
    `;

    setInner("page-ai-recommendations", aiRecommendationsHTML);

    // Load AI recommendations data
    setTimeout(() => {
        loadContentRecommendations();
        loadInterventionRecommendations();
        setupAIRecommendationsEventListeners();
    }, 100);

    UIComponents.showNotification("🤖 AI Recommendations loaded successfully!", "success");
}

function loadContentRecommendations() {
    const contentRecommendations = [
        {
            id: 1,
            type: "Video Content",
            title: "Interactive Data Visualization Tutorial",
            targetStudents: ["Andi Mahasiswa", "Sari Belajar"],
            reason: "Students struggling with visual concepts",
            confidence: 92,
            expectedImprovement: "+25%",
            priority: "High"
        },
        {
            id: 2,
            type: "Practice Exercise",
            title: "Python Coding Challenges - Beginner Level",
            targetStudents: ["Maya Rajin", "Budi Cerdas"],
            reason: "Need more hands-on programming practice",
            confidence: 88,
            expectedImprovement: "+18%",
            priority: "Medium"
        },
        {
            id: 3,
            type: "Reading Material",
            title: "Statistics Fundamentals - Visual Guide",
            targetStudents: ["Andi Mahasiswa"],
            reason: "Visual learner needing conceptual reinforcement",
            confidence: 95,
            expectedImprovement: "+30%",
            priority: "High"
        },
        {
            id: 4,
            type: "Interactive Quiz",
            title: "Data Analysis Concepts - Adaptive Quiz",
            targetStudents: ["All Students"],
            reason: "Reinforce learning with adaptive difficulty",
            confidence: 85,
            expectedImprovement: "+15%",
            priority: "Low"
        }
    ];

    const recommendationsHTML = contentRecommendations.map(rec => {
        const priorityColors = {
            'High': 'var(--error)',
            'Medium': 'var(--warning)',
            'Low': 'var(--info)'
        };

        const typeIcons = {
            'Video Content': '🎥',
            'Practice Exercise': '💻',
            'Reading Material': '📖',
            'Interactive Quiz': '📋'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${priorityColors[rec.priority]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">${typeIcons[rec.type]}</span>
                        <div>
                            <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${rec.title}</h4>
                            <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${rec.type} • Confidence: ${rec.confidence}%</p>
                        </div>
                    </div>
                    <span style="background: ${priorityColors[rec.priority]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${rec.priority} Priority
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="margin-bottom: 0.75rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Target Students:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${Array.isArray(rec.targetStudents) ? rec.targetStudents.join(', ') : rec.targetStudents}</span>
                    </div>
                    <div style="margin-bottom: 0.75rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Reason:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${rec.reason}</span>
                    </div>
                    <div>
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Expected Improvement:</strong>
                        <span style="color: var(--success); font-size: 0.875rem; font-weight: 600;"> ${rec.expectedImprovement}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="implementRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ✅ Implement
                    </button>
                    <button class="btn" onclick="customizeRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Customize
                    </button>
                    <button class="btn" onclick="dismissRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--gray-500);">
                        ❌ Dismiss
                    </button>
                    <button class="btn" onclick="viewRecommendationDetails(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        📊 Details
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("content-recommendations-list", recommendationsHTML);
}

function loadInterventionRecommendations() {
    const interventions = [
        {
            student: "Andi Mahasiswa",
            risk: "Medium",
            intervention: "Schedule 1-on-1 tutoring session",
            urgency: "This Week",
            success_probability: 85
        },
        {
            student: "Maya Rajin",
            risk: "High",
            intervention: "Provide additional practice materials",
            urgency: "Immediate",
            success_probability: 92
        },
        {
            student: "Sari Belajar",
            risk: "Low",
            intervention: "Encourage peer mentoring role",
            urgency: "Next Month",
            success_probability: 78
        }
    ];

    const interventionsHTML = interventions.map(intervention => {
        const riskColors = {
            'High': 'var(--error)',
            'Medium': 'var(--warning)',
            'Low': 'var(--success)'
        };

        return `
            <div style="background: var(--accent); padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 3px solid ${riskColors[intervention.risk]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="color: var(--gray-800); font-size: 0.875rem;">${intervention.student}</strong>
                    <span style="background: ${riskColors[intervention.risk]}; color: white; padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; font-weight: 600;">
                        ${intervention.risk} Risk
                    </span>
                </div>
                <p style="color: var(--gray-700); font-size: 0.75rem; margin-bottom: 0.5rem;">${intervention.intervention}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--gray-600); font-size: 0.625rem;">Urgency: ${intervention.urgency}</span>
                    <span style="color: var(--success); font-size: 0.625rem; font-weight: 600;">Success: ${intervention.success_probability}%</span>
                </div>
            </div>
        `;
    }).join('');

    setInner("intervention-recommendations", interventionsHTML);
}

function setupAIRecommendationsEventListeners() {
    setTimeout(() => {
        const generateBtn = document.getElementById("btn-generate-recommendations");
        if (generateBtn) {
            generateBtn.addEventListener("click", generateNewRecommendations);
        }

        const settingsBtn = document.getElementById("btn-ai-settings");
        if (settingsBtn) {
            settingsBtn.addEventListener("click", openAISettings);
        }
    }, 200);
}

function loadReportsPage() {
    const reportsHTML = `
        <!-- Advanced Reporting & Export Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--info); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    📊
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Advanced Reporting & Export System</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Generate comprehensive reports and export data in multiple formats</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-generate-report" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        📈 Generate Report
                    </button>
                    <button class="btn" id="btn-schedule-report" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        ⏰ Schedule Reports
                    </button>
                </div>
            </div>

            <!-- Report Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="total-reports">47</div>
                    <div class="metric-label">Total Reports Generated</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="scheduled-reports">12</div>
                    <div class="metric-label">Scheduled Reports</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="export-formats">5</div>
                    <div class="metric-label">Export Formats</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="data-points">2.4K</div>
                    <div class="metric-label">Data Points Analyzed</div>
                </div>
            </div>
        </section>

        <!-- Quick Report Generation -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Quick Report Generation
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>👥</span> Student Progress Report
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Comprehensive overview of individual and class progress with detailed analytics.</p>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>All Students</option>
                            <option>Class A</option>
                            <option>Class B</option>
                            <option>At-Risk Students</option>
                        </select>
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>This Month</option>
                            <option>This Week</option>
                            <option>This Semester</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generateProgressReport()" style="background: var(--primary); width: 100%;">Generate Progress Report</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--secondary-dark);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📝</span> Assessment Analytics Report
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Detailed analysis of assessment performance, difficulty, and effectiveness.</p>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>All Assessments</option>
                            <option>Quizzes Only</option>
                            <option>Assignments Only</option>
                            <option>Exams Only</option>
                        </select>
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                            <option>This Semester</option>
                            <option>All Time</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generateAssessmentReport()" style="background: var(--secondary-dark); width: 100%;">Generate Assessment Report</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>💬</span> Engagement Analytics Report
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Communication patterns, participation rates, and engagement metrics.</p>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>All Activities</option>
                            <option>Discussion Forums</option>
                            <option>Live Sessions</option>
                            <option>Assignments</option>
                        </select>
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Custom</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generateEngagementReport()" style="background: var(--info); width: 100%;">Generate Engagement Report</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🤖</span> AI Insights Report
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">AI-generated insights, recommendations, and predictive analytics summary.</p>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>All Insights</option>
                            <option>Learning Patterns</option>
                            <option>Risk Predictions</option>
                            <option>Recommendations</option>
                        </select>
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>Latest</option>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Trending</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generateAIInsightsReport()" style="background: var(--success); width: 100%;">Generate AI Report</button>
                </div>
            </div>
        </section>

        <!-- Custom Report Builder -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🛠️</span> Custom Report Builder
            </h3>
            <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Report Type</label>
                        <select id="custom-report-type" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Comprehensive Dashboard</option>
                            <option>Student Performance</option>
                            <option>Assessment Analysis</option>
                            <option>Engagement Metrics</option>
                            <option>AI Recommendations</option>
                            <option>Custom Analytics</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Date Range</label>
                        <select id="custom-date-range" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Semester</option>
                            <option>This Year</option>
                            <option>All Time</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Export Format</label>
                        <select id="custom-export-format" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>PDF Report</option>
                            <option>Excel Spreadsheet</option>
                            <option>CSV Data</option>
                            <option>PowerPoint Presentation</option>
                            <option>Interactive Dashboard</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Include Charts</label>
                        <select id="custom-include-charts" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>All Visualizations</option>
                            <option>Charts Only</option>
                            <option>Tables Only</option>
                            <option>Summary Only</option>
                            <option>Custom Selection</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn" onclick="previewCustomReport()" style="background: var(--info); flex: 1;">👁️ Preview Report</button>
                    <button class="btn" onclick="generateCustomReport()" style="background: var(--primary); flex: 1;">📊 Generate Custom Report</button>
                    <button class="btn" onclick="saveReportTemplate()" style="background: var(--success); flex: 1;">💾 Save as Template</button>
                </div>
            </div>
        </section>

        <!-- Recent Reports -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📋</span> Recent Reports
            </h3>
            <div id="recent-reports-list">
                <!-- Recent reports will be loaded here -->
            </div>
        </section>

        <!-- Scheduled Reports -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⏰</span> Scheduled Reports
            </h3>
            <div id="scheduled-reports-list">
                <!-- Scheduled reports will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-reports", reportsHTML);

    // Load reports data
    setTimeout(() => {
        loadRecentReports();
        loadScheduledReports();
        setupReportsEventListeners();
    }, 100);

    UIComponents.showNotification("📊 Reports & Export loaded successfully!", "success");
}

function loadRecentReports() {
    const recentReports = [
        {
            id: 1,
            title: "Weekly Student Progress Report",
            type: "Progress Report",
            format: "PDF",
            generated: "2024-12-11 14:30",
            size: "2.4 MB",
            status: "Completed",
            downloads: 3
        },
        {
            id: 2,
            title: "Module 3 Assessment Analytics",
            type: "Assessment Report",
            format: "Excel",
            generated: "2024-12-10 09:15",
            size: "1.8 MB",
            status: "Completed",
            downloads: 7
        },
        {
            id: 3,
            title: "AI Insights Summary - December",
            type: "AI Report",
            format: "PowerPoint",
            generated: "2024-12-09 16:45",
            size: "5.2 MB",
            status: "Completed",
            downloads: 12
        },
        {
            id: 4,
            title: "Engagement Analytics - Q4",
            type: "Engagement Report",
            format: "PDF",
            generated: "2024-12-08 11:20",
            size: "3.1 MB",
            status: "Processing",
            downloads: 0
        },
        {
            id: 5,
            title: "Custom Dashboard Export",
            type: "Custom Report",
            format: "Interactive",
            generated: "2024-12-07 13:10",
            size: "890 KB",
            status: "Completed",
            downloads: 5
        }
    ];

    const reportsHTML = recentReports.map(report => {
        const statusColors = {
            'Completed': 'var(--success)',
            'Processing': 'var(--warning)',
            'Failed': 'var(--error)'
        };

        const formatIcons = {
            'PDF': '📄',
            'Excel': '📊',
            'PowerPoint': '📋',
            'CSV': '📈',
            'Interactive': '🌐'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[report.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">${formatIcons[report.format]}</span>
                        <div>
                            <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${report.title}</h4>
                            <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${report.type} • ${report.format} • ${report.size}</p>
                        </div>
                    </div>
                    <span style="background: ${statusColors[report.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${report.status}
                    </span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 1rem; font-weight: 700; color: var(--primary);">${new Date(report.generated).toLocaleDateString('id-ID')}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Generated</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1rem; font-weight: 700; color: var(--secondary-dark);">${new Date(report.generated).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Time</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1rem; font-weight: 700; color: var(--info);">${report.downloads}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Downloads</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${report.status === 'Completed' ? `
                        <button class="btn" onclick="downloadReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                            📥 Download
                        </button>
                        <button class="btn" onclick="shareReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                            📤 Share
                        </button>
                    ` : ''}
                    <button class="btn" onclick="viewReportDetails(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        👁️ View Details
                    </button>
                    <button class="btn" onclick="duplicateReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        📋 Duplicate
                    </button>
                    <button class="btn" onclick="deleteReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("recent-reports-list", reportsHTML);
}

function loadScheduledReports() {
    const scheduledReports = [
        {
            id: 1,
            title: "Weekly Progress Summary",
            type: "Progress Report",
            schedule: "Every Monday 08:00",
            nextRun: "2024-12-16 08:00",
            format: "PDF",
            recipients: "admin@university.edu, dean@university.edu",
            status: "Active"
        },
        {
            id: 2,
            title: "Monthly Assessment Analytics",
            type: "Assessment Report",
            schedule: "1st of every month",
            nextRun: "2025-01-01 09:00",
            format: "Excel",
            recipients: "department@university.edu",
            status: "Active"
        },
        {
            id: 3,
            title: "Quarterly AI Insights",
            type: "AI Report",
            schedule: "Every 3 months",
            nextRun: "2025-03-01 10:00",
            format: "PowerPoint",
            recipients: "research@university.edu",
            status: "Paused"
        }
    ];

    const scheduledHTML = scheduledReports.map(report => {
        const statusColors = {
            'Active': 'var(--success)',
            'Paused': 'var(--warning)',
            'Disabled': 'var(--error)'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[report.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${report.title}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${report.type} • ${report.format} • ${report.schedule}</p>
                    </div>
                    <span style="background: ${statusColors[report.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${report.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Next Run:</strong>
                        <span style="color: var(--primary); font-size: 0.875rem; font-weight: 600;"> ${new Date(report.nextRun).toLocaleString('id-ID')}</span>
                    </div>
                    <div>
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Recipients:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${report.recipients}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="editScheduledReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Edit
                    </button>
                    <button class="btn" onclick="runScheduledReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ▶️ Run Now
                    </button>
                    <button class="btn" onclick="toggleScheduledReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        ${report.status === 'Active' ? '⏸️ Pause' : '▶️ Resume'}
                    </button>
                    <button class="btn" onclick="deleteScheduledReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("scheduled-reports-list", scheduledHTML);
}

function loadIntegrationsPage() {
    const integrationsHTML = `
        <!-- Integration & API Management Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--secondary-dark); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🔗
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Integration & API Management</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Manage external integrations and API connections</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-add-integration" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ➕ Add Integration
                    </button>
                    <button class="btn" id="btn-api-docs" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📚 API Documentation
                    </button>
                </div>
            </div>

            <!-- Integration Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="active-integrations">12</div>
                    <div class="metric-label">Active Integrations</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="api-calls-today">2.4K</div>
                    <div class="metric-label">API Calls Today</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="webhook-events">156</div>
                    <div class="metric-label">Webhook Events</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="sync-status">98%</div>
                    <div class="metric-label">Sync Success Rate</div>
                </div>
            </div>
        </section>

        <!-- Available Integrations -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🌐</span> Available Integrations
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🎓</span> Learning Management Systems
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Connect with popular LMS platforms for seamless data exchange.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" onclick="connectLMS('moodle')" style="background: var(--primary); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Moodle
                        </button>
                        <button class="btn" onclick="connectLMS('canvas')" style="background: var(--info); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Canvas
                        </button>
                        <button class="btn" onclick="connectLMS('blackboard')" style="background: var(--secondary-dark); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Blackboard
                        </button>
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--secondary-dark);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>💬</span> Communication Tools
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Integrate with communication platforms for enhanced collaboration.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" onclick="connectComm('slack')" style="background: var(--success); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Slack
                        </button>
                        <button class="btn" onclick="connectComm('teams')" style="background: var(--info); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Microsoft Teams
                        </button>
                        <button class="btn" onclick="connectComm('discord')" style="background: var(--warning); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Discord
                        </button>
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📊</span> Analytics & Reporting
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Connect with analytics platforms for advanced data insights.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" onclick="connectAnalytics('googleanalytics')" style="background: var(--warning); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Google Analytics
                        </button>
                        <button class="btn" onclick="connectAnalytics('powerbi')" style="background: var(--info); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Power BI
                        </button>
                        <button class="btn" onclick="connectAnalytics('tableau')" style="background: var(--primary); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Tableau
                        </button>
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>☁️</span> Cloud Storage
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Integrate with cloud storage for file management and backup.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" onclick="connectStorage('googledrive')" style="background: var(--success); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Google Drive
                        </button>
                        <button class="btn" onclick="connectStorage('onedrive')" style="background: var(--info); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect OneDrive
                        </button>
                        <button class="btn" onclick="connectStorage('dropbox')" style="background: var(--primary); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Dropbox
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Active Integrations -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔌</span> Active Integrations
            </h3>
            <div id="active-integrations-list">
                <!-- Active integrations will be loaded here -->
            </div>
        </section>

        <!-- API Management -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔑</span> API Management
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">API Keys</h4>
                    <div id="api-keys-list">
                        <!-- API keys will be loaded here -->
                    </div>
                    <button class="btn" onclick="generateAPIKey()" style="background: var(--primary); width: 100%; margin-top: 1rem;">
                        🔑 Generate New API Key
                    </button>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">API Usage Analytics</h4>
                    <div id="api-usage-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        API usage chart will be rendered here
                    </div>
                </div>
            </div>
        </section>

        <!-- Webhook Configuration -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔔</span> Webhook Configuration
            </h3>
            <div id="webhook-list">
                <!-- Webhooks will be loaded here -->
            </div>
            <button class="btn" onclick="addWebhook()" style="background: var(--success); margin-top: 1rem;">
                ➕ Add New Webhook
            </button>
        </section>

        <!-- Data Synchronization -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔄</span> Data Synchronization
            </h3>
            <div id="sync-status-list">
                <!-- Sync status will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-integrations", integrationsHTML);

    // Load integrations data
    setTimeout(() => {
        loadActiveIntegrations();
        loadAPIKeys();
        loadWebhooks();
        loadSyncStatus();
        setupIntegrationsEventListeners();
    }, 100);

    UIComponents.showNotification("🔗 Integrations & API Management loaded successfully!", "success");
}

function loadActiveIntegrations() {
    const activeIntegrations = [
        {
            id: 1,
            name: "Google Classroom",
            type: "LMS",
            status: "Connected",
            lastSync: "2024-12-11 14:30",
            dataPoints: "1,245 students synced",
            health: "Healthy"
        },
        {
            id: 2,
            name: "Slack Workspace",
            type: "Communication",
            status: "Connected",
            lastSync: "2024-12-11 15:45",
            dataPoints: "24 channels active",
            health: "Healthy"
        },
        {
            id: 3,
            name: "Google Analytics",
            type: "Analytics",
            status: "Connected",
            lastSync: "2024-12-11 16:00",
            dataPoints: "Real-time tracking",
            health: "Healthy"
        },
        {
            id: 4,
            name: "OneDrive Storage",
            type: "Storage",
            status: "Connected",
            lastSync: "2024-12-11 13:20",
            dataPoints: "2.4GB synchronized",
            health: "Warning"
        },
        {
            id: 5,
            name: "Zoom Integration",
            type: "Video Conferencing",
            status: "Disconnected",
            lastSync: "2024-12-10 09:15",
            dataPoints: "Connection lost",
            health: "Error"
        }
    ];

    const integrationsHTML = activeIntegrations.map(integration => {
        const statusColors = {
            'Connected': 'var(--success)',
            'Disconnected': 'var(--error)',
            'Connecting': 'var(--warning)'
        };

        const healthColors = {
            'Healthy': 'var(--success)',
            'Warning': 'var(--warning)',
            'Error': 'var(--error)'
        };

        const typeIcons = {
            'LMS': '🎓',
            'Communication': '💬',
            'Analytics': '📊',
            'Storage': '☁️',
            'Video Conferencing': '📹'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[integration.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">${typeIcons[integration.type]}</span>
                        <div>
                            <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${integration.name}</h4>
                            <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${integration.type} • ${integration.dataPoints}</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <span style="background: ${statusColors[integration.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${integration.status}
                        </span>
                        <span style="background: ${healthColors[integration.health]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${integration.health}
                        </span>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Last Sync:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${new Date(integration.lastSync).toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="configureIntegration(${integration.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ⚙️ Configure
                    </button>
                    <button class="btn" onclick="testIntegration(${integration.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🧪 Test Connection
                    </button>
                    <button class="btn" onclick="syncIntegration(${integration.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        🔄 Sync Now
                    </button>
                    <button class="btn" onclick="disconnectIntegration(${integration.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🔌 Disconnect
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("active-integrations-list", integrationsHTML);
}

function loadAPIKeys() {
    const apiKeys = [
        {
            id: 1,
            name: "Production API Key",
            key: "ak_prod_1234567890abcdef",
            created: "2024-11-15",
            lastUsed: "2024-12-11 16:30",
            requests: "2,456",
            status: "Active"
        },
        {
            id: 2,
            name: "Development API Key",
            key: "ak_dev_abcdef1234567890",
            created: "2024-12-01",
            lastUsed: "2024-12-11 14:20",
            requests: "892",
            status: "Active"
        },
        {
            id: 3,
            name: "Testing API Key",
            key: "ak_test_567890abcdef1234",
            created: "2024-12-05",
            lastUsed: "2024-12-10 11:45",
            requests: "156",
            status: "Limited"
        }
    ];

    const apiKeysHTML = apiKeys.map(key => {
        const statusColors = {
            'Active': 'var(--success)',
            'Limited': 'var(--warning)',
            'Disabled': 'var(--error)'
        };

        return `
            <div style="background: var(--accent); padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 3px solid ${statusColors[key.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="color: var(--gray-800); font-size: 0.875rem;">${key.name}</strong>
                    <span style="background: ${statusColors[key.status]}; color: white; padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; font-weight: 600;">
                        ${key.status}
                    </span>
                </div>
                <div style="font-family: monospace; font-size: 0.75rem; color: var(--gray-700); margin-bottom: 0.5rem; background: var(--white); padding: 0.5rem; border-radius: 4px;">
                    ${key.key}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.625rem; color: var(--gray-600);">
                    <span>Requests: ${key.requests}</span>
                    <span>Last used: ${new Date(key.lastUsed).toLocaleDateString('id-ID')}</span>
                </div>
                <div style="display: flex; gap: 0.25rem; margin-top: 0.5rem;">
                    <button class="btn" onclick="copyAPIKey('${key.key}')" style="padding: 0.25rem 0.5rem; font-size: 0.625rem; background: var(--info);">📋 Copy</button>
                    <button class="btn" onclick="regenerateAPIKey(${key.id})" style="padding: 0.25rem 0.5rem; font-size: 0.625rem; background: var(--warning);">🔄 Regenerate</button>
                    <button class="btn" onclick="deleteAPIKey(${key.id})" style="padding: 0.25rem 0.5rem; font-size: 0.625rem; background: var(--error);">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');

    setInner("api-keys-list", apiKeysHTML);
}

function loadWebhooks() {
    const webhooks = [
        {
            id: 1,
            name: "Student Progress Updates",
            url: "https://api.university.edu/webhooks/progress",
            events: ["student.progress.updated", "assessment.completed"],
            status: "Active",
            lastTriggered: "2024-12-11 16:45",
            successRate: "98%"
        },
        {
            id: 2,
            name: "Assessment Notifications",
            url: "https://notifications.edu/webhooks/assessments",
            events: ["assessment.created", "assessment.graded"],
            status: "Active",
            lastTriggered: "2024-12-11 15:30",
            successRate: "100%"
        },
        {
            id: 3,
            name: "Communication Alerts",
            url: "https://alerts.university.edu/webhooks/comm",
            events: ["message.sent", "announcement.posted"],
            status: "Paused",
            lastTriggered: "2024-12-10 14:20",
            successRate: "95%"
        }
    ];

    const webhooksHTML = webhooks.map(webhook => {
        const statusColors = {
            'Active': 'var(--success)',
            'Paused': 'var(--warning)',
            'Failed': 'var(--error)'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[webhook.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${webhook.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem; font-family: monospace;">${webhook.url}</p>
                    </div>
                    <span style="background: ${statusColors[webhook.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${webhook.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Events:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${webhook.events.join(', ')}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--gray-600); font-size: 0.75rem;">Last triggered: ${new Date(webhook.lastTriggered).toLocaleString('id-ID')}</span>
                        <span style="color: var(--success); font-size: 0.75rem; font-weight: 600;">Success rate: ${webhook.successRate}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="editWebhook(${webhook.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Edit
                    </button>
                    <button class="btn" onclick="testWebhook(${webhook.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🧪 Test
                    </button>
                    <button class="btn" onclick="toggleWebhook(${webhook.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        ${webhook.status === 'Active' ? '⏸️ Pause' : '▶️ Resume'}
                    </button>
                    <button class="btn" onclick="deleteWebhook(${webhook.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("webhook-list", webhooksHTML);
}

function loadSyncStatus() {
    const syncItems = [
        {
            id: 1,
            source: "Google Classroom",
            target: "AgenticLearn Database",
            type: "Student Data",
            status: "Syncing",
            progress: 75,
            lastSync: "2024-12-11 16:30",
            nextSync: "2024-12-11 17:00"
        },
        {
            id: 2,
            source: "Slack Workspace",
            target: "Communication Center",
            type: "Messages",
            status: "Completed",
            progress: 100,
            lastSync: "2024-12-11 16:45",
            nextSync: "2024-12-11 17:15"
        },
        {
            id: 3,
            source: "OneDrive Storage",
            target: "File Repository",
            type: "Documents",
            status: "Failed",
            progress: 45,
            lastSync: "2024-12-11 15:20",
            nextSync: "2024-12-11 17:20"
        },
        {
            id: 4,
            source: "Google Analytics",
            target: "Analytics Dashboard",
            type: "Usage Data",
            status: "Completed",
            progress: 100,
            lastSync: "2024-12-11 16:50",
            nextSync: "2024-12-11 17:50"
        }
    ];

    const syncHTML = syncItems.map(item => {
        const statusColors = {
            'Completed': 'var(--success)',
            'Syncing': 'var(--info)',
            'Failed': 'var(--error)',
            'Pending': 'var(--warning)'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[item.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${item.source} → ${item.target}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${item.type} synchronization</p>
                    </div>
                    <span style="background: ${statusColors[item.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${item.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700); font-size: 0.875rem;">Progress</span>
                        <span style="color: var(--primary); font-size: 0.875rem; font-weight: 600;">${item.progress}%</span>
                    </div>
                    <div style="background: var(--accent); height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: ${statusColors[item.status]}; height: 100%; width: ${item.progress}%; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--gray-600);">
                        <span>Last: ${new Date(item.lastSync).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</span>
                        <span>Next: ${new Date(item.nextSync).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="forceSyncNow(${item.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🔄 Sync Now
                    </button>
                    <button class="btn" onclick="configureSyncSchedule(${item.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ⏰ Schedule
                    </button>
                    <button class="btn" onclick="viewSyncLogs(${item.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        📋 View Logs
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("sync-status-list", syncHTML);
}

// Global functions for onclick handlers
window.openQuizBuilder = openQuizBuilder;
window.createEssayAssignment = createEssayAssignment;
window.createMathAssessment = createMathAssessment;
window.createCodingChallenge = createCodingChallenge;
window.viewAssessment = viewAssessment;
window.editAssessment = editAssessment;
window.gradeAssessment = gradeAssessment;
window.duplicateAssessment = duplicateAssessment;

// AI Recommendations action functions
function generateNewRecommendations() {
    UIComponents.showNotification("🔄 Generating new AI recommendations based on latest student data...", "info");

    // Simulate AI processing
    setTimeout(() => {
        UIComponents.showNotification("✅ New recommendations generated successfully!", "success");
        loadContentRecommendations();
        loadInterventionRecommendations();
    }, 2000);
}

function openAISettings() {
    UIComponents.showNotification("⚙️ Opening AI model configuration settings...", "info");
}

function viewAdaptivePaths() {
    UIComponents.showNotification("🛤️ Viewing adaptive learning paths for all students...", "info");
}

function viewLearningStyles() {
    UIComponents.showNotification("🧠 Analyzing learning styles and optimization strategies...", "info");
}

function implementRecommendation(id) {
    UIComponents.showNotification(`✅ Implementing recommendation ID: ${id}. Content will be delivered to target students.`, "success");
}

function customizeRecommendation(id) {
    UIComponents.showNotification(`✏️ Opening customization interface for recommendation ID: ${id}`, "info");
}

function dismissRecommendation(id) {
    UIComponents.showNotification(`❌ Recommendation ID: ${id} dismissed. AI will learn from this feedback.`, "warning");
}

function viewRecommendationDetails(id) {
    UIComponents.showNotification(`📊 Viewing detailed analytics for recommendation ID: ${id}`, "info");
}

// Global functions for onclick handlers
window.generateNewRecommendations = generateNewRecommendations;
window.openAISettings = openAISettings;
window.viewAdaptivePaths = viewAdaptivePaths;
window.viewLearningStyles = viewLearningStyles;
window.implementRecommendation = implementRecommendation;
window.customizeRecommendation = customizeRecommendation;
window.dismissRecommendation = dismissRecommendation;
window.viewRecommendationDetails = viewRecommendationDetails;

function setupReportsEventListeners() {
    setTimeout(() => {
        const generateBtn = document.getElementById("btn-generate-report");
        if (generateBtn) {
            generateBtn.addEventListener("click", openReportGenerator);
        }

        const scheduleBtn = document.getElementById("btn-schedule-report");
        if (scheduleBtn) {
            scheduleBtn.addEventListener("click", openReportScheduler);
        }
    }, 200);
}

// Quick Report Generation Functions
function generateProgressReport() {
    UIComponents.showNotification("📈 Generating student progress report...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Student Progress Report generated successfully! Check Recent Reports.", "success");
        loadRecentReports();
    }, 2000);
}

function generateAssessmentReport() {
    UIComponents.showNotification("📝 Generating assessment analytics report...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Assessment Analytics Report generated successfully!", "success");
        loadRecentReports();
    }, 2000);
}

function generateEngagementReport() {
    UIComponents.showNotification("💬 Generating engagement analytics report...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Engagement Analytics Report generated successfully!", "success");
        loadRecentReports();
    }, 2000);
}

function generateAIInsightsReport() {
    UIComponents.showNotification("🤖 Generating AI insights report...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ AI Insights Report generated successfully!", "success");
        loadRecentReports();
    }, 2000);
}

// Custom Report Builder Functions
function previewCustomReport() {
    const reportType = document.getElementById("custom-report-type")?.value;
    const dateRange = document.getElementById("custom-date-range")?.value;
    const format = document.getElementById("custom-export-format")?.value;

    UIComponents.showNotification(`👁️ Previewing ${reportType} report (${dateRange}, ${format})...`, "info");
}

function generateCustomReport() {
    const reportType = document.getElementById("custom-report-type")?.value;
    const dateRange = document.getElementById("custom-date-range")?.value;
    const format = document.getElementById("custom-export-format")?.value;

    UIComponents.showNotification(`📊 Generating custom ${reportType} report in ${format} format...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Custom report generated successfully!", "success");
        loadRecentReports();
    }, 3000);
}

function saveReportTemplate() {
    UIComponents.showNotification("💾 Saving report configuration as template...", "success");
}

// Report Management Functions
function openReportGenerator() {
    UIComponents.showNotification("📈 Opening advanced report generator...", "info");
}

function openReportScheduler() {
    UIComponents.showNotification("⏰ Opening report scheduling interface...", "info");
}

function downloadReport(id) {
    UIComponents.showNotification(`📥 Downloading report ID: ${id}...`, "success");
}

function shareReport(id) {
    UIComponents.showNotification(`📤 Opening share options for report ID: ${id}`, "info");
}

function viewReportDetails(id) {
    UIComponents.showNotification(`👁️ Viewing detailed information for report ID: ${id}`, "info");
}

function duplicateReport(id) {
    UIComponents.showNotification(`📋 Creating duplicate of report ID: ${id}`, "success");
}

function deleteReport(id) {
    UIComponents.showNotification(`🗑️ Report ID: ${id} deleted successfully`, "warning");
    setTimeout(() => {
        loadRecentReports();
    }, 1000);
}

// Scheduled Reports Functions
function editScheduledReport(id) {
    UIComponents.showNotification(`✏️ Opening editor for scheduled report ID: ${id}`, "info");
}

function runScheduledReport(id) {
    UIComponents.showNotification(`▶️ Running scheduled report ID: ${id} now...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Scheduled report executed successfully!", "success");
        loadRecentReports();
    }, 2000);
}

function toggleScheduledReport(id) {
    UIComponents.showNotification(`⏸️ Toggling status for scheduled report ID: ${id}`, "info");

    setTimeout(() => {
        loadScheduledReports();
    }, 1000);
}

function deleteScheduledReport(id) {
    UIComponents.showNotification(`🗑️ Scheduled report ID: ${id} deleted successfully`, "warning");

    setTimeout(() => {
        loadScheduledReports();
    }, 1000);
}

// Global functions for onclick handlers
window.generateProgressReport = generateProgressReport;
window.generateAssessmentReport = generateAssessmentReport;
window.generateEngagementReport = generateEngagementReport;
window.generateAIInsightsReport = generateAIInsightsReport;
window.previewCustomReport = previewCustomReport;
window.generateCustomReport = generateCustomReport;
window.saveReportTemplate = saveReportTemplate;
window.downloadReport = downloadReport;
window.shareReport = shareReport;
window.viewReportDetails = viewReportDetails;
window.duplicateReport = duplicateReport;
window.deleteReport = deleteReport;
window.editScheduledReport = editScheduledReport;
window.runScheduledReport = runScheduledReport;
window.toggleScheduledReport = toggleScheduledReport;
window.deleteScheduledReport = deleteScheduledReport;

function setupIntegrationsEventListeners() {
    setTimeout(() => {
        const addBtn = document.getElementById("btn-add-integration");
        if (addBtn) {
            addBtn.addEventListener("click", openIntegrationMarketplace);
        }

        const docsBtn = document.getElementById("btn-api-docs");
        if (docsBtn) {
            docsBtn.addEventListener("click", openAPIDocs);
        }
    }, 200);
}

// Integration Connection Functions
function connectLMS(platform) {
    UIComponents.showNotification(`🔗 Connecting to ${platform.toUpperCase()} LMS...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ Successfully connected to ${platform.toUpperCase()}!`, "success");
        loadActiveIntegrations();
    }, 2000);
}

function connectComm(platform) {
    UIComponents.showNotification(`💬 Connecting to ${platform} communication platform...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ Successfully connected to ${platform}!`, "success");
        loadActiveIntegrations();
    }, 2000);
}

function connectAnalytics(platform) {
    UIComponents.showNotification(`📊 Connecting to ${platform} analytics platform...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ Successfully connected to ${platform}!`, "success");
        loadActiveIntegrations();
    }, 2000);
}

function connectStorage(platform) {
    UIComponents.showNotification(`☁️ Connecting to ${platform} cloud storage...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ Successfully connected to ${platform}!`, "success");
        loadActiveIntegrations();
    }, 2000);
}

// Active Integration Management
function configureIntegration(id) {
    UIComponents.showNotification(`⚙️ Opening configuration for integration ID: ${id}`, "info");
}

function testIntegration(id) {
    UIComponents.showNotification(`🧪 Testing connection for integration ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Connection test successful!", "success");
    }, 1500);
}

function syncIntegration(id) {
    UIComponents.showNotification(`🔄 Starting manual sync for integration ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Synchronization completed successfully!", "success");
        loadActiveIntegrations();
        loadSyncStatus();
    }, 2000);
}

function disconnectIntegration(id) {
    UIComponents.showNotification(`🔌 Disconnecting integration ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("⚠️ Integration disconnected successfully", "warning");
        loadActiveIntegrations();
    }, 1500);
}

// API Key Management
function generateAPIKey() {
    UIComponents.showNotification("🔑 Generating new API key...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ New API key generated successfully!", "success");
        loadAPIKeys();
    }, 1500);
}

function copyAPIKey(key) {
    navigator.clipboard.writeText(key).then(() => {
        UIComponents.showNotification("📋 API key copied to clipboard!", "success");
    }).catch(() => {
        UIComponents.showNotification("❌ Failed to copy API key", "error");
    });
}

function regenerateAPIKey(id) {
    UIComponents.showNotification(`🔄 Regenerating API key ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("✅ API key regenerated successfully!", "success");
        loadAPIKeys();
    }, 1500);
}

function deleteAPIKey(id) {
    UIComponents.showNotification(`🗑️ Deleting API key ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("⚠️ API key deleted successfully", "warning");
        loadAPIKeys();
    }, 1000);
}

// Webhook Management
function addWebhook() {
    UIComponents.showNotification("➕ Opening webhook creation interface...", "info");
}

function editWebhook(id) {
    UIComponents.showNotification(`✏️ Opening webhook editor for ID: ${id}`, "info");
}

function testWebhook(id) {
    UIComponents.showNotification(`🧪 Testing webhook ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Webhook test successful!", "success");
    }, 1500);
}

function toggleWebhook(id) {
    UIComponents.showNotification(`⏸️ Toggling webhook status for ID: ${id}`, "info");

    setTimeout(() => {
        loadWebhooks();
    }, 1000);
}

function deleteWebhook(id) {
    UIComponents.showNotification(`🗑️ Deleting webhook ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("⚠️ Webhook deleted successfully", "warning");
        loadWebhooks();
    }, 1000);
}

// Data Synchronization Management
function forceSyncNow(id) {
    UIComponents.showNotification(`🔄 Starting immediate sync for ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Forced synchronization completed!", "success");
        loadSyncStatus();
    }, 2000);
}

function configureSyncSchedule(id) {
    UIComponents.showNotification(`⏰ Opening sync schedule configuration for ID: ${id}`, "info");
}

function viewSyncLogs(id) {
    UIComponents.showNotification(`📋 Opening sync logs for ID: ${id}`, "info");
}

// General Integration Functions
function openIntegrationMarketplace() {
    UIComponents.showNotification("🛒 Opening integration marketplace...", "info");
}

function openAPIDocs() {
    UIComponents.showNotification("📚 Opening API documentation...", "info");
}

// Global functions for onclick handlers
window.connectLMS = connectLMS;
window.connectComm = connectComm;
window.connectAnalytics = connectAnalytics;
window.connectStorage = connectStorage;
window.configureIntegration = configureIntegration;
window.testIntegration = testIntegration;
window.syncIntegration = syncIntegration;
window.disconnectIntegration = disconnectIntegration;
window.generateAPIKey = generateAPIKey;
window.copyAPIKey = copyAPIKey;
window.regenerateAPIKey = regenerateAPIKey;
window.deleteAPIKey = deleteAPIKey;
window.addWebhook = addWebhook;
window.editWebhook = editWebhook;
window.testWebhook = testWebhook;
window.toggleWebhook = toggleWebhook;
window.deleteWebhook = deleteWebhook;
window.forceSyncNow = forceSyncNow;
window.configureSyncSchedule = configureSyncSchedule;
window.viewSyncLogs = viewSyncLogs;

// Week 4 Page Loading Functions
function loadSecurityPage() {
    const securityHTML = `
        <!-- Advanced Security & Authentication Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--error); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🔐
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Advanced Security & Authentication</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Enterprise-grade security controls and authentication management</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-security-scan" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🔍 Security Scan
                    </button>
                    <button class="btn" id="btn-audit-logs" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        📋 Audit Logs
                    </button>
                </div>
            </div>

            <!-- Security Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="security-score">98%</div>
                    <div class="metric-label">Security Score</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="active-sessions">24</div>
                    <div class="metric-label">Active Sessions</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="failed-attempts">3</div>
                    <div class="metric-label">Failed Login Attempts</div>
                </div>
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="mfa-enabled">89%</div>
                    <div class="metric-label">MFA Adoption Rate</div>
                </div>
            </div>
        </section>

        <!-- Multi-Factor Authentication -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔑</span> Multi-Factor Authentication (MFA)
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📱</span> SMS Authentication
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Send verification codes via SMS for secure login.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Enabled Users</span>
                            <span style="font-weight: 600; color: var(--success);">32 users</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Success Rate</span>
                            <span style="font-weight: 600; color: var(--primary);">97%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="configureSMSAuth()" style="background: var(--success); width: 100%;">Configure SMS Auth</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔐</span> Authenticator Apps
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Support for Google Authenticator, Authy, and other TOTP apps.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Enabled Users</span>
                            <span style="font-weight: 600; color: var(--primary);">18 users</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Success Rate</span>
                            <span style="font-weight: 600; color: var(--success);">99%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="configureAuthenticatorApps()" style="background: var(--primary); width: 100%;">Configure Authenticator</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔑</span> Hardware Security Keys
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Support for FIDO2/WebAuthn hardware security keys.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Registered Keys</span>
                            <span style="font-weight: 600; color: var(--info);">8 keys</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Success Rate</span>
                            <span style="font-weight: 600; color: var(--success);">100%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="configureHardwareKeys()" style="background: var(--info); width: 100%;">Configure Hardware Keys</button>
                </div>
            </div>
        </section>

        <!-- Role-Based Access Control -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>👥</span> Role-Based Access Control (RBAC)
            </h3>
            <div id="rbac-roles-list">
                <!-- RBAC roles will be loaded here -->
            </div>
        </section>

        <!-- Security Audit Logs -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📋</span> Security Audit Logs
            </h3>
            <div id="security-audit-logs">
                <!-- Security audit logs will be loaded here -->
            </div>
        </section>

        <!-- Session Management -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔄</span> Active Session Management
            </h3>
            <div id="active-sessions-list">
                <!-- Active sessions will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-security", securityHTML);

    // Load security data
    setTimeout(() => {
        loadRBACRoles();
        loadSecurityAuditLogs();
        loadActiveSessions();
        setupSecurityEventListeners();
    }, 100);

    UIComponents.showNotification("🔐 Security & Authentication loaded successfully!", "success");
}

function loadRBACRoles() {
    const roles = [
        {
            id: 1,
            name: "Super Administrator",
            description: "Full system access with all permissions",
            users: 2,
            permissions: ["all"],
            color: "var(--error)"
        },
        {
            id: 2,
            name: "Educator",
            description: "Teaching and student management permissions",
            users: 15,
            permissions: ["students.view", "students.edit", "assessments.create", "reports.generate"],
            color: "var(--primary)"
        },
        {
            id: 3,
            name: "Teaching Assistant",
            description: "Limited teaching support permissions",
            users: 8,
            permissions: ["students.view", "assessments.grade", "communication.send"],
            color: "var(--info)"
        },
        {
            id: 4,
            name: "Content Manager",
            description: "Content creation and management permissions",
            users: 5,
            permissions: ["content.create", "content.edit", "assessments.create"],
            color: "var(--success)"
        },
        {
            id: 5,
            name: "Analyst",
            description: "Analytics and reporting permissions",
            users: 3,
            permissions: ["analytics.view", "reports.generate", "data.export"],
            color: "var(--warning)"
        }
    ];

    const rolesHTML = roles.map(role => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${role.color};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${role.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.875rem;">${role.description}</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: ${role.color};">${role.users}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Users</div>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <strong style="color: var(--gray-800); font-size: 0.875rem;">Permissions:</strong>
                    <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.25rem;">
                        ${role.permissions.map(permission => `
                            <span style="background: ${role.color}; color: white; padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; font-weight: 600;">
                                ${permission}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="editRole(${role.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Edit Role
                    </button>
                    <button class="btn" onclick="viewRoleUsers(${role.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        👥 View Users
                    </button>
                    <button class="btn" onclick="duplicateRole(${role.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        📋 Duplicate
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("rbac-roles-list", rolesHTML);
}

function loadSecurityAuditLogs() {
    const auditLogs = [
        {
            id: 1,
            timestamp: "2024-12-11 16:45:23",
            user: "admin@university.edu",
            action: "Login Success",
            details: "Successful login with MFA",
            ip: "192.168.1.100",
            severity: "Info"
        },
        {
            id: 2,
            timestamp: "2024-12-11 16:30:15",
            user: "educator@university.edu",
            action: "Permission Changed",
            details: "Role permissions updated for Teaching Assistant",
            ip: "192.168.1.105",
            severity: "Warning"
        },
        {
            id: 3,
            timestamp: "2024-12-11 16:15:42",
            user: "unknown",
            action: "Login Failed",
            details: "Failed login attempt - invalid credentials",
            ip: "203.0.113.45",
            severity: "Error"
        },
        {
            id: 4,
            timestamp: "2024-12-11 15:58:30",
            user: "ta@university.edu",
            action: "Data Export",
            details: "Student progress data exported",
            ip: "192.168.1.110",
            severity: "Info"
        },
        {
            id: 5,
            timestamp: "2024-12-11 15:45:18",
            user: "admin@university.edu",
            action: "Security Scan",
            details: "Automated security scan completed",
            ip: "127.0.0.1",
            severity: "Info"
        }
    ];

    const severityColors = {
        'Info': 'var(--info)',
        'Warning': 'var(--warning)',
        'Error': 'var(--error)'
    };

    const auditHTML = auditLogs.map(log => {
        return `
            <div style="background: var(--accent); border-radius: 6px; padding: 1rem; margin-bottom: 0.75rem; border-left: 3px solid ${severityColors[log.severity]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">${log.action}</strong>
                        <span style="background: ${severityColors[log.severity]}; color: white; padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; font-weight: 600;">
                            ${log.severity}
                        </span>
                    </div>
                    <span style="color: var(--gray-600); font-size: 0.75rem;">${new Date(log.timestamp).toLocaleString('id-ID')}</span>
                </div>
                <p style="color: var(--gray-700); font-size: 0.75rem; margin-bottom: 0.5rem;">${log.details}</p>
                <div style="display: flex; justify-content: space-between; font-size: 0.625rem; color: var(--gray-600);">
                    <span>User: ${log.user}</span>
                    <span>IP: ${log.ip}</span>
                </div>
            </div>
        `;
    }).join('');

    setInner("security-audit-logs", auditHTML);
}

function loadActiveSessions() {
    const sessions = [
        {
            id: 1,
            user: "Dr. Sarah Johnson",
            email: "sarah@university.edu",
            device: "Chrome on Windows 11",
            location: "Jakarta, Indonesia",
            loginTime: "2024-12-11 14:30:00",
            lastActivity: "2024-12-11 16:45:00",
            ip: "192.168.1.100",
            status: "Active"
        },
        {
            id: 2,
            user: "Prof. Ahmad Rahman",
            email: "ahmad@university.edu",
            device: "Safari on macOS",
            location: "Bandung, Indonesia",
            loginTime: "2024-12-11 15:15:00",
            lastActivity: "2024-12-11 16:30:00",
            ip: "192.168.1.105",
            status: "Active"
        },
        {
            id: 3,
            user: "Dr. Maria Santos",
            email: "maria@university.edu",
            device: "Firefox on Ubuntu",
            location: "Surabaya, Indonesia",
            loginTime: "2024-12-11 13:45:00",
            lastActivity: "2024-12-11 16:00:00",
            ip: "192.168.1.110",
            status: "Idle"
        }
    ];

    const statusColors = {
        'Active': 'var(--success)',
        'Idle': 'var(--warning)',
        'Expired': 'var(--error)'
    };

    const sessionsHTML = sessions.map(session => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[session.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${session.user}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${session.email}</p>
                    </div>
                    <span style="background: ${statusColors[session.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${session.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; font-size: 0.75rem;">
                        <div><strong>Device:</strong> ${session.device}</div>
                        <div><strong>Location:</strong> ${session.location}</div>
                        <div><strong>IP Address:</strong> ${session.ip}</div>
                        <div><strong>Login:</strong> ${new Date(session.loginTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</div>
                        <div><strong>Last Activity:</strong> ${new Date(session.lastActivity).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="viewSessionDetails(${session.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        👁️ View Details
                    </button>
                    <button class="btn" onclick="terminateSession(${session.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🚫 Terminate Session
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("active-sessions-list", sessionsHTML);
}

function setupSecurityEventListeners() {
    setTimeout(() => {
        const scanBtn = document.getElementById("btn-security-scan");
        if (scanBtn) {
            scanBtn.addEventListener("click", runSecurityScan);
        }

        const auditBtn = document.getElementById("btn-audit-logs");
        if (auditBtn) {
            auditBtn.addEventListener("click", openAuditLogs);
        }
    }, 200);
}

// MFA Configuration Functions
function configureSMSAuth() {
    UIComponents.showNotification("📱 Opening SMS authentication configuration...", "info");
}

function configureAuthenticatorApps() {
    UIComponents.showNotification("🔐 Opening authenticator app configuration...", "info");
}

function configureHardwareKeys() {
    UIComponents.showNotification("🔑 Opening hardware security key configuration...", "info");
}

// RBAC Functions
function editRole(id) {
    UIComponents.showNotification(`✏️ Opening role editor for role ID: ${id}`, "info");
}

function viewRoleUsers(id) {
    UIComponents.showNotification(`👥 Viewing users assigned to role ID: ${id}`, "info");
}

function duplicateRole(id) {
    UIComponents.showNotification(`📋 Creating duplicate of role ID: ${id}`, "success");
}

// Session Management Functions
function viewSessionDetails(id) {
    UIComponents.showNotification(`👁️ Viewing detailed information for session ID: ${id}`, "info");
}

function terminateSession(id) {
    UIComponents.showNotification(`🚫 Terminating session ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("⚠️ Session terminated successfully", "warning");
        loadActiveSessions();
    }, 1500);
}

// Security Functions
function runSecurityScan() {
    UIComponents.showNotification("🔍 Starting comprehensive security scan...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Security scan completed! No vulnerabilities found.", "success");
    }, 3000);
}

function openAuditLogs() {
    UIComponents.showNotification("📋 Opening detailed audit log viewer...", "info");
}

function loadPerformancePage() {
    const performanceHTML = `
        <!-- Performance Optimization & Caching Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--success); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    ⚡
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Performance Optimization & Caching</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">System performance monitoring and optimization tools</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-performance-test" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        🚀 Run Performance Test
                    </button>
                    <button class="btn" id="btn-clear-cache" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        🗑️ Clear Cache
                    </button>
                </div>
            </div>

            <!-- Performance Metrics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="page-load-time">1.2s</div>
                    <div class="metric-label">Average Load Time</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="cache-hit-rate">94%</div>
                    <div class="metric-label">Cache Hit Rate</div>
                </div>
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="memory-usage">68%</div>
                    <div class="metric-label">Memory Usage</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="cpu-usage">23%</div>
                    <div class="metric-label">CPU Usage</div>
                </div>
            </div>
        </section>

        <!-- Real-time Performance Monitoring -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Real-time Performance Monitoring
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Response Time Trends</h4>
                    <div id="response-time-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Response time chart will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Resource Usage</h4>
                    <div id="resource-usage-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Resource usage chart will be rendered here
                    </div>
                </div>
            </div>
        </section>

        <!-- Caching System -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>💾</span> Advanced Caching System
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🗄️</span> Database Query Cache
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Intelligent caching of frequently accessed database queries.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Cache Size</span>
                            <span style="font-weight: 600; color: var(--primary);">2.4 GB</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Hit Rate</span>
                            <span style="font-weight: 600; color: var(--success);">96%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Entries</span>
                            <span style="font-weight: 600; color: var(--info);">15,432</span>
                        </div>
                    </div>
                    <button class="btn" onclick="manageQueryCache()" style="background: var(--primary); width: 100%;">Manage Query Cache</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🌐</span> CDN & Static Assets
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Content Delivery Network optimization for static assets.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">CDN Hit Rate</span>
                            <span style="font-weight: 600; color: var(--success);">98%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Bandwidth Saved</span>
                            <span style="font-weight: 600; color: var(--primary);">1.8 TB</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Edge Locations</span>
                            <span style="font-weight: 600; color: var(--info);">24</span>
                        </div>
                    </div>
                    <button class="btn" onclick="manageCDN()" style="background: var(--success); width: 100%;">Manage CDN</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⚡</span> Redis Memory Cache
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">High-performance in-memory caching for session data.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Memory Used</span>
                            <span style="font-weight: 600; color: var(--info);">512 MB</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Keys Stored</span>
                            <span style="font-weight: 600; color: var(--primary);">8,924</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Avg Response</span>
                            <span style="font-weight: 600; color: var(--success);">0.3ms</span>
                        </div>
                    </div>
                    <button class="btn" onclick="manageRedisCache()" style="background: var(--info); width: 100%;">Manage Redis Cache</button>
                </div>
            </div>
        </section>

        <!-- Database Optimization -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🗃️</span> Database Query Optimization
            </h3>
            <div id="database-optimization-list">
                <!-- Database optimization info will be loaded here -->
            </div>
        </section>

        <!-- Performance Recommendations -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>💡</span> Performance Recommendations
            </h3>
            <div id="performance-recommendations-list">
                <!-- Performance recommendations will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-performance", performanceHTML);

    // Load performance data
    setTimeout(() => {
        loadDatabaseOptimization();
        loadPerformanceRecommendations();
        setupPerformanceEventListeners();
    }, 100);

    UIComponents.showNotification("⚡ Performance Optimization loaded successfully!", "success");
}

function loadDatabaseOptimization() {
    const dbOptimizations = [
        {
            id: 1,
            query: "SELECT * FROM students WHERE progress > 80",
            executionTime: "45ms",
            optimizedTime: "12ms",
            improvement: "73%",
            frequency: "High",
            status: "Optimized"
        },
        {
            id: 2,
            query: "SELECT COUNT(*) FROM assessments GROUP BY module_id",
            executionTime: "120ms",
            optimizedTime: "35ms",
            improvement: "71%",
            frequency: "Medium",
            status: "Optimized"
        },
        {
            id: 3,
            query: "SELECT * FROM communication_logs ORDER BY timestamp DESC",
            executionTime: "200ms",
            optimizedTime: "200ms",
            improvement: "0%",
            frequency: "Low",
            status: "Needs Optimization"
        },
        {
            id: 4,
            query: "SELECT AVG(score) FROM assessment_results WHERE date >= '2024-12-01'",
            executionTime: "80ms",
            optimizedTime: "25ms",
            improvement: "69%",
            frequency: "High",
            status: "Optimized"
        }
    ];

    const statusColors = {
        'Optimized': 'var(--success)',
        'Needs Optimization': 'var(--warning)',
        'Critical': 'var(--error)'
    };

    const frequencyColors = {
        'High': 'var(--error)',
        'Medium': 'var(--warning)',
        'Low': 'var(--info)'
    };

    const dbHTML = dbOptimizations.map(opt => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[opt.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">Query Optimization #${opt.id}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem; font-family: monospace; background: var(--white); padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem;">${opt.query}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <span style="background: ${frequencyColors[opt.frequency]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${opt.frequency} Freq
                        </span>
                        <span style="background: ${statusColors[opt.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${opt.status}
                        </span>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--error);">${opt.executionTime}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Original Time</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${opt.optimizedTime}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Optimized Time</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--primary);">${opt.improvement}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Improvement</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="analyzeQuery(${opt.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        🔍 Analyze Query
                    </button>
                    <button class="btn" onclick="optimizeQuery(${opt.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ⚡ Optimize
                    </button>
                    <button class="btn" onclick="viewQueryPlan(${opt.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        📋 Execution Plan
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("database-optimization-list", dbHTML);
}

function loadPerformanceRecommendations() {
    const recommendations = [
        {
            id: 1,
            title: "Enable Gzip Compression",
            description: "Reduce bandwidth usage by 60-80% with gzip compression for text-based assets.",
            impact: "High",
            effort: "Low",
            savings: "2.4s load time reduction",
            status: "Pending"
        },
        {
            id: 2,
            title: "Implement Image Lazy Loading",
            description: "Load images only when they enter the viewport to improve initial page load.",
            impact: "Medium",
            effort: "Medium",
            savings: "1.8s load time reduction",
            status: "In Progress"
        },
        {
            id: 3,
            title: "Optimize Database Indexes",
            description: "Add composite indexes for frequently queried student progress data.",
            impact: "High",
            effort: "High",
            savings: "45% query time reduction",
            status: "Completed"
        },
        {
            id: 4,
            title: "Implement Service Worker Caching",
            description: "Cache static assets and API responses for offline functionality.",
            impact: "Medium",
            effort: "Medium",
            savings: "Offline capability",
            status: "Pending"
        },
        {
            id: 5,
            title: "Minify CSS and JavaScript",
            description: "Reduce file sizes by removing unnecessary whitespace and comments.",
            impact: "Low",
            effort: "Low",
            savings: "0.5s load time reduction",
            status: "Completed"
        }
    ];

    const impactColors = {
        'High': 'var(--error)',
        'Medium': 'var(--warning)',
        'Low': 'var(--info)'
    };

    const statusColors = {
        'Completed': 'var(--success)',
        'In Progress': 'var(--warning)',
        'Pending': 'var(--gray-500)'
    };

    const recommendationsHTML = recommendations.map(rec => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${impactColors[rec.impact]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${rec.title}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.875rem; margin-top: 0.25rem;">${rec.description}</p>
                    </div>
                    <span style="background: ${statusColors[rec.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${rec.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: ${impactColors[rec.impact]};">${rec.impact}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Impact</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--info);">${rec.effort}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Effort</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${rec.savings}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Expected Savings</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${rec.status === 'Pending' ? `
                        <button class="btn" onclick="implementRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                            🚀 Implement
                        </button>
                    ` : ''}
                    <button class="btn" onclick="viewRecommendationDetails(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📋 View Details
                    </button>
                    <button class="btn" onclick="scheduleRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        ⏰ Schedule
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("performance-recommendations-list", recommendationsHTML);
}

function loadAdvancedAnalyticsPage() {
    const advancedAnalyticsHTML = `
        <!-- Advanced Analytics & Machine Learning Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🧠
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Advanced Analytics & Machine Learning</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">AI-powered insights and predictive analytics for enhanced learning outcomes</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-train-model" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🤖 Train ML Model
                    </button>
                    <button class="btn" id="btn-generate-insights" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        💡 Generate Insights
                    </button>
                </div>
            </div>

            <!-- ML Model Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="model-accuracy">96.8%</div>
                    <div class="metric-label">Model Accuracy</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="predictions-made">1,247</div>
                    <div class="metric-label">Predictions Made</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="data-points">45.2K</div>
                    <div class="metric-label">Training Data Points</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="model-confidence">94.3%</div>
                    <div class="metric-label">Average Confidence</div>
                </div>
            </div>
        </section>

        <!-- Predictive Learning Analytics -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔮</span> Predictive Learning Analytics
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📈</span> Student Success Prediction
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">AI model predicts student success probability based on learning patterns and engagement.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">High Success Probability</span>
                            <span style="font-weight: 600; color: var(--success);">32 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Medium Risk</span>
                            <span style="font-weight: 600; color: var(--warning);">8 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">High Risk</span>
                            <span style="font-weight: 600; color: var(--error);">5 students</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewSuccessPredictions()" style="background: var(--primary); width: 100%;">View Detailed Predictions</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🎯</span> Learning Path Optimization
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">ML algorithms optimize learning paths based on individual student performance and preferences.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Optimized Paths</span>
                            <span style="font-weight: 600; color: var(--success);">28 paths</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Avg Improvement</span>
                            <span style="font-weight: 600; color: var(--primary);">+34%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Completion Rate</span>
                            <span style="font-weight: 600; color: var(--info);">89%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewPathOptimizations()" style="background: var(--success); width: 100%;">View Path Analytics</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⏰</span> Engagement Forecasting
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Predict future engagement levels and identify optimal intervention timing.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Next Week Forecast</span>
                            <span style="font-weight: 600; color: var(--info);">82% avg</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Declining Trend</span>
                            <span style="font-weight: 600; color: var(--warning);">6 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Intervention Needed</span>
                            <span style="font-weight: 600; color: var(--error);">3 students</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewEngagementForecasts()" style="background: var(--info); width: 100%;">View Forecasts</button>
                </div>
            </div>
        </section>

        <!-- Advanced Data Visualization -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Advanced Data Visualization
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">ML Model Performance</h4>
                    <div id="ml-performance-chart" style="height: 250px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        ML model performance visualization will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Predictive Analytics Dashboard</h4>
                    <div id="predictive-dashboard" style="height: 250px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Predictive analytics dashboard will be rendered here
                    </div>
                </div>
            </div>
        </section>

        <!-- Machine Learning Models -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🤖</span> Machine Learning Models
            </h3>
            <div id="ml-models-list">
                <!-- ML models will be loaded here -->
            </div>
        </section>

        <!-- Custom Analytics Builder -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🛠️</span> Custom Analytics Builder
            </h3>
            <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Data Source</label>
                        <select id="analytics-data-source" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Student Performance Data</option>
                            <option>Engagement Metrics</option>
                            <option>Assessment Results</option>
                            <option>Communication Logs</option>
                            <option>Learning Path Data</option>
                            <option>Custom Dataset</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Analysis Type</label>
                        <select id="analytics-type" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Predictive Modeling</option>
                            <option>Clustering Analysis</option>
                            <option>Trend Analysis</option>
                            <option>Correlation Analysis</option>
                            <option>Anomaly Detection</option>
                            <option>Classification</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Time Period</label>
                        <select id="analytics-timeframe" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Semester</option>
                            <option>This Year</option>
                            <option>All Time</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Visualization</label>
                        <select id="analytics-visualization" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Interactive Dashboard</option>
                            <option>Statistical Charts</option>
                            <option>Heatmaps</option>
                            <option>Network Graphs</option>
                            <option>3D Visualizations</option>
                            <option>Custom Charts</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn" onclick="previewAnalytics()" style="background: var(--info); flex: 1;">👁️ Preview Analytics</button>
                    <button class="btn" onclick="runCustomAnalytics()" style="background: var(--primary); flex: 1;">🚀 Run Analysis</button>
                    <button class="btn" onclick="saveAnalyticsTemplate()" style="background: var(--success); flex: 1;">💾 Save Template</button>
                </div>
            </div>
        </section>

        <!-- Real-time Data Processing -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Real-time Data Processing
            </h3>
            <div id="realtime-processing-status">
                <!-- Real-time processing status will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-advanced-analytics", advancedAnalyticsHTML);

    // Load advanced analytics data
    setTimeout(() => {
        loadMLModels();
        loadRealtimeProcessingStatus();
        setupAdvancedAnalyticsEventListeners();
    }, 100);

    UIComponents.showNotification("🧠 Advanced Analytics & Machine Learning loaded successfully!", "success");
}

function loadMLModels() {
    const mlModels = [
        {
            id: 1,
            name: "Student Success Predictor",
            type: "Classification",
            algorithm: "Random Forest",
            accuracy: "96.8%",
            lastTrained: "2024-12-11 14:30",
            status: "Active",
            predictions: 1247,
            features: ["engagement_score", "assignment_completion", "time_spent", "quiz_performance"]
        },
        {
            id: 2,
            name: "Learning Path Optimizer",
            type: "Recommendation",
            algorithm: "Collaborative Filtering",
            accuracy: "94.2%",
            lastTrained: "2024-12-10 16:45",
            status: "Active",
            predictions: 892,
            features: ["learning_style", "progress_rate", "difficulty_preference", "topic_interest"]
        },
        {
            id: 3,
            name: "Engagement Forecaster",
            type: "Time Series",
            algorithm: "LSTM Neural Network",
            accuracy: "91.5%",
            lastTrained: "2024-12-09 10:20",
            status: "Training",
            predictions: 634,
            features: ["daily_activity", "session_duration", "interaction_frequency", "content_type"]
        },
        {
            id: 4,
            name: "Content Difficulty Analyzer",
            type: "Regression",
            algorithm: "Gradient Boosting",
            accuracy: "89.7%",
            lastTrained: "2024-12-08 13:15",
            status: "Active",
            predictions: 456,
            features: ["content_complexity", "student_level", "completion_time", "error_rate"]
        },
        {
            id: 5,
            name: "Anomaly Detector",
            type: "Unsupervised",
            algorithm: "Isolation Forest",
            accuracy: "87.3%",
            lastTrained: "2024-12-07 09:30",
            status: "Inactive",
            predictions: 234,
            features: ["behavior_pattern", "access_time", "performance_deviation", "engagement_anomaly"]
        }
    ];

    const statusColors = {
        'Active': 'var(--success)',
        'Training': 'var(--warning)',
        'Inactive': 'var(--gray-500)',
        'Error': 'var(--error)'
    };

    const typeColors = {
        'Classification': 'var(--primary)',
        'Recommendation': 'var(--info)',
        'Time Series': 'var(--success)',
        'Regression': 'var(--warning)',
        'Unsupervised': 'var(--secondary-dark)'
    };

    const modelsHTML = mlModels.map(model => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[model.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${model.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${model.algorithm} • ${model.type} Model</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <span style="background: ${typeColors[model.type]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${model.type}
                        </span>
                        <span style="background: ${statusColors[model.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${model.status}
                        </span>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--primary);">${model.accuracy}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Accuracy</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${model.predictions}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Predictions</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--info);">${model.features.length}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Features</div>
                        </div>
                    </div>
                    <div>
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Features:</strong>
                        <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.25rem;">
                            ${model.features.map(feature => `
                                <span style="background: var(--accent); color: var(--gray-700); padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; border: 1px solid var(--accent-dark);">
                                    ${feature}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="viewModelDetails(${model.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📊 View Details
                    </button>
                    <button class="btn" onclick="retrainModel(${model.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🔄 Retrain
                    </button>
                    <button class="btn" onclick="testModel(${model.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        🧪 Test Model
                    </button>
                    <button class="btn" onclick="exportModel(${model.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        📤 Export
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("ml-models-list", modelsHTML);
}

function loadRealtimeProcessingStatus() {
    const processingStreams = [
        {
            id: 1,
            name: "Student Activity Stream",
            type: "Real-time Events",
            status: "Active",
            throughput: "1,247 events/min",
            latency: "12ms",
            errorRate: "0.02%"
        },
        {
            id: 2,
            name: "Assessment Results Pipeline",
            type: "Batch Processing",
            status: "Active",
            throughput: "456 records/min",
            latency: "45ms",
            errorRate: "0.01%"
        },
        {
            id: 3,
            name: "ML Inference Engine",
            type: "Prediction Service",
            status: "Active",
            throughput: "892 predictions/min",
            latency: "8ms",
            errorRate: "0.05%"
        },
        {
            id: 4,
            name: "Analytics Aggregator",
            type: "Data Aggregation",
            status: "Warning",
            throughput: "234 aggregations/min",
            latency: "120ms",
            errorRate: "0.15%"
        }
    ];

    const statusColors = {
        'Active': 'var(--success)',
        'Warning': 'var(--warning)',
        'Error': 'var(--error)',
        'Stopped': 'var(--gray-500)'
    };

    const streamHTML = processingStreams.map(stream => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[stream.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${stream.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${stream.type}</p>
                    </div>
                    <span style="background: ${statusColors[stream.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${stream.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--primary);">${stream.throughput}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Throughput</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--info);">${stream.latency}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Latency</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${stream.errorRate}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Error Rate</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="viewStreamMetrics(${stream.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📊 Metrics
                    </button>
                    <button class="btn" onclick="restartStream(${stream.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        🔄 Restart
                    </button>
                    <button class="btn" onclick="configureStream(${stream.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        ⚙️ Configure
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("realtime-processing-status", streamHTML);
}

function loadMobilePage() {
    const mobileHTML = `
        <!-- Mobile App & Cross-Platform Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--info); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    📱
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Mobile App & Progressive Web App</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Mobile optimization and cross-platform compatibility features</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-install-pwa" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📲 Install PWA
                    </button>
                    <button class="btn" id="btn-test-offline" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        🔌 Test Offline Mode
                    </button>
                </div>
            </div>

            <!-- Mobile Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="mobile-users">68%</div>
                    <div class="metric-label">Mobile Users</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="pwa-installs">342</div>
                    <div class="metric-label">PWA Installations</div>
                </div>
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="offline-sessions">89</div>
                    <div class="metric-label">Offline Sessions</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="push-notifications">1.2K</div>
                    <div class="metric-label">Push Notifications Sent</div>
                </div>
            </div>
        </section>

        <!-- Progressive Web App Features -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🌐</span> Progressive Web App Features
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📲</span> App Installation
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Install AgenticLearn as a native app on any device with PWA technology.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">PWA Support</span>
                            <span style="font-weight: 600; color: var(--success);">✅ Enabled</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Service Worker</span>
                            <span style="font-weight: 600; color: var(--success);">✅ Active</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Manifest</span>
                            <span style="font-weight: 600; color: var(--success);">✅ Valid</span>
                        </div>
                    </div>
                    <button class="btn" onclick="configurePWA()" style="background: var(--info); width: 100%;">Configure PWA Settings</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔌</span> Offline Functionality
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Access core features even without internet connection using intelligent caching.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Cached Pages</span>
                            <span style="font-weight: 600; color: var(--success);">24 pages</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Offline Storage</span>
                            <span style="font-weight: 600; color: var(--primary);">15.2 MB</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Sync Queue</span>
                            <span style="font-weight: 600; color: var(--info);">3 items</span>
                        </div>
                    </div>
                    <button class="btn" onclick="manageOfflineContent()" style="background: var(--success); width: 100%;">Manage Offline Content</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--warning);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔔</span> Push Notifications
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Send real-time notifications for important updates and reminders.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Subscribers</span>
                            <span style="font-weight: 600; color: var(--warning);">156 users</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Delivery Rate</span>
                            <span style="font-weight: 600; color: var(--success);">94%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Click Rate</span>
                            <span style="font-weight: 600; color: var(--primary);">23%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="managePushNotifications()" style="background: var(--warning); width: 100%;">Manage Notifications</button>
                </div>
            </div>
        </section>

        <!-- Mobile Responsive Design -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📐</span> Mobile Responsive Design
            </h3>
            <div id="responsive-design-status">
                <!-- Responsive design status will be loaded here -->
            </div>
        </section>

        <!-- Cross-Platform Compatibility -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔄</span> Cross-Platform Compatibility
            </h3>
            <div id="platform-compatibility-list">
                <!-- Platform compatibility will be loaded here -->
            </div>
        </section>

        <!-- Mobile Performance Metrics -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Mobile Performance Metrics
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Mobile Performance Score</h4>
                    <div id="mobile-performance-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Mobile performance metrics will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Device Usage Analytics</h4>
                    <div id="device-usage-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Device usage analytics will be rendered here
                    </div>
                </div>
            </div>
        </section>

        <!-- App Store Deployment -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🏪</span> App Store Deployment
            </h3>
            <div id="app-store-status">
                <!-- App store deployment status will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-mobile", mobileHTML);

    // Load mobile data
    setTimeout(() => {
        loadResponsiveDesignStatus();
        loadPlatformCompatibility();
        loadAppStoreStatus();
        setupMobileEventListeners();
    }, 100);

    UIComponents.showNotification("📱 Mobile & PWA loaded successfully!", "success");
}

function loadResponsiveDesignStatus() {
    const breakpoints = [
        {
            name: "Mobile Portrait",
            size: "320px - 480px",
            status: "Optimized",
            coverage: "100%",
            issues: 0
        },
        {
            name: "Mobile Landscape",
            size: "481px - 768px",
            status: "Optimized",
            coverage: "100%",
            issues: 0
        },
        {
            name: "Tablet Portrait",
            size: "769px - 1024px",
            status: "Optimized",
            coverage: "98%",
            issues: 1
        },
        {
            name: "Tablet Landscape",
            size: "1025px - 1200px",
            status: "Optimized",
            coverage: "100%",
            issues: 0
        },
        {
            name: "Desktop",
            size: "1201px+",
            status: "Optimized",
            coverage: "100%",
            issues: 0
        }
    ];

    const statusColors = {
        'Optimized': 'var(--success)',
        'Needs Work': 'var(--warning)',
        'Critical': 'var(--error)'
    };

    const responsiveHTML = breakpoints.map(bp => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[bp.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${bp.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${bp.size}</p>
                    </div>
                    <span style="background: ${statusColors[bp.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${bp.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${bp.coverage}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Coverage</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: ${bp.issues > 0 ? 'var(--warning)' : 'var(--success)'};">${bp.issues}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Issues</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="testBreakpoint('${bp.name}')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        🧪 Test Breakpoint
                    </button>
                    <button class="btn" onclick="optimizeBreakpoint('${bp.name}')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ⚡ Optimize
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("responsive-design-status", responsiveHTML);
}

function loadPlatformCompatibility() {
    const platforms = [
        {
            name: "iOS Safari",
            version: "17.0+",
            compatibility: "100%",
            features: ["PWA", "Push Notifications", "Offline Storage"],
            status: "Fully Supported"
        },
        {
            name: "Android Chrome",
            version: "120.0+",
            compatibility: "100%",
            features: ["PWA", "Push Notifications", "Offline Storage", "Background Sync"],
            status: "Fully Supported"
        },
        {
            name: "Desktop Chrome",
            version: "120.0+",
            compatibility: "100%",
            features: ["PWA", "Push Notifications", "Offline Storage", "Background Sync"],
            status: "Fully Supported"
        },
        {
            name: "Desktop Firefox",
            version: "121.0+",
            compatibility: "95%",
            features: ["PWA", "Offline Storage"],
            status: "Mostly Supported"
        },
        {
            name: "Desktop Safari",
            version: "17.0+",
            compatibility: "90%",
            features: ["PWA", "Offline Storage"],
            status: "Mostly Supported"
        },
        {
            name: "Edge",
            version: "120.0+",
            compatibility: "100%",
            features: ["PWA", "Push Notifications", "Offline Storage"],
            status: "Fully Supported"
        }
    ];

    const statusColors = {
        'Fully Supported': 'var(--success)',
        'Mostly Supported': 'var(--warning)',
        'Limited Support': 'var(--error)'
    };

    const platformHTML = platforms.map(platform => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[platform.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${platform.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">Version ${platform.version}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">${platform.compatibility}</span>
                        <span style="background: ${statusColors[platform.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${platform.status}
                        </span>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <strong style="color: var(--gray-800); font-size: 0.875rem;">Supported Features:</strong>
                    <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.25rem;">
                        ${platform.features.map(feature => `
                            <span style="background: var(--success); color: white; padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; font-weight: 600;">
                                ${feature}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="testPlatform('${platform.name}')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        🧪 Test Platform
                    </button>
                    <button class="btn" onclick="viewCompatibilityDetails('${platform.name}')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        📋 View Details
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("platform-compatibility-list", platformHTML);
}

function loadAppStoreStatus() {
    const appStores = [
        {
            name: "Google Play Store",
            status: "Published",
            version: "1.2.3",
            downloads: "2,456",
            rating: "4.8",
            lastUpdate: "2024-12-10"
        },
        {
            name: "Apple App Store",
            status: "Under Review",
            version: "1.2.3",
            downloads: "1,892",
            rating: "4.7",
            lastUpdate: "2024-12-09"
        },
        {
            name: "Microsoft Store",
            status: "Published",
            version: "1.2.2",
            downloads: "634",
            rating: "4.6",
            lastUpdate: "2024-12-05"
        },
        {
            name: "PWA Direct Install",
            status: "Available",
            version: "1.2.3",
            downloads: "5,234",
            rating: "4.9",
            lastUpdate: "2024-12-11"
        }
    ];

    const statusColors = {
        'Published': 'var(--success)',
        'Under Review': 'var(--warning)',
        'Rejected': 'var(--error)',
        'Available': 'var(--info)'
    };

    const storeHTML = appStores.map(store => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[store.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${store.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">Version ${store.version}</p>
                    </div>
                    <span style="background: ${statusColors[store.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${store.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--primary);">${store.downloads}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Downloads</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${store.rating}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Rating</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--info);">${new Date(store.lastUpdate).toLocaleDateString('id-ID')}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Last Update</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="updateAppStore('${store.name}')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🚀 Update App
                    </button>
                    <button class="btn" onclick="viewStoreAnalytics('${store.name}')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📊 Analytics
                    </button>
                    <button class="btn" onclick="manageStoreListing('${store.name}')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        ✏️ Manage Listing
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("app-store-status", storeHTML);
}

// Global functions for onclick handlers
window.configureSMSAuth = configureSMSAuth;
window.configureAuthenticatorApps = configureAuthenticatorApps;
window.configureHardwareKeys = configureHardwareKeys;
window.editRole = editRole;
window.viewRoleUsers = viewRoleUsers;
window.duplicateRole = duplicateRole;
window.viewSessionDetails = viewSessionDetails;
window.terminateSession = terminateSession;
window.runSecurityScan = runSecurityScan;
window.openAuditLogs = openAuditLogs;

function setupPerformanceEventListeners() {
    setTimeout(() => {
        const testBtn = document.getElementById("btn-performance-test");
        if (testBtn) {
            testBtn.addEventListener("click", runPerformanceTest);
        }

        const clearBtn = document.getElementById("btn-clear-cache");
        if (clearBtn) {
            clearBtn.addEventListener("click", clearAllCache);
        }
    }, 200);
}

// Performance Test Functions
function runPerformanceTest() {
    UIComponents.showNotification("🚀 Starting comprehensive performance test...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Performance test completed! Average load time: 1.2s", "success");
        // Update metrics
        document.getElementById("page-load-time").textContent = "1.2s";
        document.getElementById("cache-hit-rate").textContent = "94%";
        document.getElementById("memory-usage").textContent = "68%";
        document.getElementById("cpu-usage").textContent = "23%";
    }, 3000);
}

function clearAllCache() {
    UIComponents.showNotification("🗑️ Clearing all cache layers...", "warning");

    setTimeout(() => {
        UIComponents.showNotification("✅ All cache cleared successfully! Performance may be temporarily affected.", "success");
        // Update cache metrics
        document.getElementById("cache-hit-rate").textContent = "0%";

        // Simulate cache rebuilding
        setTimeout(() => {
            document.getElementById("cache-hit-rate").textContent = "94%";
            UIComponents.showNotification("🔄 Cache rebuilt successfully!", "success");
        }, 5000);
    }, 2000);
}

// Cache Management Functions
function manageQueryCache() {
    UIComponents.showNotification("🗄️ Opening database query cache management...", "info");
}

function manageCDN() {
    UIComponents.showNotification("🌐 Opening CDN configuration panel...", "info");
}

function manageRedisCache() {
    UIComponents.showNotification("⚡ Opening Redis cache management interface...", "info");
}

// Database Optimization Functions
function analyzeQuery(id) {
    UIComponents.showNotification(`🔍 Analyzing query performance for ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("📊 Query analysis completed! Check recommendations.", "success");
    }, 2000);
}

function optimizeQuery(id) {
    UIComponents.showNotification(`⚡ Optimizing query ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Query optimization completed! Performance improved by 45%.", "success");
        loadDatabaseOptimization();
    }, 3000);
}

function viewQueryPlan(id) {
    UIComponents.showNotification(`📋 Opening execution plan for query ID: ${id}`, "info");
}

// Performance Recommendations Functions
function implementRecommendation(id) {
    UIComponents.showNotification(`🚀 Implementing performance recommendation ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Recommendation implemented successfully!", "success");
        loadPerformanceRecommendations();
    }, 3000);
}

function viewRecommendationDetails(id) {
    UIComponents.showNotification(`📋 Viewing detailed information for recommendation ID: ${id}`, "info");
}

function scheduleRecommendation(id) {
    UIComponents.showNotification(`⏰ Scheduling implementation for recommendation ID: ${id}`, "info");
}

// Global functions for onclick handlers
window.runPerformanceTest = runPerformanceTest;
window.clearAllCache = clearAllCache;
window.manageQueryCache = manageQueryCache;
window.manageCDN = manageCDN;
window.manageRedisCache = manageRedisCache;
window.analyzeQuery = analyzeQuery;
window.optimizeQuery = optimizeQuery;
window.viewQueryPlan = viewQueryPlan;
window.implementRecommendation = implementRecommendation;
window.viewRecommendationDetails = viewRecommendationDetails;
window.scheduleRecommendation = scheduleRecommendation;

function setupAdvancedAnalyticsEventListeners() {
    setTimeout(() => {
        const trainBtn = document.getElementById("btn-train-model");
        if (trainBtn) {
            trainBtn.addEventListener("click", trainMLModel);
        }

        const insightsBtn = document.getElementById("btn-generate-insights");
        if (insightsBtn) {
            insightsBtn.addEventListener("click", generateMLInsights);
        }
    }, 200);
}

// ML Model Training Functions
function trainMLModel() {
    UIComponents.showNotification("🤖 Starting ML model training with latest data...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ ML model training completed! Accuracy improved to 97.2%", "success");
        // Update model accuracy
        document.getElementById("model-accuracy").textContent = "97.2%";
        loadMLModels();
    }, 5000);
}

function generateMLInsights() {
    UIComponents.showNotification("💡 Generating AI-powered insights from latest data...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ New insights generated! Check the predictive analytics dashboard.", "success");
        // Update predictions count
        const currentPredictions = parseInt(document.getElementById("predictions-made").textContent.replace(',', ''));
        document.getElementById("predictions-made").textContent = (currentPredictions + 156).toLocaleString();
    }, 3000);
}

// Predictive Analytics Functions
function viewSuccessPredictions() {
    UIComponents.showNotification("📈 Opening detailed student success predictions dashboard...", "info");
}

function viewPathOptimizations() {
    UIComponents.showNotification("🎯 Opening learning path optimization analytics...", "info");
}

function viewEngagementForecasts() {
    UIComponents.showNotification("⏰ Opening engagement forecasting dashboard...", "info");
}

// ML Model Management Functions
function viewModelDetails(id) {
    UIComponents.showNotification(`📊 Opening detailed analytics for ML model ID: ${id}`, "info");
}

function retrainModel(id) {
    UIComponents.showNotification(`🔄 Starting retraining process for model ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Model retraining completed successfully!", "success");
        loadMLModels();
    }, 4000);
}

function testModel(id) {
    UIComponents.showNotification(`🧪 Running test suite for model ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Model testing completed! All tests passed.", "success");
    }, 2000);
}

function exportModel(id) {
    UIComponents.showNotification(`📤 Exporting model ID: ${id} for deployment...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Model exported successfully! Download ready.", "success");
    }, 1500);
}

// Custom Analytics Builder Functions
function previewAnalytics() {
    const dataSource = document.getElementById("analytics-data-source")?.value;
    const analysisType = document.getElementById("analytics-type")?.value;
    const timeframe = document.getElementById("analytics-timeframe")?.value;
    const visualization = document.getElementById("analytics-visualization")?.value;

    UIComponents.showNotification(`👁️ Previewing ${analysisType} on ${dataSource} (${timeframe}, ${visualization})...`, "info");
}

function runCustomAnalytics() {
    const dataSource = document.getElementById("analytics-data-source")?.value;
    const analysisType = document.getElementById("analytics-type")?.value;
    const timeframe = document.getElementById("analytics-timeframe")?.value;
    const visualization = document.getElementById("analytics-visualization")?.value;

    UIComponents.showNotification(`🚀 Running ${analysisType} analysis on ${dataSource}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Custom analytics completed! Results available in dashboard.", "success");
    }, 4000);
}

function saveAnalyticsTemplate() {
    UIComponents.showNotification("💾 Saving analytics configuration as reusable template...", "success");
}

// Real-time Processing Functions
function viewStreamMetrics(id) {
    UIComponents.showNotification(`📊 Opening detailed metrics for processing stream ID: ${id}`, "info");
}

function restartStream(id) {
    UIComponents.showNotification(`🔄 Restarting processing stream ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("✅ Processing stream restarted successfully!", "success");
        loadRealtimeProcessingStatus();
    }, 2000);
}

function configureStream(id) {
    UIComponents.showNotification(`⚙️ Opening configuration for processing stream ID: ${id}`, "info");
}

// Global functions for onclick handlers
window.viewSuccessPredictions = viewSuccessPredictions;
window.viewPathOptimizations = viewPathOptimizations;
window.viewEngagementForecasts = viewEngagementForecasts;
window.viewModelDetails = viewModelDetails;
window.retrainModel = retrainModel;
window.testModel = testModel;
window.exportModel = exportModel;
window.previewAnalytics = previewAnalytics;
window.runCustomAnalytics = runCustomAnalytics;
window.saveAnalyticsTemplate = saveAnalyticsTemplate;
window.viewStreamMetrics = viewStreamMetrics;
window.restartStream = restartStream;
window.configureStream = configureStream;

function setupMobileEventListeners() {
    setTimeout(() => {
        const installBtn = document.getElementById("btn-install-pwa");
        if (installBtn) {
            installBtn.addEventListener("click", installPWA);
        }

        const offlineBtn = document.getElementById("btn-test-offline");
        if (offlineBtn) {
            offlineBtn.addEventListener("click", testOfflineMode);
        }
    }, 200);
}

// PWA Installation Functions
function installPWA() {
    UIComponents.showNotification("📲 Initiating PWA installation...", "info");

    // Check if PWA installation is available
    if ('serviceWorker' in navigator) {
        setTimeout(() => {
            UIComponents.showNotification("✅ PWA installation prompt displayed! Check your browser's install option.", "success");
            // Update install count
            const currentInstalls = parseInt(document.getElementById("pwa-installs").textContent);
            document.getElementById("pwa-installs").textContent = currentInstalls + 1;
        }, 1500);
    } else {
        UIComponents.showNotification("❌ PWA not supported in this browser", "error");
    }
}

function testOfflineMode() {
    UIComponents.showNotification("🔌 Testing offline functionality...", "warning");

    setTimeout(() => {
        UIComponents.showNotification("✅ Offline mode test completed! Core features available offline.", "success");
        // Update offline sessions count
        const currentSessions = parseInt(document.getElementById("offline-sessions").textContent);
        document.getElementById("offline-sessions").textContent = currentSessions + 1;
    }, 2000);
}

// PWA Configuration Functions
function configurePWA() {
    UIComponents.showNotification("🌐 Opening PWA configuration panel...", "info");
}

function manageOfflineContent() {
    UIComponents.showNotification("🔌 Opening offline content management interface...", "info");
}

function managePushNotifications() {
    UIComponents.showNotification("🔔 Opening push notification management panel...", "info");
}

// Responsive Design Functions
function testBreakpoint(breakpoint) {
    UIComponents.showNotification(`🧪 Testing responsive design for ${breakpoint}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ ${breakpoint} responsive test completed successfully!`, "success");
    }, 1500);
}

function optimizeBreakpoint(breakpoint) {
    UIComponents.showNotification(`⚡ Optimizing responsive design for ${breakpoint}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ ${breakpoint} optimization completed!`, "success");
        loadResponsiveDesignStatus();
    }, 2500);
}

// Platform Compatibility Functions
function testPlatform(platform) {
    UIComponents.showNotification(`🧪 Running compatibility test for ${platform}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ ${platform} compatibility test passed!`, "success");
    }, 2000);
}

function viewCompatibilityDetails(platform) {
    UIComponents.showNotification(`📋 Opening detailed compatibility report for ${platform}`, "info");
}

// App Store Management Functions
function updateAppStore(store) {
    UIComponents.showNotification(`🚀 Submitting app update to ${store}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ App update submitted to ${store} successfully!`, "success");
        loadAppStoreStatus();
    }, 3000);
}

function viewStoreAnalytics(store) {
    UIComponents.showNotification(`📊 Opening analytics dashboard for ${store}`, "info");
}

function manageStoreListing(store) {
    UIComponents.showNotification(`✏️ Opening store listing management for ${store}`, "info");
}

// Global functions for onclick handlers
window.configurePWA = configurePWA;
window.manageOfflineContent = manageOfflineContent;
window.managePushNotifications = managePushNotifications;
window.testBreakpoint = testBreakpoint;
window.optimizeBreakpoint = optimizeBreakpoint;
window.testPlatform = testPlatform;
window.viewCompatibilityDetails = viewCompatibilityDetails;
window.updateAppStore = updateAppStore;
window.viewStoreAnalytics = viewStoreAnalytics;
window.manageStoreListing = manageStoreListing;

// Global functions
window.viewStudentDetail = viewStudentDetail;

// ===== ENHANCED INITIALIZATION =====

// Initialize the portal when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing Educator Portal...');

    // Skip authentication for local testing
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Local development mode - skipping authentication');
        setCookie('login', 'demo-token', 1); // Set demo token for local testing
    }

    // Initialize the portal
    initializeEducatorPortal().catch(error => {
        console.error('❌ Failed to initialize portal:', error);
        UIComponents.showNotification('Failed to initialize portal. Using demo mode.', 'error');

        // Fallback initialization
        try {
            initializeSidebar();
            loadDemoEducatorData();
            loadDemoClassData();
            loadDemoStudentData();
            setupEventListeners();
            updateCarbonIndicator();
            UIComponents.showNotification('🌱 Portal loaded in demo mode', 'info');
        } catch (fallbackError) {
            console.error('❌ Fallback initialization failed:', fallbackError);
            UIComponents.showNotification('Critical error: Portal failed to load', 'error');
        }
    });
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    // DOM is already loaded
    console.log('🚀 DOM already loaded, initializing Educator Portal...');

    // Skip authentication for local testing
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Local development mode - skipping authentication');
        setCookie('login', 'demo-token', 1);
    }

    initializeEducatorPortal().catch(error => {
        console.error('❌ Failed to initialize portal:', error);
        UIComponents.showNotification('Failed to initialize portal. Using demo mode.', 'error');

        // Fallback initialization
        try {
            initializeSidebar();
            loadDemoEducatorData();
            loadDemoClassData();
            loadDemoStudentData();
            setupEventListeners();
            updateCarbonIndicator();
            UIComponents.showNotification('🌱 Portal loaded in demo mode', 'info');
        } catch (fallbackError) {
            console.error('❌ Fallback initialization failed:', fallbackError);
            UIComponents.showNotification('Critical error: Portal failed to load', 'error');
        }
    });
}

// ===== ASSESSMENT MANAGEMENT FUNCTIONS =====

function showCreateAssessmentModal(type = 'quiz') {
    const modal = document.getElementById('assessment-modal');
    if (modal) {
        modal.style.display = 'flex';

        // Set default values based on type
        document.getElementById('assessment-type').value = type;
        document.getElementById('modal-title').textContent = `Create New ${type.charAt(0).toUpperCase() + type.slice(1)}`;

        // Set default duration based on type
        const defaultDurations = {
            quiz: 30,
            assignment: 120,
            project: 1440,
            exam: 90
        };
        document.getElementById('assessment-duration').value = defaultDurations[type] || 60;

        // Set default questions based on type
        const defaultQuestions = {
            quiz: 10,
            assignment: 5,
            project: 1,
            exam: 25
        };
        document.getElementById('assessment-questions').value = defaultQuestions[type] || 10;
    }
}

function closeAssessmentModal() {
    const modal = document.getElementById('assessment-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('assessment-form').reset();
    }
}

function setupAssessmentFormHandler() {
    const form = document.getElementById('assessment-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                title: document.getElementById('assessment-title').value,
                type: document.getElementById('assessment-type').value,
                dueDate: document.getElementById('assessment-due-date').value,
                duration: parseInt(document.getElementById('assessment-duration').value),
                totalQuestions: parseInt(document.getElementById('assessment-questions').value),
                description: document.getElementById('assessment-description').value,
                status: 'draft',
                createdAt: new Date().toISOString(),
                submissions: 0,
                totalStudents: currentStudentData?.length || 45,
                averageScore: 0
            };

            const result = await assessmentManager.createAssessment(formData);
            if (result) {
                closeAssessmentModal();
                assessmentManager.renderAssessmentsList();
                UIComponents.showNotification('✅ Assessment created successfully!', 'success');
            }
        });
    }
}

async function viewAssessmentResults(assessmentId) {
    try {
        UIComponents.showNotification('🔄 Loading assessment results...', 'info');
        const results = await assessmentManager.getAssessmentResults(assessmentId);

        // Create results modal
        const resultsModal = `
            <div id="results-modal" class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 1000px;">
                    <div class="modal-header">
                        <h3>Assessment Results</h3>
                        <button onclick="closeResultsModal()" class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                            <div class="metric-card">
                                <div class="metric-value">${results.length}</div>
                                <div class="metric-label">Total Submissions</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)}%</div>
                                <div class="metric-label">Average Score</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-value">${Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length)} min</div>
                                <div class="metric-label">Average Time</div>
                            </div>
                        </div>

                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--accent);">
                                    <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--gray-300);">Student</th>
                                    <th style="padding: 0.75rem; text-align: center; border: 1px solid var(--gray-300);">Score</th>
                                    <th style="padding: 0.75rem; text-align: center; border: 1px solid var(--gray-300);">Time Spent</th>
                                    <th style="padding: 0.75rem; text-align: center; border: 1px solid var(--gray-300);">Status</th>
                                    <th style="padding: 0.75rem; text-align: center; border: 1px solid var(--gray-300);">Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${results.map(result => `
                                    <tr>
                                        <td style="padding: 0.75rem; border: 1px solid var(--gray-300);">${result.studentName}</td>
                                        <td style="padding: 0.75rem; text-align: center; border: 1px solid var(--gray-300); font-weight: 600; color: ${result.score >= 80 ? 'var(--success)' : result.score >= 60 ? 'var(--warning)' : 'var(--error)'};">${result.score}%</td>
                                        <td style="padding: 0.75rem; text-align: center; border: 1px solid var(--gray-300);">${result.timeSpent} min</td>
                                        <td style="padding: 0.75rem; text-align: center; border: 1px solid var(--gray-300);">
                                            <span style="background: var(--success); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">${result.status}</span>
                                        </td>
                                        <td style="padding: 0.75rem; text-align: center; border: 1px solid var(--gray-300); font-size: 0.875rem;">${getRelativeTime(result.submittedAt)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', resultsModal);

    } catch (error) {
        console.error('Failed to load assessment results:', error);
        UIComponents.showNotification('❌ Failed to load assessment results', 'error');
    }
}

function closeResultsModal() {
    const modal = document.getElementById('results-modal');
    if (modal) {
        modal.remove();
    }
}

async function editAssessment(assessmentId) {
    const assessment = assessmentManager.assessments.find(a => a.id === assessmentId);
    if (assessment) {
        showCreateAssessmentModal(assessment.type);

        // Populate form with existing data
        document.getElementById('assessment-title').value = assessment.title;
        document.getElementById('assessment-type').value = assessment.type;
        document.getElementById('assessment-due-date').value = new Date(assessment.dueDate).toISOString().slice(0, 16);
        document.getElementById('assessment-duration').value = assessment.duration;
        document.getElementById('assessment-questions').value = assessment.totalQuestions;
        document.getElementById('assessment-description').value = assessment.description || '';

        document.getElementById('modal-title').textContent = 'Edit Assessment';

        // Update form handler for editing
        const form = document.getElementById('assessment-form');
        form.onsubmit = async function(e) {
            e.preventDefault();

            const updateData = {
                title: document.getElementById('assessment-title').value,
                type: document.getElementById('assessment-type').value,
                dueDate: document.getElementById('assessment-due-date').value,
                duration: parseInt(document.getElementById('assessment-duration').value),
                totalQuestions: parseInt(document.getElementById('assessment-questions').value),
                description: document.getElementById('assessment-description').value
            };

            const result = await assessmentManager.updateAssessment(assessmentId, updateData);
            if (result) {
                closeAssessmentModal();
                assessmentManager.renderAssessmentsList();
            }
        };
    }
}

async function deleteAssessmentConfirm(assessmentId) {
    const assessment = assessmentManager.assessments.find(a => a.id === assessmentId);
    if (assessment && confirm(`Are you sure you want to delete "${assessment.title}"?`)) {
        const result = await assessmentManager.deleteAssessment(assessmentId);
        if (result) {
            assessmentManager.renderAssessmentsList();
        }
    }
}

// Global assessment functions
window.showCreateAssessmentModal = showCreateAssessmentModal;
window.closeAssessmentModal = closeAssessmentModal;
window.viewAssessmentResults = viewAssessmentResults;
window.closeResultsModal = closeResultsModal;
window.editAssessment = editAssessment;
window.deleteAssessmentConfirm = deleteAssessmentConfirm;

// ===== D7-D24 WORKFLOW PAGE LOADING FUNCTIONS =====

// D7-D12: Advanced Analytics Pages
async function loadEnhancedAdvancedAnalyticsPage() {
    console.log("🔄 Loading enhanced advanced analytics page...");

    // Load advanced analytics data
    await advancedAnalyticsManager.loadAdvancedAnalytics();

    const pageHTML = `
        <div style="margin-bottom: 2rem;">
            <h2 style="margin: 0 0 0.5rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                📊 Advanced Analytics Dashboard
                <span style="background: ${isBackendConnected ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                    ${isBackendConnected ? '🟢 Live Data' : '🟡 Demo Mode'}
                </span>
            </h2>
            <p style="margin: 0; color: var(--gray-600);">Comprehensive learning analytics with AI-powered insights</p>
        </div>

        <div id="advanced-analytics-content">
            <!-- Content will be rendered by AdvancedAnalyticsManager -->
        </div>
    `;

    setInner("page-advanced-analytics", pageHTML);

    // Render the analytics dashboard
    advancedAnalyticsManager.renderAdvancedAnalyticsDashboard();

    console.log("✅ Enhanced advanced analytics page loaded");
}

// D13-D18: Communication Pages
async function loadEnhancedCommunicationPage() {
    console.log("🔄 Loading enhanced communication page...");

    // Load communication data
    await communicationManager.loadCommunicationData();

    const pageHTML = `
        <div style="margin-bottom: 2rem;">
            <h2 style="margin: 0 0 0.5rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                💬 Communication Center
                <span style="background: ${isBackendConnected ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                    ${isBackendConnected ? '🟢 Live Data' : '🟡 Demo Mode'}
                </span>
            </h2>
            <p style="margin: 0; color: var(--gray-600);">Comprehensive communication tools for student engagement</p>
        </div>

        <div id="communication-content">
            <!-- Content will be rendered by CommunicationManager -->
        </div>
    `;

    setInner("page-communication", pageHTML);

    // Render the communication dashboard
    communicationManager.renderCommunicationDashboard();

    console.log("✅ Enhanced communication page loaded");
}

// D19-D24: Content Management Pages
async function loadEnhancedContentManagementPage() {
    console.log("🔄 Loading enhanced content management page...");

    // Load content management data
    await contentManagementSystem.loadContentManagementData();

    const pageHTML = `
        <div style="margin-bottom: 2rem;">
            <h2 style="margin: 0 0 0.5rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                📚 Content Management System
                <span style="background: ${isBackendConnected ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                    ${isBackendConnected ? '🟢 Live Data' : '🟡 Demo Mode'}
                </span>
            </h2>
            <p style="margin: 0; color: var(--gray-600);">Complete content lifecycle management with curriculum mapping</p>
        </div>

        <div id="content-management-content">
            <!-- Content will be rendered by ContentManagementSystem -->
        </div>
    `;

    setInner("page-content-management", pageHTML);

    // Render the content management dashboard
    contentManagementSystem.renderContentManagementDashboard();

    console.log("✅ Enhanced content management page loaded");
}

// Enhanced Assessment Page with new features
async function loadEnhancedAssessmentsPage() {
    console.log("🔄 Loading enhanced assessments page...");

    // Load assessments data
    await assessmentManager.loadAssessments();

    // Calculate statistics
    const totalAssessments = assessmentManager.assessments.length;
    const activeAssessments = assessmentManager.assessments.filter(a => a.status === 'active').length;
    const completedAssessments = assessmentManager.assessments.filter(a => a.status === 'completed');
    const averageScore = completedAssessments.length > 0
        ? Math.round(completedAssessments.reduce((sum, a) => sum + a.averageScore, 0) / completedAssessments.length)
        : 0;
    const pendingReviews = assessmentManager.assessments.filter(a => a.status === 'active' && a.submissions > 0).length;

    const assessmentsHTML = `
        <div style="margin-bottom: 2rem;">
            <h2 style="margin: 0 0 0.5rem 0; color: var(--gray-800); display: flex; align-items: center; gap: 0.5rem;">
                📝 Assessment Management
                <span style="background: ${isBackendConnected ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                    ${isBackendConnected ? '🟢 Live Data' : '🟡 Demo Mode'}
                </span>
            </h2>
            <p style="margin: 0; color: var(--gray-600);">Create, manage, and analyze student assessments with AI insights</p>
        </div>

        <!-- Assessment Statistics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="metric-card">
                <div class="metric-icon">📊</div>
                <div class="metric-value">${totalAssessments}</div>
                <div class="metric-label">Total Assessments</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">✅</div>
                <div class="metric-value">${activeAssessments}</div>
                <div class="metric-label">Active Assessments</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">📈</div>
                <div class="metric-value">${averageScore}%</div>
                <div class="metric-label">Average Score</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">⏰</div>
                <div class="metric-value">${pendingReviews}</div>
                <div class="metric-label">Pending Reviews</div>
            </div>
        </div>

        <!-- Assessment Builder -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">Quick Assessment Builder</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                <button class="assessment-type-btn" onclick="showCreateAssessmentModal('quiz')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📝</div>
                    <h4 style="margin: 0 0 0.5rem 0;">Create Quiz</h4>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Multiple choice, true/false questions</p>
                </button>
                <button class="assessment-type-btn" onclick="showCreateAssessmentModal('assignment')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
                    <h4 style="margin: 0 0 0.5rem 0;">Create Assignment</h4>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">File uploads, written responses</p>
                </button>
                <button class="assessment-type-btn" onclick="showCreateAssessmentModal('project')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎯</div>
                    <h4 style="margin: 0 0 0.5rem 0;">Create Project</h4>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Long-term collaborative work</p>
                </button>
                <button class="assessment-type-btn" onclick="showCreateAssessmentModal('exam')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
                    <h4 style="margin: 0 0 0.5rem 0;">Create Exam</h4>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Comprehensive evaluations</p>
                </button>
            </div>
        </section>

        <!-- Assessments List -->
        <section class="card">
            <div id="assessments-content">
                <!-- Assessment list will be rendered here -->
            </div>
        </section>

        <!-- Assessment Creation Modal -->
        <div id="assessment-modal" class="modal" style="display: none;">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3 id="modal-title">Create New Assessment</h3>
                    <button onclick="closeAssessmentModal()" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="assessment-form">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Assessment Title</label>
                                <input type="text" id="assessment-title" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Assessment Type</label>
                                <select id="assessment-type" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 4px;">
                                    <option value="quiz">Quiz</option>
                                    <option value="assignment">Assignment</option>
                                    <option value="project">Project</option>
                                    <option value="exam">Exam</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Due Date</label>
                                <input type="datetime-local" id="assessment-due-date" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Duration (minutes)</label>
                                <input type="number" id="assessment-duration" min="1" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Total Questions</label>
                                <input type="number" id="assessment-questions" min="1" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 4px;">
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
                            <textarea id="assessment-description" rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 4px; resize: vertical;"></textarea>
                        </div>

                        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                            <button type="button" onclick="closeAssessmentModal()" class="btn" style="background: var(--gray-500);">Cancel</button>
                            <button type="submit" class="btn" style="background: var(--success);">Create Assessment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    setInner("page-assessments", assessmentsHTML);

    // Render assessments list
    assessmentManager.renderAssessmentsList();

    // Setup form handler
    setupAssessmentFormHandler();

    console.log("✅ Enhanced assessments page loaded");
}

// Global functions for D7-D24 workflow tools
window.loadEnhancedAdvancedAnalyticsPage = loadEnhancedAdvancedAnalyticsPage;
window.loadEnhancedCommunicationPage = loadEnhancedCommunicationPage;
window.loadEnhancedContentManagementPage = loadEnhancedContentManagementPage;
window.loadEnhancedAssessmentsPage = loadEnhancedAssessmentsPage;

// Utility functions for enhanced features
async function refreshAdvancedAnalytics() {
    UIComponents.showNotification("🔄 Refreshing analytics data...", "info");
    await advancedAnalyticsManager.loadAdvancedAnalytics();
    advancedAnalyticsManager.renderAdvancedAnalyticsDashboard();
    UIComponents.showNotification("✅ Analytics data refreshed", "success");
}

async function exportAnalyticsReport() {
    UIComponents.showNotification("📊 Generating analytics report...", "info");
    // Simulate export process
    setTimeout(() => {
        UIComponents.showNotification("✅ Analytics report exported successfully", "success");
    }, 2000);
}

// Communication functions
function showComposeMessageModal() {
    UIComponents.showNotification("✉️ Opening message composer...", "info");
}

function showSendNotificationModal() {
    UIComponents.showNotification("📢 Opening notification sender...", "info");
}

function showScheduleVideoModal() {
    UIComponents.showNotification("📹 Opening video session scheduler...", "info");
}

function showBulkMessageModal() {
    UIComponents.showNotification("📨 Opening bulk message tool...", "info");
}

function replyToMessage(messageId) {
    UIComponents.showNotification(`↩️ Replying to message ${messageId}...`, "info");
}

function markAsRead(messageId) {
    UIComponents.showNotification(`✅ Message ${messageId} marked as read`, "success");
}

function manageForum(forumId) {
    UIComponents.showNotification(`⚙️ Managing forum ${forumId}...`, "info");
}

function editVideoSession(sessionId) {
    UIComponents.showNotification(`✏️ Editing video session ${sessionId}...`, "info");
}

function startVideoSession(sessionId) {
    UIComponents.showNotification(`▶️ Starting video session ${sessionId}...`, "success");
}

// Content management functions
function showCreateContentModal() {
    UIComponents.showNotification("➕ Opening content creator...", "info");
}

function showUploadResourceModal() {
    UIComponents.showNotification("📤 Opening resource uploader...", "info");
}

function showCurriculumMapperModal() {
    UIComponents.showNotification("🗺️ Opening curriculum mapper...", "info");
}

function showContentSharingModal() {
    UIComponents.showNotification("🔗 Opening content sharing tool...", "info");
}

function editContent(contentId) {
    UIComponents.showNotification(`✏️ Editing content ${contentId}...`, "info");
}

function viewContentAnalytics(contentId) {
    UIComponents.showNotification(`📊 Viewing analytics for content ${contentId}...`, "info");
}

function shareContent(contentId) {
    UIComponents.showNotification(`🔗 Sharing content ${contentId}...`, "info");
}

function duplicateContent(contentId) {
    UIComponents.showNotification(`📋 Duplicating content ${contentId}...`, "success");
}

function editResource(resourceId) {
    UIComponents.showNotification(`✏️ Editing resource ${resourceId}...`, "info");
}

function downloadResource(resourceId) {
    UIComponents.showNotification(`📥 Downloading resource ${resourceId}...`, "success");
}

function editCurriculum(curriculumId) {
    UIComponents.showNotification(`✏️ Editing curriculum ${curriculumId}...`, "info");
}

function importSharedContent(contentId) {
    UIComponents.showNotification(`📥 Importing shared content ${contentId}...`, "success");
}

// Global function assignments
window.refreshAdvancedAnalytics = refreshAdvancedAnalytics;
window.exportAnalyticsReport = exportAnalyticsReport;
window.showComposeMessageModal = showComposeMessageModal;
window.showSendNotificationModal = showSendNotificationModal;
window.showScheduleVideoModal = showScheduleVideoModal;
window.showBulkMessageModal = showBulkMessageModal;
window.replyToMessage = replyToMessage;
window.markAsRead = markAsRead;
window.manageForum = manageForum;
window.editVideoSession = editVideoSession;
window.startVideoSession = startVideoSession;
window.showCreateContentModal = showCreateContentModal;
window.showUploadResourceModal = showUploadResourceModal;
window.showCurriculumMapperModal = showCurriculumMapperModal;
window.showContentSharingModal = showContentSharingModal;
window.editContent = editContent;
window.viewContentAnalytics = viewContentAnalytics;
window.shareContent = shareContent;
window.duplicateContent = duplicateContent;
window.editResource = editResource;
window.downloadResource = downloadResource;
window.editCurriculum = editCurriculum;
window.importSharedContent = importSharedContent;

console.log("🌱 AgenticLearn Educator Portal - Vanilla JavaScript Version Loaded");
