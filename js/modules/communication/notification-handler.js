// ===== NOTIFICATION HANDLER MODULE =====

import { apiClient } from '../../core/api-client.js';
import { UIComponents } from '../../components/ui-components.js';
import { CommunicationRenderer } from './communication-renderer.js';

export class NotificationHandler {
    constructor() {
        this.notifications = [];
    }

    async loadNotifications() {
        try {
            console.log('🔄 Loading notifications from backend...');
            const response = await apiClient.getNotifications();
            
            if (response && response.success && response.data) {
                this.notifications = response.data;
                console.log(`✅ Loaded ${this.notifications.length} notifications`);
                return this.notifications;
            }
            return [];
        } catch (error) {
            console.error('❌ Failed to load notifications:', error);
            throw error;
        }
    }

    async markNotificationRead(notificationId) {
        try {
            console.log('🔄 Marking notification as read...', notificationId);

            const response = await apiClient.markNotificationRead(notificationId);

            if (response && response.success) {
                UIComponents.showNotification('Notification marked as read', 'success');
                
                // Update local array
                const notification = this.notifications.find(n => n.notification_id === notificationId);
                if (notification) {
                    notification.read = true;
                    notification.read_at = new Date().toISOString();
                }
                
                return { success: true };
            } else {
                throw new Error(response?.message || 'Failed to mark notification as read');
            }
        } catch (error) {
            console.error('❌ Failed to mark notification as read:', error);
            UIComponents.showNotification(`Failed to mark notification as read: ${error.message}`, 'error');
            throw error;
        }
    }

    async markAllNotificationsRead() {
        try {
            console.log('🔄 Marking all notifications as read...');

            const response = await apiClient.markAllNotificationsRead();

            if (response && response.success) {
                UIComponents.showNotification('All notifications marked as read', 'success');
                
                // Update local array
                this.notifications.forEach(notification => {
                    if (!notification.read) {
                        notification.read = true;
                        notification.read_at = new Date().toISOString();
                    }
                });
                
                return { success: true };
            } else {
                throw new Error(response?.message || 'Failed to mark all notifications as read');
            }
        } catch (error) {
            console.error('❌ Failed to mark all notifications as read:', error);
            UIComponents.showNotification(`Failed to mark all notifications as read: ${error.message}`, 'error');
            throw error;
        }
    }

    handleNotificationAction(actionUrl) {
        console.log('🔄 Handling notification action:', actionUrl);
        
        try {
            // Navigate to the action URL or handle the action
            if (actionUrl.startsWith('/assessments/')) {
                // Switch to assessments view
                window.educatorPortal?.switchPage('assessments');
            } else if (actionUrl.startsWith('/students/')) {
                // Switch to students view
                window.educatorPortal?.switchPage('students');
            } else if (actionUrl.startsWith('/communication/')) {
                // Stay in communication view but switch tab
                const tab = actionUrl.split('/')[2];
                window.communicationManager?.switchView(tab);
            } else if (actionUrl.startsWith('http')) {
                // External URL
                window.open(actionUrl, '_blank');
            } else {
                // Internal navigation
                window.location.hash = actionUrl;
            }

            UIComponents.showNotification('Action completed', 'success');
        } catch (error) {
            console.error('❌ Failed to handle notification action:', error);
            UIComponents.showNotification(`Failed to handle action: ${error.message}`, 'error');
        }
    }

    async createNotification(notificationData) {
        try {
            console.log('🔄 Creating notification...', notificationData);

            // For now, add to local array (in production, this would call backend)
            const newNotification = {
                notification_id: `notif_${Date.now()}`,
                ...notificationData,
                created_at: new Date().toISOString(),
                read: false
            };

            this.notifications.unshift(newNotification);
            
            UIComponents.showNotification('Notification created successfully!', 'success');
            return { success: true, notification: newNotification };
        } catch (error) {
            console.error('❌ Failed to create notification:', error);
            UIComponents.showNotification(`Failed to create notification: ${error.message}`, 'error');
            throw error;
        }
    }

    async deleteNotification(notificationId) {
        try {
            console.log('🔄 Deleting notification...', notificationId);

            // For now, remove from local array (in production, this would call backend)
            this.notifications = this.notifications.filter(n => n.notification_id !== notificationId);
            
            UIComponents.showNotification('Notification deleted successfully!', 'success');
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to delete notification:', error);
            UIComponents.showNotification(`Failed to delete notification: ${error.message}`, 'error');
            throw error;
        }
    }

    renderNotificationsList() {
        return CommunicationRenderer.renderNotificationsList(this.notifications);
    }

    updateNotificationsList() {
        const notificationsContainer = document.querySelector('#notifications-view .notifications-list');
        if (notificationsContainer) {
            notificationsContainer.innerHTML = this.renderNotificationsList();
        }
    }

    getNotifications() {
        return this.notifications;
    }

    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read);
    }

    getNotificationById(notificationId) {
        return this.notifications.find(n => n.notification_id === notificationId);
    }

    searchNotifications(query) {
        if (!query) return this.notifications;
        
        const lowercaseQuery = query.toLowerCase();
        return this.notifications.filter(notification => 
            notification.title.toLowerCase().includes(lowercaseQuery) ||
            notification.message.toLowerCase().includes(lowercaseQuery)
        );
    }

    filterNotificationsByType(type) {
        if (!type || type === 'all') return this.notifications;
        return this.notifications.filter(notification => notification.type === type);
    }

    filterNotificationsByPriority(priority) {
        if (!priority || priority === 'all') return this.notifications;
        return this.notifications.filter(notification => notification.priority === priority);
    }

    filterNotificationsByReadStatus(readStatus) {
        if (readStatus === 'read') {
            return this.notifications.filter(n => n.read);
        } else if (readStatus === 'unread') {
            return this.notifications.filter(n => !n.read);
        }
        return this.notifications;
    }

    sortNotifications(sortBy = 'created_at', order = 'desc') {
        return [...this.notifications].sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle date sorting
            if (sortBy === 'created_at' || sortBy === 'read_at') {
                aValue = new Date(aValue || 0);
                bValue = new Date(bValue || 0);
            }

            if (order === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });
    }

    getNotificationStats() {
        const total = this.notifications.length;
        const unread = this.notifications.filter(n => !n.read).length;
        const read = total - unread;

        const byType = {};
        const byPriority = {};

        this.notifications.forEach(notification => {
            // Count by type
            byType[notification.type] = (byType[notification.type] || 0) + 1;
            
            // Count by priority
            byPriority[notification.priority] = (byPriority[notification.priority] || 0) + 1;
        });

        return {
            total,
            read,
            unread,
            readPercentage: total > 0 ? Math.round((read / total) * 100) : 0,
            byType,
            byPriority
        };
    }

    // Utility methods for notification management
    addNotification(notification) {
        this.notifications.unshift(notification);
    }

    updateNotification(notificationId, updates) {
        const index = this.notifications.findIndex(n => n.notification_id === notificationId);
        if (index !== -1) {
            this.notifications[index] = { ...this.notifications[index], ...updates };
        }
    }

    removeNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.notification_id !== notificationId);
    }

    clearAllNotifications() {
        this.notifications = [];
    }

    clearReadNotifications() {
        this.notifications = this.notifications.filter(n => !n.read);
    }

    // Auto-cleanup old notifications (older than 30 days)
    cleanupOldNotifications() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const beforeCount = this.notifications.length;
        this.notifications = this.notifications.filter(notification => {
            const createdAt = new Date(notification.created_at);
            return createdAt > thirtyDaysAgo;
        });

        const removedCount = beforeCount - this.notifications.length;
        if (removedCount > 0) {
            console.log(`🧹 Cleaned up ${removedCount} old notifications`);
        }
    }
}
