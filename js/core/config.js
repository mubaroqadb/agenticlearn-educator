// ===== AGENTICLEARN CONFIGURATION =====

export const API_CONFIG = {
    BASE_URL: "https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid",
    ENDPOINTS: {
        // ✅ CORE ENDPOINTS - Per Backend Documentation
        EDUCATOR_PROFILE: "/api/agenticlearn/educator/profile",

        // ✅ ANALYTICS & DASHBOARD - Fixed endpoint per backend documentation
        DASHBOARD_ANALYTICS: "/api/agenticlearn/educator/analytics/dashboard",

        // ✅ STUDENT MANAGEMENT - CORRECTED endpoints per backend
        STUDENTS_LIST: "/api/agenticlearn/educator/students/list",
        STUDENT_DETAIL: "/api/agenticlearn/educator/student/detail",

        // ✅ ASSESSMENT MANAGEMENT - CORRECTED endpoints per backend
        ASSESSMENTS_LIST: "/api/agenticlearn/educator/assessments/list",
        ASSESSMENT_DETAIL: "/api/agenticlearn/educator/assessment/detail",
        CREATE_ASSESSMENT: "/api/agenticlearn/educator/assessment/create",
        UPDATE_ASSESSMENT: "/api/agenticlearn/educator/assessment/update",
        DELETE_ASSESSMENT: "/api/agenticlearn/educator/assessment/delete",
        ASSESSMENT_RESULTS: "/api/agenticlearn/educator/assessment/results",
        GRADE_ASSESSMENT: "/api/agenticlearn/educator/assessment/grade",

        // ✅ COMMUNICATION SYSTEM - Per Backend Documentation
        MESSAGES_LIST: "/api/agenticlearn/educator/communication/messages/list",
        SEND_MESSAGE: "/api/agenticlearn/educator/communication/messages/send",
        ANNOUNCEMENTS_LIST: "/api/agenticlearn/educator/communication/announcements/list",
        CREATE_ANNOUNCEMENT: "/api/agenticlearn/educator/communication/announcements/create",

        // ✅ NOTIFICATION SYSTEM - Per Backend Documentation
        NOTIFICATIONS: "/api/agenticlearn/educator/communication/notifications",
        MARK_NOTIFICATION_READ: "/api/agenticlearn/notifications/mark-read",

        // ✅ AI & ML INTEGRATION - Per Backend Documentation
        AI_INSIGHTS: "/api/agenticlearn/educator/ai/insights",
        AI_RECOMMENDATIONS: "/api/agenticlearn/educator/ai/recommendations",
        AI_LEARNING_PATTERNS: "/api/agenticlearn/educator/ai/learning-patterns",

        // ✅ DATA MANAGEMENT - Per Backend Documentation
        DATA_EXPORT: "/api/agenticlearn/educator/data/export",
        DATA_IMPORT: "/api/agenticlearn/educator/data/import",
        DATA_POPULATE: "/api/agenticlearn/educator/data/populate",

        // ✅ WORKFLOW TOOLS - D1-D24 Automation
        WORKFLOW_LIST: "/api/agenticlearn/educator/workflow/list",
        WORKFLOW_CREATE: "/api/agenticlearn/educator/workflow/create",
        WORKFLOW_EXECUTE: "/api/agenticlearn/educator/workflow/execute",
        WORKFLOW_HISTORY: "/api/agenticlearn/educator/workflow/history",

        // ✅ REPORTS & ANALYTICS
        REPORTS_GENERATE: "/api/agenticlearn/educator/reports/generate",
        REPORTS_HISTORY: "/api/agenticlearn/educator/reports/history",
        REPORTS_DOWNLOAD: "/api/agenticlearn/educator/reports/download",
        ADVANCED_ANALYTICS: "/api/agenticlearn/educator/analytics/advanced"
    }
};

export const APP_CONFIG = {
    // Application settings
    APP_NAME: "AgenticLearn Educator Portal",
    VERSION: "2.0.0",
    
    // UI settings
    THEME: {
        PRIMARY: "#2563eb",
        SUCCESS: "#059669", 
        WARNING: "#d97706",
        ERROR: "#dc2626",
        INFO: "#0891b2"
    },
    
    // Performance settings
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    REFRESH_INTERVAL: 30 * 1000,   // 30 seconds
    
    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    
    // Real-time updates
    POLLING_INTERVALS: {
        DASHBOARD: 30000,    // 30 seconds
        NOTIFICATIONS: 10000, // 10 seconds
        MESSAGES: 15000      // 15 seconds
    }
};

export const GITHUB_CONFIG = {
    USERNAME: window.location.hostname.includes('github.io')
        ? window.location.hostname.split('.')[0]
        : 'mubaroqadb',
    REPOSITORY: 'agenticlearn-educator'
};

export const MENU_CONFIG = {
    CORE_MENUS: [
        { id: 'beranda', icon: '🏠', title: 'Beranda', subtitle: 'Dashboard overview' },
        { id: 'analytics', icon: '📊', title: 'Analytics', subtitle: 'Learning analytics & insights' },
        { id: 'students', icon: '👥', title: 'Students', subtitle: 'Student management & monitoring' },
        { id: 'communication', icon: '💬', title: 'Communication', subtitle: 'Messages & announcements' },
        { id: 'workflow', icon: '🔄', title: 'Workflow', subtitle: 'D1-D24 educator workflow tools' },
        { id: 'assessments', icon: '📝', title: 'Assessments', subtitle: 'Assessment management' },
        { id: 'ai-recommendations', icon: '🤖', title: 'AI Recommendations', subtitle: 'AI-powered recommendations' },
        { id: 'reports', icon: '📋', title: 'Reports & Export', subtitle: 'Data export & reporting' }
    ]
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Network connection failed. Please check your internet connection.",
    AUTH_ERROR: "Authentication failed. Please login again.",
    SERVER_ERROR: "Server error occurred. Please try again later.",
    NOT_FOUND: "Requested resource not found.",
    VALIDATION_ERROR: "Invalid data provided. Please check your input.",
    TIMEOUT_ERROR: "Request timeout. Please try again."
};

export const SUCCESS_MESSAGES = {
    DATA_LOADED: "Data loaded successfully",
    DATA_SAVED: "Data saved successfully", 
    MESSAGE_SENT: "Message sent successfully",
    ASSESSMENT_CREATED: "Assessment created successfully",
    EXPORT_COMPLETED: "Export completed successfully"
};

// Export default configuration object
export default {
    API_CONFIG,
    APP_CONFIG,
    GITHUB_CONFIG,
    MENU_CONFIG,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};
