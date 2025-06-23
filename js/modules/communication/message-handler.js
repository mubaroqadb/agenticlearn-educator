// ===== MESSAGE HANDLER MODULE =====

import { apiClient } from '../../core/api-client.js';
import { API_CONFIG } from '../../core/config.js';
import { UIComponents } from '../../components/ui-components.js';
import { CommunicationValidator } from './communication-validator.js';
import { CommunicationTemplates } from './communication-templates.js';
import { CommunicationRenderer } from './communication-renderer.js';

export class MessageHandler {
    constructor() {
        this.messages = [];
    }

    async loadMessages() {
        try {
            console.log('🔄 Loading messages from backend...');
            const response = await apiClient.getMessagesList();
            
            if (response && response.success && response.data) {
                this.messages = response.data;
                console.log(`✅ Loaded ${this.messages.length} messages`);
                return this.messages;
            }
            return [];
        } catch (error) {
            console.error('❌ Failed to load messages:', error);
            throw error;
        }
    }

    async sendMessage(formData) {
        try {
            console.log('🔄 Sending message...', formData);
            console.log('🔗 Using endpoint:', API_CONFIG.ENDPOINTS.SEND_MESSAGE);

            const response = await apiClient.sendMessage(formData);

            if (response && response.success) {
                UIComponents.showNotification('Message sent successfully!', 'success');
                
                // Add the new message to local array for immediate UI update
                const newMessage = {
                    message_id: response.message_id || `msg_${Date.now()}`,
                    ...formData,
                    timestamp: new Date().toISOString(),
                    status: 'sent'
                };
                this.messages.unshift(newMessage);
                
                return { success: true, message: newMessage };
            } else {
                throw new Error(response?.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('❌ Failed to send message:', error);
            UIComponents.showNotification(`Failed to send message: ${error.message}`, 'error');
            throw error;
        }
    }

    async handleSendMessage(event) {
        event.preventDefault();

        // Validate form data
        const validationResult = CommunicationValidator.validateMessageForm();
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
            // Show loading state
            const submitButton = event.target.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '⏳ Sending...';
            submitButton.disabled = true;

            await this.sendMessage(formData);
            
            // Reset form on success
            document.getElementById('send-message-form').reset();
            
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            return { success: true };
        } catch (error) {
            // Restore button state on error
            const submitButton = event.target.querySelector('button[type="submit"]');
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
            
            return { success: false, error: error.message };
        }
    }

    async replyToMessage(messageId) {
        try {
            const originalMessage = this.messages.find(m => m.message_id === messageId);
            if (!originalMessage) {
                UIComponents.showNotification('Original message not found', 'error');
                return;
            }

            // Pre-fill the form with reply data
            const toStudentSelect = document.getElementById('message-to-student');
            const subjectInput = document.getElementById('message-subject');
            const contentTextarea = document.getElementById('message-content');

            if (toStudentSelect) {
                toStudentSelect.value = originalMessage.from_id || originalMessage.to_id;
            }

            if (subjectInput) {
                const replySubject = originalMessage.subject.startsWith('Re: ') 
                    ? originalMessage.subject 
                    : `Re: ${originalMessage.subject}`;
                subjectInput.value = replySubject;
            }

            if (contentTextarea) {
                const replyContent = `\n\n--- Original Message ---\nFrom: ${originalMessage.from_name}\nDate: ${originalMessage.timestamp}\nSubject: ${originalMessage.subject}\n\n${originalMessage.content}`;
                contentTextarea.value = replyContent;
                contentTextarea.focus();
            }

            // Switch to messages view if not already there
            if (window.communicationManager) {
                window.communicationManager.switchView('messages');
            }

            UIComponents.showNotification('Reply form prepared', 'info');
        } catch (error) {
            console.error('❌ Failed to prepare reply:', error);
            UIComponents.showNotification(`Failed to prepare reply: ${error.message}`, 'error');
        }
    }

    applyMessageTemplate() {
        const templateSelect = document.getElementById('message-template');
        const subjectInput = document.getElementById('message-subject');
        const contentTextarea = document.getElementById('message-content');

        if (!templateSelect || !templateSelect.value) return;

        const templates = CommunicationTemplates.getMessageTemplates();
        const template = templates.find(t => t.id === templateSelect.value);

        if (template) {
            // Get student name for personalization
            const studentSelect = document.getElementById('message-to-student');
            const studentName = studentSelect?.selectedOptions[0]?.text || '[Student Name]';

            const formatted = CommunicationTemplates.formatTemplate(template, {
                student_name: studentName,
                educator_name: 'Dr. Sarah Johnson'
            });

            if (subjectInput) {
                subjectInput.value = formatted.subject;
            }

            if (contentTextarea) {
                contentTextarea.value = formatted.content;
            }

            // Reset template selection
            templateSelect.value = '';

            // Show notification
            UIComponents.showNotification(`Template "${template.name}" applied`, 'success');
        }
    }

    async sendBulkMessage() {
        const modalHTML = CommunicationRenderer.renderBulkMessageModal();
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listener for form submission
        document.getElementById('bulk-message-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBulkMessage(e);
        });
    }

    async handleBulkMessage(event) {
        const validationResult = CommunicationValidator.validateBulkMessageForm();
        if (!validationResult.isValid) {
            UIComponents.showNotification(validationResult.message, 'warning');
            return;
        }

        const formData = {
            recipients: Array.from(document.getElementById('bulk-recipients').selectedOptions).map(o => o.value),
            subject: document.getElementById('bulk-subject').value,
            content: document.getElementById('bulk-content').value,
            priority: document.getElementById('bulk-priority').value,
            message_type: 'bulk'
        };

        try {
            console.log('🔄 Sending bulk message...', formData);

            const response = await apiClient.sendBulkMessage(formData);

            if (response && response.success) {
                UIComponents.showNotification(
                    `Bulk message sent successfully! Sent to ${response.sent_count} recipients.`,
                    'success'
                );

                // Close modal
                document.querySelector('.modal-overlay')?.remove();

                // Refresh messages
                await this.loadMessages();
            } else {
                throw new Error(response?.message || 'Failed to send bulk message');
            }
        } catch (error) {
            console.error('❌ Failed to send bulk message:', error);
            UIComponents.showNotification(`Failed to send bulk message: ${error.message}`, 'error');
        }
    }

    renderMessagesList() {
        return CommunicationRenderer.renderMessagesList(this.messages);
    }

    updateMessagesList() {
        const messagesContainer = document.querySelector('#messages-view .messages-list');
        if (messagesContainer) {
            messagesContainer.innerHTML = this.renderMessagesList();
        }
    }

    getMessages() {
        return this.messages;
    }

    getMessageById(messageId) {
        return this.messages.find(m => m.message_id === messageId);
    }

    addMessage(message) {
        this.messages.unshift(message);
    }

    updateMessage(messageId, updates) {
        const index = this.messages.findIndex(m => m.message_id === messageId);
        if (index !== -1) {
            this.messages[index] = { ...this.messages[index], ...updates };
        }
    }

    deleteMessage(messageId) {
        this.messages = this.messages.filter(m => m.message_id !== messageId);
    }

    searchMessages(query) {
        if (!query) return this.messages;
        
        const lowercaseQuery = query.toLowerCase();
        return this.messages.filter(message => 
            message.subject.toLowerCase().includes(lowercaseQuery) ||
            message.content.toLowerCase().includes(lowercaseQuery) ||
            message.to_name.toLowerCase().includes(lowercaseQuery) ||
            message.from_name.toLowerCase().includes(lowercaseQuery)
        );
    }

    filterMessagesByType(type) {
        if (!type || type === 'all') return this.messages;
        return this.messages.filter(message => message.message_type === type);
    }

    filterMessagesByStatus(status) {
        if (!status || status === 'all') return this.messages;
        return this.messages.filter(message => message.status === status);
    }

    getMessageStats() {
        return {
            total: this.messages.length,
            sent: this.messages.filter(m => m.status === 'sent').length,
            delivered: this.messages.filter(m => m.status === 'delivered').length,
            read: this.messages.filter(m => m.status === 'read').length,
            failed: this.messages.filter(m => m.status === 'failed').length
        };
    }
}
