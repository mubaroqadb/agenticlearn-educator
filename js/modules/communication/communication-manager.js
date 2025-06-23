// ===== COMMUNICATION MANAGER (MODULAR) =====

import { setInner } from '../../core/utils.js';
import { MessageHandler } from './message-handler.js';
import { AnnouncementHandler } from './announcement-handler.js';
import { NotificationHandler } from './notification-handler.js';
import { CommunicationRenderer } from './communication-renderer.js';
import { CommunicationTemplates } from './communication-templates.js';

export class CommunicationManager {
    constructor() {
        this.messageHandler = new MessageHandler();
        this.announcementHandler = new AnnouncementHandler();
        this.notificationHandler = new NotificationHandler();
        
        this.isLoading = false;
        this.currentView = 'messages'; // messages, announcements, notifications
        this.messageTemplates = CommunicationTemplates.getMessageTemplates();
    }

    async initialize() {
        console.log('🔄 Initializing Communication System...');
        try {
            await this.loadAllData();
            this.renderCommunicationInterface();
            this.setupEventListeners();
            console.log('✅ Communication System initialized successfully');
        } catch (error) {
            console.error('❌ Communication System initialization failed:', error);
            this.renderError(error.message);
        }
    }

    async loadAllData() {
        await Promise.all([
            this.messageHandler.loadMessages(),
            this.announcementHandler.loadAnnouncements(),
            this.notificationHandler.loadNotifications()
        ]);
    }

    renderCommunicationInterface() {
        const communicationHTML = CommunicationRenderer.renderMainInterface(
            this.currentView,
            this.messageHandler.getMessages(),
            this.announcementHandler.getAnnouncements(),
            this.notificationHandler.getNotifications()
        );
        
        setInner('communication-content', communicationHTML);
    }

    setupEventListeners() {
        // Send message form
        const sendMessageForm = document.getElementById('send-message-form');
        if (sendMessageForm) {
            sendMessageForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        }

        // Create announcement form
        const createAnnouncementForm = document.getElementById('create-announcement-form');
        if (createAnnouncementForm) {
            createAnnouncementForm.addEventListener('submit', (e) => this.handleCreateAnnouncement(e));
        }
    }

    // Delegate to handlers
    async handleSendMessage(event) {
        const result = await this.messageHandler.handleSendMessage(event);
        if (result.success) {
            this.updateMessagesList();
        }
        return result;
    }

    async handleCreateAnnouncement(event) {
        const result = await this.announcementHandler.handleCreateAnnouncement(event);
        if (result.success) {
            this.updateAnnouncementsList();
        }
        return result;
    }

    // View switching
    switchView(viewName) {
        this.currentView = viewName;
        this.updateViewDisplay();
    }

    updateViewDisplay() {
        // Update tab active states
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${this.currentView}"]`)?.classList.add('active');

        // Update view content visibility
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active');
        });

        const activeView = document.getElementById(`${this.currentView}-view`);
        if (activeView) {
            activeView.classList.remove('hidden');
            activeView.classList.add('active');

            // Update content for the active view only
            this.updateViewContent(this.currentView);
        }
    }

    updateViewContent(viewName) {
        switch (viewName) {
            case 'messages':
                this.updateMessagesList();
                break;
            case 'announcements':
                this.updateAnnouncementsList();
                break;
            case 'notifications':
                this.updateNotificationsList();
                break;
        }
    }

    // Update methods that delegate to handlers
    updateMessagesList() {
        this.messageHandler.updateMessagesList();
    }

    updateAnnouncementsList() {
        this.announcementHandler.updateAnnouncementsList();
    }

    updateNotificationsList() {
        this.notificationHandler.updateNotificationsList();
    }

    // Delegate methods to handlers
    async replyToMessage(messageId) {
        return await this.messageHandler.replyToMessage(messageId);
    }

    async editAnnouncement(announcementId) {
        const result = await this.announcementHandler.editAnnouncement(announcementId);
        if (result?.success) {
            this.updateAnnouncementsList();
        }
        return result;
    }

    async deleteAnnouncement(announcementId) {
        const result = await this.announcementHandler.deleteAnnouncement(announcementId);
        if (result?.success) {
            this.updateAnnouncementsList();
        }
        return result;
    }

    async markNotificationRead(notificationId) {
        const result = await this.notificationHandler.markNotificationRead(notificationId);
        if (result?.success) {
            this.updateNotificationsList();
            // Update tab count
            this.updateTabCounts();
        }
        return result;
    }

    async markAllNotificationsRead() {
        const result = await this.notificationHandler.markAllNotificationsRead();
        if (result?.success) {
            this.updateNotificationsList();
            this.updateTabCounts();
        }
        return result;
    }

    handleNotificationAction(actionUrl) {
        return this.notificationHandler.handleNotificationAction(actionUrl);
    }

    applyMessageTemplate() {
        return this.messageHandler.applyMessageTemplate();
    }

    async sendBulkMessage() {
        return await this.messageHandler.sendBulkMessage();
    }

    // Refresh functionality
    async refreshCurrentView() {
        try {
            console.log(`🔄 Manually refreshing ${this.currentView} view...`);

            switch (this.currentView) {
                case 'messages':
                    await this.messageHandler.loadMessages();
                    this.updateMessagesList();
                    break;
                case 'announcements':
                    await this.announcementHandler.loadAnnouncements();
                    this.updateAnnouncementsList();
                    break;
                case 'notifications':
                    await this.notificationHandler.loadNotifications();
                    this.updateNotificationsList();
                    break;
            }

            this.updateTabCounts();
            console.log(`✅ ${this.currentView} view refreshed successfully`);
        } catch (error) {
            console.error(`❌ Failed to refresh ${this.currentView} view:`, error);
        }
    }

    updateTabCounts() {
        // Update tab counts in the interface
        const messagesTab = document.querySelector('[data-view="messages"]');
        const announcementsTab = document.querySelector('[data-view="announcements"]');
        const notificationsTab = document.querySelector('[data-view="notifications"]');

        if (messagesTab) {
            const messageCount = this.messageHandler.getMessages().length;
            messagesTab.innerHTML = `📧 Messages (${messageCount})`;
        }

        if (announcementsTab) {
            const announcementCount = this.announcementHandler.getAnnouncements().length;
            announcementsTab.innerHTML = `📢 Announcements (${announcementCount})`;
        }

        if (notificationsTab) {
            const unreadCount = this.notificationHandler.getUnreadNotifications().length;
            notificationsTab.innerHTML = `🔔 Notifications (${unreadCount})`;
        }
    }

    renderError(message) {
        const errorHTML = CommunicationRenderer.renderErrorMessage(message);
        setInner('communication-content', errorHTML);
    }

    // Getter methods for accessing data
    getMessages() {
        return this.messageHandler.getMessages();
    }

    getAnnouncements() {
        return this.announcementHandler.getAnnouncements();
    }

    getNotifications() {
        return this.notificationHandler.getNotifications();
    }

    getMessageTemplates() {
        return this.messageTemplates;
    }

    // Statistics methods
    getStats() {
        return {
            messages: this.messageHandler.getMessageStats(),
            announcements: this.announcementHandler.getAnnouncementStats(),
            notifications: this.notificationHandler.getNotificationStats()
        };
    }

    // Search functionality
    searchContent(query) {
        return {
            messages: this.messageHandler.searchMessages(query),
            announcements: this.announcementHandler.searchAnnouncements(query),
            notifications: this.notificationHandler.searchNotifications(query)
        };
    }

    // Cleanup methods
    cleanup() {
        // Cleanup old notifications
        this.notificationHandler.cleanupOldNotifications();
        
        // Remove event listeners if needed
        console.log('🧹 Communication system cleanup completed');
    }
}
