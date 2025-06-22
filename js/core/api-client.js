// ===== AGENTICLEARN API CLIENT =====

import { API_CONFIG } from './config.js';
import { getCookie, setCookie } from './utils.js';

export class EducatorAPIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.pasetoToken = this.getPasetoToken();
        this.isConnected = false;
        this.requestCount = 0;
    }

    getPasetoToken() {
        const tokenNames = ['paseto_token', 'login', 'access_token', 'educator_token'];
        for (const name of tokenNames) {
            const token = getCookie(name);
            if (token) return token;
        }
        return localStorage.getItem('paseto_token') || null;
    }

    setPasetoToken(pasetoToken) {
        this.pasetoToken = pasetoToken;
        
        // Store in multiple locations for compatibility
        setCookie('paseto_token', pasetoToken);
        setCookie('login', pasetoToken);
        setCookie('educator_token', pasetoToken);
        localStorage.setItem('paseto_token', pasetoToken);
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.pasetoToken) {
            headers['Authorization'] = `Bearer ${this.pasetoToken}`;
        }

        const config = {
            method: options.method || 'GET',
            headers,
            ...options
        };

        if (options.body && config.method !== 'GET') {
            config.body = JSON.stringify(options.body);
        }

        const response = await fetch(url, config);
        return await response.json();
    }



    // ✅ CORE API METHODS

    async getProfile() {
        return await this.request(API_CONFIG.ENDPOINTS.EDUCATOR_PROFILE);
    }

    async getDashboardAnalytics() {
        return await this.request(API_CONFIG.ENDPOINTS.DASHBOARD_ANALYTICS);
    }

    async getStudentsList() {
        return await this.request(API_CONFIG.ENDPOINTS.STUDENTS_LIST);
    }

    async getStudentDetail(studentId) {
        return await this.request(`${API_CONFIG.ENDPOINTS.STUDENT_DETAIL}?student_id=${studentId}`);
    }

    // ✅ COMMUNICATION METHODS

    async getMessagesList() {
        return await this.request(API_CONFIG.ENDPOINTS.MESSAGES_LIST);
    }

    async sendMessage(messageData) {
        return await this.request(API_CONFIG.ENDPOINTS.SEND_MESSAGE, {
            method: 'POST',
            body: messageData
        });
    }

    async getAnnouncementsList() {
        return await this.request(API_CONFIG.ENDPOINTS.ANNOUNCEMENTS_LIST);
    }

    async createAnnouncement(announcementData) {
        return await this.request(API_CONFIG.ENDPOINTS.CREATE_ANNOUNCEMENT, {
            method: 'POST',
            body: announcementData
        });
    }

    async getNotifications() {
        return await this.request(API_CONFIG.ENDPOINTS.NOTIFICATIONS);
    }

    async markNotificationRead(notificationId) {
        return await this.request(API_CONFIG.ENDPOINTS.MARK_NOTIFICATION_READ, {
            method: 'POST',
            body: { notification_id: notificationId }
        });
    }

    async markAllNotificationsRead() {
        return await this.request(API_CONFIG.ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ, {
            method: 'POST'
        });
    }

    async updateAnnouncement(announcementData) {
        return await this.request(API_CONFIG.ENDPOINTS.UPDATE_ANNOUNCEMENT, {
            method: 'PUT',
            body: announcementData
        });
    }

    async deleteAnnouncement(announcementId) {
        return await this.request(API_CONFIG.ENDPOINTS.DELETE_ANNOUNCEMENT, {
            method: 'DELETE',
            body: { announcement_id: announcementId }
        });
    }

    async sendBulkMessage(messageData) {
        return await this.request(API_CONFIG.ENDPOINTS.SEND_BULK_MESSAGE, {
            method: 'POST',
            body: messageData
        });
    }

    // ✅ ASSESSMENT METHODS

    async getAssessmentsList() {
        return await this.request(API_CONFIG.ENDPOINTS.ASSESSMENTS_LIST);
    }

    async getAssessmentDetail(assessmentId) {
        return await this.request(`${API_CONFIG.ENDPOINTS.ASSESSMENT_DETAIL}?assessment_id=${assessmentId}`);
    }

    async createAssessment(assessmentData) {
        return await this.request(API_CONFIG.ENDPOINTS.CREATE_ASSESSMENT, {
            method: 'POST',
            body: assessmentData
        });
    }

    async updateAssessment(assessmentData) {
        return await this.request(API_CONFIG.ENDPOINTS.UPDATE_ASSESSMENT, {
            method: 'PUT',
            body: assessmentData
        });
    }

    async deleteAssessment(assessmentId) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DELETE_ASSESSMENT}?assessment_id=${assessmentId}`, {
            method: 'DELETE'
        });
    }

    async getAssessmentResults(assessmentId) {
        return await this.request(`${API_CONFIG.ENDPOINTS.ASSESSMENT_RESULTS}?assessment_id=${assessmentId}`);
    }

    async gradeAssessment(gradeData) {
        return await this.request(API_CONFIG.ENDPOINTS.GRADE_ASSESSMENT, {
            method: 'POST',
            body: gradeData
        });
    }

    // ✅ AI SYSTEM METHODS

    async getAIInsights() {
        return await this.request(API_CONFIG.ENDPOINTS.AI_INSIGHTS);
    }

    async getAIRecommendations() {
        return await this.request(API_CONFIG.ENDPOINTS.AI_RECOMMENDATIONS);
    }

    async getAILearningPatterns() {
        return await this.request(API_CONFIG.ENDPOINTS.AI_LEARNING_PATTERNS);
    }

    async getLearningPatterns() {
        return await this.request(API_CONFIG.ENDPOINTS.AI_LEARNING_PATTERNS);
    }

    // ✅ DATA EXPORT METHODS

    async exportData(type, format) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DATA_EXPORT}?type=${type}&format=${format}`);
    }

    // ✅ WORKFLOW METHODS

    async getWorkflowList() {
        return await this.request(API_CONFIG.ENDPOINTS.WORKFLOW_LIST);
    }

    async createWorkflow(workflowData) {
        return await this.request(API_CONFIG.ENDPOINTS.WORKFLOW_CREATE, {
            method: 'POST',
            body: workflowData
        });
    }

    async executeWorkflow(workflowData) {
        return await this.request(API_CONFIG.ENDPOINTS.WORKFLOW_EXECUTE, {
            method: 'POST',
            body: workflowData
        });
    }

    async getWorkflowHistory() {
        return await this.request(API_CONFIG.ENDPOINTS.WORKFLOW_HISTORY);
    }

    // ✅ REPORTS METHODS

    async generateReport(reportData) {
        return await this.request(API_CONFIG.ENDPOINTS.REPORTS_GENERATE, {
            method: 'POST',
            body: reportData
        });
    }

    async getReportsHistory() {
        return await this.request(API_CONFIG.ENDPOINTS.REPORTS_HISTORY);
    }

    async downloadReport(reportId) {
        return await this.request(`${API_CONFIG.ENDPOINTS.REPORTS_DOWNLOAD}?report_id=${reportId}`);
    }

    async getAdvancedAnalytics() {
        return await this.request(API_CONFIG.ENDPOINTS.ADVANCED_ANALYTICS);
    }

    // ✅ BULK MESSAGE METHOD

    async sendBulkMessage(messageData) {
        return await this.request(API_CONFIG.ENDPOINTS.SEND_MESSAGE, {
            method: 'POST',
            body: messageData
        });
    }

    // ✅ PROFILE METHODS

    async getUserProfile() {
        return await this.request(API_CONFIG.ENDPOINTS.PROFILE);
    }

    async updateUserProfile(profileData) {
        return await this.request(API_CONFIG.ENDPOINTS.PROFILE, {
            method: 'PUT',
            body: profileData
        });
    }

    // ✅ UTILITY METHODS

    async markNotificationRead(notificationId) {
        return await this.request(API_CONFIG.ENDPOINTS.MARK_NOTIFICATION_READ, {
            method: 'POST',
            body: { notification_id: notificationId }
        });
    }

    async testConnection() {
        const response = await this.getProfile();
        const profile = response.profile || response.data;
        this.isConnected = true;
        return { success: true, profile };
    }
}

// Create and export singleton instance
export const apiClient = new EducatorAPIClient();
export default apiClient;
