// Educator Portal - Clean Version (No Fallback Data)

// ===== UTILITY FUNCTIONS =====

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

function setInner(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
        return true;
    }
    console.warn(`Element with ID '${elementId}' not found`);
    return false;
}

// ===== API CONFIGURATION =====

const API_CONFIG = {
    BASE_URL: "https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid",
    ENDPOINTS: {
        EDUCATOR_PROFILE: "/api/agenticlearn/educator/profile",
        DASHBOARD_ANALYTICS: "/api/agenticlearn/educator/analytics/dashboard",
        STUDENTS_LIST: "/api/agenticlearn/educator/students/list",
        STUDENT_DETAIL: "/api/agenticlearn/educator/students/detail",
        ASSESSMENTS_LIST: "/api/agenticlearn/educator/assessment/list",
        MESSAGES_LIST: "/api/agenticlearn/educator/communication/messages/list",
        ANNOUNCEMENTS_LIST: "/api/agenticlearn/educator/communication/announcements/list",
        NOTIFICATIONS: "/api/agenticlearn/educator/communication/notifications",
        AI_INSIGHTS: "/api/agenticlearn/educator/ai/insights",
        AI_RECOMMENDATIONS: "/api/agenticlearn/educator/ai/recommendations"
    }
};

// ===== API CLIENT =====

class EducatorAPIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.pasetoToken = this.getPasetoToken();
    }

    getPasetoToken() {
        const tokenNames = ['paseto_token', 'login', 'access_token', 'educator_token'];
        for (const name of tokenNames) {
            const token = getCookie(name);
            if (token) return token;
        }
        return null;
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

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            console.log(`🔗 API Request: ${config.method} ${url}`);
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`API Error: ${data.error?.message || 'Request failed'}`);
            }

            console.log(`✅ API Response: ${endpoint}`, data);
            return data;
        } catch (error) {
            console.error(`❌ API Error: ${endpoint}`, error);
            throw error;
        }
    }

    async testConnection() {
        try {
            console.log("🔄 Testing backend connection...");
            const response = await this.request(API_CONFIG.ENDPOINTS.EDUCATOR_PROFILE);

            if (response && response.success && response.data) {
                console.log("✅ Backend connection successful!");
                return { success: true, profile: response.data };
            } else {
                throw new Error("Invalid profile response");
            }
        } catch (error) {
            console.error("❌ Backend connection failed:", error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize API client
const educatorAPI = new EducatorAPIClient();

// ===== GLOBAL STATE =====

let currentEducatorData = null;
let currentStudentData = [];
let currentAnalyticsData = null;
let isBackendConnected = false;

// ===== PAGE MANAGEMENT =====

function showPage(pageName) {
    console.log(`📄 Switching to page: ${pageName}`);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.style.display = 'none');
    
    // Show target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.style.display = 'block';
    }
    
    // Update menu active state
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    const activeMenuItem = document.querySelector(`[onclick="showPage('${pageName}')"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // Load page-specific data
    loadPageData(pageName);
}

async function loadPageData(pageName) {
    try {
        switch (pageName) {
            case 'beranda':
                await loadDashboardData();
                break;
            case 'analytics':
                await loadAnalyticsData();
                break;
            case 'students':
                await loadStudentsData();
                break;
            case 'communication':
                await loadCommunicationData();
                break;
            case 'assessments':
                await loadAssessmentsData();
                break;
            case 'ai-recommendations':
                await loadAIData();
                break;
            case 'reports':
                await loadReportsData();
                break;
            default:
                console.log(`No specific data loader for page: ${pageName}`);
        }
    } catch (error) {
        console.error(`❌ Failed to load data for page ${pageName}:`, error);
        showError(`Failed to load ${pageName} data: ${error.message}`);
    }
}

// ===== DATA LOADING FUNCTIONS =====

async function loadDashboardData() {
    console.log('🔄 Loading dashboard data...');
    const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.DASHBOARD_ANALYTICS);
    
    if (response && response.success && response.data) {
        currentAnalyticsData = response.data;
        renderDashboard(response.data);
    } else {
        throw new Error('Invalid dashboard response');
    }
}

async function loadStudentsData() {
    console.log('🔄 Loading students data...');
    const response = await educatorAPI.request(API_CONFIG.ENDPOINTS.STUDENTS_LIST);
    
    if (response && response.success && response.data) {
        currentStudentData = response.data;
        renderStudents(response.data);
    } else {
        throw new Error('Invalid students response');
    }
}

async function loadAnalyticsData() {
    console.log('🔄 Loading analytics data...');
    // Load analytics specific data
    showError('Analytics page requires backend implementation');
}

async function loadCommunicationData() {
    console.log('🔄 Loading communication data...');
    // Load communication specific data
    showError('Communication page requires backend implementation');
}

async function loadAssessmentsData() {
    console.log('🔄 Loading assessments data...');
    // Load assessments specific data
    showError('Assessments page requires backend implementation');
}

async function loadAIData() {
    console.log('🔄 Loading AI data...');
    // Load AI specific data
    showError('AI Recommendations page requires backend implementation');
}

async function loadReportsData() {
    console.log('🔄 Loading reports data...');
    // Load reports specific data
    showError('Reports page requires backend implementation');
}

// ===== RENDERING FUNCTIONS =====

function renderDashboard(data) {
    if (!data.overview) return;
    
    const overview = data.overview;
    
    // Update metrics
    setInner('total-students', overview.total_students || 0);
    setInner('average-progress', `${overview.average_progress || 0}%`);
    setInner('unread-messages', overview.unread_messages || 0);
    setInner('at-risk-students', overview.at_risk_students || 0);
    
    console.log('✅ Dashboard rendered with real data');
}

function renderStudents(students) {
    if (!students || students.length === 0) {
        setInner('students-content', '<p>No students found</p>');
        return;
    }
    
    const studentsHTML = students.map(student => `
        <div class="student-card">
            <h4>${student.name}</h4>
            <p>Progress: ${student.progress_percentage || 0}%</p>
            <p>Status: ${student.status || 'Unknown'}</p>
        </div>
    `).join('');
    
    setInner('students-content', studentsHTML);
    console.log('✅ Students rendered with real data');
}

function showError(message) {
    const errorHTML = `
        <div style="
            text-align: center;
            padding: 2rem;
            color: var(--error);
            background: var(--error-light);
            border-radius: 8px;
            margin: 1rem;
        ">
            <h3>❌ Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="
                background: var(--primary);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
            ">🔄 Retry</button>
        </div>
    `;
    
    // Show error in current page
    const currentPage = document.querySelector('.page-content[style*="block"]');
    if (currentPage) {
        currentPage.innerHTML = errorHTML;
    }
}

// ===== INITIALIZATION =====

async function initializePortal() {
    console.log('🚀 Initializing Educator Portal...');
    
    try {
        // Test backend connection
        const connectionResult = await educatorAPI.testConnection();
        
        if (connectionResult.success) {
            isBackendConnected = true;
            currentEducatorData = connectionResult.profile;
            console.log('✅ Portal initialized with backend connection');
            
            // Load initial dashboard data
            await loadDashboardData();
        } else {
            throw new Error('Backend connection failed');
        }
    } catch (error) {
        console.error('❌ Portal initialization failed:', error);
        showError(`Portal initialization failed: ${error.message}`);
    }
}

// ===== WINDOW EXPORTS =====

window.showPage = showPage;
window.educatorAPI = educatorAPI;

// ===== AUTO INITIALIZATION =====

document.addEventListener('DOMContentLoaded', initializePortal);
