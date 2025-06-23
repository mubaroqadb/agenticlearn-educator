// ===== ANNOUNCEMENT HANDLER MODULE =====

import { apiClient } from '../../core/api-client.js';
import { UIComponents } from '../../components/ui-components.js';
import { CommunicationValidator } from './communication-validator.js';
import { CommunicationRenderer } from './communication-renderer.js';

export class AnnouncementHandler {
    constructor() {
        this.announcements = [];
    }

    async loadAnnouncements() {
        try {
            console.log('🔄 Loading announcements from backend...');
            const response = await apiClient.getAnnouncementsList();
            
            if (response && response.success && response.data) {
                this.announcements = response.data;
                console.log(`✅ Loaded ${this.announcements.length} announcements`);
                return this.announcements;
            }
            return [];
        } catch (error) {
            console.error('❌ Failed to load announcements:', error);
            throw error;
        }
    }

    async createAnnouncement(formData) {
        try {
            console.log('🔄 Creating announcement...', formData);

            const response = await apiClient.createAnnouncement(formData);

            if (response && response.success) {
                UIComponents.showNotification('Announcement created successfully!', 'success');
                
                // Add the new announcement to local array for immediate UI update
                const newAnnouncement = {
                    announcement_id: response.announcement_id || `ann_${Date.now()}`,
                    ...formData,
                    created_at: new Date().toISOString(),
                    read_count: 0,
                    total_recipients: 25, // This would come from backend
                    read_percentage: 0
                };
                this.announcements.unshift(newAnnouncement);
                
                return { success: true, announcement: newAnnouncement };
            } else {
                throw new Error(response?.message || 'Failed to create announcement');
            }
        } catch (error) {
            console.error('❌ Failed to create announcement:', error);
            UIComponents.showNotification(`Failed to create announcement: ${error.message}`, 'error');
            throw error;
        }
    }

    async updateAnnouncement(announcementId, updateData) {
        try {
            console.log('🔄 Updating announcement...', announcementId, updateData);

            const response = await apiClient.updateAnnouncement({
                announcement_id: announcementId,
                ...updateData
            });

            if (response && response.success) {
                UIComponents.showNotification('Announcement updated successfully!', 'success');
                
                // Update local array
                const index = this.announcements.findIndex(a => a.announcement_id === announcementId);
                if (index !== -1) {
                    this.announcements[index] = { 
                        ...this.announcements[index], 
                        ...updateData,
                        updated_at: new Date().toISOString()
                    };
                }
                
                return { success: true };
            } else {
                throw new Error(response?.message || 'Failed to update announcement');
            }
        } catch (error) {
            console.error('❌ Failed to update announcement:', error);
            UIComponents.showNotification(`Failed to update announcement: ${error.message}`, 'error');
            throw error;
        }
    }

    async deleteAnnouncement(announcementId) {
        try {
            const announcement = this.announcements.find(a => a.announcement_id === announcementId);
            if (!announcement) {
                UIComponents.showNotification('Announcement not found', 'error');
                return;
            }

            const confirmed = confirm(`Are you sure you want to delete the announcement "${announcement.title}"?`);
            if (!confirmed) return;

            console.log('🔄 Deleting announcement...', announcementId);

            const response = await apiClient.deleteAnnouncement(announcementId);

            if (response && response.success) {
                UIComponents.showNotification('Announcement deleted successfully!', 'success');
                
                // Remove from local array
                this.announcements = this.announcements.filter(a => a.announcement_id !== announcementId);
                
                return { success: true };
            } else {
                throw new Error(response?.message || 'Failed to delete announcement');
            }
        } catch (error) {
            console.error('❌ Failed to delete announcement:', error);
            UIComponents.showNotification(`Failed to delete announcement: ${error.message}`, 'error');
            throw error;
        }
    }

    async handleCreateAnnouncement(event) {
        event.preventDefault();

        // Validate form data
        const validationResult = CommunicationValidator.validateAnnouncementForm();
        if (!validationResult.isValid) {
            UIComponents.showNotification(validationResult.message, 'warning');
            return;
        }

        const expiresAt = document.getElementById('announcement-expires').value;
        const formData = {
            title: document.getElementById('announcement-title').value.trim(),
            content: document.getElementById('announcement-content').value.trim(),
            priority: document.getElementById('announcement-priority').value,
            audience: document.getElementById('announcement-audience').value,
            expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
            created_by: 'educator_001',
            created_by_name: 'Dr. Sarah Johnson'
        };

        try {
            // Show loading state
            const submitButton = event.target.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '⏳ Creating...';
            submitButton.disabled = true;

            await this.createAnnouncement(formData);
            
            // Reset form on success
            document.getElementById('create-announcement-form').reset();
            
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            return { success: true };
        } catch (error) {
            // Restore button state on error
            const submitButton = event.target.querySelector('button[type="submit"]');
            submitButton.textContent = 'Create Announcement';
            submitButton.disabled = false;
            
            return { success: false, error: error.message };
        }
    }

    async editAnnouncement(announcementId) {
        try {
            const announcement = this.announcements.find(a => a.announcement_id === announcementId);
            if (!announcement) {
                UIComponents.showNotification('Announcement not found', 'error');
                return;
            }

            // Create edit modal
            const modalHTML = this.renderEditAnnouncementModal(announcement);
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Add event listener for form submission
            document.getElementById('edit-announcement-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleEditAnnouncement(e, announcementId);
            });
        } catch (error) {
            console.error('❌ Failed to open edit modal:', error);
            UIComponents.showNotification(`Failed to open edit form: ${error.message}`, 'error');
        }
    }

    async handleEditAnnouncement(event, announcementId) {
        const updateData = {
            title: document.getElementById('edit-announcement-title').value.trim(),
            content: document.getElementById('edit-announcement-content').value.trim(),
            priority: document.getElementById('edit-announcement-priority').value,
            audience: document.getElementById('edit-announcement-audience').value
        };

        const expiresAt = document.getElementById('edit-announcement-expires').value;
        if (expiresAt) {
            updateData.expires_at = new Date(expiresAt).toISOString();
        }

        try {
            await this.updateAnnouncement(announcementId, updateData);
            
            // Close modal
            document.querySelector('.modal-overlay')?.remove();
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    renderEditAnnouncementModal(announcement) {
        const expiresValue = announcement.expires_at 
            ? new Date(announcement.expires_at).toISOString().slice(0, 16)
            : '';

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
                        <h3 style="margin: 0;">✏️ Edit Announcement</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" style="
                            background: none;
                            border: none;
                            font-size: 1.5rem;
                            cursor: pointer;
                            color: #6b7280;
                        ">&times;</button>
                    </div>

                    <form id="edit-announcement-form">
                        <div class="form-group">
                            <label class="form-label">Title:</label>
                            <input type="text" class="form-input" id="edit-announcement-title" value="${announcement.title}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Content:</label>
                            <textarea class="form-textarea" id="edit-announcement-content" required style="height: 120px;">${announcement.content}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Priority:</label>
                            <select class="form-select" id="edit-announcement-priority">
                                <option value="low" ${announcement.priority === 'low' ? 'selected' : ''}>Low</option>
                                <option value="normal" ${announcement.priority === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="high" ${announcement.priority === 'high' ? 'selected' : ''}>High</option>
                                <option value="urgent" ${announcement.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Audience:</label>
                            <select class="form-select" id="edit-announcement-audience">
                                <option value="all" ${announcement.audience === 'all' ? 'selected' : ''}>All Students</option>
                                <option value="course_001" ${announcement.audience === 'course_001' ? 'selected' : ''}>Digital Literacy Course</option>
                                <option value="course_002" ${announcement.audience === 'course_002' ? 'selected' : ''}>Programming Basics Course</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Expires At:</label>
                            <input type="datetime-local" class="form-input" id="edit-announcement-expires" value="${expiresValue}">
                        </div>

                        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                                Cancel
                            </button>
                            <button type="submit" class="btn-primary">
                                💾 Update Announcement
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderAnnouncementsList() {
        return CommunicationRenderer.renderAnnouncementsList(this.announcements);
    }

    updateAnnouncementsList() {
        const announcementsContainer = document.querySelector('#announcements-view .announcements-list');
        if (announcementsContainer) {
            announcementsContainer.innerHTML = this.renderAnnouncementsList();
        }
    }

    getAnnouncements() {
        return this.announcements;
    }

    getAnnouncementById(announcementId) {
        return this.announcements.find(a => a.announcement_id === announcementId);
    }

    searchAnnouncements(query) {
        if (!query) return this.announcements;
        
        const lowercaseQuery = query.toLowerCase();
        return this.announcements.filter(announcement => 
            announcement.title.toLowerCase().includes(lowercaseQuery) ||
            announcement.content.toLowerCase().includes(lowercaseQuery)
        );
    }

    filterAnnouncementsByPriority(priority) {
        if (!priority || priority === 'all') return this.announcements;
        return this.announcements.filter(announcement => announcement.priority === priority);
    }

    filterAnnouncementsByAudience(audience) {
        if (!audience || audience === 'all') return this.announcements;
        return this.announcements.filter(announcement => announcement.audience === audience);
    }

    getAnnouncementStats() {
        return {
            total: this.announcements.length,
            low: this.announcements.filter(a => a.priority === 'low').length,
            normal: this.announcements.filter(a => a.priority === 'normal').length,
            high: this.announcements.filter(a => a.priority === 'high').length,
            urgent: this.announcements.filter(a => a.priority === 'urgent').length
        };
    }
}
