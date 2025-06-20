// ===== AGENTICLEARN EDUCATOR PORTAL - MAIN APPLICATION =====

import { apiClient } from './core/api-client.js';
import { UIComponents } from './components/ui-components.js';
import { dashboardModule } from './modules/dashboard.js';
import { studentModule } from './modules/students.js';
import { assessmentModule } from './modules/assessments.js';
import { communicationModule } from './modules/communication.js';
import { aiSystemModule } from './modules/ai-system.js';
import { workflowModule } from './modules/workflow.js';
import { reportsModule } from './modules/reports.js';
import { MENU_CONFIG, APP_CONFIG } from './core/config.js';
import { setInner, show, hide } from './core/utils.js';

class AgenticLearnApp {
    constructor() {
        this.currentPage = 'beranda';
        this.isInitialized = false;
        this.modules = new Map();
        this.menuState = {
            isCollapsed: false,
            activeMenu: 'beranda'
        };
        this.initializeModules();
    }

    initializeModules() {
        // Register all modules
        this.modules.set('beranda', dashboardModule);
        this.modules.set('students', studentModule);
        this.modules.set('assessments', assessmentModule);
        this.modules.set('communication', communicationModule);
        this.modules.set('ai-recommendations', aiSystemModule);
        this.modules.set('workflow', workflowModule);
        this.modules.set('reports', reportsModule);

        console.log('📦 Modules registered:', Array.from(this.modules.keys()));
    }

    async initialize() {
        if (this.isInitialized) return;

        console.log('🚀 Initializing AgenticLearn Educator Portal...');
        
        try {
            // Initialize core components
            this.setupEventListeners();
            this.renderNavigation();
            this.loadMenuState();
            
            // Test backend connection
            await this.testBackendConnection();
            
            // Initialize modules
            await this.initializeModules();
            
            // Show initial page
            await this.showPage(this.currentPage);
            
            this.isInitialized = true;
            console.log('✅ AgenticLearn Educator Portal initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.showInitializationError(error);
        }
    }

    async testBackendConnection() {
        console.log('🔄 Testing backend connection...');
        
        const result = await apiClient.testConnection();
        
        if (result.success) {
            console.log(`✅ Connected as ${result.profile.name}`);
            this.updateConnectionStatus(true, result.profile);
        } else {
            console.error('❌ Backend connection failed');
            this.updateConnectionStatus(false);
        }
    }

    updateConnectionStatus(isConnected, profile = null) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            if (isConnected && profile) {
                statusElement.innerHTML = `
                    <div style="color: var(--success); display: flex; align-items: center; gap: 0.5rem;">
                        <span style="width: 8px; height: 8px; background: var(--success); border-radius: 50%;"></span>
                        Connected as ${profile.name}
                    </div>
                `;
            } else {
                statusElement.innerHTML = `
                    <div style="color: var(--error); display: flex; align-items: center; gap: 0.5rem;">
                        <span style="width: 8px; height: 8px; background: var(--error); border-radius: 50%;"></span>
                        Demo Mode
                    </div>
                `;
            }
        }
    }

    renderNavigation() {
        const menuHTML = MENU_CONFIG.CORE_MENUS.map(menu => `
            <a href="#" class="menu-item ${menu.id === this.menuState.activeMenu ? 'active' : ''}" 
               onclick="app.showPage('${menu.id}')" data-menu="${menu.id}">
                <span class="menu-icon">${menu.icon}</span>
                <span class="menu-text">${menu.title}</span>
            </a>
        `).join('');

        setInner('navigation-menu', menuHTML);
    }

    async initializeModules() {
        console.log('🔧 Initializing modules...');

        // Initialize all modules
        for (const [moduleId, module] of this.modules) {
            try {
                if (typeof module.initialize === 'function') {
                    console.log(`🔧 Initializing ${moduleId} module...`);
                    // Only initialize dashboard by default, others on demand
                    if (moduleId === 'beranda') {
                        await module.initialize();
                    }
                }
            } catch (error) {
                console.error(`❌ Failed to initialize ${moduleId} module:`, error);
            }
        }

        console.log('✅ Modules initialized successfully');
    }

    async showPage(pageId) {
        if (this.currentPage === pageId) return;

        console.log(`📄 Switching to page: ${pageId}`);
        
        try {
            // Hide all pages
            this.hideAllPages();
            
            // Update menu state
            this.updateActiveMenu(pageId);
            
            // Show target page
            show(`page-${pageId}`);
            
            // Initialize module if needed
            const module = this.modules.get(pageId);
            if (module && typeof module.initialize === 'function') {
                await module.initialize();
            }
            
            // Update page header
            this.updatePageHeader(pageId);
            
            this.currentPage = pageId;
            this.saveMenuState();
            
        } catch (error) {
            console.error(`❌ Failed to show page ${pageId}:`, error);
        }
    }

    hideAllPages() {
        MENU_CONFIG.CORE_MENUS.forEach(menu => {
            hide(`page-${menu.id}`);
        });
    }

    updateActiveMenu(pageId) {
        // Remove active class from all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current menu item
        const activeMenuItem = document.querySelector(`[data-menu="${pageId}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }
        
        this.menuState.activeMenu = pageId;
    }

    updatePageHeader(pageId) {
        const menu = MENU_CONFIG.CORE_MENUS.find(m => m.id === pageId);
        if (menu) {
            setInner('page-title', menu.title);
            setInner('page-subtitle', menu.subtitle);
        }
    }

    setupEventListeners() {
        // Menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Refresh button
        const refreshButton = document.getElementById('refresh-data');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.refreshCurrentPage());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.refreshCurrentPage();
                        break;
                    case '1':
                        e.preventDefault();
                        this.showPage('beranda');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showPage('analytics');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showPage('students');
                        break;
                }
            }
        });
    }

    toggleMenu() {
        this.menuState.isCollapsed = !this.menuState.isCollapsed;
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed', this.menuState.isCollapsed);
        }
        this.saveMenuState();
    }

    async refreshCurrentPage() {
        const module = this.modules.get(this.currentPage);
        if (module && typeof module.loadData === 'function') {
            await module.loadData();
        } else if (module && typeof module.initialize === 'function') {
            await module.initialize();
        }
    }

    saveMenuState() {
        localStorage.setItem('agenticlearn_menu_state', JSON.stringify(this.menuState));
    }

    loadMenuState() {
        try {
            const saved = localStorage.getItem('agenticlearn_menu_state');
            if (saved) {
                this.menuState = { ...this.menuState, ...JSON.parse(saved) };
                this.currentPage = this.menuState.activeMenu || 'beranda';
            }
        } catch (error) {
            console.warn('Failed to load menu state:', error);
        }
    }

    showInitializationError(error) {
        const errorHTML = `
            <div class="initialization-error" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                padding: 2rem;
                text-align: center;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h2 style="color: var(--error); margin-bottom: 1rem;">
                    Failed to Initialize Application
                </h2>
                <p style="color: var(--gray-600); margin-bottom: 2rem; max-width: 500px;">
                    There was an error starting the AgenticLearn Educator Portal. 
                    Please refresh the page or contact support if the problem persists.
                </p>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    🔄 Refresh Page
                </button>
                <details style="margin-top: 2rem; max-width: 600px;">
                    <summary style="cursor: pointer; color: var(--gray-500);">
                        Technical Details
                    </summary>
                    <pre style="
                        background: var(--gray-100);
                        padding: 1rem;
                        border-radius: 4px;
                        margin-top: 1rem;
                        text-align: left;
                        overflow: auto;
                        font-size: 0.875rem;
                    ">${error.message}</pre>
                </details>
            </div>
        `;
        
        document.body.innerHTML = errorHTML;
    }

    destroy() {
        // Clean up modules
        this.modules.forEach(module => {
            if (typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules.clear();
        this.isInitialized = false;
    }
}

// Create global app instance
window.app = new AgenticLearnApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.initialize());
} else {
    app.initialize();
}

// Export for module usage
export default window.app;
