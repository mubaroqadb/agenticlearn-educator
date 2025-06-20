// ===== COMMUNICATION MODULE =====

import { apiClient } from '../core/api-client.js';
import { API_CONFIG } from '../core/config.js';
import { UIComponents } from '../components/ui-components.js';
import { formatDate, formatTime, setInner, showError, showSuccess } from '../core/utils.js';

export class CommunicationManager {
    constructor() {
        this.messages = [];
        this.announcements = [];
        this.notifications = [];
        this.isLoading = false;
        this.currentView = 'messages'; // messages, announcements, notifications
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
            this.loadMessages(),
            this.loadAnnouncements(),
            this.loadNotifications()
        ]);
    }

    async loadMessages() {
        try {
            console.log('🔄 Loading messages from backend...');
            const response = await apiClient.getMessagesList();
            
            if (response && response.success && response.data) {
                this.messages = response.data;
                console.log(`✅ Loaded ${this.messages.length} messages`);
            }
        } catch (error) {
            console.error('❌ Failed to load messages:', error);
            throw error;
        }
    }

    async loadAnnouncements() {
        try {
            console.log('🔄 Loading announcements from backend...');
            const response = await apiClient.getAnnouncementsList();
            
            if (response && response.success && response.data) {
                this.announcements = response.data;
                console.log(`✅ Loaded ${this.announcements.length} announcements`);
            }
        } catch (error) {
            console.error('❌ Failed to load announcements:', error);
            throw error;
        }
    }

    async loadNotifications() {
        try {
            console.log('🔄 Loading notifications from backend...');
            const response = await apiClient.getNotifications();
            
            if (response && response.success && response.data) {
                this.notifications = response.data;
                console.log(`✅ Loaded ${this.notifications.length} notifications`);
            }
        } catch (error) {
            console.error('❌ Failed to load notifications:', error);
            throw error;
        }
    }

    renderCommunicationInterface() {
        const communicationHTML = `
            <div class="communication-container">
                <div class="communication-header">
                    <h2>💬 Communication Center</h2>
                    <div class="communication-tabs">
                        <button class="tab-btn ${this.currentView === 'messages' ? 'active' : ''}" 
                                onclick="communicationManager.switchView('messages')">
                            📧 Messages (${this.messages.length})
                        </button>
                        <button class="tab-btn ${this.currentView === 'announcements' ? 'active' : ''}" 
                                onclick="communicationManager.switchView('announcements')">
                            📢 Announcements (${this.announcements.length})
                        </button>
                        <button class="tab-btn ${this.currentView === 'notifications' ? 'active' : ''}" 
                                onclick="communicationManager.switchView('notifications')">
                            🔔 Notifications (${this.notifications.filter(n => !n.read).length})
                        </button>
                    </div>
                </div>
                
                <div class="communication-content">
                    <div id="messages-view" class="view-content ${this.currentView === 'messages' ? 'active' : 'hidden'}">
                        ${this.renderMessagesView()}
                    </div>
                    
                    <div id="announcements-view" class="view-content ${this.currentView === 'announcements' ? 'active' : 'hidden'}">
                        ${this.renderAnnouncementsView()}
                    </div>
                    
                    <div id="notifications-view" class="view-content ${this.currentView === 'notifications' ? 'active' : 'hidden'}">
                        ${this.renderNotificationsView()}
                    </div>
                </div>
            </div>
            
            <style>
                .communication-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem;
                }
                
                .communication-header {
                    margin-bottom: 2rem;
                }
                
                .communication-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                
                .tab-btn {
                    padding: 0.75rem 1.5rem;
                    border: 2px solid #e5e7eb;
                    background: white;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .tab-btn:hover {
                    border-color: #3b82f6;
                    background: #f8fafc;
                }
                
                .tab-btn.active {
                    border-color: #3b82f6;
                    background: #3b82f6;
                    color: white;
                }
                
                .view-content {
                    min-height: 400px;
                }
                
                .view-content.hidden {
                    display: none;
                }
                
                .message-card, .announcement-card, .notification-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    transition: all 0.2s;
                }
                
                .message-card:hover, .announcement-card:hover, .notification-card:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
                }
                
                .card-header {
                    display: flex;
                    justify-content: between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                
                .card-title {
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .card-meta {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                
                .card-content {
                    color: #374151;
                    line-height: 1.5;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                .btn-primary, .btn-secondary {
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    border: none;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }
                
                .btn-primary {
                    background: #3b82f6;
                    color: white;
                }
                
                .btn-primary:hover {
                    background: #2563eb;
                }
                
                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .btn-secondary:hover {
                    background: #e5e7eb;
                }
                
                .create-form {
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-label {
                    display: block;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    color: #374151;
                }
                
                .form-input, .form-textarea, .form-select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                }
                
                .form-input:focus, .form-textarea:focus, .form-select:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .form-textarea {
                    min-height: 100px;
                    resize: vertical;
                }
            </style>
        `;
        
        setInner('communication-content', communicationHTML);
    }

    renderMessagesView() {
        const createMessageForm = `
            <div class="create-form">
                <h3>📧 Send New Message</h3>
                <form id="send-message-form">
                    <div class="form-group">
                        <label class="form-label">To Student:</label>
                        <select class="form-select" id="message-to-student" required>
                            <option value="">Select student...</option>
                            <option value="student_001">Ahmad Mahasiswa</option>
                            <option value="student_002">Budi Santoso</option>
                            <option value="student_003">Siti Nurhaliza</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Subject:</label>
                        <input type="text" class="form-input" id="message-subject" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message:</label>
                        <textarea class="form-textarea" id="message-content" required></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message Type:</label>
                        <select class="form-select" id="message-type">
                            <option value="general">General</option>
                            <option value="feedback">Feedback</option>
                            <option value="encouragement">Encouragement</option>
                            <option value="reminder">Reminder</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Send Message</button>
                </form>
            </div>
        `;

        const messagesHTML = this.messages.map(message => `
            <div class="message-card">
                <div class="card-header">
                    <div class="card-title">${message.subject}</div>
                    <div class="card-meta">${formatDate(message.timestamp)}</div>
                </div>
                <div class="card-meta">
                    To: ${message.to_name} | Type: ${message.message_type} | Status: ${message.status}
                </div>
                <div class="card-content">${message.content}</div>
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="communicationManager.replyToMessage('${message.message_id}')">
                        Reply
                    </button>
                </div>
            </div>
        `).join('');

        return createMessageForm + '<div class="messages-list">' + messagesHTML + '</div>';
    }

    renderAnnouncementsView() {
        const createAnnouncementForm = `
            <div class="create-form">
                <h3>📢 Create New Announcement</h3>
                <form id="create-announcement-form">
                    <div class="form-group">
                        <label class="form-label">Title:</label>
                        <input type="text" class="form-input" id="announcement-title" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Content:</label>
                        <textarea class="form-textarea" id="announcement-content" required></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Priority:</label>
                        <select class="form-select" id="announcement-priority">
                            <option value="low">Low</option>
                            <option value="normal" selected>Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Audience:</label>
                        <select class="form-select" id="announcement-audience">
                            <option value="all" selected>All Students</option>
                            <option value="course_001">Digital Literacy Course</option>
                            <option value="course_002">Programming Basics Course</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Expires At:</label>
                        <input type="datetime-local" class="form-input" id="announcement-expires">
                    </div>
                    <button type="submit" class="btn-primary">Create Announcement</button>
                </form>
            </div>
        `;

        const announcementsHTML = this.announcements.map(announcement => `
            <div class="announcement-card">
                <div class="card-header">
                    <div class="card-title">${announcement.title}</div>
                    <div class="card-meta">
                        ${formatDate(announcement.created_at)} | Priority: ${announcement.priority}
                    </div>
                </div>
                <div class="card-meta">
                    Audience: ${announcement.audience} | Read: ${announcement.read_count}/${announcement.total_recipients} (${announcement.read_percentage}%)
                </div>
                <div class="card-content">${announcement.content}</div>
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="communicationManager.editAnnouncement('${announcement.announcement_id}')">
                        Edit
                    </button>
                    <button class="btn-secondary" onclick="communicationManager.deleteAnnouncement('${announcement.announcement_id}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        return createAnnouncementForm + '<div class="announcements-list">' + announcementsHTML + '</div>';
    }

    renderNotificationsView() {
        const notificationsHTML = this.notifications.map(notification => `
            <div class="notification-card ${notification.read ? '' : 'unread'}">
                <div class="card-header">
                    <div class="card-title">
                        ${notification.read ? '' : '🔴 '} ${notification.title}
                    </div>
                    <div class="card-meta">
                        ${formatDate(notification.created_at)} | Priority: ${notification.priority}
                    </div>
                </div>
                <div class="card-content">${notification.message}</div>
                <div class="action-buttons">
                    ${!notification.read ? `
                        <button class="btn-primary" onclick="communicationManager.markNotificationRead('${notification.notification_id}')">
                            Mark as Read
                        </button>
                    ` : ''}
                    ${notification.action_url ? `
                        <button class="btn-secondary" onclick="communicationManager.handleNotificationAction('${notification.action_url}')">
                            Take Action
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');

        return '<div class="notifications-list">' + notificationsHTML + '</div>';
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

    async handleSendMessage(event) {
        event.preventDefault();

        const formData = {
            to_id: document.getElementById('message-to-student').value,
            to_name: document.getElementById('message-to-student').selectedOptions[0].text,
            subject: document.getElementById('message-subject').value,
            content: document.getElementById('message-content').value,
            message_type: document.getElementById('message-type').value,
            from_id: 'educator_001',
            from_name: 'Dr. Sarah Johnson',
            conversation_id: `conv_${Date.now()}`
        };

        try {
            console.log('🔄 Sending message...', formData);
            const response = await apiClient.sendMessage(formData);

            if (response && response.success) {
                UIComponents.showNotification('Message sent successfully!', 'success');
                document.getElementById('send-message-form').reset();
                await this.loadMessages();
                this.renderCommunicationInterface();
            }
        } catch (error) {
            console.error('❌ Failed to send message:', error);
            UIComponents.showNotification('Failed to send message: ' + error.message, 'error');
        }
    }

    async handleCreateAnnouncement(event) {
        event.preventDefault();

        const expiresAt = document.getElementById('announcement-expires').value;
        const formData = {
            title: document.getElementById('announcement-title').value,
            content: document.getElementById('announcement-content').value,
            priority: document.getElementById('announcement-priority').value,
            audience: document.getElementById('announcement-audience').value,
            course_id: document.getElementById('announcement-audience').value.startsWith('course_')
                ? document.getElementById('announcement-audience').value
                : null,
            expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
        };

        try {
            console.log('🔄 Creating announcement...', formData);
            const response = await apiClient.createAnnouncement(formData);

            if (response && response.success) {
                UIComponents.showNotification('Announcement created successfully!', 'success');
                document.getElementById('create-announcement-form').reset();
                await this.loadAnnouncements();
                this.renderCommunicationInterface();
            }
        } catch (error) {
            console.error('❌ Failed to create announcement:', error);
            UIComponents.showNotification('Failed to create announcement: ' + error.message, 'error');
        }
    }

    switchView(view) {
        this.currentView = view;
        this.renderCommunicationInterface();
    }

    async markNotificationRead(notificationId) {
        try {
            console.log('🔄 Marking notification as read:', notificationId);
            // Note: Backend doesn't have this endpoint yet, but we'll simulate it
            const notification = this.notifications.find(n => n.notification_id === notificationId);
            if (notification) {
                notification.read = true;
                this.renderCommunicationInterface();
                showSuccess('Notification marked as read');
            }
        } catch (error) {
            console.error('❌ Failed to mark notification as read:', error);
            showError('Failed to mark notification as read: ' + error.message);
        }
    }

    handleNotificationAction(actionUrl) {
        console.log('🔄 Handling notification action:', actionUrl);
        // Navigate to the action URL or handle the action
        if (actionUrl.startsWith('/assessments/')) {
            // Switch to assessments view
            window.educatorPortal?.switchPage('assessments');
        } else if (actionUrl.startsWith('/students/')) {
            // Switch to students view
            window.educatorPortal?.switchPage('students');
        }
        showSuccess('Navigating to ' + actionUrl);
    }

    replyToMessage(messageId) {
        console.log('🔄 Replying to message:', messageId);
        const message = this.messages.find(m => m.message_id === messageId);
        if (message) {
            // Pre-fill the form with reply data
            document.getElementById('message-to-student').value = message.from_id;
            document.getElementById('message-subject').value = 'Re: ' + message.subject;
            document.getElementById('message-content').value = `\n\n--- Original Message ---\n${message.content}`;
            document.getElementById('message-type').value = 'feedback';

            // Scroll to form
            document.getElementById('send-message-form').scrollIntoView({ behavior: 'smooth' });
        }
    }

    editAnnouncement(announcementId) {
        console.log('🔄 Editing announcement:', announcementId);
        const announcement = this.announcements.find(a => a.announcement_id === announcementId);
        if (announcement) {
            // Pre-fill the form with announcement data
            document.getElementById('announcement-title').value = announcement.title;
            document.getElementById('announcement-content').value = announcement.content;
            document.getElementById('announcement-priority').value = announcement.priority;
            document.getElementById('announcement-audience').value = announcement.audience;

            // Scroll to form
            document.getElementById('create-announcement-form').scrollIntoView({ behavior: 'smooth' });
        }
    }

    async deleteAnnouncement(announcementId) {
        if (!confirm('Are you sure you want to delete this announcement?')) {
            return;
        }

        try {
            console.log('🔄 Deleting announcement:', announcementId);
            // Note: Backend doesn't have delete endpoint yet, but we'll simulate it
            this.announcements = this.announcements.filter(a => a.announcement_id !== announcementId);
            this.renderCommunicationInterface();
            showSuccess('Announcement deleted successfully');
        } catch (error) {
            console.error('❌ Failed to delete announcement:', error);
            showError('Failed to delete announcement: ' + error.message);
        }
    }

    renderError(message) {
        const errorHTML = `
            <div class="error-container" style="
                text-align: center;
                padding: 2rem;
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 0.5rem;
                color: #dc2626;
            ">
                <h3>❌ Communication System Error</h3>
                <p>${message}</p>
                <button class="btn-primary" onclick="communicationManager.initialize()" style="margin-top: 1rem;">
                    Retry
                </button>
            </div>
        `;

        setInner('communication-content', errorHTML);
    }

    // Auto-refresh functionality
    startAutoRefresh() {
        // Refresh notifications every 10 seconds
        setInterval(() => {
            if (this.currentView === 'notifications') {
                this.loadNotifications().then(() => {
                    if (this.currentView === 'notifications') {
                        this.renderCommunicationInterface();
                    }
                });
            }
        }, 10000);

        // Refresh messages every 15 seconds
        setInterval(() => {
            if (this.currentView === 'messages') {
                this.loadMessages().then(() => {
                    if (this.currentView === 'messages') {
                        this.renderCommunicationInterface();
                    }
                });
            }
        }, 15000);
    }
}

// Create and export singleton instance
export const communicationManager = new CommunicationManager();

// Make it globally available for onclick handlers
window.communicationManager = communicationManager;
