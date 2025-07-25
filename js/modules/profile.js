// Profile Module - User Profile Management
// Green Computing: Efficient profile management with minimal resource usage

import { apiClient } from '../core/api-client.js';
import { UIComponents } from '../components/ui-components.js';
import { setInner } from '../core/utils.js';

class ProfileModule {
    constructor() {
        this.profile = null;
        this.isEditing = false;
    }

    async initialize() {
        try {
            // First try to load from cache for faster display
            this.loadFromCache();

            // Then load from backend to get latest data
            await this.loadProfile();

            this.renderProfileInterface();
            this.bindEventHandlers();
        } catch (error) {
            UIComponents.showNotification('Profile initialization failed: ' + error.message, 'error');
        }
    }

    loadFromCache() {
        const savedProfile = localStorage.getItem('agenticlearn_profile');
        if (savedProfile) {
            try {
                this.profile = JSON.parse(savedProfile);
            } catch (error) {
                // Silent fail for cache parsing errors
            }
        }
    }

    async loadProfile() {
        try {
            const response = await apiClient.getProfile();
            // Backend returns profile in different structure
            this.profile = response.profile || response.data || response;

        } catch (error) {
            // No fallback data per green computing principles
            throw new Error('Failed to load profile from backend: ' + error.message);
        }
    }

    renderProfileInterface() {
        // Get profile page (should already exist and be active from showPage)
        const profilePage = document.getElementById('page-profile');
        if (!profilePage) {
            return;
        }

        const container = profilePage;

        const profileHTML = `
            <div style="max-width: 1000px; margin: 0 auto; padding: 2rem;">
                <!-- Profile Header -->
                <div style="
                    background: var(--white);
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    padding: 2rem;
                    margin-bottom: 2rem;
                    position: relative;
                ">
                    <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem;">
                        <div style="
                            width: 120px;
                            height: 120px;
                            border-radius: 50%;
                            background: linear-gradient(135deg, var(--primary), var(--primary-light));
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 3rem;
                            color: white;
                            font-weight: bold;
                        ">
                            ${this.profile?.name ? this.profile.name.charAt(0) : '👤'}
                        </div>
                        <div style="flex: 1;">
                            <h1 style="margin: 0 0 0.5rem 0; color: var(--gray-800); font-size: 2rem;">
                                ${this.profile?.name || 'User Profile'}
                            </h1>
                            <p style="margin: 0 0 0.5rem 0; color: var(--gray-600); font-size: 1.1rem;">
                                ${this.profile?.role || 'Educator'} • ${this.profile?.department || 'Department'}
                            </p>
                            <p style="margin: 0; color: var(--gray-500);">
                                📧 ${this.profile?.email || 'email@example.com'}
                            </p>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-primary" onclick="profileModule.toggleEdit()">
                                ✏️ Edit Profile
                            </button>
                            <button class="btn btn-info" onclick="profileModule.showSettings()">
                                ⚙️ Settings
                            </button>
                        </div>
                    </div>

                    <!-- Profile Stats -->
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 1rem;
                        padding: 1.5rem;
                        background: var(--accent);
                        border-radius: 8px;
                    ">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">
                                ${this.profile?.stats?.students_taught || 0}
                            </div>
                            <div style="color: var(--gray-600); font-size: 0.875rem;">Students Taught</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: bold; color: var(--success);">
                                ${this.profile?.stats?.courses_created || 0}
                            </div>
                            <div style="color: var(--gray-600); font-size: 0.875rem;">Courses Created</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: bold; color: var(--info);">
                                ${this.profile?.stats?.assessments_created || 0}
                            </div>
                            <div style="color: var(--gray-600); font-size: 0.875rem;">Assessments Created</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: bold; color: var(--warning);">
                                ${this.profile?.stats?.years_experience || 0}
                            </div>
                            <div style="color: var(--gray-600); font-size: 0.875rem;">Years Experience</div>
                        </div>
                    </div>
                </div>

                <!-- Profile Details -->
                <div style="
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                ">
                    <!-- Main Info -->
                    <div style="
                        background: var(--white);
                        border-radius: 12px;
                        box-shadow: var(--shadow-sm);
                        padding: 2rem;
                    ">
                        <h3 style="margin: 0 0 1.5rem 0; color: var(--gray-800);">📋 Profile Information</h3>
                        
                        <div id="profile-form">
                            ${this.renderProfileForm()}
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div style="display: flex; flex-direction: column; gap: 2rem;">
                        <!-- Quick Actions -->
                        <div style="
                            background: var(--white);
                            border-radius: 12px;
                            box-shadow: var(--shadow-sm);
                            padding: 1.5rem;
                        ">
                            <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">⚡ Quick Actions</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <button class="btn btn-success" onclick="profileModule.changePassword()" style="width: 100%; justify-content: flex-start;">
                                    🔒 Change Password
                                </button>
                                <button class="btn btn-info" onclick="profileModule.exportData()" style="width: 100%; justify-content: flex-start;">
                                    📥 Export My Data
                                </button>
                                <button class="btn btn-warning" onclick="profileModule.showPrivacy()" style="width: 100%; justify-content: flex-start;">
                                    🛡️ Privacy Settings
                                </button>
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div style="
                            background: var(--white);
                            border-radius: 12px;
                            box-shadow: var(--shadow-sm);
                            padding: 1.5rem;
                        ">
                            <h4 style="margin: 0 0 1rem 0; color: var(--gray-800);">📈 Recent Activity</h4>
                            <div style="font-size: 0.875rem; color: var(--gray-600);">
                                <div style="margin-bottom: 0.5rem;">
                                    ✅ Last login: ${new Date(this.profile?.last_login || Date.now()).toLocaleDateString()}
                                </div>
                                <div style="margin-bottom: 0.5rem;">
                                    📅 Member since: ${new Date(this.profile?.joined_date || '2020-01-01').toLocaleDateString()}
                                </div>
                                <div>
                                    🌱 Green computing advocate
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal for Settings -->
            <div id="profile-modal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                <!-- Modal content will be inserted here -->
            </div>
        `;

        container.innerHTML = profileHTML;
    }

    renderProfileForm() {
        const isEditing = this.isEditing;
        
        if (isEditing) {
            return `
                <form id="edit-profile-form" onsubmit="profileModule.saveProfile(event)">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Full Name:</label>
                            <input type="text" id="profile-name" value="${this.profile?.name || ''}" 
                                   style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-300); border-radius: 6px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email:</label>
                            <input type="email" id="profile-email" value="${this.profile?.email || ''}" 
                                   style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-300); border-radius: 6px;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Role:</label>
                            <input type="text" id="profile-role" value="${this.profile?.role || ''}" 
                                   style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-300); border-radius: 6px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Department:</label>
                            <input type="text" id="profile-department" value="${this.profile?.department || ''}" 
                                   style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-300); border-radius: 6px;">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Phone:</label>
                        <input type="tel" id="profile-phone" value="${this.profile?.phone || ''}" 
                               style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-300); border-radius: 6px;">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Bio:</label>
                        <textarea id="profile-bio" rows="4" 
                                  style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-300); border-radius: 6px; resize: vertical;">${this.profile?.bio || ''}</textarea>
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn btn-success">
                            ✅ Save Changes
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="profileModule.cancelEdit()">
                            ❌ Cancel
                        </button>
                    </div>
                </form>
            `;
        } else {
            return `
                <div style="display: grid; gap: 1rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--gray-600);">Full Name:</label>
                            <div style="padding: 0.75rem; background: var(--accent); border-radius: 6px;">
                                ${this.profile?.name || 'Not specified'}
                            </div>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--gray-600);">Email:</label>
                            <div style="padding: 0.75rem; background: var(--accent); border-radius: 6px;">
                                ${this.profile?.email || 'Not specified'}
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--gray-600);">Role:</label>
                            <div style="padding: 0.75rem; background: var(--accent); border-radius: 6px;">
                                ${this.profile?.role || 'Not specified'}
                            </div>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--gray-600);">Department:</label>
                            <div style="padding: 0.75rem; background: var(--accent); border-radius: 6px;">
                                ${this.profile?.department || 'Not specified'}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--gray-600);">Phone:</label>
                        <div style="padding: 0.75rem; background: var(--accent); border-radius: 6px;">
                            ${this.profile?.phone || 'Not specified'}
                        </div>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--gray-600);">Bio:</label>
                        <div style="padding: 0.75rem; background: var(--accent); border-radius: 6px; line-height: 1.5;">
                            ${this.profile?.bio || 'No bio provided'}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        const formContainer = document.getElementById('profile-form');
        if (formContainer) {
            formContainer.innerHTML = this.renderProfileForm();
        }
        console.log(this.isEditing ? '✏️ Edit mode enabled' : '👁️ View mode enabled');
    }

    async saveProfile(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('profile-name').value,
            email: document.getElementById('profile-email').value,
            role: document.getElementById('profile-role').value,
            department: document.getElementById('profile-department').value,
            phone: document.getElementById('profile-phone').value,
            bio: document.getElementById('profile-bio').value
        };

        // Update local profile
        this.profile = { ...this.profile, ...formData };

        // Save to backend
        await apiClient.updateUserProfile(formData);

        // Refresh profile data from backend to ensure consistency
        const freshProfile = await apiClient.getProfile();
        const updatedProfile = freshProfile.profile || freshProfile.data || freshProfile;

        // Update local profile with fresh data
        this.profile = updatedProfile;

        // Update global state to refresh UI components
        if (window.educatorPortal && window.educatorPortal.state) {
            window.educatorPortal.state.educator = updatedProfile;

            // Re-render header with updated data
            if (window.renderHeader) {
                window.renderHeader();
            }

            // Show updated welcome message
            UIComponents.showNotification(
                `✅ Profile updated! Welcome ${updatedProfile.name}`,
                'success'
            );
        } else {
            UIComponents.showNotification('Profile updated successfully!', 'success');
        }

        this.isEditing = false;
        this.renderProfileInterface();
    }

    cancelEdit() {
        this.isEditing = false;
        const formContainer = document.getElementById('profile-form');
        if (formContainer) {
            formContainer.innerHTML = this.renderProfileForm();
        }
        console.log('❌ Edit cancelled');
    }

    showSettings() {
        const modalHTML = `
            <div class="modal-content" style="max-width: 500px; background: white; border-radius: 12px; padding: 2rem;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0;">⚙️ Profile Settings</h3>
                    <button onclick="profileModule.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" ${this.profile?.preferences?.notifications ? 'checked' : ''}>
                            🔔 Email Notifications
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" checked>
                            🌱 Green Theme
                        </label>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">🌍 Language:</label>
                            <select style="width: 100%; padding: 0.5rem; border: 1px solid var(--gray-300); border-radius: 6px;">
                                <option value="en">English</option>
                                <option value="id">Bahasa Indonesia</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">🕐 Timezone:</label>
                            <select style="width: 100%; padding: 0.5rem; border: 1px solid var(--gray-300); border-radius: 6px;">
                                <option value="UTC-5">UTC-5 (Eastern)</option>
                                <option value="UTC+7">UTC+7 (Jakarta)</option>
                                <option value="UTC+0">UTC+0 (GMT)</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end;">
                        <button class="btn btn-secondary" onclick="profileModule.hideModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="profileModule.saveSettings()">Save Settings</button>
                    </div>
                </div>
            </div>
        `;

        setInner('profile-modal', modalHTML);
        this.showModal();
    }

    saveSettings() {
        UIComponents.showNotification('Settings saved successfully!', 'success');
        this.hideModal();
    }

    changePassword() {
        UIComponents.showNotification('Password change feature coming soon!', 'info');
    }

    exportData() {
        const data = JSON.stringify(this.profile, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'my-profile-data.json');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        UIComponents.showNotification('Profile data exported successfully!', 'success');
    }

    showPrivacy() {
        UIComponents.showNotification('Privacy settings feature coming soon!', 'info');
    }

    showModal() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    bindEventHandlers() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal();
            }
        });
    }
}

// Create and export singleton instance
export const profileModule = new ProfileModule();

// Make it globally available for onclick handlers
window.profileModule = profileModule;

export default profileModule;
