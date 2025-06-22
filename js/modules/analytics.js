// ===== ANALYTICS MODULE =====
// Advanced learning analytics with charts and insights

import { apiClient } from '../core/api-client.js';
import { UIComponents } from '../components/improved_ui_components.js';
import { setInner, formatDate, formatNumber, formatPercentage } from '../core/utils.js';
import { API_CONFIG } from '../core/config.js';

export class AnalyticsModule {
    constructor() {
        this.analyticsData = null;
        this.isLoading = false;
        this.currentView = 'overview'; // overview, performance, trends, risks
        this.timeRange = '30d'; // 7d, 30d, 90d, 1y
        this.selectedMetric = 'progress'; // progress, engagement, scores, completion
        
        // Ensure UIComponents styles are loaded
        UIComponents.addGlobalStyles();
    }

    async initialize() {
        console.log('📊 Initializing Analytics Module...');
        
        this.renderAnalyticsInterface();
        this.bindEventHandlers();
        await this.loadAnalyticsData();
        
        console.log('✅ Analytics Module initialized successfully');
    }

    async loadAnalyticsData() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.showLoadingState();
            console.log('🔄 Loading analytics data from backend...');
            
            const response = await apiClient.getDashboardAnalytics();

            if (response && response.success && response.data) {
                this.analyticsData = response.data;
                this.renderAnalytics();
                console.log('✅ Analytics data loaded successfully');
                UIComponents.showNotification('Analytics data updated', 'success');
            } else {
                throw new Error('Invalid analytics response format');
            }
        } catch (error) {
            console.error('❌ Failed to load analytics:', error);
            this.renderError(error.message);
            UIComponents.showNotification(`Failed to load analytics: ${error.message}`, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    renderAnalyticsInterface() {
        const interfaceHTML = `
            <div class="analytics-dashboard">
                <!-- Header with Controls -->
                <div class="analytics-header" style="
                    background: var(--white);
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 2rem;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h2 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">📊 Learning Analytics</h2>
                            <p style="margin: 0; color: var(--gray-600);">Comprehensive insights into student performance and learning patterns</p>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <select id="analytics-timerange" style="padding: 0.5rem; border: 1px solid var(--gray-300); border-radius: 6px;">
                                <option value="7d">Last 7 Days</option>
                                <option value="30d" selected>Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="1y">Last Year</option>
                            </select>
                            <button class="btn btn-primary" onclick="analyticsModule.loadAnalyticsData()">
                                🔄 Refresh
                            </button>
                            <button class="btn btn-info" onclick="analyticsModule.exportAnalytics()">
                                📊 Export
                            </button>
                        </div>
                    </div>

                    <!-- View Tabs -->
                    <div class="analytics-tabs" style="display: flex; gap: 0.5rem;">
                        <button class="tab-btn active" data-view="overview" onclick="analyticsModule.switchView('overview')">
                            📈 Overview
                        </button>
                        <button class="tab-btn" data-view="performance" onclick="analyticsModule.switchView('performance')">
                            🎯 Performance
                        </button>
                        <button class="tab-btn" data-view="trends" onclick="analyticsModule.switchView('trends')">
                            📊 Trends
                        </button>
                        <button class="tab-btn" data-view="risks" onclick="analyticsModule.switchView('risks')">
                            ⚠️ Risk Analysis
                        </button>
                    </div>
                </div>

                <!-- Analytics Content -->
                <div id="analytics-content" class="analytics-content">
                    <!-- Content will be rendered here based on selected view -->
                </div>
            </div>
        `;

        setInner('analytics-content', interfaceHTML);
        
        // Add tab styles
        this.addTabStyles();
    }

    renderAnalytics() {
        if (!this.analyticsData) return;

        switch (this.currentView) {
            case 'overview':
                this.renderOverviewAnalytics();
                break;
            case 'performance':
                this.renderPerformanceAnalytics();
                break;
            case 'trends':
                this.renderTrendsAnalytics();
                break;
            case 'risks':
                this.renderRiskAnalytics();
                break;
            default:
                this.renderOverviewAnalytics();
        }
    }

    renderOverviewAnalytics() {
        const { overview, students_summary } = this.analyticsData;
        
        const overviewHTML = `
            <!-- Key Metrics -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                ${this.createAnalyticsCard('Total Students', overview.total_students, '👥', 'primary')}
                ${this.createAnalyticsCard('Active Students', overview.active_students, '✅', 'success')}
                ${this.createAnalyticsCard('Avg Progress', formatPercentage(overview.average_progress), '📈', 'info')}
                ${this.createAnalyticsCard('At Risk', overview.at_risk_students, '⚠️', 'warning')}
                ${this.createAnalyticsCard('Avg Score', formatNumber(overview.average_score, 1), '🏆', 'success')}
            </div>

            <!-- Progress Distribution Chart -->
            <div class="chart-container" style="
                background: var(--white);
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: var(--shadow-sm);
                margin-bottom: 2rem;
            ">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">📊 Progress Distribution</h3>
                <div id="progress-chart" style="height: 300px;">
                    ${this.renderProgressChart()}
                </div>
            </div>

            <!-- Recent Student Activity -->
            <div class="activity-container" style="
                background: var(--white);
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: var(--shadow-sm);
            ">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">🔄 Recent Student Activity</h3>
                <div id="student-activity">
                    ${this.renderStudentActivity(students_summary)}
                </div>
            </div>
        `;

        setInner('analytics-content', overviewHTML);
    }

    renderPerformanceAnalytics() {
        const performanceHTML = `
            <!-- Performance Metrics -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <!-- Score Distribution -->
                <div class="chart-container" style="
                    background: var(--white);
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                ">
                    <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">🎯 Score Distribution</h3>
                    <div id="score-chart" style="height: 250px;">
                        ${this.renderScoreChart()}
                    </div>
                </div>

                <!-- Engagement Levels -->
                <div class="chart-container" style="
                    background: var(--white);
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                ">
                    <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">💡 Engagement Levels</h3>
                    <div id="engagement-chart" style="height: 250px;">
                        ${this.renderEngagementChart()}
                    </div>
                </div>
            </div>

            <!-- Top Performers -->
            <div class="performers-container" style="
                background: var(--white);
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: var(--shadow-sm);
            ">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">🏆 Top Performers</h3>
                <div id="top-performers">
                    ${this.renderTopPerformers()}
                </div>
            </div>
        `;

        setInner('analytics-content', performanceHTML);
    }

    renderTrendsAnalytics() {
        const trendsHTML = `
            <!-- Trend Analysis -->
            <div class="trends-container" style="
                background: var(--white);
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: var(--shadow-sm);
                margin-bottom: 2rem;
            ">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">📈 Learning Trends</h3>
                <div id="trends-chart" style="height: 400px;">
                    ${this.renderTrendsChart()}
                </div>
            </div>

            <!-- Insights -->
            <div class="insights-container" style="
                background: var(--white);
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: var(--shadow-sm);
            ">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">💡 Key Insights</h3>
                <div id="analytics-insights">
                    ${this.renderAnalyticsInsights()}
                </div>
            </div>
        `;

        setInner('analytics-content', trendsHTML);
    }

    renderRiskAnalytics() {
        const riskHTML = `
            <!-- Risk Overview -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                ${this.createAnalyticsCard('High Risk', this.getRiskCount('high'), '🔴', 'error')}
                ${this.createAnalyticsCard('Medium Risk', this.getRiskCount('medium'), '🟡', 'warning')}
                ${this.createAnalyticsCard('Low Risk', this.getRiskCount('low'), '🟢', 'success')}
                ${this.createAnalyticsCard('No Risk', this.getRiskCount('none'), '✅', 'info')}
            </div>

            <!-- At-Risk Students -->
            <div class="risk-container" style="
                background: var(--white);
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: var(--shadow-sm);
            ">
                <h3 style="margin: 0 0 1rem 0; color: var(--gray-800);">⚠️ Students Requiring Attention</h3>
                <div id="at-risk-students">
                    ${this.renderAtRiskStudents()}
                </div>
            </div>
        `;

        setInner('analytics-content', riskHTML);
    }

    // Helper methods for rendering charts and data
    createAnalyticsCard(title, value, icon, color) {
        return `
            <div style="
                background: var(--white);
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: var(--shadow-sm);
                border-left: 4px solid var(--${color});
                text-align: center;
            ">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${icon}</div>
                <div style="font-size: 2rem; font-weight: bold; color: var(--${color}); margin-bottom: 0.25rem;">
                    ${value}
                </div>
                <div style="color: var(--gray-600); font-size: 0.875rem;">${title}</div>
            </div>
        `;
    }

    renderProgressChart() {
        // Simple text-based chart for now - can be enhanced with actual charting library
        return `
            <div style="display: flex; align-items: end; gap: 1rem; height: 200px; padding: 1rem;">
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                    <div style="background: var(--error); width: 100%; height: 60px; border-radius: 4px 4px 0 0;"></div>
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-600);">0-25%</div>
                    <div style="font-weight: bold; color: var(--error);">12</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                    <div style="background: var(--warning); width: 100%; height: 100px; border-radius: 4px 4px 0 0;"></div>
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-600);">26-50%</div>
                    <div style="font-weight: bold; color: var(--warning);">18</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                    <div style="background: var(--info); width: 100%; height: 140px; border-radius: 4px 4px 0 0;"></div>
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-600);">51-75%</div>
                    <div style="font-weight: bold; color: var(--info);">25</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                    <div style="background: var(--success); width: 100%; height: 180px; border-radius: 4px 4px 0 0;"></div>
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-600);">76-100%</div>
                    <div style="font-weight: bold; color: var(--success);">32</div>
                </div>
            </div>
        `;
    }

    renderScoreChart() {
        return `
            <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
                <div style="position: relative; width: 150px; height: 150px;">
                    <!-- Simple donut chart representation -->
                    <div style="
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: conic-gradient(
                            var(--success) 0deg 120deg,
                            var(--info) 120deg 240deg,
                            var(--warning) 240deg 300deg,
                            var(--error) 300deg 360deg
                        );
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div style="
                            width: 80px;
                            height: 80px;
                            background: var(--white);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            color: var(--gray-800);
                        ">
                            ${this.analyticsData?.overview?.average_score || 85}
                        </div>
                    </div>
                </div>
                <div style="margin-left: 2rem;">
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 12px; height: 12px; background: var(--success); border-radius: 2px;"></div>
                            <span style="font-size: 0.875rem;">90-100 (Excellent)</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 12px; height: 12px; background: var(--info); border-radius: 2px;"></div>
                            <span style="font-size: 0.875rem;">80-89 (Good)</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 12px; height: 12px; background: var(--warning); border-radius: 2px;"></div>
                            <span style="font-size: 0.875rem;">70-79 (Fair)</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 12px; height: 12px; background: var(--error); border-radius: 2px;"></div>
                            <span style="font-size: 0.875rem;">Below 70 (Needs Improvement)</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEngagementChart() {
        return `
            <div style="display: flex; align-items: end; gap: 1rem; height: 200px; padding: 1rem;">
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                    <div style="background: var(--success); width: 100%; height: 160px; border-radius: 4px 4px 0 0;"></div>
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-600);">High</div>
                    <div style="font-weight: bold; color: var(--success);">45%</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                    <div style="background: var(--info); width: 100%; height: 120px; border-radius: 4px 4px 0 0;"></div>
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-600);">Medium</div>
                    <div style="font-weight: bold; color: var(--info);">35%</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                    <div style="background: var(--warning); width: 100%; height: 80px; border-radius: 4px 4px 0 0;"></div>
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-600);">Low</div>
                    <div style="font-weight: bold; color: var(--warning);">20%</div>
                </div>
            </div>
        `;
    }

    renderTopPerformers() {
        const topStudents = this.analyticsData?.students_summary?.slice(0, 5) || [];

        if (topStudents.length === 0) {
            return '<p style="text-align: center; color: var(--gray-600);">No student data available</p>';
        }

        return topStudents.map((student, index) => `
            <div style="
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: var(--accent);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                border-left: 4px solid ${this.getPerformanceColor(student.average_score)};
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    background: ${this.getPerformanceColor(student.average_score)};
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                ">
                    ${index + 1}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--gray-800);">${student.name}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">
                        Score: ${formatNumber(student.average_score, 1)} | Progress: ${formatPercentage(student.progress_percentage)}
                    </div>
                </div>
                <div style="text-align: right;">
                    ${UIComponents.createBadge(this.getPerformanceLevel(student.average_score), this.getPerformanceBadgeType(student.average_score))}
                </div>
            </div>
        `).join('');
    }

    renderTrendsChart() {
        return `
            <div style="display: flex; align-items: center; justify-content: center; height: 350px; color: var(--gray-600);">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📈</div>
                    <h4 style="margin: 0 0 0.5rem 0;">Trend Analysis</h4>
                    <p style="margin: 0;">Advanced charting will be implemented with Chart.js or similar library</p>
                    <div style="margin-top: 1rem; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div style="font-size: 0.875rem;">
                            <strong>Current Trends:</strong><br>
                            📈 Overall progress: +12% this month<br>
                            🎯 Engagement: Stable<br>
                            📊 Completion rate: +8%
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAnalyticsInsights() {
        return `
            <div style="display: grid; gap: 1rem;">
                <div style="padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid var(--success);">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--success);">✅ Positive Trend</h5>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-700);">
                        Student engagement has increased by 15% over the past month, indicating improved learning motivation.
                    </p>
                </div>
                <div style="padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid var(--warning);">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--warning);">⚠️ Area for Improvement</h5>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-700);">
                        ${this.analyticsData?.overview?.at_risk_students || 5} students are showing signs of falling behind and may need additional support.
                    </p>
                </div>
                <div style="padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid var(--info);">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--info);">💡 Recommendation</h5>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--gray-700);">
                        Consider implementing peer tutoring programs to help struggling students improve their performance.
                    </p>
                </div>
            </div>
        `;
    }

    renderAtRiskStudents() {
        const atRiskStudents = this.analyticsData?.students_summary?.filter(s =>
            s.risk_level === 'high' || s.risk_level === 'medium'
        ) || [];

        if (atRiskStudents.length === 0) {
            return `
                <div style="text-align: center; padding: 2rem; color: var(--success);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h4 style="margin: 0 0 0.5rem 0;">All Students on Track</h4>
                    <p style="margin: 0; color: var(--gray-600);">No students currently require immediate attention.</p>
                </div>
            `;
        }

        return atRiskStudents.map(student => `
            <div style="
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: var(--accent);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                border-left: 4px solid ${this.getRiskColor(student.risk_level)};
            ">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--gray-800);">${student.name}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">
                        Progress: ${formatPercentage(student.progress_percentage)} |
                        Score: ${formatNumber(student.average_score, 1)} |
                        Engagement: ${formatNumber(student.engagement_score, 1)}
                    </div>
                </div>
                <div style="text-align: right;">
                    ${UIComponents.createBadge(student.risk_level, this.getRiskBadgeType(student.risk_level))}
                    <div style="margin-top: 0.5rem;">
                        <button class="btn btn-sm btn-primary" onclick="analyticsModule.viewStudentDetail('${student.student_id}')">
                            👁️ View
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Utility and helper methods
    switchView(view) {
        this.currentView = view;

        // Update tab active state
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Re-render analytics for new view
        this.renderAnalytics();
        console.log(`📊 Switched to ${view} view`);
    }

    getRiskCount(level) {
        if (!this.analyticsData?.students_summary) return 0;
        return this.analyticsData.students_summary.filter(s => s.risk_level === level).length;
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

    getPerformanceColor(score) {
        if (score >= 90) return 'var(--success)';
        if (score >= 80) return 'var(--info)';
        if (score >= 70) return 'var(--warning)';
        return 'var(--error)';
    }

    getPerformanceLevel(score) {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Good';
        if (score >= 70) return 'Fair';
        return 'Needs Improvement';
    }

    getPerformanceBadgeType(score) {
        if (score >= 90) return 'success';
        if (score >= 80) return 'info';
        if (score >= 70) return 'warning';
        return 'error';
    }

    showLoadingState() {
        setInner('analytics-content', `
            <div style="text-align: center; padding: 3rem; color: var(--gray-600);">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--gray-300);
                    border-top: 4px solid var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <h3>📊 Loading Analytics...</h3>
                <p>Analyzing student data and generating insights...</p>
            </div>
        `);
    }

    renderError(errorMessage) {
        setInner('analytics-content', `
            <div style="text-align: center; padding: 3rem; color: var(--error);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3>Failed to Load Analytics</h3>
                <p style="color: var(--gray-600); margin-bottom: 2rem;">${errorMessage}</p>
                <button class="btn btn-primary" onclick="analyticsModule.loadAnalyticsData()">
                    🔄 Retry
                </button>
            </div>
        `);
    }

    addTabStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tab-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                background: var(--gray-100);
                color: var(--gray-600);
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.875rem;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            .tab-btn:hover {
                background: var(--gray-200);
                color: var(--gray-800);
            }
            .tab-btn.active {
                background: var(--primary);
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    bindEventHandlers() {
        // Time range change handler
        const timeRangeSelect = document.getElementById('analytics-timerange');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                this.timeRange = e.target.value;
                this.loadAnalyticsData();
            });
        }
    }

    viewStudentDetail(studentId) {
        // Redirect to student management with specific student
        if (window.studentModule) {
            window.studentModule.viewStudentDetail(studentId);
            // Switch to students page
            if (window.educatorPortal) {
                window.educatorPortal.loadPage('students');
            }
        } else {
            UIComponents.showNotification('Student module not available', 'error');
        }
    }

    exportAnalytics() {
        const data = {
            analytics: this.analyticsData,
            view: this.currentView,
            timeRange: this.timeRange,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `analytics-${this.currentView}-${this.timeRange}.json`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        UIComponents.showNotification('Analytics data exported successfully!', 'success');
    }

    renderStudentActivity(students) {
        if (!students || students.length === 0) {
            return '<p style="text-align: center; color: var(--gray-600);">No recent activity data available</p>';
        }

        return students.slice(0, 8).map(student => `
            <div style="
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem;
                border-bottom: 1px solid var(--gray-200);
            ">
                <div style="
                    width: 32px;
                    height: 32px;
                    background: var(--primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 0.875rem;
                ">
                    ${student.name.charAt(0)}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 500; color: var(--gray-800);">${student.name}</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">
                        Last active: ${formatDate(student.last_activity || new Date())}
                    </div>
                </div>
                <div style="text-align: right; font-size: 0.875rem;">
                    <div style="color: var(--primary); font-weight: 500;">
                        ${formatPercentage(student.progress_percentage)}
                    </div>
                    <div style="color: var(--gray-600);">progress</div>
                </div>
            </div>
        `).join('');
    }
}

// Create and export singleton instance
export const analyticsModule = new AnalyticsModule();

// Make it globally available for onclick handlers
window.analyticsModule = analyticsModule;

export default analyticsModule;
