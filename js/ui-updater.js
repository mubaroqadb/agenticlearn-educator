// UI Updater untuk AgenticLearn Portal
// Mengupdate UI dengan data dari database

class UIUpdater {
    constructor() {
        this.adapter = window.DatabaseAdapter;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            await this.adapter.initialize();
            this.isInitialized = true;
            console.log('✅ UI Updater initialized');
        } catch (error) {
            console.error('❌ UI Updater initialization failed:', error);
        }
    }

    // Update Dashboard
    async updateDashboard() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const data = await this.adapter.getDashboardMetrics();
            
            // Update metric cards
            this.updateElement('total-students-value', data.totalStudents);
            this.updateElement('active-courses-value', data.activeCourses);
            this.updateElement('completion-rate-value', `${data.completionRate}%`);
            this.updateElement('engagement-score-value', data.engagementScore);
            this.updateElement('assignments-submitted-value', data.assignmentsSubmitted);
            this.updateElement('average-grade-value', data.averageGrade);
            
            console.log('✅ Dashboard updated with database data');
        } catch (error) {
            console.error('❌ Failed to update dashboard:', error);
        }
    }

    // Update Students Table
    async updateStudentsTable(filters = {}) {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const students = await this.adapter.getStudents(filters);
            const tableBody = document.querySelector('#students-table-body');
            
            if (!tableBody) return;
            
            tableBody.innerHTML = students.map(student => `
                <tr style="border-bottom: 1px solid var(--accent);">
                    <td style="padding: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                                ${student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <div style="font-weight: 600; color: var(--gray-800);">${student.name}</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">${student.studentId}</div>
                            </div>
                        </div>
                    </td>
                    <td style="padding: 1rem;">
                        <div style="font-weight: 500; color: var(--gray-800);">${student.email}</div>
                    </td>
                    <td style="padding: 1rem;">
                        <span class="status-badge status-${student.status}">${this.formatStatus(student.status)}</span>
                    </td>
                    <td style="padding: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="flex: 1; background: var(--gray-200); height: 8px; border-radius: 4px; overflow: hidden;">
                                <div style="background: ${this.getProgressColor(student.progress)}; height: 100%; width: ${student.progress}%; transition: width 0.3s ease;"></div>
                            </div>
                            <span style="font-size: 0.875rem; font-weight: 600; color: var(--gray-700);">${student.progress}%</span>
                        </div>
                    </td>
                    <td style="padding: 1rem;">
                        <div style="font-size: 0.875rem; color: var(--gray-600);">${student.lastActivity}</div>
                    </td>
                    <td style="padding: 1rem;">
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn" onclick="viewStudentDetail(${student.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">👁️ View</button>
                            <button class="btn" onclick="sendMessage(${student.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">💬 Message</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            // Update student count
            this.updateElement('students-count', students.length);
            
            console.log('✅ Students table updated with database data');
        } catch (error) {
            console.error('❌ Failed to update students table:', error);
        }
    }

    // Update Analytics
    async updateAnalytics() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const data = await this.adapter.getAnalytics();
            
            // Update learning patterns
            if (data.learning_pattern) {
                this.updateElement('visual-learners', data.learning_pattern.visual_learners);
                this.updateElement('auditory-learners', data.learning_pattern.auditory_learners);
                this.updateElement('kinesthetic-learners', data.learning_pattern.kinesthetic_learners);
                this.updateElement('reading-writing-learners', data.learning_pattern.reading_writing_learners);
            }
            
            // Update engagement trends
            if (data.engagementTrends) {
                this.updateElement('average-engagement', data.engagementTrends.average);
                this.updateElement('engagement-trend', data.engagementTrends.trend);
            }
            
            console.log('✅ Analytics updated with database data');
        } catch (error) {
            console.error('❌ Failed to update analytics:', error);
        }
    }

    // Update Assessments
    async updateAssessments() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const assessments = await this.adapter.getAssessments();
            
            // Update assessment counts
            const activeAssessments = assessments.filter(a => a.status === 'active').length;
            const completedAssessments = assessments.filter(a => a.status === 'completed').length;
            
            this.updateElement('active-assessments-count', activeAssessments);
            this.updateElement('completed-assessments-count', completedAssessments);
            
            console.log('✅ Assessments updated with database data');
        } catch (error) {
            console.error('❌ Failed to update assessments:', error);
        }
    }

    // Update Communications
    async updateCommunications() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const communications = await this.adapter.getCommunications();
            
            // Update unread count
            const unreadCount = communications.filter(c => c.status === 'unread').length;
            this.updateElement('unread-messages-count', unreadCount);
            
            console.log('✅ Communications updated with database data');
        } catch (error) {
            console.error('❌ Failed to update communications:', error);
        }
    }

    // Update Workflows
    async updateWorkflows() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const workflows = await this.adapter.getWorkflows();
            
            // Update workflow counts
            const activeWorkflows = workflows.filter(w => w.status === 'active').length;
            this.updateElement('active-workflows-count', activeWorkflows);
            
            console.log('✅ Workflows updated with database data');
        } catch (error) {
            console.error('❌ Failed to update workflows:', error);
        }
    }

    // Update Security
    async updateSecurity() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const data = await this.adapter.getSecurityData();
            
            if (data.login_activity) {
                this.updateElement('successful-logins', data.login_activity.successful_logins);
                this.updateElement('failed-attempts', data.login_activity.failed_attempts);
            }
            
            console.log('✅ Security data updated with database data');
        } catch (error) {
            console.error('❌ Failed to update security data:', error);
        }
    }

    // Update Performance
    async updatePerformance() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const data = await this.adapter.getPerformanceData();
            
            if (data.system_metrics) {
                this.updateElement('cpu-usage', `${data.system_metrics.cpu_usage}%`);
                this.updateElement('memory-usage', `${data.system_metrics.memory_usage}%`);
                this.updateElement('uptime', `${data.system_metrics.uptime}%`);
            }
            
            console.log('✅ Performance data updated with database data');
        } catch (error) {
            console.error('❌ Failed to update performance data:', error);
        }
    }

    // Update AI Recommendations
    async updateAIRecommendations() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const recommendations = await this.adapter.getAIRecommendations();
            
            // Update recommendation counts
            const urgentCount = recommendations.filter(r => r.type === 'urgent').length;
            this.updateElement('urgent-recommendations-count', urgentCount);
            
            console.log('✅ AI Recommendations updated with database data');
        } catch (error) {
            console.error('❌ Failed to update AI recommendations:', error);
        }
    }

    // Update Settings
    async updateSettings() {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const settings = await this.adapter.getSettings();
            
            // Update profile settings
            if (settings.profile) {
                this.updateInputValue('full-name-input', settings.profile.full_name);
                this.updateInputValue('email-input', settings.profile.email);
            }
            
            // Update preferences
            if (settings.preferences) {
                this.updateInputValue('theme-select', settings.preferences.theme);
                this.updateInputValue('language-select', settings.preferences.language);
            }
            
            console.log('✅ Settings updated with database data');
        } catch (error) {
            console.error('❌ Failed to update settings:', error);
        }
    }

    // Update all pages
    async updateAllPages() {
        console.log('🔄 Updating all pages with database data...');
        
        await Promise.all([
            this.updateDashboard(),
            this.updateStudentsTable(),
            this.updateAnalytics(),
            this.updateAssessments(),
            this.updateCommunications(),
            this.updateWorkflows(),
            this.updateSecurity(),
            this.updatePerformance(),
            this.updateAIRecommendations(),
            this.updateSettings()
        ]);
        
        console.log('✅ All pages updated with database data');
    }

    // Helper methods
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateInputValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    }

    formatStatus(status) {
        const statusMap = {
            'excellent': '🌟 Excellent',
            'good': '✅ Good',
            'average': '📊 Average',
            'at-risk': '⚠️ At Risk'
        };
        return statusMap[status] || status;
    }

    getProgressColor(progress) {
        if (progress >= 80) return 'var(--success)';
        if (progress >= 60) return 'var(--primary)';
        if (progress >= 40) return 'var(--warning)';
        return 'var(--error)';
    }
}

// Global UI updater instance
window.UIUpdater = new UIUpdater();

// Auto-update when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Starting database-driven UI updates...');
    await window.UIUpdater.updateAllPages();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIUpdater;
}
