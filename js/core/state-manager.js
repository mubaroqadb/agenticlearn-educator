// ===== STATE MANAGER =====
// Centralized state management for the application

export class StateManager {
    constructor() {
        this.state = {
            user: {
                isAuthenticated: false,
                profile: null,
                permissions: []
            },
            app: {
                isInitialized: false,
                currentPage: 'beranda',
                isLoading: false,
                lastRefresh: null
            },
            data: {
                dashboard: null,
                students: [],
                assessments: [],
                messages: [],
                announcements: [],
                notifications: [],
                aiInsights: null,
                aiRecommendations: null
            },
            ui: {
                sidebarCollapsed: false,
                theme: 'light',
                notifications: [],
                modals: {}
            },
            cache: {
                lastFetch: {},
                expiry: {}
            }
        };
        
        this.subscribers = new Map();
        this.middleware = [];
        this.persistKeys = ['ui.sidebarCollapsed', 'ui.theme', 'app.currentPage'];
        
        this.loadPersistedState();
    }

    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(key);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }

    // Get state value by path
    get(path) {
        return this.getNestedValue(this.state, path);
    }

    // Set state value by path
    set(path, value, options = {}) {
        const oldValue = this.get(path);
        
        // Run middleware
        for (const middleware of this.middleware) {
            const result = middleware(path, value, oldValue, this.state);
            if (result !== undefined) {
                value = result;
            }
        }

        // Update state
        this.setNestedValue(this.state, path, value);
        
        // Notify subscribers
        this.notifySubscribers(path, value, oldValue);
        
        // Persist if needed
        if (this.shouldPersist(path)) {
            this.persistState();
        }

        // Log state change in development
        if (options.debug || window.APP_DEBUG) {
            console.log(`🔄 State changed: ${path}`, { oldValue, newValue: value });
        }
    }

    // Update state (merge objects)
    update(path, updates) {
        const currentValue = this.get(path);
        if (typeof currentValue === 'object' && currentValue !== null) {
            this.set(path, { ...currentValue, ...updates });
        } else {
            this.set(path, updates);
        }
    }

    // Reset state to initial values
    reset(path = null) {
        if (path) {
            this.set(path, this.getInitialValue(path));
        } else {
            this.state = this.getInitialState();
            this.notifyAllSubscribers();
        }
    }

    // Add middleware
    addMiddleware(middleware) {
        this.middleware.push(middleware);
    }

    // Cache management
    setCache(key, data, ttl = 300000) { // 5 minutes default
        this.set(`cache.lastFetch.${key}`, Date.now());
        this.set(`cache.expiry.${key}`, Date.now() + ttl);
        this.set(`data.${key}`, data);
    }

    getCache(key) {
        const expiry = this.get(`cache.expiry.${key}`);
        if (expiry && Date.now() < expiry) {
            return this.get(`data.${key}`);
        }
        return null;
    }

    isCacheValid(key) {
        const expiry = this.get(`cache.expiry.${key}`);
        return expiry && Date.now() < expiry;
    }

    clearCache(key = null) {
        if (key) {
            this.set(`cache.lastFetch.${key}`, null);
            this.set(`cache.expiry.${key}`, null);
            this.set(`data.${key}`, null);
        } else {
            this.set('cache', { lastFetch: {}, expiry: {} });
        }
    }

    // UI state helpers
    showLoading(message = 'Loading...') {
        this.set('app.isLoading', true);
        this.set('app.loadingMessage', message);
    }

    hideLoading() {
        this.set('app.isLoading', false);
        this.set('app.loadingMessage', null);
    }

    addNotification(notification) {
        const notifications = this.get('ui.notifications') || [];
        const newNotification = {
            id: Date.now().toString(),
            timestamp: new Date(),
            ...notification
        };
        this.set('ui.notifications', [...notifications, newNotification]);
        return newNotification.id;
    }

    removeNotification(id) {
        const notifications = this.get('ui.notifications') || [];
        this.set('ui.notifications', notifications.filter(n => n.id !== id));
    }

    clearNotifications() {
        this.set('ui.notifications', []);
    }

    // Modal management
    openModal(modalId, data = null) {
        this.set(`ui.modals.${modalId}`, { isOpen: true, data });
    }

    closeModal(modalId) {
        this.set(`ui.modals.${modalId}`, { isOpen: false, data: null });
    }

    isModalOpen(modalId) {
        return this.get(`ui.modals.${modalId}.isOpen`) || false;
    }

    // User state helpers
    setUser(userProfile) {
        this.set('user.profile', userProfile);
        this.set('user.isAuthenticated', !!userProfile);
    }

    logout() {
        this.set('user.profile', null);
        this.set('user.isAuthenticated', false);
        this.set('user.permissions', []);
        this.clearCache();
    }

    hasPermission(permission) {
        const permissions = this.get('user.permissions') || [];
        return permissions.includes(permission);
    }

    // Data refresh tracking
    markDataRefresh(dataType) {
        this.set('app.lastRefresh', new Date());
        this.set(`cache.lastFetch.${dataType}`, Date.now());
    }

    getLastRefresh(dataType = null) {
        if (dataType) {
            return this.get(`cache.lastFetch.${dataType}`);
        }
        return this.get('app.lastRefresh');
    }

    // Private helper methods
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    notifySubscribers(path, newValue, oldValue) {
        // Notify exact path subscribers
        const callbacks = this.subscribers.get(path);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(newValue, oldValue, path);
                } catch (error) {
                    console.error('Error in state subscriber:', error);
                }
            });
        }

        // Notify wildcard subscribers
        const pathParts = path.split('.');
        for (let i = 0; i < pathParts.length; i++) {
            const wildcardPath = pathParts.slice(0, i + 1).join('.') + '.*';
            const wildcardCallbacks = this.subscribers.get(wildcardPath);
            if (wildcardCallbacks) {
                wildcardCallbacks.forEach(callback => {
                    try {
                        callback(newValue, oldValue, path);
                    } catch (error) {
                        console.error('Error in wildcard state subscriber:', error);
                    }
                });
            }
        }
    }

    notifyAllSubscribers() {
        this.subscribers.forEach((callbacks, path) => {
            const value = this.get(path.replace('.*', ''));
            callbacks.forEach(callback => {
                try {
                    callback(value, null, path);
                } catch (error) {
                    console.error('Error in state subscriber:', error);
                }
            });
        });
    }

    shouldPersist(path) {
        return this.persistKeys.some(key => path.startsWith(key));
    }

    persistState() {
        try {
            const persistedState = {};
            this.persistKeys.forEach(key => {
                const value = this.get(key);
                if (value !== null) {
                    this.setNestedValue(persistedState, key, value);
                }
            });
            localStorage.setItem('agenticlearn_state', JSON.stringify(persistedState));
        } catch (error) {
            console.warn('Failed to persist state:', error);
        }
    }

    loadPersistedState() {
        try {
            const persisted = localStorage.getItem('agenticlearn_state');
            if (persisted) {
                const persistedState = JSON.parse(persisted);
                this.persistKeys.forEach(key => {
                    const value = this.getNestedValue(persistedState, key);
                    if (value !== null) {
                        this.setNestedValue(this.state, key, value);
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to load persisted state:', error);
        }
    }

    getInitialState() {
        return {
            user: { isAuthenticated: false, profile: null, permissions: [] },
            app: { isInitialized: false, currentPage: 'beranda', isLoading: false, lastRefresh: null },
            data: { dashboard: null, students: [], assessments: [], messages: [], announcements: [], notifications: [], aiInsights: null, aiRecommendations: null },
            ui: { sidebarCollapsed: false, theme: 'light', notifications: [], modals: {} },
            cache: { lastFetch: {}, expiry: {} }
        };
    }

    getInitialValue(path) {
        return this.getNestedValue(this.getInitialState(), path);
    }

    // Debug helpers
    getState() {
        return { ...this.state };
    }

    getSubscribers() {
        return Array.from(this.subscribers.keys());
    }

    // Destroy state manager
    destroy() {
        this.subscribers.clear();
        this.middleware = [];
        this.state = this.getInitialState();
    }
}

// Create and export singleton instance
export const stateManager = new StateManager();
export default stateManager;
