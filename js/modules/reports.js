// ===== REPORTS & EXPORT MODULE =====
// Handles data export, report generation, and analytics export

import { apiClient } from '../core/api-client.js';
import { UIComponents } from '../components/ui-components.js';
import { setInner, formatDate, formatNumber } from '../core/utils.js';
import { API_CONFIG } from '../core/config.js';

export class ReportsModule {
    constructor() {
        this.reports = [];
        this.exports = [];
        this.isLoading = false;
        this.currentTab = 'generate'; // generate, history, templates
        this.selectedReportType = 'student_progress';
        this.exportFormats = ['PDF', 'Excel', 'CSV', 'JSON'];
    }

    async initialize() {
        console.log('📊 Initializing Reports & Export Module...');
        await this.loadReportsData();
        this.renderReportsInterface();
        this.bindEventHandlers();
    }

    async loadReportsData() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.showLoadingState();
            console.log('🔄 Loading reports data from backend...');
            
            // Load export history
            const response = await apiClient.request(API_CONFIG.ENDPOINTS.DATA_EXPORT + '?type=history');

            if (response && response.success && response.data) {
                this.exports = response.data;
                this.renderCurrentTab();
                console.log('✅ Reports data loaded successfully');
                UIComponents.showNotification('Reports data loaded successfully', 'success');
            } else {
                // Initialize with empty data
                this.exports = [];
                this.renderCurrentTab();
            }
        } catch (error) {
            console.error('❌ Failed to load reports data:', error);
            this.renderError(error.message);
            UIComponents.showNotification(`Failed to load reports data: ${error.message}`, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    renderReportsInterface() {
        const interfaceHTML = `
            <div class="reports-module">
                <!-- Header -->
                <div class="reports-header" style="
                    background: var(--white);
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 2rem;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h2 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">📊 Reports & Data Export</h2>
                            <p style="margin: 0; color: var(--gray-600);">Generate comprehensive reports and export your data</p>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-success" onclick="reportsModule.quickExport()">
                                📤 Quick Export
                            </button>
                            <button class="btn btn-info" onclick="reportsModule.scheduleReport()">
                                ⏰ Schedule Report
                            </button>
                            <button class="btn btn-primary" onclick="reportsModule.loadReportsData()">
                                🔄 Refresh
                            </button>
                        </div>
                    </div>

                    <!-- Quick Stats -->
                    <div id="reports-stats" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 1rem;
                    ">
                        <!-- Stats will be rendered here -->
                    </div>
                </div>

                <!-- Tab Navigation -->
                <div class="reports-tabs" style="
                    background: var(--white);
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 2rem;
                    overflow: hidden;
                ">
                    <div style="display: flex; border-bottom: 1px solid var(--accent);">
                        <button class="tab-button ${this.currentTab === 'generate' ? 'active' : ''}" 
                                onclick="reportsModule.switchTab('generate')"
                                style="flex: 1; padding: 1rem; border: none; background: ${this.currentTab === 'generate' ? 'var(--primary)' : 'transparent'}; 
                                       color: ${this.currentTab === 'generate' ? 'white' : 'var(--gray-700)'}; cursor: pointer;">
                            📋 Generate Reports
                        </button>
                        <button class="tab-button ${this.currentTab === 'history' ? 'active' : ''}" 
                                onclick="reportsModule.switchTab('history')"
                                style="flex: 1; padding: 1rem; border: none; background: ${this.currentTab === 'history' ? 'var(--primary)' : 'transparent'}; 
                                       color: ${this.currentTab === 'history' ? 'white' : 'var(--gray-700)'}; cursor: pointer;">
                            📁 Export History (${this.exports.length})
                        </button>
                        <button class="tab-button ${this.currentTab === 'templates' ? 'active' : ''}" 
                                onclick="reportsModule.switchTab('templates')"
                                style="flex: 1; padding: 1rem; border: none; background: ${this.currentTab === 'templates' ? 'var(--primary)' : 'transparent'}; 
                                       color: ${this.currentTab === 'templates' ? 'white' : 'var(--gray-700)'}; cursor: pointer;">
                            📄 Report Templates
                        </button>
                    </div>
                </div>

                <!-- Content Area -->
                <div id="reports-content" class="reports-content">
                    <!-- Content will be rendered here -->
                </div>
            </div>
        `;

        setInner('reports-content', interfaceHTML);
    }

    renderCurrentTab() {
        this.renderReportsStats();
        
        switch (this.currentTab) {
            case 'generate':
                this.renderReportGenerator();
                break;
            case 'history':
                this.renderExportHistory();
                break;
            case 'templates':
                this.renderReportTemplates();
                break;
        }
    }

    renderReportsStats() {
        const totalExports = this.exports.length;
        const recentExports = this.exports.filter(e => {
            const exportDate = new Date(e.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return exportDate > weekAgo;
        }).length;
        const totalSize = this.exports.reduce((sum, e) => sum + (e.file_size || 0), 0);
        const avgProcessingTime = this.exports.reduce((sum, e) => sum + (e.processing_time || 0), 0) / totalExports || 0;

        const statsHTML = `
            ${UIComponents.createMetricCard('Total Exports', totalExports, null, '📤')}
            ${UIComponents.createMetricCard('This Week', recentExports, recentExports > 0 ? 'success' : 'default', '📅')}
            ${UIComponents.createMetricCard('Total Size', `${(totalSize / 1024 / 1024).toFixed(1)}MB`, null, '💾')}
            ${UIComponents.createMetricCard('Avg Time', `${avgProcessingTime.toFixed(1)}s`, null, '⏱️')}
        `;

        setInner('reports-stats', statsHTML);
    }

    renderReportGenerator() {
        const generatorHTML = `
            <div class="report-generator" style="
                background: var(--white);
                border-radius: 12px;
                box-shadow: var(--shadow-sm);
                padding: 2rem;
            ">
                <h3 style="margin: 0 0 1.5rem 0; color: var(--gray-800);">📋 Generate New Report</h3>
                
                <!-- Report Type Selection -->
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; margin-bottom: 1rem; font-weight: 600; color: var(--gray-700);">Report Type</label>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        ${this.renderReportTypeCards()}
                    </div>
                </div>

                <!-- Report Configuration -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Date Range</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <input type="date" id="start-date" class="form-control" value="${this.getDefaultStartDate()}" />
                            <input type="date" id="end-date" class="form-control" value="${this.getDefaultEndDate()}" />
                        </div>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Export Format</label>
                        <select id="export-format" class="form-control">
                            ${this.exportFormats.map(format => `<option value="${format.toLowerCase()}">${format}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <!-- Advanced Options -->
                <div style="margin-bottom: 2rem;">
                    <h4 style="margin: 0 0 1rem 0; color: var(--gray-700);">Advanced Options</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="include-charts" checked />
                            Include Charts & Graphs
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="include-raw-data" />
                            Include Raw Data
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="include-analytics" checked />
                            Include Analytics
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="compress-file" />
                            Compress Output
                        </label>
                    </div>
                </div>

                <!-- Generate Button -->
                <div style="text-align: center;">
                    <button class="btn btn-primary" onclick="reportsModule.generateReport()" style="padding: 1rem 2rem; font-size: 1.1rem;">
                        📊 Generate Report
                    </button>
                </div>
            </div>
        `;

        setInner('reports-content', generatorHTML);
    }

    renderReportTypeCards() {
        const reportTypes = [
            { id: 'student_progress', name: 'Student Progress', icon: '👥', description: 'Comprehensive student progress and performance data' },
            { id: 'assessment_results', name: 'Assessment Results', icon: '📝', description: 'Detailed assessment scores and analytics' },
            { id: 'engagement_analytics', name: 'Engagement Analytics', icon: '📈', description: 'Student engagement and activity patterns' },
            { id: 'course_analytics', name: 'Course Analytics', icon: '📚', description: 'Course completion and effectiveness metrics' },
            { id: 'ai_insights', name: 'AI Insights', icon: '🤖', description: 'AI-generated insights and recommendations' },
            { id: 'communication_log', name: 'Communication Log', icon: '💬', description: 'Messages, announcements, and interactions' }
        ];

        return reportTypes.map(type => `
            <div class="report-type-card" onclick="reportsModule.selectReportType('${type.id}')" style="
                padding: 1.5rem;
                border: 2px solid ${this.selectedReportType === type.id ? 'var(--primary)' : 'var(--accent)'};
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                background: ${this.selectedReportType === type.id ? 'var(--accent)' : 'var(--white)'};
            " onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='${this.selectedReportType === type.id ? 'var(--primary)' : 'var(--accent)'}'">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.5rem;">${type.icon}</span>
                    <h4 style="margin: 0; color: var(--gray-800);">${type.name}</h4>
                </div>
                <p style="margin: 0; color: var(--gray-600); font-size: 0.9rem;">${type.description}</p>
            </div>
        `).join('');
    }

    renderExportHistory() {
        if (this.exports.length === 0) {
            setInner('reports-content', UIComponents.createEmptyState(
                'No Export History',
                'No reports have been generated yet. Create your first report to see it here.',
                { label: 'Generate Report', onclick: 'reportsModule.switchTab("generate")' }
            ));
            return;
        }

        const historyHTML = `
            <div class="export-history">
                ${this.exports.map(exportItem => this.renderExportCard(exportItem)).join('')}
            </div>
        `;

        setInner('reports-content', historyHTML);
    }

    renderExportCard(exportItem) {
        const statusColor = exportItem.status === 'completed' ? 'var(--success)' : 
                           exportItem.status === 'processing' ? 'var(--warning)' : 'var(--error)';

        return `
            <div class="export-card" style="
                background: var(--white);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: var(--shadow-sm);
                border-left: 4px solid ${statusColor};
                margin-bottom: 1rem;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">${exportItem.report_name}</h4>
                        <p style="margin: 0 0 1rem 0; color: var(--gray-600); font-size: 0.9rem;">${exportItem.description}</p>
                        <div style="display: flex; gap: 2rem; font-size: 0.85rem; color: var(--gray-600);">
                            <span><strong>Format:</strong> ${exportItem.format?.toUpperCase()}</span>
                            <span><strong>Size:</strong> ${(exportItem.file_size / 1024).toFixed(1)}KB</span>
                            <span><strong>Created:</strong> ${formatDate(exportItem.created_at)}</span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: end; gap: 0.5rem;">
                        ${UIComponents.createBadge(exportItem.status, exportItem.status === 'completed' ? 'success' : 'warning')}
                        ${exportItem.status === 'completed' ? `
                            <button class="btn btn-sm btn-primary" onclick="reportsModule.downloadExport('${exportItem.id}')">
                                📥 Download
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderReportTemplates() {
        const templatesHTML = `
            <div class="report-templates">
                <div style="text-align: center; padding: 3rem; color: var(--gray-600);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📄</div>
                    <h3>Report Templates</h3>
                    <p>Create and manage reusable report templates for consistent reporting.</p>
                    <button class="btn btn-primary" onclick="reportsModule.createTemplate()">
                        ➕ Create Template
                    </button>
                </div>
            </div>
        `;

        setInner('reports-content', templatesHTML);
    }

    showLoadingState() {
        setInner('reports-content', `
            <div style="text-align: center; padding: 3rem; color: var(--gray-600);">
                <div class="loading-spinner" style="
                    width: 40px; height: 40px; border: 4px solid var(--accent);
                    border-top: 4px solid var(--primary); border-radius: 50%;
                    animation: spin 1s linear infinite; margin: 0 auto 1rem;
                "></div>
                <h3>Loading Reports...</h3>
                <p>Fetching export history and report data...</p>
            </div>
        `);
    }

    renderError(errorMessage) {
        setInner('reports-content', `
            <div style="text-align: center; padding: 3rem; color: var(--error);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3>Failed to Load Reports</h3>
                <p style="color: var(--gray-600); margin-bottom: 2rem;">${errorMessage}</p>
                <button class="btn btn-primary" onclick="reportsModule.loadReportsData()">
                    🔄 Retry
                </button>
            </div>
        `);
    }

    // Utility methods
    getDefaultStartDate() {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
    }

    getDefaultEndDate() {
        return new Date().toISOString().split('T')[0];
    }

    // Tab and action methods
    switchTab(tab) {
        this.currentTab = tab;
        this.renderReportsInterface();
        this.renderCurrentTab();
    }

    selectReportType(typeId) {
        this.selectedReportType = typeId;
        this.renderReportGenerator();
    }

    // Action methods (to be implemented)
    async generateReport() {
        console.log('📊 Generating report...');
        const reportType = this.selectedReportType;
        const startDate = document.getElementById('start-date')?.value;
        const endDate = document.getElementById('end-date')?.value;
        const format = document.getElementById('export-format')?.value;
        
        UIComponents.showNotification(`Generating ${reportType} report in ${format.toUpperCase()} format...`, 'info');
        
        // Simulate report generation
        setTimeout(() => {
            UIComponents.showNotification('Report generated successfully!', 'success');
        }, 3000);
    }

    async quickExport() {
        console.log('📤 Quick export...');
        UIComponents.showNotification('Quick export feature - Coming soon!', 'info');
    }

    async scheduleReport() {
        console.log('⏰ Schedule report...');
        UIComponents.showNotification('Schedule report feature - Coming soon!', 'info');
    }

    async downloadExport(exportId) {
        console.log('📥 Downloading export:', exportId);
        UIComponents.showNotification('Download feature - Coming soon!', 'info');
    }

    async createTemplate() {
        console.log('➕ Creating template...');
        UIComponents.showNotification('Create template feature - Coming soon!', 'info');
    }

    bindEventHandlers() {
        // Add any additional event handlers here
    }
}

// Create and export singleton instance
export const reportsModule = new ReportsModule();
export default reportsModule;
