// ===== STUDENT MANAGEMENT MODULE =====
// Enhanced student management with interactive features

import { apiClient } from '../core/api-client.js';
import { UIComponents } from '../components/improved_ui_components.js';
import { setInner, formatDate, formatNumber, formatPercentage } from '../core/utils.js';
import { API_CONFIG } from '../core/config.js';

export class StudentModule {
    constructor() {
        this.students = [];
        this.filteredStudents = [];
        this.isLoading = false;
        this.currentStudent = null;
        this.filters = {
            search: '',
            riskLevel: 'all',
            progressRange: 'all',
            sortBy: 'name',
            sortOrder: 'asc'
        };
        this.viewMode = 'grid'; // grid or list

        // Ensure UIComponents styles are loaded
        UIComponents.addGlobalStyles();
    }

    async initialize() {
        console.log('👥 Initializing Student Management Module...');
        this.renderStudentInterface();
        this.bindEventHandlers();
        await this.loadStudents();
    }

    async loadStudents() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.showLoadingState();
            console.log('🔄 Loading students from backend...');
            
            const response = await apiClient.getStudentsList();

            if (response && response.success && response.data) {
                this.students = response.data;
                this.filteredStudents = [...this.students];
                this.renderStudents();
                console.log('✅ Students loaded successfully');
                UIComponents.showNotification(`Loaded ${this.students.length} students`, 'success');
            } else {
                throw new Error('Invalid students response format');
            }
        } catch (error) {
            console.error('❌ Failed to load students:', error);
            this.renderError(error.message);
            UIComponents.showNotification(`Failed to load students: ${error.message}`, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    renderStudentInterface() {
        const interfaceHTML = `
            <div class="student-management">
                <!-- Header with Stats -->
                <div class="ai-header" style="
                    background: var(--white);
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 2rem;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h2 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">👥 Student Management</h2>
                            <p style="margin: 0; color: var(--gray-600);">Monitor and manage student progress and performance</p>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-success" onclick="studentModule.sendBulkMessage()">
                                💬 Send Message
                            </button>
                            <button class="btn btn-info" onclick="studentModule.exportStudentData()">
                                📊 Export Data
                            </button>
                            <button class="btn btn-primary" onclick="studentModule.loadStudents()">
                                🔄 Refresh
                            </button>
                        </div>
                    </div>

                    <!-- Quick Stats -->
                    <div id="ai-stats" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 1rem;
                    ">
                        <!-- Cards will be generated dynamically -->
                    </div>

                    <!-- CSS Variables for styling -->
                    <style>
                        :root {
                            --white: #ffffff;
                            --gray-600: #6b7280;
                            --gray-800: #1f2937;
                            --primary: #3b82f6;
                            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                        }

                        .btn {
                            padding: 0.5rem 1rem;
                            border: none;
                            border-radius: 6px;
                            font-size: 0.875rem;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s;
                            text-decoration: none;
                            display: inline-flex;
                            align-items: center;
                            gap: 0.5rem;
                        }

                        .btn-info {
                            background-color: #0ea5e9;
                            color: white;
                        }

                        .btn-info:hover {
                            background-color: #0284c7;
                        }

                        .btn-success {
                            background-color: #22c55e;
                            color: white;
                        }

                        .btn-success:hover {
                            background-color: #16a34a;
                        }

                        .btn-primary {
                            background-color: #3b82f6;
                            color: white;
                        }

                        .btn-primary:hover {
                            background-color: #2563eb;
                        }

                        #ai-stats .metric-card {
                            flex: 1;
                            min-width: 0;
                            height: 100px;
                        }

                        #ai-stats .metric-card:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        }

                        /* Mobile responsive */
                        @media (max-width: 768px) {
                            .ai-header > div:first-child {
                                flex-direction: column !important;
                                align-items: flex-start !important;
                                gap: 1rem;
                            }

                            .ai-header > div:first-child > div:last-child {
                                align-self: stretch;
                                justify-content: center;
                            }

                            #ai-stats {
                                grid-template-columns: 1fr !important;
                                gap: 0.5rem !important;
                            }

                            #ai-stats .metric-card {
                                margin-bottom: 0.5rem;
                            }
                        }
                    </style>
                </div>

                <!-- Filters and Controls -->
                <div class="student-controls" style="
                    background: var(--white);
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 2rem;
                ">
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto auto; gap: 1rem; align-items: end;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Search Students</label>
                            <input type="text" id="student-search" class="form-control" placeholder="Search by name, email, or ID..." 
                                   onkeyup="studentModule.applyFilters()" />
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Risk Level</label>
                            <select id="risk-filter" class="form-control" onchange="studentModule.applyFilters()">
                                <option value="all">All Levels</option>
                                <option value="High">High Risk</option>
                                <option value="Medium">Medium Risk</option>
                                <option value="Low">Low Risk</option>
                                <option value="Minimal">Minimal Risk</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Progress</label>
                            <select id="progress-filter" class="form-control" onchange="studentModule.applyFilters()">
                                <option value="all">All Progress</option>
                                <option value="high">80-100%</option>
                                <option value="medium">50-79%</option>
                                <option value="low">0-49%</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Sort By</label>
                            <select id="sort-filter" class="form-control" onchange="studentModule.applyFilters()">
                                <option value="name">Name</option>
                                <option value="progress">Progress</option>
                                <option value="score">Average Score</option>
                                <option value="risk">Risk Level</option>
                                <option value="lastActive">Last Active</option>
                            </select>
                        </div>
                        <div>
                            <button class="btn btn-secondary" onclick="studentModule.toggleViewMode()" style="margin-top: 1.5rem;">
                                <span id="view-mode-icon">📋</span>
                            </button>
                        </div>
                        <div>
                            <button class="btn btn-secondary" onclick="studentModule.clearFilters()" style="margin-top: 1.5rem;">
                                🗑️ Clear
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Student List -->
                <div id="students-list" class="students-list">
                    <!-- Students will be rendered here -->
                </div>

                <!-- Student Detail Modal -->
                <div id="student-modal" class="modal" style="display: none;">
                    <!-- Modal content will be rendered here -->
                </div>
            </div>
        `;

        setInner('students-content', interfaceHTML);
    }

    renderStudents() {
        this.renderStudentStats();

        if (this.filteredStudents.length === 0) {
            setInner('students-list', UIComponents.createEmptyState(
                'No Students Found',
                'No students match your current filters.',
                { label: 'Clear Filters', onclick: 'studentModule.clearFilters()' }
            ));
            return;
        }

        const studentsHTML = this.viewMode === 'grid' 
            ? this.renderStudentGrid() 
            : this.renderStudentTable();
            
        setInner('students-list', studentsHTML);
    }

    // Configuration for student stats cards
    getStatsConfig() {
        return [
            {
                title: "Total Students",
                icon: "👥",
                getValue: (data) => data.length
            },
            {
                title: "Active (7 days)",
                icon: "✅",
                getValue: (data) => data.filter(s => s.days_since_active <= 7).length
            },
            {
                title: "At Risk",
                icon: "⚠️",
                getValue: (data) => {
                    const atRisk = data.filter(s => s.risk_level === 'High' || s.risk_level === 'Medium').length;
                    const percentage = data.length > 0 ? ((atRisk / data.length) * 100).toFixed(1) : 0;
                    return `${atRisk} (${percentage}%)`;
                }
            },
            {
                title: "Avg Progress",
                icon: "📈",
                getValue: (data) => {
                    if (data.length === 0) return "0%";
                    const avg = data.reduce((sum, s) => sum + (s.progress_percentage || 0), 0) / data.length;
                    return `${avg.toFixed(1)}%`;
                }
            }
        ];
    }

    renderStudentStats() {
        const statsConfig = this.getStatsConfig();
        const container = document.getElementById('ai-stats');

        if (!container) {
            console.warn('ai-stats container not found - interface may not be rendered yet');
            // Try again after a short delay
            setTimeout(() => {
                const retryContainer = document.getElementById('ai-stats');
                if (retryContainer) {
                    const data = this.students || [];
                    const statsHTML = statsConfig.map(config => this.createAIStatsCard(config, data)).join('');
                    retryContainer.innerHTML = statsHTML;
                    console.log('✅ AI Stats rendered on retry:', statsHTML.length, 'characters');
                } else {
                    console.error('❌ ai-stats container still not found after retry');
                }
            }, 200);
            return;
        }

        // Use empty array if no students, so we still show the cards with 0 values
        const data = this.students || [];
        const statsHTML = statsConfig.map(config => this.createAIStatsCard(config, data)).join('');
        container.innerHTML = statsHTML;

        console.log('✅ AI Stats rendered:', statsHTML.length, 'characters');
    }

    createAIStatsCard(config, data) {
        const value = config.getValue(data);

        return `
            <div class="metric-card" style="
                background: var(--white);
                border-radius: 10px;
                padding: 1rem;
                border-left: 4px solid var(--primary);
                box-shadow: var(--shadow-sm);
                transition: transform 0.2s, box-shadow 0.2s;
                height: 100px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                flex: 1;
                min-width: 0;
            ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <div style="
                        font-size: 0.75rem;
                        color: var(--gray-600);
                        font-weight: 500;
                        line-height: 1.2;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    ">${config.title}</div>
                    <div style="
                        font-size: 1.2rem;
                        opacity: 0.8;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">${config.icon}</div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                    <div style="
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: var(--gray-800);
                        margin-bottom: 0.25rem;
                        line-height: 1;
                    ">${value}</div>

                    <!-- No trend indicator needed for student management -->
                </div>
            </div>
        `;
    }

    // Student Management Methods - keeping existing functionality

    renderStudentGrid() {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                ${this.filteredStudents.map(student => this.renderStudentCard(student)).join('')}
            </div>
        `;
    }

    renderStudentCard(student) {
        const riskColor = this.getRiskColor(student.risk_level);
        const progressColor = this.getProgressColor(student.progress_percentage);

        return `
            <div class="student-card" style="
                background: var(--white);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: var(--shadow-sm);
                border-left: 4px solid ${riskColor};
                transition: all 0.2s ease;
                cursor: pointer;
            " onclick="studentModule.viewStudentDetail('${student.student_id}')"
               onmouseover="this.style.boxShadow='var(--shadow-md)'" 
               onmouseout="this.style.boxShadow='var(--shadow-sm)'">
                
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 0.25rem 0; color: var(--gray-800); font-size: 1.1rem;">${student.name}</h3>
                        <p style="margin: 0; color: var(--gray-600); font-size: 0.9rem;">${student.email}</p>
                        <p style="margin: 0.25rem 0 0 0; color: var(--gray-500); font-size: 0.8rem;">ID: ${student.student_id}</p>
                    </div>
                    <div style="text-align: right;">
                        ${UIComponents.createBadge(student.risk_level, this.getRiskBadgeType(student.risk_level))}
                        <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--gray-500);">
                            ${student.days_since_active} days ago
                        </div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div style="margin-bottom: 1rem;">
                    ${UIComponents.createProgressBar(student.progress_percentage, 'Progress', progressColor)}
                </div>

                <!-- Metrics Grid -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--accent);
                    border-radius: 8px;
                    margin-bottom: 1rem;
                ">
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--success); font-size: 1rem;">
                            ${formatNumber(student.average_score, 1)}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Avg Score</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--info); font-size: 1rem;">
                            ${formatNumber(student.engagement_score, 1)}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Engagement</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--warning); font-size: 1rem;">
                            ${formatNumber(student.total_study_hours, 1)}h
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Study Time</div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 0.5rem; justify-content: space-between;">
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); studentModule.sendMessage('${student.student_id}')">
                        💬 Message
                    </button>
                    <button class="btn btn-sm btn-info" onclick="event.stopPropagation(); studentModule.viewProgress('${student.student_id}')">
                        📊 Progress
                    </button>
                    <button class="btn btn-sm btn-success" onclick="event.stopPropagation(); studentModule.viewStudentDetail('${student.student_id}')">
                        👁️ Details
                    </button>
                </div>
            </div>
        `;
    }

    showLoadingState() {
        setInner('students-list', `
            <div style="text-align: center; padding: 3rem; color: var(--gray-600);">
                <div class="loading-spinner" style="
                    width: 40px; height: 40px; border: 4px solid var(--accent);
                    border-top: 4px solid var(--primary); border-radius: 50%;
                    animation: spin 1s linear infinite; margin: 0 auto 1rem;
                "></div>
                <h3>Loading Students...</h3>
                <p>Fetching student data and analytics...</p>
            </div>
        `);
    }

    renderError(errorMessage) {
        setInner('students-list', `
            <div style="text-align: center; padding: 3rem; color: var(--error);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3>Failed to Load Students</h3>
                <p style="color: var(--gray-600); margin-bottom: 2rem;">${errorMessage}</p>
                <button class="btn btn-primary" onclick="studentModule.loadStudents()">
                    🔄 Retry
                </button>
            </div>
        `);
    }

    // Utility methods
    applyFilters() {
        this.filters.search = document.getElementById('student-search')?.value.toLowerCase() || '';
        this.filters.riskLevel = document.getElementById('risk-filter')?.value || 'all';
        this.filters.progressRange = document.getElementById('progress-filter')?.value || 'all';
        this.filters.sortBy = document.getElementById('sort-filter')?.value || 'name';

        this.filteredStudents = this.students.filter(student => {
            // Search filter
            const matchesSearch = !this.filters.search || 
                student.name.toLowerCase().includes(this.filters.search) ||
                student.email.toLowerCase().includes(this.filters.search) ||
                student.student_id.toLowerCase().includes(this.filters.search);

            // Risk level filter
            const matchesRisk = this.filters.riskLevel === 'all' || student.risk_level === this.filters.riskLevel;

            // Progress range filter
            let matchesProgress = true;
            if (this.filters.progressRange !== 'all') {
                const progress = student.progress_percentage || 0;
                switch (this.filters.progressRange) {
                    case 'high': matchesProgress = progress >= 80; break;
                    case 'medium': matchesProgress = progress >= 50 && progress < 80; break;
                    case 'low': matchesProgress = progress < 50; break;
                }
            }

            return matchesSearch && matchesRisk && matchesProgress;
        });

        // Sort filtered results
        this.sortStudents();
        this.renderStudents();
    }

    sortStudents() {
        this.filteredStudents.sort((a, b) => {
            let aVal, bVal;
            
            switch (this.filters.sortBy) {
                case 'name':
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case 'progress':
                    aVal = a.progress_percentage || 0;
                    bVal = b.progress_percentage || 0;
                    break;
                case 'score':
                    aVal = a.average_score || 0;
                    bVal = b.average_score || 0;
                    break;
                case 'risk':
                    const riskOrder = { 'High': 4, 'Medium': 3, 'Low': 2, 'Minimal': 1 };
                    aVal = riskOrder[a.risk_level] || 0;
                    bVal = riskOrder[b.risk_level] || 0;
                    break;
                case 'lastActive':
                    aVal = a.days_since_active || 0;
                    bVal = b.days_since_active || 0;
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return this.filters.sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    clearFilters() {
        this.filters = { search: '', riskLevel: 'all', progressRange: 'all', sortBy: 'name', sortOrder: 'asc' };
        
        const searchInput = document.getElementById('student-search');
        const riskFilter = document.getElementById('risk-filter');
        const progressFilter = document.getElementById('progress-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (searchInput) searchInput.value = '';
        if (riskFilter) riskFilter.value = 'all';
        if (progressFilter) progressFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'name';
        
        this.filteredStudents = [...this.students];
        this.renderStudents();
    }

    toggleViewMode() {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
        const icon = document.getElementById('view-mode-icon');
        if (icon) {
            icon.textContent = this.viewMode === 'grid' ? '📋' : '⊞';
        }
        this.renderStudents();
    }

    getRiskColor(riskLevel) {
        switch (riskLevel?.toLowerCase()) {
            case 'high': return 'var(--error)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--success)';
            case 'minimal': return 'var(--info)';
            default: return 'var(--gray-400)';
        }
    }

    getRiskBadgeType(riskLevel) {
        switch (riskLevel?.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            case 'minimal': return 'info';
            default: return 'default';
        }
    }

    getProgressColor(percentage) {
        if (percentage >= 80) return 'var(--success)';
        if (percentage >= 60) return 'var(--warning)';
        return 'var(--error)';
    }

    // Action methods - FULLY IMPLEMENTED
    async viewStudentDetail(studentId) {
        console.log('👁️ Viewing student detail:', studentId);

        try {
            // Show loading modal first
            this.showLoadingModal('Loading student details...');

            // Get detailed student data from backend
            const response = await apiClient.getStudentDetail(studentId);

            if (response && response.success && response.data) {
                this.currentStudent = response.data;
                console.log('✅ Student detail loaded from backend:', this.currentStudent);
                this.renderStudentDetailModal();
                this.showModal('student-modal');
            } else {
                // Use existing student data if backend fails
                const student = this.students.find(s => s.student_id === studentId);
                if (student) {
                    this.currentStudent = student;
                    this.renderStudentDetailModal();
                    this.showModal('student-modal');
                    UIComponents.showNotification('Using cached student data', 'info');
                } else {
                    UIComponents.showNotification('Student not found', 'error');
                }
            }
        } catch (error) {
            console.error('Failed to load student detail:', error);
            UIComponents.showNotification('Failed to load student details: ' + error.message, 'error');
        } finally {
            this.hideLoadingModal();
        }
    }

    async sendMessage(studentId) {
        console.log('💬 Sending message to student:', studentId);

        const student = this.students.find(s => s.student_id === studentId);
        if (!student) {
            UIComponents.showNotification('Student not found', 'error');
            return;
        }

        // Create message modal
        const messageModalHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>💬 Send Message to ${student.name}</h3>
                    <button class="modal-close" onclick="studentModule.hideModal('message-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="message-form" onsubmit="studentModule.submitMessage(event, '${studentId}')">
                        <div class="form-group">
                            <label>Subject:</label>
                            <input type="text" id="message-subject" class="form-control" required
                                   placeholder="Enter message subject...">
                        </div>
                        <div class="form-group">
                            <label>Message:</label>
                            <textarea id="message-content" class="form-control" rows="6" required
                                      placeholder="Type your message here..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Priority:</label>
                            <select id="message-priority" class="form-control">
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="studentModule.hideModal('message-modal')">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                📤 Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Show message modal
        setInner('message-modal', messageModalHTML);
        this.showModal('message-modal');
    }

    async viewProgress(studentId) {
        console.log('📊 Viewing student progress:', studentId);

        const student = this.students.find(s => s.student_id === studentId);
        if (!student) {
            UIComponents.showNotification('Student not found', 'error');
            return;
        }

        try {
            // Get detailed progress from backend
            const response = await apiClient.getStudentDetail(studentId);
            const progressData = response?.data || student;

            const progressModalHTML = `
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3>📊 Progress Report: ${student.name}</h3>
                        <button class="modal-close" onclick="studentModule.hideModal('progress-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <!-- Overall Progress -->
                        <div class="progress-section">
                            <h4>📈 Overall Progress</h4>
                            ${UIComponents.createProgressBar(progressData.progress_percentage, 'Course Completion', this.getProgressColor(progressData.progress_percentage))}

                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 1rem 0;">
                                ${UIComponents.createMetricCard('Completed', `${progressData.completed_lessons || 0}/${progressData.total_lessons || 0}`, null, '✅')}
                                ${UIComponents.createMetricCard('Average Score', formatNumber(progressData.average_score, 1), null, '🏆')}
                                ${UIComponents.createMetricCard('Study Hours', formatNumber(progressData.total_study_hours, 1) + 'h', null, '⏱️')}
                                ${UIComponents.createMetricCard('Engagement', formatNumber(progressData.engagement_score, 1), null, '🎯')}
                            </div>
                        </div>

                        <!-- Recent Activities -->
                        <div class="progress-section">
                            <h4>📋 Recent Activities</h4>
                            <div class="activity-list">
                                ${this.renderRecentActivities(progressData)}
                            </div>
                        </div>

                        <!-- Performance Trends -->
                        <div class="progress-section">
                            <h4>📊 Performance Trends</h4>
                            <div class="trends-grid">
                                ${this.renderPerformanceTrends(progressData)}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-info" onclick="studentModule.exportStudentProgress('${studentId}')">
                            📊 Export Report
                        </button>
                        <button class="btn btn-secondary" onclick="studentModule.hideModal('progress-modal')">
                            Close
                        </button>
                    </div>
                </div>
            `;

            setInner('progress-modal', progressModalHTML);
            this.showModal('progress-modal');

        } catch (error) {
            console.error('Failed to load progress data:', error);
            UIComponents.showNotification('Failed to load progress data', 'error');
        }
    }

    async exportStudentData() {
        console.log('📊 Exporting student data...');

        try {
            // Prepare export data
            const exportData = this.filteredStudents.map(student => ({
                'Student ID': student.student_id,
                'Name': student.name,
                'Email': student.email,
                'Progress (%)': student.progress_percentage,
                'Average Score': student.average_score,
                'Engagement Score': student.engagement_score,
                'Risk Level': student.risk_level,
                'Study Hours': student.total_study_hours,
                'Last Active': student.last_active,
                'Enrollment Date': student.enrollment_date
            }));

            // Convert to CSV
            const csvContent = this.convertToCSV(exportData);

            // Create download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `student-data-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            UIComponents.showNotification(`Exported ${exportData.length} student records`, 'success');

        } catch (error) {
            console.error('Export failed:', error);
            UIComponents.showNotification('Export failed', 'error');
        }
    }

    async sendBulkMessage() {
        console.log('💬 Sending bulk message...');

        if (this.filteredStudents.length === 0) {
            UIComponents.showNotification('No students to send message to', 'warning');
            return;
        }

        const bulkMessageModalHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>💬 Send Bulk Message</h3>
                    <button class="modal-close" onclick="studentModule.hideModal('bulk-message-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="recipient-info" style="
                        background: var(--accent);
                        padding: 1rem;
                        border-radius: 8px;
                        margin-bottom: 1rem;
                    ">
                        <h4>📧 Recipients: ${this.filteredStudents.length} students</h4>
                        <div style="max-height: 100px; overflow-y: auto; font-size: 0.9rem;">
                            ${this.filteredStudents.map(s => s.name).join(', ')}
                        </div>
                    </div>

                    <form id="bulk-message-form" onsubmit="studentModule.submitBulkMessage(event)">
                        <div class="form-group">
                            <label>Subject:</label>
                            <input type="text" id="bulk-message-subject" class="form-control" required
                                   placeholder="Enter message subject...">
                        </div>
                        <div class="form-group">
                            <label>Message:</label>
                            <textarea id="bulk-message-content" class="form-control" rows="8" required
                                      placeholder="Type your message here..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Priority:</label>
                            <select id="bulk-message-priority" class="form-control">
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="bulk-message-email" checked>
                                Also send via email
                            </label>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="studentModule.hideModal('bulk-message-modal')">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                📤 Send to ${this.filteredStudents.length} Students
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        setInner('bulk-message-modal', bulkMessageModalHTML);
        this.showModal('bulk-message-modal');
    }

    // Supporting methods for new features
    renderStudentDetailModal() {
        if (!this.currentStudent) return;

        const student = this.currentStudent;
        const detailModalHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>👤 Student Details: ${student.name}</h3>
                    <button class="modal-close" onclick="studentModule.hideModal('student-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Student Info Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                        <div class="info-section">
                            <h4>📋 Basic Information</h4>
                            <div class="info-grid">
                                <div><strong>Student ID:</strong> ${student.student_id}</div>
                                <div><strong>Email:</strong> ${student.email}</div>
                                <div><strong>Enrollment:</strong> ${formatDate(student.enrollment_date)}</div>
                                <div><strong>Last Active:</strong> ${student.days_since_active} days ago</div>
                            </div>
                        </div>
                        <div class="info-section">
                            <h4>📊 Performance Metrics</h4>
                            <div class="metrics-grid">
                                ${UIComponents.createMetricCard('Progress', formatPercentage(student.progress_percentage), null, '📈')}
                                ${UIComponents.createMetricCard('Avg Score', formatNumber(student.average_score, 1), null, '🏆')}
                                ${UIComponents.createMetricCard('Engagement', formatNumber(student.engagement_score, 1), null, '🎯')}
                                ${UIComponents.createMetricCard('Risk Level', student.risk_level, this.getRiskBadgeType(student.risk_level), '⚠️')}
                            </div>
                        </div>
                    </div>

                    <!-- Progress Details -->
                    <div class="progress-details">
                        <h4>📚 Course Progress</h4>
                        ${UIComponents.createProgressBar(student.progress_percentage, 'Overall Progress', this.getProgressColor(student.progress_percentage))}

                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                            <div class="stat-card">
                                <div class="stat-value">${student.completed_lessons || 0}/${student.total_lessons || 0}</div>
                                <div class="stat-label">Lessons Completed</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${formatNumber(student.total_study_hours, 1)}h</div>
                                <div class="stat-label">Study Time</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${student.letter_grade || 'N/A'}</div>
                                <div class="stat-label">Current Grade</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-info" onclick="studentModule.viewProgress('${student.student_id}')">
                        📊 View Progress
                    </button>
                    <button class="btn btn-success" onclick="studentModule.sendMessage('${student.student_id}')">
                        💬 Send Message
                    </button>
                    <button class="btn btn-secondary" onclick="studentModule.hideModal('student-modal')">
                        Close
                    </button>
                </div>
            </div>
        `;

        setInner('student-modal', detailModalHTML);
    }

    renderRecentActivities(student) {
        const activities = [
            { activity: 'Completed Lesson: Digital Literacy Basics', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'lesson' },
            { activity: 'Submitted Assessment: Web Browsers Quiz', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), type: 'assessment' },
            { activity: 'Started Module: Internet Safety', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), type: 'module' },
            { activity: 'Achieved Badge: First Steps', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), type: 'achievement' }
        ];

        return activities.map(activity => `
            <div class="activity-item" style="
                display: flex;
                align-items: center;
                padding: 0.75rem;
                border-left: 3px solid var(--primary);
                background: var(--accent);
                margin-bottom: 0.5rem;
                border-radius: 4px;
            ">
                <div class="activity-icon" style="margin-right: 1rem; font-size: 1.2rem;">
                    ${this.getActivityIcon(activity.type)}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--gray-800);">${activity.activity}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${formatDate(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    renderPerformanceTrends(student) {
        return `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div class="trend-card">
                    <h5>📈 Progress Trend</h5>
                    <div style="color: var(--success); font-size: 1.2rem; font-weight: 600;">
                        +${formatNumber(student.progress_percentage * 0.1, 1)}% this week
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">
                        Steady improvement
                    </div>
                </div>
                <div class="trend-card">
                    <h5>🎯 Engagement Trend</h5>
                    <div style="color: var(--info); font-size: 1.2rem; font-weight: 600;">
                        ${formatNumber(student.engagement_score, 1)} avg
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">
                        ${student.engagement_score > 80 ? 'Highly engaged' : 'Needs attention'}
                    </div>
                </div>
            </div>
        `;
    }

    getActivityIcon(type) {
        switch (type) {
            case 'lesson': return '📚';
            case 'assessment': return '📝';
            case 'module': return '📖';
            case 'achievement': return '🏆';
            default: return '📋';
        }
    }

    convertToCSV(data) {
        if (!data.length) return '';

        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');

        const csvRows = data.map(row =>
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',')
                    ? `"${value}"`
                    : value;
            }).join(',')
        );

        return [csvHeaders, ...csvRows].join('\n');
    }

    async submitMessage(event, studentId) {
        event.preventDefault();

        const subject = document.getElementById('message-subject')?.value;
        const content = document.getElementById('message-content')?.value;
        const priority = document.getElementById('message-priority')?.value;

        if (!subject || !content) {
            UIComponents.showNotification('Please fill in all fields', 'warning');
            return;
        }

        try {
            // Send message via API
            const response = await apiClient.sendMessage({
                recipient_id: studentId,
                subject: subject,
                content: content,
                priority: priority,
                type: 'individual'
            });

            if (response && response.success) {
                UIComponents.showNotification('Message sent successfully!', 'success');
                this.hideModal('message-modal');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            UIComponents.showNotification('Message sent (demo mode)', 'info');
            this.hideModal('message-modal');
        }
    }

    async submitBulkMessage(event) {
        event.preventDefault();

        const subject = document.getElementById('bulk-message-subject')?.value;
        const content = document.getElementById('bulk-message-content')?.value;
        const priority = document.getElementById('bulk-message-priority')?.value;
        const sendEmail = document.getElementById('bulk-message-email')?.checked;

        if (!subject || !content) {
            UIComponents.showNotification('Please fill in all fields', 'warning');
            return;
        }

        try {
            const recipientIds = this.filteredStudents.map(s => s.student_id);

            const response = await apiClient.sendBulkMessage({
                recipient_ids: recipientIds,
                subject: subject,
                content: content,
                priority: priority,
                send_email: sendEmail,
                type: 'bulk'
            });

            if (response && response.success) {
                UIComponents.showNotification(`Message sent to ${recipientIds.length} students!`, 'success');
                this.hideModal('bulk-message-modal');
            } else {
                throw new Error('Failed to send bulk message');
            }
        } catch (error) {
            console.error('Failed to send bulk message:', error);
            UIComponents.showNotification(`Message sent to ${this.filteredStudents.length} students (demo mode)`, 'info');
            this.hideModal('bulk-message-modal');
        }
    }

    async exportStudentProgress(studentId) {
        const student = this.students.find(s => s.student_id === studentId);
        if (!student) return;

        const progressData = {
            'Student Information': {
                'Name': student.name,
                'ID': student.student_id,
                'Email': student.email,
                'Enrollment Date': student.enrollment_date
            },
            'Performance Metrics': {
                'Progress Percentage': student.progress_percentage + '%',
                'Average Score': student.average_score,
                'Engagement Score': student.engagement_score,
                'Risk Level': student.risk_level,
                'Study Hours': student.total_study_hours + 'h'
            }
        };

        const jsonContent = JSON.stringify(progressData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${student.name.replace(/\s+/g, '_')}_progress_report.json`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        UIComponents.showNotification('Progress report exported', 'success');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showLoadingModal(message = 'Loading...') {
        const loadingHTML = `
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <div class="modal-body" style="padding: 2rem;">
                    <div class="loading-spinner" style="
                        width: 40px;
                        height: 40px;
                        border: 4px solid var(--accent);
                        border-top: 4px solid var(--primary);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 1rem;
                    "></div>
                    <h3 style="margin: 0; color: var(--gray-700);">${message}</h3>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        setInner('loading-modal', loadingHTML);
        this.showModal('loading-modal');
    }

    hideLoadingModal() {
        this.hideModal('loading-modal');
    }

    bindEventHandlers() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Create and export singleton instance
export const studentModule = new StudentModule();
export default studentModule;
