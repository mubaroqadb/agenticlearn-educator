// ===== AGENTICLEARN API CLIENT =====

import { API_CONFIG, ERROR_MESSAGES } from './config.js';
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
        const requestId = ++this.requestCount;
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // ✅ BACKEND DOCUMENTATION - Use 'Authorization: Bearer' header
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

        try {
            console.log(`🔗 API Request #${requestId}: ${config.method} ${endpoint}`);
            
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(this.formatError(data, response.status));
            }

            console.log(`✅ API Response #${requestId}:`, data);
            
            this.isConnected = true;
            return data;
            
        } catch (error) {
            console.error(`❌ API Error #${requestId}: ${endpoint}`, error);
            this.isConnected = false;
            throw error;
        }
    }

    formatError(data, status) {
        if (data.error) {
            return `${data.error.code || 'API_ERROR'}: ${data.error.message || 'Request failed'}`;
        }
        
        switch (status) {
            case 401: return ERROR_MESSAGES.AUTH_ERROR;
            case 404: return ERROR_MESSAGES.NOT_FOUND;
            case 500: return ERROR_MESSAGES.SERVER_ERROR;
            case 408: return ERROR_MESSAGES.TIMEOUT_ERROR;
            default: return ERROR_MESSAGES.NETWORK_ERROR;
        }
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

    async getMessages() {
        return await this.request(API_CONFIG.ENDPOINTS.MESSAGES_LIST);
    }

    async sendMessage(messageData) {
        return await this.request(API_CONFIG.ENDPOINTS.SEND_MESSAGE, {
            method: 'POST',
            body: messageData
        });
    }

    async getAnnouncements() {
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

    async getAssessments() {
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

    async updateAssessment(assessmentId, updateData) {
        return await this.request(`${API_CONFIG.ENDPOINTS.UPDATE_ASSESSMENT}?assessment_id=${assessmentId}`, {
            method: 'PUT',
            body: updateData
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

    async getAIInsights() {
        return await this.request(API_CONFIG.ENDPOINTS.AI_INSIGHTS);
    }

    async getAIRecommendations() {
        return await this.request(API_CONFIG.ENDPOINTS.AI_RECOMMENDATIONS);
    }

    async getAILearningPatterns() {
        return await this.request(API_CONFIG.ENDPOINTS.AI_LEARNING_PATTERNS);
    }

    async exportData(type, format) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DATA_EXPORT}?type=${type}&format=${format}`);
    }

    async testConnection() {
        try {
            console.log("🔄 Testing AgenticAI backend connection...");
            const response = await this.getProfile();

            if (response && response.success && response.data) {
                const profile = response.data;
                this.isConnected = true;
                console.log("✅ AgenticAI backend connection successful!");
                console.log("👤 Connected as:", profile.name);
                return { success: true, profile };
            } else {
                throw new Error("Invalid educator profile response");
            }
        } catch (error) {
            this.isConnected = false;
            console.error("❌ AgenticAI backend connection failed:", error);
            return { success: false, error: error.message };
        }
    }
}

// Create and export singleton instance
export const apiClient = new EducatorAPIClient();
export default apiClient;
