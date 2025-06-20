// ===== ROUTER MODULE =====
// Handles navigation and page routing

import { UIComponents } from '../components/ui-components.js';
import { setInner, show, hide } from './utils.js';

export class Router {
    constructor(app) {
        this.app = app;
        this.currentRoute = null;
        this.routes = new Map();
        this.beforeNavigateCallbacks = [];
        this.afterNavigateCallbacks = [];
    }

    // Register a route with its handler
    register(path, handler, options = {}) {
        this.routes.set(path, {
            handler,
            title: options.title || path,
            requiresAuth: options.requiresAuth || false,
            module: options.module || null
        });
    }

    // Navigate to a specific route
    async navigate(path, options = {}) {
        console.log(`🧭 Router: Navigating to ${path}`);

        try {
            // Run before navigate callbacks
            for (const callback of this.beforeNavigateCallbacks) {
                const result = await callback(path, this.currentRoute);
                if (result === false) {
                    console.log('🚫 Navigation cancelled by before callback');
                    return false;
                }
            }

            const route = this.routes.get(path);
            if (!route) {
                console.warn(`⚠️ Route not found: ${path}`);
                return this.navigate('beranda'); // Fallback to dashboard
            }

            // Show loading state if not disabled
            if (!options.skipLoading) {
                this.showNavigationLoading(path);
            }

            // Update browser history if not disabled
            if (!options.skipHistory && path !== this.currentRoute) {
                this.updateBrowserHistory(path, route.title);
            }

            // Execute route handler
            if (route.handler) {
                await route.handler(path, options);
            } else if (route.module) {
                await this.handleModuleRoute(route.module, path);
            }

            // Update current route
            const previousRoute = this.currentRoute;
            this.currentRoute = path;

            // Run after navigate callbacks
            for (const callback of this.afterNavigateCallbacks) {
                await callback(path, previousRoute);
            }

            console.log(`✅ Router: Successfully navigated to ${path}`);
            
            // Show success notification if enabled
            if (options.showNotification !== false) {
                UIComponents.showNotification(`Navigated to ${route.title}`, 'success');
            }

            return true;

        } catch (error) {
            console.error(`❌ Router: Navigation failed for ${path}:`, error);
            this.showNavigationError(path, error);
            return false;
        }
    }

    // Handle module-based routes
    async handleModuleRoute(module, path) {
        if (!module) {
            throw new Error(`Module not found for route: ${path}`);
        }

        // Initialize module if it has an initialize method
        if (typeof module.initialize === 'function') {
            await module.initialize();
        } else {
            console.warn(`⚠️ Module for ${path} doesn't have initialize method`);
        }

        // Show the appropriate page content
        this.showPageContent(path);
    }

    // Show page content and hide others
    showPageContent(path) {
        // Hide all page contents
        this.app.hideAllPages();
        
        // Show target page
        const pageElement = document.getElementById(`page-${path}`);
        if (pageElement) {
            show(`page-${path}`);
        } else {
            console.warn(`⚠️ Page element not found: page-${path}`);
        }

        // Update active menu
        this.updateActiveMenu(path);
        
        // Update page header
        this.updatePageHeader(path);
    }

    // Update active menu state
    updateActiveMenu(path) {
        // Remove active class from all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current menu item
        const activeMenuItem = document.querySelector(`[data-menu="${path}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }
    }

    // Update page header
    updatePageHeader(path) {
        const route = this.routes.get(path);
        if (route) {
            const titleElement = document.getElementById('page-title');
            const subtitleElement = document.getElementById('page-subtitle');
            
            if (titleElement) {
                titleElement.textContent = route.title;
            }
            
            if (subtitleElement && route.subtitle) {
                subtitleElement.textContent = route.subtitle;
            }
        }
    }

    // Show navigation loading state
    showNavigationLoading(path) {
        const route = this.routes.get(path);
        const loadingHTML = `
            <div class="navigation-loading" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 3rem;
                text-align: center;
            ">
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--accent);
                    border-top: 4px solid var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                "></div>
                <h3 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">
                    Loading ${route?.title || path}...
                </h3>
                <p style="margin: 0; color: var(--gray-600);">
                    Please wait while we prepare the content
                </p>
            </div>
        `;

        // Show loading in the main content area
        const contentArea = document.getElementById(`${path}-content`) || 
                           document.getElementById('main-content');
        if (contentArea) {
            setInner(contentArea.id, loadingHTML);
        }
    }

    // Show navigation error
    showNavigationError(path, error) {
        const errorHTML = `
            <div class="navigation-error" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 3rem;
                text-align: center;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3 style="margin: 0 0 1rem 0; color: var(--error);">
                    Failed to Load Page
                </h3>
                <p style="margin: 0 0 2rem 0; color: var(--gray-600); max-width: 400px;">
                    There was an error loading the ${path} page. Please try again or contact support if the problem persists.
                </p>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn btn-primary" onclick="router.navigate('${path}', {skipHistory: true})">
                        🔄 Retry
                    </button>
                    <button class="btn btn-secondary" onclick="router.navigate('beranda')">
                        🏠 Go to Dashboard
                    </button>
                </div>
                <details style="margin-top: 2rem; max-width: 500px;">
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

        const contentArea = document.getElementById(`${path}-content`) || 
                           document.getElementById('main-content');
        if (contentArea) {
            setInner(contentArea.id, errorHTML);
        }

        UIComponents.showNotification(`Failed to load ${path}: ${error.message}`, 'error');
    }

    // Update browser history
    updateBrowserHistory(path, title) {
        const url = new URL(window.location);
        url.hash = path;
        
        try {
            window.history.pushState({ path }, title, url.toString());
            document.title = `${title} - AgenticLearn Educator Portal`;
        } catch (error) {
            console.warn('Failed to update browser history:', error);
        }
    }

    // Handle browser back/forward buttons
    handlePopState(event) {
        if (event.state && event.state.path) {
            this.navigate(event.state.path, { skipHistory: true, showNotification: false });
        }
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Check if a route exists
    hasRoute(path) {
        return this.routes.has(path);
    }

    // Get route information
    getRoute(path) {
        return this.routes.get(path);
    }

    // Add before navigate callback
    beforeNavigate(callback) {
        this.beforeNavigateCallbacks.push(callback);
    }

    // Add after navigate callback
    afterNavigate(callback) {
        this.afterNavigateCallbacks.push(callback);
    }

    // Initialize router
    initialize() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => this.handlePopState(event));

        // Handle initial route from URL hash
        const initialRoute = window.location.hash.slice(1) || 'beranda';
        this.navigate(initialRoute, { skipHistory: true, showNotification: false });

        console.log('✅ Router initialized');
    }

    // Destroy router
    destroy() {
        window.removeEventListener('popstate', this.handlePopState);
        this.routes.clear();
        this.beforeNavigateCallbacks = [];
        this.afterNavigateCallbacks = [];
        this.currentRoute = null;
    }
}

// Export router class
export default Router;
