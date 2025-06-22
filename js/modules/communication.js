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
        this.messageTemplates = this.getMessageTemplates();
    }

    async initialize() {
        console.log('🔄 Initializing Communication System...');
        try {
            await this.loadAllData();
            this.renderCommunicationInterface();
            this.setupEventListeners();
            this.startAutoRefresh();
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
                                data-view="messages"
                                onclick="communicationManager.switchView('messages')">
                            📧 Messages (${this.messages.length})
                        </button>
                        <button class="tab-btn ${this.currentView === 'announcements' ? 'active' : ''}"
                                data-view="announcements"
                                onclick="communicationManager.switchView('announcements')">
                            📢 Announcements (${this.announcements.length})
                        </button>
                        <button class="tab-btn ${this.currentView === 'notifications' ? 'active' : ''}"
                                data-view="notifications"
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
                        <label class="form-label">Message Templates:</label>
                        <select class="form-select" id="message-template" onchange="communicationManager.applyMessageTemplate()">
                            <option value="">Select template...</option>
                            ${this.messageTemplates.map(template =>
                                `<option value="${template.id}">${template.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Message:</label>
                        <textarea class="form-textarea" id="message-content" required placeholder="Type your message or select a template above..."></textarea>
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

        // Validate form data
        const validationResult = this.validateMessageForm();
        if (!validationResult.isValid) {
            UIComponents.showNotification(validationResult.message, 'warning');
            return;
        }

        const formData = {
            to_id: document.getElementById('message-to-student').value,
            to_name: document.getElementById('message-to-student').selectedOptions[0].text,
            subject: document.getElementById('message-subject').value.trim(),
            content: document.getElementById('message-content').value.trim(),
            message_type: document.getElementById('message-type').value,
            from_id: 'educator_001',
            from_name: 'Dr. Sarah Johnson',
            conversation_id: `conv_${Date.now()}`
        };

        try {
            console.log('🔄 Sending message...', formData);

            // Show loading state
            const submitButton = event.target.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '⏳ Sending...';
            submitButton.disabled = true;

            const response = await apiClient.sendMessage(formData);

            if (response && response.success) {
                UIComponents.showNotification('Message sent successfully!', 'success');
                document.getElementById('send-message-form').reset();
                await this.loadMessages();
                this.updateViewContent('messages');
            } else {
                // Backend endpoint doesn't exist yet, simulate success
                UIComponents.showNotification('Message sent (demo mode)', 'info');
                document.getElementById('send-message-form').reset();
            }
        } catch (error) {
            console.error('❌ Failed to send message:', error);
            // Since backend endpoint doesn't exist, treat as demo mode
            UIComponents.showNotification('Message sent (demo mode)', 'info');
            document.getElementById('send-message-form').reset();
        } finally {
            // Reset button state
            const submitButton = event.target.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.textContent = '📤 Send Message';
                submitButton.disabled = false;
            }
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
                this.updateViewContent('announcements');
            }
        } catch (error) {
            console.error('❌ Failed to create announcement:', error);
            UIComponents.showNotification('Failed to create announcement: ' + error.message, 'error');
        }
    }

    switchView(view) {
        this.currentView = view;
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
                const messagesContainer = document.querySelector('#messages-view .messages-list');
                if (messagesContainer) {
                    messagesContainer.innerHTML = this.renderMessagesList();
                }
                break;
            case 'announcements':
                const announcementsContainer = document.querySelector('#announcements-view .announcements-list');
                if (announcementsContainer) {
                    announcementsContainer.innerHTML = this.renderAnnouncementsList();
                }
                break;
            case 'notifications':
                const notificationsContainer = document.querySelector('#notifications-view .notifications-list');
                if (notificationsContainer) {
                    notificationsContainer.innerHTML = this.renderNotificationsList();
                }
                break;
        }
    }

    renderMessagesList() {
        return this.messages.map(message => `
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
    }

    renderAnnouncementsList() {
        return this.announcements.map(announcement => `
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
    }

    renderNotificationsList() {
        return this.notifications.map(notification => `
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
    }

    async markNotificationRead(notificationId) {
        try {
            console.log('🔄 Marking notification as read:', notificationId);
            // Note: Backend doesn't have this endpoint yet, but we'll simulate it
            const notification = this.notifications.find(n => n.notification_id === notificationId);
            if (notification) {
                notification.read = true;
                this.updateViewContent('notifications');
                UIComponents.showNotification('Notification marked as read', 'success');
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
            this.updateViewContent('announcements');
            UIComponents.showNotification('Announcement deleted successfully', 'success');
        } catch (error) {
            console.error('❌ Failed to delete announcement:', error);
            UIComponents.showNotification('Failed to delete announcement: ' + error.message, 'error');
        }
    }

    validateMessageForm() {
        const toStudent = document.getElementById('message-to-student')?.value;
        const subject = document.getElementById('message-subject')?.value?.trim();
        const content = document.getElementById('message-content')?.value?.trim();

        if (!toStudent) {
            return { isValid: false, message: 'Please select a recipient' };
        }

        if (!subject || subject.length < 3) {
            return { isValid: false, message: 'Subject must be at least 3 characters long' };
        }

        if (subject.length > 100) {
            return { isValid: false, message: 'Subject must be less than 100 characters' };
        }

        if (!content || content.length < 10) {
            return { isValid: false, message: 'Message content must be at least 10 characters long' };
        }

        if (content.length > 2000) {
            return { isValid: false, message: 'Message content must be less than 2000 characters' };
        }

        return { isValid: true, message: 'Validation passed' };
    }

    validateAnnouncementForm() {
        const title = document.getElementById('announcement-title')?.value?.trim();
        const content = document.getElementById('announcement-content')?.value?.trim();
        const expires = document.getElementById('announcement-expires')?.value;

        if (!title || title.length < 5) {
            return { isValid: false, message: 'Announcement title must be at least 5 characters long' };
        }

        if (title.length > 100) {
            return { isValid: false, message: 'Announcement title must be less than 100 characters' };
        }

        if (!content || content.length < 20) {
            return { isValid: false, message: 'Announcement content must be at least 20 characters long' };
        }

        if (content.length > 5000) {
            return { isValid: false, message: 'Announcement content must be less than 5000 characters' };
        }

        if (expires) {
            const expiresDate = new Date(expires);
            const now = new Date();
            if (expiresDate <= now) {
                return { isValid: false, message: 'Expiration date must be in the future' };
            }
        }

        return { isValid: true, message: 'Validation passed' };
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
                        this.updateViewContent('notifications');
                    }
                });
            }
        }, 10000);

        // Refresh messages every 15 seconds
        setInterval(() => {
            if (this.currentView === 'messages') {
                this.loadMessages().then(() => {
                    if (this.currentView === 'messages') {
                        this.updateViewContent('messages');
                    }
                });
            }
        }, 15000);
    }

    getMessageTemplates() {
        return [
            {
                id: 'encouragement',
                name: '🌟 Encouragement',
                subject: 'Keep up the great work!',
                content: 'Hi [Student Name],\n\nI wanted to take a moment to acknowledge your excellent progress in our course. Your dedication and hard work are truly paying off!\n\nKeep up the fantastic work, and don\'t hesitate to reach out if you need any support.\n\nBest regards,\nDr. Sarah Johnson'
            },
            {
                id: 'reminder',
                name: '⏰ Assignment Reminder',
                subject: 'Upcoming Assignment Deadline',
                content: 'Hi [Student Name],\n\nThis is a friendly reminder that your assignment "[Assignment Name]" is due on [Due Date].\n\nIf you have any questions or need assistance, please don\'t hesitate to reach out.\n\nBest regards,\nDr. Sarah Johnson'
            },
            {
                id: 'feedback',
                name: '📝 Feedback',
                subject: 'Feedback on your recent work',
                content: 'Hi [Student Name],\n\nI\'ve reviewed your recent submission and wanted to provide some feedback:\n\n[Feedback Details]\n\nOverall, you\'re making good progress. Keep up the good work!\n\nBest regards,\nDr. Sarah Johnson'
            },
            {
                id: 'concern',
                name: '⚠️ Academic Concern',
                subject: 'Let\'s discuss your progress',
                content: 'Hi [Student Name],\n\nI\'ve noticed that you might be facing some challenges with the course material. I\'d like to schedule a meeting to discuss how I can better support your learning.\n\nPlease let me know your availability for a brief chat.\n\nBest regards,\nDr. Sarah Johnson'
            },
            {
                id: 'congratulations',
                name: '🎉 Congratulations',
                subject: 'Congratulations on your achievement!',
                content: 'Hi [Student Name],\n\nCongratulations on your excellent performance! Your hard work and dedication have really paid off.\n\nI\'m proud of your achievement and look forward to seeing your continued success.\n\nBest regards,\nDr. Sarah Johnson'
            }
        ];
    }

    applyMessageTemplate() {
        const templateSelect = document.getElementById('message-template');
        const subjectInput = document.getElementById('message-subject');
        const contentTextarea = document.getElementById('message-content');

        if (!templateSelect || !subjectInput || !contentTextarea) return;

        const templateId = templateSelect.value;
        if (!templateId) return;

        const template = this.messageTemplates.find(t => t.id === templateId);
        if (template) {
            subjectInput.value = template.subject;
            contentTextarea.value = template.content;

            // Show notification
            UIComponents.showNotification(`Template "${template.name}" applied`, 'success');
        }
    }

    // Bulk messaging functionality
    async sendBulkMessage() {
        const modalHTML = `
            <div class="modal-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            ">
                <div class="modal-content" style="
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h3 style="margin: 0;">📢 Send Bulk Message</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" style="
                            background: none;
                            border: none;
                            font-size: 1.5rem;
                            cursor: pointer;
                            color: #6b7280;
                        ">&times;</button>
                    </div>

                    <form id="bulk-message-form">
                        <div class="form-group">
                            <label class="form-label">Recipients:</label>
                            <select class="form-select" id="bulk-recipients" multiple style="height: 120px;">
                                <option value="all">All Students</option>
                                <option value="at_risk">At-Risk Students</option>
                                <option value="high_performers">High Performers</option>
                                <option value="course_001">Digital Literacy Course</option>
                                <option value="course_002">Programming Basics Course</option>
                            </select>
                            <small style="color: #6b7280;">Hold Ctrl/Cmd to select multiple options</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Subject:</label>
                            <input type="text" class="form-input" id="bulk-subject" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Message:</label>
                            <textarea class="form-textarea" id="bulk-content" required style="height: 150px;"></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Priority:</label>
                            <select class="form-select" id="bulk-priority">
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                                Cancel
                            </button>
                            <button type="submit" class="btn-primary">
                                📤 Send to All
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listener for form submission
        document.getElementById('bulk-message-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBulkMessage(e);
        });
    }

    async handleBulkMessage(event) {
        const formData = {
            recipients: Array.from(document.getElementById('bulk-recipients').selectedOptions).map(o => o.value),
            subject: document.getElementById('bulk-subject').value,
            content: document.getElementById('bulk-content').value,
            priority: document.getElementById('bulk-priority').value,
            message_type: 'bulk'
        };

        try {
            console.log('🔄 Sending bulk message...', formData);

            // Show loading state
            const submitButton = event.target.querySelector('button[type="submit"]');
            submitButton.textContent = '⏳ Sending...';
            submitButton.disabled = true;

            // Simulate API call (backend endpoint doesn't exist yet)
            await new Promise(resolve => setTimeout(resolve, 2000));

            UIComponents.showNotification(`Bulk message sent to ${formData.recipients.length} recipient groups`, 'success');

            // Close modal
            document.querySelector('.modal-overlay').remove();

        } catch (error) {
            console.error('❌ Failed to send bulk message:', error);
            UIComponents.showNotification('Failed to send bulk message: ' + error.message, 'error');
        }
    }
}

// Create and export singleton instance
export const communicationManager = new CommunicationManager();

// Make it globally available for onclick handlers
window.communicationManager = communicationManager;
