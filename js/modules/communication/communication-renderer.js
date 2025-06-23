// ===== COMMUNICATION RENDERER MODULE =====

import { formatDate, formatTime } from '../../core/utils.js';
import { CommunicationTemplates } from './communication-templates.js';

export class CommunicationRenderer {
    static renderMainInterface(currentView, messages, announcements, notifications) {
        return `
            <div class="communication-container">
                <div class="communication-header">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h2 style="margin: 0;">💬 Communication Center</h2>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-secondary" onclick="communicationManager.refreshCurrentView()" title="Refresh current view">
                                🔄 Refresh
                            </button>
                            <button class="btn-secondary" onclick="communicationManager.markAllNotificationsRead()" title="Mark all notifications as read">
                                ✅ Mark All Read
                            </button>
                        </div>
                    </div>
                    <div class="communication-tabs">
                        <button class="tab-btn ${currentView === 'messages' ? 'active' : ''}"
                                data-view="messages"
                                onclick="communicationManager.switchView('messages')">
                            📧 Messages (${messages.length})
                        </button>
                        <button class="tab-btn ${currentView === 'announcements' ? 'active' : ''}"
                                data-view="announcements"
                                onclick="communicationManager.switchView('announcements')">
                            📢 Announcements (${announcements.length})
                        </button>
                        <button class="tab-btn ${currentView === 'notifications' ? 'active' : ''}"
                                data-view="notifications"
                                onclick="communicationManager.switchView('notifications')">
                            🔔 Notifications (${notifications.filter(n => !n.read).length})
                        </button>
                    </div>
                </div>
                
                <div class="communication-content">
                    <div id="messages-view" class="view-content ${currentView === 'messages' ? 'active' : 'hidden'}">
                        ${this.renderMessagesView(messages)}
                    </div>
                    
                    <div id="announcements-view" class="view-content ${currentView === 'announcements' ? 'active' : 'hidden'}">
                        ${this.renderAnnouncementsView(announcements)}
                    </div>
                    
                    <div id="notifications-view" class="view-content ${currentView === 'notifications' ? 'active' : 'hidden'}">
                        ${this.renderNotificationsView(notifications)}
                    </div>
                </div>
            </div>
            
            ${this.renderStyles()}
        `;
    }

    static renderMessagesView(messages) {
        const createMessageForm = this.renderMessageForm();
        const messagesHTML = this.renderMessagesList(messages);
        return createMessageForm + '<div class="messages-list">' + messagesHTML + '</div>';
    }

    static renderAnnouncementsView(announcements) {
        const createAnnouncementForm = this.renderAnnouncementForm();
        const announcementsHTML = this.renderAnnouncementsList(announcements);
        return createAnnouncementForm + '<div class="announcements-list">' + announcementsHTML + '</div>';
    }

    static renderNotificationsView(notifications) {
        const notificationsHTML = this.renderNotificationsList(notifications);
        return '<div class="notifications-list">' + notificationsHTML + '</div>';
    }

    static renderMessageForm() {
        const messageTemplates = CommunicationTemplates.getMessageTemplates();
        const studentOptions = CommunicationTemplates.getStudentOptions();
        const messageTypes = CommunicationTemplates.getMessageTypes();

        return `
            <div class="create-form">
                <h3>📧 Send New Message</h3>
                <form id="send-message-form">
                    <div class="form-group">
                        <label class="form-label">To Student:</label>
                        <select class="form-select" id="message-to-student" required>
                            <option value="">Select student...</option>
                            ${studentOptions.map(student =>
                                `<option value="${student.value}">${student.label}</option>`
                            ).join('')}
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
                            ${messageTemplates.map(template =>
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
                            ${messageTypes.map(type =>
                                `<option value="${type.value}">${type.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Send Message</button>
                </form>
            </div>
        `;
    }

    static renderAnnouncementForm() {
        const priorityLevels = CommunicationTemplates.getPriorityLevels();
        const audienceOptions = CommunicationTemplates.getAudienceOptions();

        return `
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
                            ${priorityLevels.map(priority =>
                                `<option value="${priority.value}" ${priority.value === 'normal' ? 'selected' : ''}>${priority.label}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Audience:</label>
                        <select class="form-select" id="announcement-audience">
                            ${audienceOptions.map(audience =>
                                `<option value="${audience.value}" ${audience.value === 'all' ? 'selected' : ''}>${audience.label}</option>`
                            ).join('')}
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
    }

    static renderMessagesList(messages) {
        return messages.map(message => `
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

    static renderAnnouncementsList(announcements) {
        return announcements.map(announcement => `
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

    static renderNotificationsList(notifications) {
        return notifications.map(notification => `
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

    static renderBulkMessageModal() {
        const recipients = CommunicationTemplates.getBulkMessageRecipients();
        const priorityLevels = CommunicationTemplates.getPriorityLevels();

        return `
            <div class="modal-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
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
                        <h3 style="margin: 0;">📤 Send Bulk Message</h3>
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
                                ${recipients.map(recipient =>
                                    `<option value="${recipient.value}" title="${recipient.description}">${recipient.label}</option>`
                                ).join('')}
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
                                ${priorityLevels.map(priority =>
                                    `<option value="${priority.value}" ${priority.value === 'normal' ? 'selected' : ''}>${priority.label}</option>`
                                ).join('')}
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
    }

    static renderErrorMessage(message) {
        return `
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
    }

    static renderStyles() {
        return `
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
                    justify-content: space-between;
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
    }
}
