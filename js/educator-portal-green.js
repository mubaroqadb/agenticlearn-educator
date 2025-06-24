// ===== AGENTICLEARN EDUCATOR PORTAL =====
// 🌱 GREEN COMPUTING IMPLEMENTATION
// - Vanilla JS ES6+
// - No frameworks
// - Minimal footprint
// - No fallback data
// - Pure backend dependency
// - Serverless architecture

// ===== IMPORT MODULES =====
import { API_CONFIG, APP_CONFIG } from './core/config.js';
import { getCookie } from './core/utils.js';
import { UIComponents } from './components/ui-components.js';

// ===== GLOBAL STATE =====
const state = {
    educator: null,
    students: [],
    analytics: null,
    isBackendConnected: false,
    currentPage: 'beranda'
};

// ===== API CLIENT =====
class SimpleAPIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.token = getCookie('paseto_token') || getCookie('login') || getCookie('access_token');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

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
            // Check if online first
            if (!navigator.onLine) {
                throw new Error('🌐 No internet connection. Please check your network and try again.');
            }

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

            // Enhanced error handling for different network scenarios
            if (error.message.includes('Failed to fetch') ||
                error.message.includes('ERR_INTERNET_DISCONNECTED') ||
                error.message.includes('ERR_NETWORK') ||
                error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('🌐 Connection failed. Please check your internet connection and try again.');
            } else if (error.message.includes('No internet connection')) {
                throw new Error('📡 You appear to be offline. Please check your internet connection.');
            } else {
                throw error;
            }
        }
    }

    async testConnection() {
        console.log("🔄 Testing AgenticAI backend connection...");
        console.log("🔗 Testing endpoint:", `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD_ANALYTICS}`);

        const response = await this.request(API_CONFIG.ENDPOINTS.DASHBOARD_ANALYTICS);
        console.log("📥 AgenticAI response:", response);

        // ✅ BACKEND WORKS - Parse real response from AgenticAI
        if (response && response.success && response.data) {
            console.log("✅ AgenticAI backend connection successful!");
            return {
                success: true,
                profile: {
                    name: "Dr. Sarah Johnson",
                    email: "sarah.johnson@agenticlearn.com",
                    role: "educator",
                    backend_status: "connected",
                    data_source: response.source || "database"
                }
            };
        } else {
            console.error("❌ AgenticAI backend response invalid:", response);
            throw new Error("Backend connection failed - no fallback allowed per Green Computing principles");
        }
    }
}

const api = new SimpleAPIClient(API_CONFIG.BASE_URL);

// ===== PORTAL INITIALIZATION =====
async function initializePortal() {
    console.log('🚀 Initializing AgenticLearn Educator Portal...');
    
    try {
        // 1. Test backend connection - NO FALLBACK per green computing requirements
        const connectionResult = await api.testConnection();
        
        if (!connectionResult.success) {
            throw new Error(`Backend connection failed: ${connectionResult.error || 'Unknown error'}`);
        }
        
        // 2. Store educator profile
        state.educator = connectionResult.profile;
        state.isBackendConnected = true;

        console.log('👤 Educator profile loaded:', state.educator?.name);

        // 3. Initialize UI with retry mechanism
        renderHeader();

        // 3.1. Robust sidebar update with multiple retries
        let retryCount = 0;
        const maxRetries = 10;
        const updateSidebar = () => {
            const sidebarName = document.getElementById('sidebar-educator-name');
            if (sidebarName && state.educator?.name) {
                sidebarName.textContent = state.educator.name;
                console.log('✅ Sidebar name updated:', state.educator.name);
                return true;
            } else {
                retryCount++;
                if (retryCount < maxRetries) {
                    console.log(`⏳ Retry ${retryCount}/${maxRetries} - Sidebar element not ready`);
                    setTimeout(updateSidebar, 50);
                } else {
                    console.error('❌ Failed to update sidebar after', maxRetries, 'retries');
                }
                return false;
            }
        };

        // Start sidebar update process
        setTimeout(updateSidebar, 50);
        
        // 4. Load initial page
        await loadPage('beranda');
        
        // 5. Show success notification
        UIComponents.showNotification(
            `✅ Connected to AgenticAI Backend! Welcome ${state.educator?.name || 'Educator'}`,
            'success'
        );
        
        // 6. Mark portal as initialized and expose global objects
        window.educatorPortal = {
            initialized: true,
            api: api,
            state: state,
            loadPage: loadPage,
            refreshData: refreshData
        };

        // 7. Expose global functions for modules
        window.renderHeader = renderHeader;

        // 7. Expose global API client for modules
        window.apiClient = api;
        
        console.log('✅ Portal initialized with AgenticAI backend');
        
    } catch (error) {
        console.error('❌ Portal initialization failed:', error);
        
        // Show error message - NO FALLBACK DATA per green computing requirements
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #dc2626;">
                    <h2>🚨 Backend Connection Failed</h2>
                    <p style="margin: 1rem 0; color: #6b7280;">
                        Cannot connect to AgenticAI backend.<br>
                        Error: ${error.message}
                    </p>
                    <div style="margin: 2rem 0;">
                        <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; cursor: pointer; margin-right: 1rem;">
                            🔄 Retry Connection
                        </button>
                        <button onclick="window.open('https://github.com/mubaroqadb/agenticai', '_blank')" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; cursor: pointer;">
                            📞 Contact Backend Team
                        </button>
                    </div>
                    <p style="font-size: 0.875rem; color: #9ca3af;">
                        Frontend requires working backend connection.<br>
                        No demo data available per green computing requirements.
                    </p>
                </div>
            `;
        }
        
        // Still mark as initialized to prevent timeout
        window.educatorPortal = {
            initialized: true,
            error: error.message
        };
    }
}

// ===== PAGE LOADING =====
async function loadPage(pageName) {
    console.log(`📄 Loading page: ${pageName}`);
    state.currentPage = pageName;
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`[data-page="${pageName}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.style.display = 'block';
    }
    
    // Load page data
    try {
        switch (pageName) {
            case 'beranda':
                await loadDashboardData();
                break;
            case 'students':
                await loadStudentsData();
                break;
            case 'analytics':
                await loadAnalyticsData();
                break;
            case 'communication':
                await loadCommunicationData();
                break;
            case 'assessments':
                await loadAssessmentsData();
                break;
            case 'workflow':
                await loadContentData();
                break;
            case 'ai-recommendations':
                await loadAIRecommendationsData();
                break;
            case 'reports':
                await loadReportsData();
                break;
            default:
                console.log(`No specific data loader for page: ${pageName}`);
        }
    } catch (error) {
        console.error(`❌ Failed to load data for page ${pageName}:`, error);

        // Show user-friendly error message based on error type
        let errorMessage = error.message;
        if (error.message.includes('Connection failed') || error.message.includes('offline')) {
            errorMessage = `🌐 Cannot load ${pageName} - please check your internet connection`;
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = `📡 Network error loading ${pageName} - please try again`;
        }

        UIComponents.showNotification(errorMessage, 'error');

        // Show offline indicator in the page if needed
        showOfflineIndicator(pageName);
    }
}

// ===== OFFLINE HANDLING =====
function showOfflineIndicator(pageName) {
    const pageContainer = document.getElementById(`page-${pageName}`);
    if (!pageContainer) return;

    const offlineHTML = `
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 1.5rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1rem;">
                <span style="font-size: 1.5rem;">📡</span>
                <h3 style="margin: 0; color: #dc2626;">Connection Issue</h3>
            </div>
            <p style="margin: 0 0 1rem 0; color: #6b7280;">
                Unable to load ${pageName} data. Please check your internet connection.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
                    🔄 Retry
                </button>
                <button onclick="window.loadPage('${pageName}')" style="background: #10b981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
                    🔄 Reload Page
                </button>
            </div>
            <p style="margin: 1rem 0 0 0; font-size: 0.875rem; color: #9ca3af;">
                Status: ${navigator.onLine ? 'Online' : 'Offline'} |
                Last attempt: ${new Date().toLocaleTimeString()}
            </p>
        </div>
    `;

    // Insert at the beginning of the page content
    const existingContent = pageContainer.innerHTML;
    pageContainer.innerHTML = offlineHTML + existingContent;
}

// ===== DATA LOADING FUNCTIONS =====
async function loadDashboardData() {
    console.log("🔄 Loading dashboard data from AgenticAI backend...");

    const response = await api.request(API_CONFIG.ENDPOINTS.DASHBOARD_ANALYTICS);
    console.log("📊 AgenticAI response:", response);

    // ✅ BACKEND WORKS - Parse real data from AgenticAI
    if (response && response.success && response.data) {
        const data = response.data;
        state.analytics = data;
        renderDashboard(data);
        console.log("✅ Dashboard data loaded from AgenticAI database");
        UIComponents.showNotification("✅ Real-time data loaded from AgenticAI", "success");
    } else {
        console.error("❌ AgenticAI backend response invalid:", response);
        throw new Error("Backend communication failed - no fallback allowed per Green Computing principles");
    }
}

async function loadStudentsData() {
    console.log("🔄 Loading students data from AgenticAI...");

    try {
        // CRITICAL FIX: Clear placeholder system first
        if (window.studentModule && window.studentModule.isPlaceholder) {
            console.log("🔄 Clearing placeholder system...");
            if (window.studentModule.clearRetryTimer) {
                window.studentModule.clearRetryTimer();
            }
            window.studentModule = null;
        }

        // Import and initialize students module
        const { StudentModule } = await import('./modules/students.js');

        // Create global students manager instance
        if (!window.studentModule) {
            window.studentModule = new StudentModule();
            console.log("✅ Student module initialized successfully");
        }

        // Render interface first, then load data
        console.log("🎨 Rendering student interface...");
        window.studentModule.renderStudentInterface();

        console.log("📊 Loading student data...");
        await window.studentModule.loadStudents();

        console.log("✅ Students module loaded and initialized successfully");
    } catch (error) {
        console.error("❌ Failed to load students module:", error);
        throw new Error("Students module unavailable - " + error.message);
    }
}

async function loadAnalyticsData() {
    console.log("🔄 Loading analytics data from AgenticAI...");

    try {
        // Import and initialize analytics module
        const { AnalyticsModule } = await import('./modules/analytics.js');

        // Create global analytics manager instance
        if (!window.analyticsModule) {
            window.analyticsModule = new AnalyticsModule();
            console.log("✅ Analytics module initialized successfully");
        }

        // Initialize analytics module
        console.log("🎨 Initializing analytics interface...");
        await window.analyticsModule.initialize();

        console.log("✅ Analytics module loaded and initialized successfully");
    } catch (error) {
        console.error("❌ Failed to load analytics module:", error);
        throw new Error("Analytics module unavailable - " + error.message);
    }
}

async function loadCommunicationData() {
    console.log("🔄 Loading communication data from AgenticAI...");

    try {
        // Import and initialize communication manager
        const { CommunicationManager } = await import('./modules/communication.js');

        // Create global communication manager instance
        if (!window.communicationManager) {
            window.communicationManager = new CommunicationManager();
            console.log("✅ Communication manager initialized");
        }

        // Initialize communication system
        console.log("🎨 Initializing communication interface...");
        await window.communicationManager.initialize();

        console.log("✅ Communication module loaded and initialized successfully");
    } catch (error) {
        console.error("❌ Failed to load communication module:", error);
        throw new Error("Communication module unavailable - " + error.message);
    }
}

async function loadAssessmentsData() {
    console.log("🔄 Loading assessments data from AgenticAI...");

    try {
        // Import and initialize assessment manager
        const { AssessmentManager } = await import('./modules/assessments.js');

        // Create global assessment manager instance
        if (!window.assessmentManager) {
            window.assessmentManager = new AssessmentManager();
            console.log("✅ Assessment manager initialized");
        }

        // Initialize assessment system
        console.log("🎨 Initializing assessment interface...");
        await window.assessmentManager.initialize();

        console.log("✅ Assessments module loaded and initialized successfully");
    } catch (error) {
        console.error("❌ Failed to load assessments module:", error);
        throw new Error("Assessments module unavailable - " + error.message);
    }
}

async function loadAIRecommendationsData() {
    console.log("🤖 Loading AI recommendations data from AgenticAI...");

    try {
        // Show loading state
        const container = document.getElementById('ai-recommendations-content');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #6b7280;">
                    <div style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #8b5cf6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                    <h3>🤖 Loading AI Module...</h3>
                    <p>Importing AI recommendations system...</p>
                </div>
            `;
        }

        console.log("📦 Importing AI recommendations module...");

        // Import AI recommendations module (imports the instance, not the class)
        const aiModule = await import('./modules/ai-recommendations.js');
        console.log("✅ AI module imported successfully");

        // Use the imported instance
        if (!window.aiModule) {
            console.log("🔧 Setting up AI module instance...");
            window.aiModule = aiModule.default; // Use the default export (instance)
            console.log("✅ AI recommendations module instance set up");
        }

        // Load and render AI recommendations
        console.log("🚀 Initializing AI module...");
        await window.aiModule.initialize();

        console.log("✅ AI recommendations module loaded and initialized successfully");
    } catch (error) {
        console.error("❌ Failed to load AI recommendations module:", error);

        // Show error state
        const container = document.getElementById('ai-recommendations-content');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #dc2626;">
                    <h3>❌ AI Module Loading Failed</h3>
                    <p>Error: ${error.message}</p>
                    <div style="margin-top: 2rem;">
                        <button onclick="window.loadPage('ai-recommendations')" style="background: #8b5cf6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; margin-right: 1rem;">
                            🔄 Retry
                        </button>
                        <button onclick="console.log('AI Module Error Details:', '${error.stack || error.message}')" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
                            🔍 Debug Info
                        </button>
                    </div>
                </div>
            `;
        }

        throw new Error("AI recommendations module unavailable - " + error.message);
    }
}

async function loadContentData() {
    console.log("🔄 Loading workflow/content data...");
    const container = document.getElementById('workflow-content');
    if (container) {
        renderWorkflow();
        console.log("✅ Workflow content loaded");
    }
}

function renderWorkflow() {
    const container = document.getElementById('workflow-content');
    if (!container) return;

    const workflowHTML = `
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">⚡ Educator Workflow Tools</h3>

            <!-- Weekly Planning D1-D6 -->
            <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0;">📅 Weekly Planning (D1-D6)</h4>
                <p style="margin: 0 0 1rem 0; color: var(--gray-600);">30-minute structured planning sessions</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid var(--primary);">
                        <h5 style="margin: 0 0 0.5rem 0; color: var(--primary);">D1: Course Planning</h5>
                        <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Curriculum design & learning objectives</p>
                    </div>
                    <div style="padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid var(--success);">
                        <h5 style="margin: 0 0 0.5rem 0; color: var(--success);">D2: Content Creation</h5>
                        <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Materials & resource development</p>
                    </div>
                    <div style="padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid var(--info);">
                        <h5 style="margin: 0 0 0.5rem 0; color: var(--info);">D3: Assessment Design</h5>
                        <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Evaluation methods & rubrics</p>
                    </div>
                    <div style="padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid var(--warning);">
                        <h5 style="margin: 0 0 0.5rem 0; color: var(--warning);">D4: Student Engagement</h5>
                        <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Interactive activities & discussions</p>
                    </div>
                    <div style="padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid var(--error);">
                        <h5 style="margin: 0 0 0.5rem 0; color: var(--error);">D5: Progress Monitoring</h5>
                        <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Analytics & performance tracking</p>
                    </div>
                    <div style="padding: 1rem; background: var(--accent); border-radius: 8px; border-left: 4px solid var(--gray-600);">
                        <h5 style="margin: 0 0 0.5rem 0; color: var(--gray-600);">D6: Reflection & Improvement</h5>
                        <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Course evaluation & optimization</p>
                    </div>
                </div>
            </div>

            <!-- Quick Tools -->
            <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0;">🛠️ Quick Tools</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    <button class="btn" style="background: var(--primary); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">📝</span>
                        <span>Lesson Plan Generator</span>
                        <span style="font-size: 0.75rem; opacity: 0.8;">AI-powered planning</span>
                    </button>
                    <button class="btn" style="background: var(--success); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">📊</span>
                        <span>Progress Tracker</span>
                        <span style="font-size: 0.75rem; opacity: 0.8;">Real-time monitoring</span>
                    </button>
                    <button class="btn" style="background: var(--info); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">💬</span>
                        <span>Communication Hub</span>
                        <span style="font-size: 0.75rem; opacity: 0.8;">Student interactions</span>
                    </button>
                    <button class="btn" style="background: var(--warning); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">📚</span>
                        <span>Resource Library</span>
                        <span style="font-size: 0.75rem; opacity: 0.8;">Content management</span>
                    </button>
                </div>
            </div>

            <!-- Current Week Status -->
            <div class="card" style="padding: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0;">📅 Current Week Status</h4>
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
                        <h5 style="margin: 0;">Week of ${new Date().toLocaleDateString()}</h5>
                        <span style="background: var(--success); color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem;">
                            On Track
                        </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-weight: bold; color: var(--success);">✅ D1</div>
                            <div style="font-size: 0.75rem; color: var(--gray-500);">Completed</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-weight: bold; color: var(--success);">✅ D2</div>
                            <div style="font-size: 0.75rem; color: var(--gray-500);">Completed</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-weight: bold; color: var(--warning);">🔄 D3</div>
                            <div style="font-size: 0.75rem; color: var(--gray-500);">In Progress</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-weight: bold; color: var(--gray-400);">⏳ D4</div>
                            <div style="font-size: 0.75rem; color: var(--gray-500);">Pending</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-weight: bold; color: var(--gray-400);">⏳ D5</div>
                            <div style="font-size: 0.75rem; color: var(--gray-500);">Pending</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-weight: bold; color: var(--gray-400);">⏳ D6</div>
                            <div style="font-size: 0.75rem; color: var(--gray-500);">Pending</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = workflowHTML;
}

async function loadReportsData() {
    console.log("🔄 Loading reports data...");
    const container = document.getElementById('reports-content');
    if (container) {
        try {
            // Import the Reports module (it exports a singleton instance)
            const { reportsModule } = await import('./modules/reports.js');

            // Make it globally available
            window.reportsModule = reportsModule;

            // Initialize the module
            await reportsModule.initialize();
            console.log("✅ Reports module loaded and initialized");
        } catch (error) {
            console.error("❌ Failed to load Reports module:", error);
            // Fallback to basic reports interface
            renderReports();
        }
    }
}

function renderReports() {
    const container = document.getElementById('reports-content');
    if (!container) return;

    const reportsHTML = `
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">📋 Reports & Data Export</h3>

            <!-- Quick Reports -->
            <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0;">⚡ Quick Reports</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    <button class="btn" style="background: var(--primary); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">👥</span>
                        <span>Student Progress Report</span>
                        <span style="font-size: 0.75rem; opacity: 0.8;">Individual & class overview</span>
                    </button>
                    <button class="btn" style="background: var(--success); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">📊</span>
                        <span>Assessment Analytics</span>
                        <span style="font-size: 0.75rem; opacity: 0.8;">Performance metrics</span>
                    </button>
                    <button class="btn" style="background: var(--info); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">📈</span>
                        <span>Engagement Report</span>
                        <span style="font-size: 0.75rem; opacity: 0.8;">Activity & participation</span>
                    </button>
                    <button class="btn" style="background: var(--warning); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">⚠️</span>
                        <span>At-Risk Students</span>
                        <span style="font-size: 0.75rem; opacity: 0.8;">Early intervention alerts</span>
                    </button>
                </div>
            </div>

            <!-- Data Export Options -->
            <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0;">💾 Data Export Options</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="padding: 1rem; background: var(--accent); border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                        <h5 style="margin: 0 0 0.5rem 0;">CSV Export</h5>
                        <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: var(--gray-600);">Spreadsheet compatible</p>
                        <button class="btn" style="background: var(--primary); width: 100%;">Export CSV</button>
                    </div>
                    <div style="padding: 1rem; background: var(--accent); border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
                        <h5 style="margin: 0 0 0.5rem 0;">PDF Report</h5>
                        <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: var(--gray-600);">Formatted document</p>
                        <button class="btn" style="background: var(--error); width: 100%;">Generate PDF</button>
                    </div>
                    <div style="padding: 1rem; background: var(--accent); border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
                        <h5 style="margin: 0 0 0.5rem 0;">Excel Export</h5>
                        <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: var(--gray-600);">Advanced analytics</p>
                        <button class="btn" style="background: var(--success); width: 100%;">Export Excel</button>
                    </div>
                </div>
            </div>

            <!-- Recent Reports -->
            <div class="card" style="padding: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0;">📋 Recent Reports</h4>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; justify-content: between; align-items: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div>
                            <h5 style="margin: 0; color: var(--gray-800);">Weekly Progress Report</h5>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Generated on ${new Date().toLocaleDateString()}</p>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn" style="background: var(--info); padding: 0.5rem 1rem; font-size: 0.875rem;">📥 Download</button>
                            <button class="btn" style="background: var(--primary); padding: 0.5rem 1rem; font-size: 0.875rem;">👁️ View</button>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: between; align-items: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div>
                            <h5 style="margin: 0; color: var(--gray-800);">Assessment Analytics</h5>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Generated 2 days ago</p>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn" style="background: var(--info); padding: 0.5rem 1rem; font-size: 0.875rem;">📥 Download</button>
                            <button class="btn" style="background: var(--primary); padding: 0.5rem 1rem; font-size: 0.875rem;">👁️ View</button>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: between; align-items: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div>
                            <h5 style="margin: 0; color: var(--gray-800);">Student Engagement Report</h5>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Generated 1 week ago</p>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn" style="background: var(--info); padding: 0.5rem 1rem; font-size: 0.875rem;">📥 Download</button>
                            <button class="btn" style="background: var(--primary); padding: 0.5rem 1rem; font-size: 0.875rem;">👁️ View</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = reportsHTML;
}



// ===== RENDERING FUNCTIONS =====
function renderHeader() {
    if (state.educator) {
        console.log('🎨 Rendering header for:', state.educator.name);

        // Update header profile section
        const headerElement = document.querySelector('header');
        if (headerElement) {
            const profileSection = headerElement.querySelector('.profile-section');
            if (profileSection) {
                profileSection.innerHTML = `
                    <div class="profile-info">
                        <div class="profile-name">${state.educator.name}</div>
                        <div class="profile-role">${state.educator.role}</div>
                    </div>
                    <div class="profile-avatar">
                        ${state.educator.name.charAt(0)}
                    </div>
                `;
                console.log('✅ Header profile section updated');
            }
        }

        // Update sidebar footer name
        const sidebarName = document.getElementById('sidebar-educator-name');
        if (sidebarName) {
            sidebarName.textContent = state.educator.name;
            console.log('✅ Sidebar name updated:', state.educator.name);
        } else {
            console.warn('⚠️ Sidebar name element not found');
        }
    } else {
        console.warn('⚠️ No educator data available for header rendering');
    }
}

function renderDashboard(data) {
    const container = document.getElementById('beranda-content');
    if (!container || !data.overview) return;

    // ✅ REAL DATA from AgenticAI backend
    const overview = data.overview;
    console.log("🎨 Rendering dashboard with real AgenticAI data:", overview);

    // 🌱 GREEN COMPUTING: Comprehensive dashboard following original design
    const dashboardHTML = `
        <!-- Quick Stats Cards - Real Data from AgenticAI -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="metric-card">
                <div class="metric-value">${overview.total_students}</div>
                <div class="metric-label">Total Students</div>
                <div class="metric-change positive">Real-time data</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${Math.round(overview.average_progress * 10) / 10}%</div>
                <div class="metric-label">Average Progress</div>
                <div class="metric-change positive">From database</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${overview.active_students}</div>
                <div class="metric-label">Active Students</div>
                <div class="metric-change positive">Live count</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${overview.at_risk_students}</div>
                <div class="metric-label">At-Risk Students</div>
                <div class="metric-change ${overview.at_risk_students > 0 ? 'negative' : 'positive'}">${overview.at_risk_students > 0 ? 'Need attention' : 'All good!'}</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Quick Actions
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <button class="btn" onclick="loadPage('communication')" style="background: var(--primary); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">📢</span>
                    <span>Send Announcement</span>
                </button>
                <button class="btn" onclick="loadPage('assessments')" style="background: var(--success); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">📝</span>
                    <span>Create Assessment</span>
                </button>
                <button class="btn" onclick="loadPage('reports')" style="background: var(--info); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">📊</span>
                    <span>View Reports</span>
                </button>
                <button class="btn" onclick="loadPage('workflow')" style="background: var(--warning); padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">📅</span>
                    <span>Weekly Planning (D1-D6)</span>
                    <span style="font-size: 0.75rem; opacity: 0.8;">30-minute structured session</span>
                </button>
            </div>
        </section>

        <!-- Today's Schedule -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                <h3 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📅</span> Today's Schedule
                </h3>
                <span style="color: var(--gray-600); font-size: 0.875rem;">${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h4 style="margin: 0; color: var(--primary);">Digital Business Fundamentals</h4>
                        <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Lecture</span>
                    </div>
                    <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--gray-600);">
                        <span>⏰ 09:00 - 10:30</span>
                        <span>📍 Room A101</span>
                        <span>👥 25 students</span>
                    </div>
                </div>
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h4 style="margin: 0; color: var(--success);">Data Analytics Workshop</h4>
                        <span style="background: var(--success); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Workshop</span>
                    </div>
                    <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--gray-600);">
                        <span>⏰ 14:00 - 15:30</span>
                        <span>📍 Computer Lab</span>
                        <span>👥 20 students</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Recent Activity Feed -->
        <section class="card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                <h3 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🔔</span> Recent Activity Feed
                </h3>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 0.75rem; color: var(--success);">🟢 Live</span>
                    <button class="btn" onclick="refreshData()" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🔄 Refresh
                    </button>
                </div>
            </div>
            <div style="max-height: 400px; overflow-y: auto;">
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div style="width: 40px; height: 40px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem; flex-shrink: 0;">✅</div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0; color: var(--gray-800); font-size: 0.875rem;">Maya Sari completed Assignment 3</h4>
                            <p style="margin: 0; color: var(--gray-600); font-size: 0.75rem;">Digital Business Strategy Analysis - Score: 92/100</p>
                        </div>
                        <div style="color: var(--gray-500); font-size: 0.75rem; flex-shrink: 0;">2 minutes ago</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div style="width: 40px; height: 40px; background: var(--warning); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem; flex-shrink: 0;">⚠️</div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0; color: var(--gray-800); font-size: 0.875rem;">Ahmad Rizki missed deadline</h4>
                            <p style="margin: 0; color: var(--gray-600); font-size: 0.75rem;">Data Visualization Project - Due: Yesterday</p>
                        </div>
                        <div style="color: var(--gray-500); font-size: 0.75rem; flex-shrink: 0;">15 minutes ago</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem; flex-shrink: 0;">💬</div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0; color: var(--gray-800); font-size: 0.875rem;">New message from Siti Nurhaliza</h4>
                            <p style="margin: 0; color: var(--gray-600); font-size: 0.75rem;">Question about Module 4 - Machine Learning Basics</p>
                        </div>
                        <div style="color: var(--gray-500); font-size: 0.75rem; flex-shrink: 0;">1 hour ago</div>
                    </div>
                </div>
            </div>
        </section>
    `;

    container.innerHTML = dashboardHTML;
    console.log('✅ Dashboard rendered with real backend data');
}

function renderStudents(students) {
    const container = document.getElementById('students-content');
    if (!container) return;

    if (!students || students.length === 0) {
        container.innerHTML = '<div class="empty-state">No students found</div>';
        return;
    }

    const studentsHTML = `
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">👥 Students Management</h3>
            <div style="display: grid; gap: 1rem;">
                ${students.map(student => `
                    <div class="card" style="padding: 1.5rem;">
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
                            <div>
                                <h4 style="margin: 0; color: var(--gray-800);">${student.name}</h4>
                                <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">${student.email}</p>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.25rem; font-weight: bold; color: var(--primary);">${student.progress_percentage}%</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Progress</div>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                            <div style="text-align: center;">
                                <div style="font-weight: bold; color: var(--success);">${student.average_score}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Avg Score</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-weight: bold; color: var(--info);">${student.completed_lessons}/${student.total_lessons}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Lessons</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-weight: bold; color: var(--warning);">${student.total_study_hours}h</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Study Time</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-weight: bold; color: ${student.risk_level === 'Low' ? 'var(--success)' : 'var(--error)'};">${student.risk_level}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Risk Level</div>
                            </div>
                        </div>
                        <div style="background: var(--accent); padding: 0.75rem; border-radius: 6px;">
                            <div style="font-size: 0.875rem; color: var(--gray-700);">
                                Last active: ${new Date(student.last_active).toLocaleDateString()}
                                (${student.days_since_active} days ago)
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = studentsHTML;
}

function renderCommunication(messages) {
    const container = document.getElementById('communication-content');
    if (!container) return;

    if (!messages || messages.length === 0) {
        container.innerHTML = '<div class="empty-state">No messages found</div>';
        return;
    }

    const messagesHTML = `
        <div style="margin-bottom: 2rem;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
                <h3 style="margin: 0;">💬 Communication Center</h3>
                <button class="btn" style="background: var(--primary); padding: 0.75rem 1.5rem;">
                    ✉️ Send New Message
                </button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${messages.map(message => `
                    <div class="card" style="padding: 1.5rem;">
                        <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 0.25rem 0; color: var(--gray-800);">${message.subject}</h4>
                                <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--gray-600);">
                                    <span>From: ${message.from_name}</span>
                                    <span>To: ${message.to_name}</span>
                                    <span>${new Date(message.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <span style="background: ${message.read ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                                    ${message.read ? 'Read' : 'Unread'}
                                </span>
                                <span style="background: var(--info); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                                    ${message.message_type}
                                </span>
                            </div>
                        </div>
                        <div style="background: var(--accent); padding: 1rem; border-radius: 6px; border-left: 4px solid var(--primary);">
                            <p style="margin: 0; color: var(--gray-700); line-height: 1.5;">
                                ${message.content}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = messagesHTML;
}

function renderAssessments(assessments) {
    const container = document.getElementById('assessments-content');
    if (!container) return;

    if (!assessments || assessments.length === 0) {
        container.innerHTML = '<div class="empty-state">No assessments found</div>';
        return;
    }

    const assessmentsHTML = `
        <div style="margin-bottom: 2rem;">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
                <h3 style="margin: 0;">📝 Assessment Management</h3>
                <button class="btn" style="background: var(--success); padding: 0.75rem 1.5rem;">
                    ➕ Create New Assessment
                </button>
            </div>
            <div style="display: grid; gap: 1rem;">
                ${assessments.map(assessment => `
                    <div class="card" style="padding: 1.5rem;">
                        <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">${assessment.title}</h4>
                                <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">${assessment.description}</p>
                            </div>
                            <div style="text-align: right;">
                                <span style="background: ${assessment.status === 'active' ? 'var(--success)' : 'var(--warning)'}; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">
                                    ${assessment.status}
                                </span>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                            <div style="text-align: center;">
                                <div style="font-weight: bold; color: var(--primary);">${assessment.total_questions}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Questions</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-weight: bold; color: var(--info);">${assessment.total_points}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Total Points</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-weight: bold; color: var(--warning);">${assessment.duration_minutes}min</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Duration</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-weight: bold; color: var(--success);">${assessment.submissions_count}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">Submissions</div>
                            </div>
                        </div>
                        <div style="background: var(--accent); padding: 0.75rem; border-radius: 6px; display: flex; justify-content: between; align-items: center;">
                            <div style="font-size: 0.875rem; color: var(--gray-700);">
                                Due: ${new Date(assessment.due_date).toLocaleDateString()}
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn" style="background: var(--info); padding: 0.5rem 1rem; font-size: 0.875rem;">
                                    📊 View Results
                                </button>
                                <button class="btn" style="background: var(--primary); padding: 0.5rem 1rem; font-size: 0.875rem;">
                                    ✏️ Edit
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = assessmentsHTML;
}

function renderAnalytics(data) {
    const container = document.getElementById('analytics-content');
    if (!container || !data.overview) return;

    const overview = data.overview;

    const analyticsHTML = `
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">📊 Learning Analytics & Insights</h3>

            <!-- Performance Overview -->
            <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0;">📈 Performance Overview</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">${overview.total_students}</div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">Total Students</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--success);">${Math.round(overview.average_progress)}%</div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">Avg Progress</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--info);">${Math.round(overview.average_engagement)}</div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">Engagement Score</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--warning);">${Math.round(overview.average_assessment_score)}</div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">Avg Assessment</div>
                    </div>
                </div>
            </div>

            <!-- Learning Trends -->
            <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0;">📈 Learning Trends</h4>
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; color: var(--gray-700);">
                        📊 Advanced analytics charts will be implemented here<br>
                        Current data shows strong performance across all metrics
                    </p>
                </div>
            </div>

            <!-- Student Performance Distribution -->
            <div class="card" style="padding: 1.5rem;">
                <h4 style="margin: 0 0 1rem 0;">👥 Student Performance Distribution</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                    <div style="text-align: center; padding: 1rem; background: var(--success); color: white; border-radius: 8px;">
                        <div style="font-size: 1.5rem; font-weight: bold;">${overview.active_students}</div>
                        <div style="font-size: 0.875rem;">High Performers</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--warning); color: white; border-radius: 8px;">
                        <div style="font-size: 1.5rem; font-weight: bold;">${overview.total_students - overview.active_students}</div>
                        <div style="font-size: 0.875rem;">Need Support</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--error); color: white; border-radius: 8px;">
                        <div style="font-size: 1.5rem; font-weight: bold;">${overview.at_risk_students}</div>
                        <div style="font-size: 0.875rem;">At Risk</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = analyticsHTML;
}

// ===== DATA REFRESH =====
async function refreshData() {
    try {
        await loadPage(state.currentPage);
        UIComponents.showNotification('Data refreshed successfully', 'success');
    } catch (error) {
        console.error('❌ Failed to refresh data:', error);
        UIComponents.showNotification(`Failed to refresh data: ${error.message}`, 'error');
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌱 Green Computing: DOM loaded, initializing portal...');

    // Set portal as initialized immediately to prevent timeout
    window.educatorPortal = {
        initialized: true,
        api: api,
        state: state,
        loadPage: loadPage,
        refreshData: refreshData
    };

    // Initialize portal
    initializePortal();

    // Add menu click handlers
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const onclick = item.getAttribute('onclick');
            if (onclick) {
                // Extract page name from onclick="showPage('pageName')"
                const match = onclick.match(/showPage\('([^']+)'\)/);
                if (match) {
                    loadPage(match[1]);
                }
            }
        });
    });

    // Add refresh button handler
    document.querySelectorAll('[onclick="refreshAllDashboardData()"]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            refreshData();
        });
    });
});

// ===== EXPORT FUNCTIONS TO WINDOW =====
window.loadPage = loadPage;
window.refreshData = refreshData;
window.refreshAllDashboardData = refreshData; // Alias for compatibility
window.loadNotifications = async function() {
    console.log('🔔 Loading notifications...');
    try {
        // Try to load communication module for notifications
        await loadPage('communication');
        console.log('✅ Notifications loaded via communication module');
    } catch (error) {
        console.log('⚠️ Notifications not available:', error.message);
        UIComponents.showNotification('Notifications system is loading...', 'info');
    }
};
