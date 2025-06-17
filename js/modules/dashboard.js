// ===== DASHBOARD MODULE =====

import { apiClient } from '../core/api-client.js';
import { UIComponents } from '../components/ui-components.js';
import { setInner, formatPercentage, formatNumber } from '../core/utils.js';
import { SUCCESS_MESSAGES } from '../core/config.js';

export class DashboardModule {
    constructor() {
        this.data = null;
        this.isLoading = false;
        this.refreshInterval = null;
    }

    async initialize() {
        console.log('🏠 Initializing Dashboard Module...');
        await this.loadDashboardData();
        this.setupAutoRefresh();
    }

    async loadDashboardData() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            console.log('🔄 Loading dashboard analytics from backend...');
            const response = await apiClient.getDashboardAnalytics();

            if (response && response.success && response.data) {
                this.data = response.data;
                this.renderDashboard();
                console.log('✅ Dashboard analytics loaded successfully');
            } else {
                throw new Error('Invalid dashboard response format');
            }
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            this.renderError(error.message);
        } finally {
            this.isLoading = false;
        }
    }

    renderDashboard() {
        if (!this.data) return;

        const { overview, course_statistics, students_summary } = this.data;

        // Render overview metrics
        this.renderOverviewMetrics(overview);
        
        // Render course statistics
        this.renderCourseStatistics(course_statistics);
        
        // Render students summary
        this.renderStudentsSummary(students_summary);
        
        // Update last refresh time
        this.updateLastRefreshTime();
    }

    renderOverviewMetrics(overview) {
        const metricsHTML = `
            <div class="metrics-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            ">
                ${UIComponents.createMetricCard(
                    'Total Students',
                    formatNumber(overview.total_students),
                    null,
                    '👥'
                )}
                ${UIComponents.createMetricCard(
                    'Active Students',
                    formatNumber(overview.active_students),
                    null,
                    '✅'
                )}
                ${UIComponents.createMetricCard(
                    'Average Progress',
                    formatPercentage(overview.average_progress),
                    null,
                    '📈'
                )}
                ${UIComponents.createMetricCard(
                    'Average Engagement',
                    formatNumber(overview.average_engagement, 1),
                    null,
                    '🎯'
                )}
                ${UIComponents.createMetricCard(
                    'Average Score',
                    formatNumber(overview.average_score, 1),
                    null,
                    '🏆'
                )}
            </div>
        `;

        setInner('overview-metrics', metricsHTML);
    }

    renderCourseStatistics(courseStats) {
        const courseHTML = `
            <div class="course-stats" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            ">
                ${UIComponents.createMetricCard(
                    'Total Courses',
                    formatNumber(courseStats.total_courses),
                    null,
                    '📚'
                )}
                ${UIComponents.createMetricCard(
                    'Active Courses',
                    formatNumber(courseStats.active_courses),
                    null,
                    '🟢'
                )}
                ${UIComponents.createMetricCard(
                    'Draft Courses',
                    formatNumber(courseStats.draft_courses),
                    null,
                    '📝'
                )}
            </div>
        `;

        setInner('course-statistics', courseHTML);
    }

    renderStudentsSummary(students) {
        if (!students || students.length === 0) {
            setInner('students-summary', UIComponents.createEmptyState(
                'No Students Found',
                'No student data available at the moment.',
                { label: 'Refresh Data', onclick: 'dashboardModule.loadDashboardData()' }
            ));
            return;
        }

        const studentsHTML = students.map(student => `
            <div class="student-summary-card" style="
                background: var(--white);
                border-radius: 8px;
                padding: 1rem;
                border-left: 4px solid ${this.getRiskColor(student.risk_level)};
                box-shadow: var(--shadow-sm);
                margin-bottom: 1rem;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <h4 style="margin: 0; color: var(--gray-800);">${student.name}</h4>
                    ${UIComponents.createBadge(student.risk_level, this.getRiskBadgeType(student.risk_level))}
                </div>
                
                ${UIComponents.createProgressBar(
                    student.progress_percentage,
                    'Progress',
                    this.getProgressColor(student.progress_percentage)
                )}
                
                <div style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-top: 1rem;
                    font-size: 0.875rem;
                ">
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--primary);">
                            ${formatNumber(student.engagement_score, 1)}
                        </div>
                        <div style="color: var(--gray-600);">Engagement</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--success);">
                            ${formatNumber(student.average_score, 1)}
                        </div>
                        <div style="color: var(--gray-600);">Avg Score</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--info);">
                            ${formatPercentage(student.progress_percentage)}
                        </div>
                        <div style="color: var(--gray-600);">Complete</div>
                    </div>
                </div>
            </div>
        `).join('');

        setInner('students-summary', studentsHTML);
    }

    renderError(errorMessage) {
        const errorHTML = `
            <div class="error-state" style="
                text-align: center;
                padding: 3rem 2rem;
                color: var(--error);
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3 style="margin: 0 0 0.5rem 0; color: var(--error);">Backend Connection Failed</h3>
                <p style="margin: 0 0 1.5rem 0; color: var(--gray-600);">
                    ${errorMessage}
                </p>
                <button class="btn btn-primary" onclick="dashboardModule.loadDashboardData()">
                    🔄 Retry Connection
                </button>
            </div>
        `;

        setInner('dashboard-content', errorHTML);
    }

    setupAutoRefresh() {
        // Clear existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        // Set up auto-refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            if (!this.isLoading) {
                this.loadDashboardData();
            }
        }, 30000);
    }

    updateLastRefreshTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const refreshElement = document.getElementById('last-refresh-time');
        if (refreshElement) {
            refreshElement.textContent = `Last updated: ${timeString}`;
        }
    }

    getRiskColor(riskLevel) {
        switch (riskLevel?.toLowerCase()) {
            case 'high': return 'var(--error)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--success)';
            default: return 'var(--gray-400)';
        }
    }

    getRiskBadgeType(riskLevel) {
        switch (riskLevel?.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    }

    getProgressColor(percentage) {
        if (percentage >= 80) return 'var(--success)';
        if (percentage >= 60) return 'var(--warning)';
        return 'var(--error)';
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// Create and export singleton instance
export const dashboardModule = new DashboardModule();
export default dashboardModule;
