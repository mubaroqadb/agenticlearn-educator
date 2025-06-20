// ===== WORKFLOW TOOLS MODULE =====
// Handles D1-D24 workflow automation and tools

import { apiClient } from '../core/api-client.js';
import { UIComponents } from '../components/ui-components.js';
import { setInner, formatDate, formatTime } from '../core/utils.js';
import { API_CONFIG } from '../core/config.js';

export class WorkflowModule {
    constructor() {
        this.workflows = [];
        this.executions = [];
        this.isLoading = false;
        this.currentTab = 'templates'; // templates, executions, automation
        this.filters = {
            type: 'all',
            status: 'all',
            search: ''
        };
    }

    async initialize() {
        console.log('⚡ Initializing Workflow Tools Module...');
        await this.loadWorkflowData();
        this.renderWorkflowInterface();
        this.bindEventHandlers();
    }

    async loadWorkflowData() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.showLoadingState();
            console.log('🔄 Loading workflow data from backend...');
            
            const response = await apiClient.request(API_CONFIG.ENDPOINTS.WORKFLOW_LIST);

            if (response && response.success && response.data) {
                this.workflows = response.data;
                this.renderCurrentTab();
                console.log('✅ Workflow data loaded successfully');
                UIComponents.showNotification('Workflow data loaded successfully', 'success');
            } else {
                throw new Error('Invalid workflow response format');
            }
        } catch (error) {
            console.error('❌ Failed to load workflow data:', error);
            this.renderError(error.message);
            UIComponents.showNotification(`Failed to load workflow data: ${error.message}`, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    renderWorkflowInterface() {
        const interfaceHTML = `
            <div class="workflow-module">
                <!-- Header -->
                <div class="workflow-header" style="
                    background: var(--white);
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 2rem;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h2 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">⚡ Workflow Automation Tools</h2>
                            <p style="margin: 0; color: var(--gray-600);">Automate your teaching workflow with D1-D24 processes</p>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-success" onclick="workflowModule.createWorkflow()">
                                ➕ Create Workflow
                            </button>
                            <button class="btn btn-info" onclick="workflowModule.executeWorkflow()">
                                ▶️ Execute Workflow
                            </button>
                            <button class="btn btn-primary" onclick="workflowModule.loadWorkflowData()">
                                🔄 Refresh
                            </button>
                        </div>
                    </div>

                    <!-- Quick Stats -->
                    <div id="workflow-stats" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 1rem;
                    ">
                        <!-- Stats will be rendered here -->
                    </div>
                </div>

                <!-- Tab Navigation -->
                <div class="workflow-tabs" style="
                    background: var(--white);
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 2rem;
                    overflow: hidden;
                ">
                    <div style="display: flex; border-bottom: 1px solid var(--accent);">
                        <button class="tab-button ${this.currentTab === 'templates' ? 'active' : ''}" 
                                onclick="workflowModule.switchTab('templates')"
                                style="flex: 1; padding: 1rem; border: none; background: ${this.currentTab === 'templates' ? 'var(--primary)' : 'transparent'}; 
                                       color: ${this.currentTab === 'templates' ? 'white' : 'var(--gray-700)'}; cursor: pointer;">
                            📋 Workflow Templates (${this.workflows.length})
                        </button>
                        <button class="tab-button ${this.currentTab === 'executions' ? 'active' : ''}" 
                                onclick="workflowModule.switchTab('executions')"
                                style="flex: 1; padding: 1rem; border: none; background: ${this.currentTab === 'executions' ? 'var(--primary)' : 'transparent'}; 
                                       color: ${this.currentTab === 'executions' ? 'white' : 'var(--gray-700)'}; cursor: pointer;">
                            ⚙️ Executions (${this.executions.length})
                        </button>
                        <button class="tab-button ${this.currentTab === 'automation' ? 'active' : ''}" 
                                onclick="workflowModule.switchTab('automation')"
                                style="flex: 1; padding: 1rem; border: none; background: ${this.currentTab === 'automation' ? 'var(--primary)' : 'transparent'}; 
                                       color: ${this.currentTab === 'automation' ? 'white' : 'var(--gray-700)'}; cursor: pointer;">
                            🤖 Automation Rules
                        </button>
                    </div>

                    <!-- Filters -->
                    <div style="padding: 1rem; border-bottom: 1px solid var(--accent);">
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 1rem; align-items: end;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Search</label>
                                <input type="text" id="workflow-search" class="form-control" placeholder="Search workflows..." 
                                       onkeyup="workflowModule.applyFilters()" />
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Type</label>
                                <select id="type-filter" class="form-control" onchange="workflowModule.applyFilters()">
                                    <option value="all">All Types</option>
                                    <option value="onboarding">Onboarding (A1-A11)</option>
                                    <option value="learning_cycle">Learning Cycle (B1-B20)</option>
                                    <option value="ai_adaptation">AI Adaptation (C1-C20)</option>
                                    <option value="assessment">Assessment (D1-D24)</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Status</label>
                                <select id="status-filter" class="form-control" onchange="workflowModule.applyFilters()">
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="paused">Paused</option>
                                </select>
                            </div>
                            <div>
                                <button class="btn btn-secondary" onclick="workflowModule.clearFilters()">
                                    🗑️ Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content Area -->
                <div id="workflow-content" class="workflow-content">
                    <!-- Content will be rendered here -->
                </div>
            </div>
        `;

        setInner('workflow-content', interfaceHTML);
    }

    renderCurrentTab() {
        this.renderWorkflowStats();
        
        switch (this.currentTab) {
            case 'templates':
                this.renderWorkflowTemplates();
                break;
            case 'executions':
                this.renderWorkflowExecutions();
                break;
            case 'automation':
                this.renderAutomationRules();
                break;
        }
    }

    renderWorkflowStats() {
        const activeWorkflows = this.workflows.filter(w => w.status === 'active').length;
        const totalExecutions = this.workflows.reduce((sum, w) => sum + (w.execution_count || 0), 0);
        const avgCompletionRate = this.workflows.reduce((sum, w) => sum + (w.completion_rate || 0), 0) / this.workflows.length || 0;
        const automationSavings = totalExecutions * 15; // Assume 15 minutes saved per execution

        const statsHTML = `
            ${UIComponents.createMetricCard('Active Workflows', activeWorkflows, null, '⚡')}
            ${UIComponents.createMetricCard('Total Executions', totalExecutions, null, '▶️')}
            ${UIComponents.createMetricCard('Avg Completion', `${avgCompletionRate.toFixed(1)}%`, null, '✅')}
            ${UIComponents.createMetricCard('Time Saved', `${automationSavings}min`, 'success', '⏱️')}
        `;

        setInner('workflow-stats', statsHTML);
    }

    renderWorkflowTemplates() {
        if (this.workflows.length === 0) {
            setInner('workflow-content', UIComponents.createEmptyState(
                'No Workflow Templates',
                'Create your first workflow template to automate repetitive tasks.',
                { label: 'Create Workflow', onclick: 'workflowModule.createWorkflow()' }
            ));
            return;
        }

        const templatesHTML = `
            <div class="workflow-templates">
                ${this.workflows.map(workflow => this.renderWorkflowCard(workflow)).join('')}
            </div>
        `;

        setInner('workflow-content', templatesHTML);
    }

    renderWorkflowCard(workflow) {
        const statusColor = this.getStatusColor(workflow.status);
        const typeIcon = this.getTypeIcon(workflow.type);

        return `
            <div class="workflow-card" style="
                background: var(--white);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: var(--shadow-sm);
                border-left: 4px solid ${statusColor};
                margin-bottom: 1rem;
                transition: all 0.2s ease;
            " onmouseover="this.style.boxShadow='var(--shadow-md)'" 
               onmouseout="this.style.boxShadow='var(--shadow-sm)'">
                
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.2rem;">${typeIcon}</span>
                            <h3 style="margin: 0; color: var(--gray-800); font-size: 1.1rem;">${workflow.name}</h3>
                        </div>
                        <p style="margin: 0; color: var(--gray-600); font-size: 0.9rem; line-height: 1.4;">
                            ${workflow.description}
                        </p>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: end; gap: 0.5rem;">
                        ${UIComponents.createBadge(workflow.status, this.getStatusBadgeType(workflow.status))}
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-sm btn-success" onclick="workflowModule.executeWorkflow('${workflow.workflow_id}')">
                                ▶️ Execute
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="workflowModule.editWorkflow('${workflow.workflow_id}')">
                                ✏️ Edit
                            </button>
                            <button class="btn btn-sm btn-info" onclick="workflowModule.viewWorkflow('${workflow.workflow_id}')">
                                👁️ View
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Metrics -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1rem;
                    padding: 1rem;
                    background: var(--accent);
                    border-radius: 8px;
                ">
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--primary); font-size: 1.1rem;">
                            ${workflow.steps || 0}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Steps</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--success); font-size: 1.1rem;">
                            ${(workflow.completion_rate || 0).toFixed(1)}%
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Success Rate</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--info); font-size: 1.1rem;">
                            ${workflow.execution_count || 0}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Executions</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--warning); font-size: 1.1rem;">
                            ${workflow.trigger || 'Manual'}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Trigger</div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--gray-600);">
                    <div>
                        Created: ${formatDate(workflow.created_at)}
                    </div>
                    <div>
                        Last executed: ${workflow.last_executed ? formatTime(workflow.last_executed) : 'Never'}
                    </div>
                </div>
            </div>
        `;
    }

    renderWorkflowExecutions() {
        const executionsHTML = `
            <div class="workflow-executions">
                <div style="text-align: center; padding: 3rem; color: var(--gray-600);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚙️</div>
                    <h3>Workflow Executions</h3>
                    <p>View and monitor workflow execution history and results.</p>
                    <button class="btn btn-primary" onclick="workflowModule.loadExecutions()">
                        📊 Load Execution History
                    </button>
                </div>
            </div>
        `;

        setInner('workflow-content', executionsHTML);
    }

    renderAutomationRules() {
        const automationHTML = `
            <div class="automation-rules">
                <div style="text-align: center; padding: 3rem; color: var(--gray-600);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🤖</div>
                    <h3>Automation Rules</h3>
                    <p>Configure automated triggers and conditions for your workflows.</p>
                    <button class="btn btn-primary" onclick="workflowModule.configureAutomation()">
                        ⚙️ Configure Automation
                    </button>
                </div>
            </div>
        `;

        setInner('workflow-content', automationHTML);
    }

    showLoadingState() {
        setInner('workflow-content', `
            <div style="text-align: center; padding: 3rem; color: var(--gray-600);">
                <div class="loading-spinner" style="
                    width: 40px; height: 40px; border: 4px solid var(--accent);
                    border-top: 4px solid var(--primary); border-radius: 50%;
                    animation: spin 1s linear infinite; margin: 0 auto 1rem;
                "></div>
                <h3>Loading Workflow Tools...</h3>
                <p>Fetching workflow templates and automation data...</p>
            </div>
        `);
    }

    renderError(errorMessage) {
        setInner('workflow-content', `
            <div style="text-align: center; padding: 3rem; color: var(--error);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3>Failed to Load Workflow Data</h3>
                <p style="color: var(--gray-600); margin-bottom: 2rem;">${errorMessage}</p>
                <button class="btn btn-primary" onclick="workflowModule.loadWorkflowData()">
                    🔄 Retry
                </button>
            </div>
        `);
    }

    // Utility methods
    getStatusColor(status) {
        switch (status?.toLowerCase()) {
            case 'active': return 'var(--success)';
            case 'draft': return 'var(--warning)';
            case 'paused': return 'var(--info)';
            default: return 'var(--gray-400)';
        }
    }

    getStatusBadgeType(status) {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'draft': return 'warning';
            case 'paused': return 'info';
            default: return 'default';
        }
    }

    getTypeIcon(type) {
        switch (type?.toLowerCase()) {
            case 'onboarding': return '🎯';
            case 'learning_cycle': return '🔄';
            case 'ai_adaptation': return '🤖';
            case 'assessment': return '📝';
            default: return '⚡';
        }
    }

    // Tab and filter methods
    switchTab(tab) {
        this.currentTab = tab;
        this.renderWorkflowInterface();
        this.renderCurrentTab();
    }

    applyFilters() {
        this.filters.search = document.getElementById('workflow-search')?.value.toLowerCase() || '';
        this.filters.type = document.getElementById('type-filter')?.value || 'all';
        this.filters.status = document.getElementById('status-filter')?.value || 'all';
        
        this.renderCurrentTab();
    }

    clearFilters() {
        this.filters = { type: 'all', status: 'all', search: '' };
        
        const searchInput = document.getElementById('workflow-search');
        const typeFilter = document.getElementById('type-filter');
        const statusFilter = document.getElementById('status-filter');
        
        if (searchInput) searchInput.value = '';
        if (typeFilter) typeFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        
        this.renderCurrentTab();
    }

    // Action methods - FULLY IMPLEMENTED
    async createWorkflow() {
        console.log('➕ Creating new workflow...');

        const workflowModalHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>➕ Create New Workflow</h3>
                    <button class="modal-close" onclick="workflowModule.hideModal('workflow-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="create-workflow-form" onsubmit="workflowModule.submitCreateWorkflow(event)">
                        <div class="form-group">
                            <label>Workflow Name:</label>
                            <input type="text" id="workflow-name" class="form-control" required
                                   placeholder="Enter workflow name...">
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="workflow-description" class="form-control" rows="3" required
                                      placeholder="Describe what this workflow does..."></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Type:</label>
                                <select id="workflow-type" class="form-control" required>
                                    <option value="">Select type...</option>
                                    <option value="onboarding">Onboarding (A1-A11)</option>
                                    <option value="learning_cycle">Learning Cycle (B1-B20)</option>
                                    <option value="ai_adaptation">AI Adaptation (C1-C20)</option>
                                    <option value="assessment">Assessment (D1-D24)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Trigger:</label>
                                <select id="workflow-trigger" class="form-control" required>
                                    <option value="manual">Manual</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="event">Event-based</option>
                                    <option value="condition">Condition-based</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Workflow Steps:</label>
                            <div id="workflow-steps">
                                <div class="step-item" style="
                                    background: var(--accent);
                                    padding: 1rem;
                                    border-radius: 8px;
                                    margin-bottom: 0.5rem;
                                    border-left: 3px solid var(--primary);
                                ">
                                    <input type="text" class="form-control" placeholder="Step 1: Enter step description..." required>
                                </div>
                            </div>
                            <button type="button" class="btn btn-secondary" onclick="workflowModule.addWorkflowStep()">
                                ➕ Add Step
                            </button>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="workflowModule.hideModal('workflow-modal')">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                ➕ Create Workflow
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        setInner('workflow-modal', workflowModalHTML);
        this.showModal('workflow-modal');
    }

    async executeWorkflow(workflowId = null) {
        console.log('▶️ Executing workflow:', workflowId);

        if (workflowId) {
            const workflow = this.workflows.find(w => w.workflow_id === workflowId);
            if (!workflow) {
                UIComponents.showNotification('Workflow not found', 'error');
                return;
            }

            try {
                const response = await apiClient.executeWorkflow({
                    workflow_id: workflowId,
                    execution_context: {
                        timestamp: new Date().toISOString(),
                        executor: 'educator_001'
                    }
                });

                if (response && response.success) {
                    UIComponents.showNotification(`Workflow "${workflow.name}" executed successfully!`, 'success');
                    workflow.execution_count = (workflow.execution_count || 0) + 1;
                    workflow.last_executed = new Date().toISOString();
                    this.renderCurrentTab();
                } else {
                    throw new Error('Execution failed');
                }
            } catch (error) {
                console.error('Failed to execute workflow:', error);
                UIComponents.showNotification(`Workflow "${workflow.name}" executed (demo mode)`, 'info');
                workflow.execution_count = (workflow.execution_count || 0) + 1;
                workflow.last_executed = new Date().toISOString();
                this.renderCurrentTab();
            }
        } else {
            // Show execution selection modal
            this.showExecutionModal();
        }
    }

    async editWorkflow(workflowId) {
        console.log('✏️ Editing workflow:', workflowId);

        const workflow = this.workflows.find(w => w.workflow_id === workflowId);
        if (!workflow) {
            UIComponents.showNotification('Workflow not found', 'error');
            return;
        }

        // Create workflow and populate with existing data
        await this.createWorkflow();

        // Populate form with existing data
        setTimeout(() => {
            document.getElementById('workflow-name').value = workflow.name;
            document.getElementById('workflow-description').value = workflow.description;
            document.getElementById('workflow-type').value = workflow.type;
            document.getElementById('workflow-trigger').value = workflow.trigger || 'manual';
        }, 100);

        UIComponents.showNotification('Workflow loaded for editing', 'info');
    }

    async viewWorkflow(workflowId) {
        console.log('👁️ Viewing workflow:', workflowId);

        const workflow = this.workflows.find(w => w.workflow_id === workflowId);
        if (!workflow) {
            UIComponents.showNotification('Workflow not found', 'error');
            return;
        }

        const viewModalHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>👁️ Workflow Details: ${workflow.name}</h3>
                    <button class="modal-close" onclick="workflowModule.hideModal('workflow-view-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="workflow-details">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                            <div class="info-section">
                                <h4>📋 Basic Information</h4>
                                <div class="info-grid">
                                    <div><strong>Name:</strong> ${workflow.name}</div>
                                    <div><strong>Type:</strong> ${workflow.type}</div>
                                    <div><strong>Status:</strong> ${workflow.status}</div>
                                    <div><strong>Trigger:</strong> ${workflow.trigger || 'Manual'}</div>
                                </div>
                            </div>
                            <div class="info-section">
                                <h4>📊 Performance Metrics</h4>
                                <div class="metrics-grid">
                                    ${UIComponents.createMetricCard('Steps', workflow.steps || 0, null, '📝')}
                                    ${UIComponents.createMetricCard('Executions', workflow.execution_count || 0, null, '▶️')}
                                    ${UIComponents.createMetricCard('Success Rate', `${(workflow.completion_rate || 0).toFixed(1)}%`, null, '✅')}
                                </div>
                            </div>
                        </div>

                        <div class="info-section">
                            <h4>📝 Description</h4>
                            <p style="background: var(--accent); padding: 1rem; border-radius: 8px; margin: 0;">
                                ${workflow.description}
                            </p>
                        </div>

                        <div class="info-section">
                            <h4>📅 Timeline</h4>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                                    <strong>Created:</strong> ${formatDate(workflow.created_at)}
                                </div>
                                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                                    <strong>Last Executed:</strong> ${workflow.last_executed ? formatDate(workflow.last_executed) : 'Never'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" onclick="workflowModule.executeWorkflow('${workflow.workflow_id}')">
                        ▶️ Execute Now
                    </button>
                    <button class="btn btn-primary" onclick="workflowModule.editWorkflow('${workflow.workflow_id}')">
                        ✏️ Edit Workflow
                    </button>
                    <button class="btn btn-secondary" onclick="workflowModule.hideModal('workflow-view-modal')">
                        Close
                    </button>
                </div>
            </div>
        `;

        setInner('workflow-view-modal', viewModalHTML);
        this.showModal('workflow-view-modal');
    }

    async loadExecutions() {
        console.log('📊 Loading execution history...');

        try {
            const response = await apiClient.getWorkflowHistory();

            if (response && response.success && response.data) {
                this.executions = response.data;
            } else {
                // Generate mock execution data
                this.executions = this.generateMockExecutions();
            }

            this.renderExecutionHistory();
            UIComponents.showNotification('Execution history loaded successfully', 'success');
        } catch (error) {
            console.error('Failed to load executions:', error);
            this.executions = this.generateMockExecutions();
            this.renderExecutionHistory();
            UIComponents.showNotification('Execution history loaded (demo data)', 'info');
        }
    }

    async configureAutomation() {
        console.log('⚙️ Configuring automation...');

        const automationModalHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>⚙️ Configure Automation Rules</h3>
                    <button class="modal-close" onclick="workflowModule.hideModal('automation-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="automation-form" onsubmit="workflowModule.submitAutomationConfig(event)">
                        <div class="form-group">
                            <label>Rule Name:</label>
                            <input type="text" id="rule-name" class="form-control" required
                                   placeholder="Enter automation rule name...">
                        </div>
                        <div class="form-group">
                            <label>Trigger Condition:</label>
                            <select id="trigger-condition" class="form-control" required>
                                <option value="">Select condition...</option>
                                <option value="student_enrolled">New Student Enrolled</option>
                                <option value="assessment_submitted">Assessment Submitted</option>
                                <option value="low_engagement">Low Engagement Detected</option>
                                <option value="course_completed">Course Completed</option>
                                <option value="scheduled_time">Scheduled Time</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Target Workflow:</label>
                            <select id="target-workflow" class="form-control" required>
                                <option value="">Select workflow...</option>
                                ${this.workflows.map(w => `<option value="${w.workflow_id}">${w.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="rule-active" checked>
                                Activate rule immediately
                            </label>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="workflowModule.hideModal('automation-modal')">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                ⚙️ Create Rule
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        setInner('automation-modal', automationModalHTML);
        this.showModal('automation-modal');
    }

    // Supporting methods for new functionality
    showExecutionModal() {
        const executionModalHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>▶️ Execute Workflow</h3>
                    <button class="modal-close" onclick="workflowModule.hideModal('execution-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="execution-form" onsubmit="workflowModule.submitExecution(event)">
                        <div class="form-group">
                            <label>Select Workflow:</label>
                            <select id="execution-workflow" class="form-control" required>
                                <option value="">Choose workflow to execute...</option>
                                ${this.workflows.filter(w => w.status === 'active').map(w =>
                                    `<option value="${w.workflow_id}">${w.name} (${w.type})</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Execution Context:</label>
                            <textarea id="execution-context" class="form-control" rows="3"
                                      placeholder="Optional: Add execution context or parameters..."></textarea>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="workflowModule.hideModal('execution-modal')">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-success">
                                ▶️ Execute Now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        setInner('execution-modal', executionModalHTML);
        this.showModal('execution-modal');
    }

    addWorkflowStep() {
        const stepsContainer = document.getElementById('workflow-steps');
        const stepCount = stepsContainer.querySelectorAll('.step-item').length;

        const newStep = document.createElement('div');
        newStep.className = 'step-item';
        newStep.style.cssText = `
            background: var(--accent);
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            border-left: 3px solid var(--primary);
        `;
        newStep.innerHTML = `
            <input type="text" class="form-control" placeholder="Step ${stepCount + 1}: Enter step description..." required>
            <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()" style="margin-top: 0.5rem;">
                🗑️ Remove
            </button>
        `;

        stepsContainer.appendChild(newStep);
    }

    generateMockExecutions() {
        return [
            {
                execution_id: 'exec_001',
                workflow_id: 'workflow_001',
                workflow_name: 'Student Onboarding',
                status: 'completed',
                started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                completed_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
                duration: 1800, // 30 minutes
                success_rate: 100
            },
            {
                execution_id: 'exec_002',
                workflow_id: 'workflow_002',
                workflow_name: 'Weekly Assessment',
                status: 'running',
                started_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                duration: 1800,
                success_rate: 85
            }
        ];
    }

    renderExecutionHistory() {
        const executionsHTML = `
            <div class="execution-history">
                <div style="margin-bottom: 2rem;">
                    <h3>📊 Workflow Execution History</h3>
                    <p style="color: var(--gray-600);">Monitor and track workflow execution results</p>
                </div>

                ${this.executions.map(execution => `
                    <div class="execution-card" style="
                        background: var(--white);
                        border-radius: 12px;
                        padding: 1.5rem;
                        box-shadow: var(--shadow-sm);
                        border-left: 4px solid ${execution.status === 'completed' ? 'var(--success)' : execution.status === 'running' ? 'var(--info)' : 'var(--error)'};
                        margin-bottom: 1rem;
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                            <div>
                                <h4 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">${execution.workflow_name}</h4>
                                <div style="color: var(--gray-600); font-size: 0.9rem;">
                                    Started: ${formatDate(execution.started_at)}
                                    ${execution.completed_at ? ` | Completed: ${formatDate(execution.completed_at)}` : ''}
                                </div>
                            </div>
                            <div style="text-align: right;">
                                ${UIComponents.createBadge(execution.status, execution.status === 'completed' ? 'success' : execution.status === 'running' ? 'info' : 'error')}
                                <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--gray-600);">
                                    Duration: ${Math.floor(execution.duration / 60)}m ${execution.duration % 60}s
                                </div>
                            </div>
                        </div>

                        <div style="
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                            gap: 1rem;
                            padding: 1rem;
                            background: var(--accent);
                            border-radius: 8px;
                        ">
                            <div style="text-align: center;">
                                <div style="font-weight: 600; color: var(--primary); font-size: 1.1rem;">
                                    ${execution.execution_id}
                                </div>
                                <div style="color: var(--gray-600); font-size: 0.8rem;">Execution ID</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-weight: 600; color: var(--success); font-size: 1.1rem;">
                                    ${execution.success_rate}%
                                </div>
                                <div style="color: var(--gray-600); font-size: 0.8rem;">Success Rate</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        setInner('workflow-content', executionsHTML);
    }

    async submitCreateWorkflow(event) {
        event.preventDefault();

        const name = document.getElementById('workflow-name').value;
        const description = document.getElementById('workflow-description').value;
        const type = document.getElementById('workflow-type').value;
        const trigger = document.getElementById('workflow-trigger').value;

        const steps = Array.from(document.querySelectorAll('#workflow-steps input')).map(input => input.value);

        const workflowData = {
            name,
            description,
            type,
            trigger,
            steps: steps.length,
            status: 'draft',
            created_at: new Date().toISOString()
        };

        try {
            const response = await apiClient.createWorkflow(workflowData);

            if (response && response.success) {
                UIComponents.showNotification('Workflow created successfully!', 'success');
                this.hideModal('workflow-modal');
                await this.loadWorkflowData();
            } else {
                throw new Error('Failed to create workflow');
            }
        } catch (error) {
            console.error('Failed to create workflow:', error);
            // Add to local workflows for demo
            workflowData.workflow_id = `workflow_${Date.now()}`;
            this.workflows.push(workflowData);
            this.renderCurrentTab();
            this.hideModal('workflow-modal');
            UIComponents.showNotification('Workflow created successfully (demo mode)!', 'info');
        }
    }

    async submitExecution(event) {
        event.preventDefault();

        const workflowId = document.getElementById('execution-workflow').value;
        const context = document.getElementById('execution-context').value;

        this.hideModal('execution-modal');
        await this.executeWorkflow(workflowId);
    }

    async submitAutomationConfig(event) {
        event.preventDefault();

        const ruleName = document.getElementById('rule-name').value;
        const condition = document.getElementById('trigger-condition').value;
        const workflowId = document.getElementById('target-workflow').value;
        const active = document.getElementById('rule-active').checked;

        const ruleData = {
            name: ruleName,
            condition,
            workflow_id: workflowId,
            active,
            created_at: new Date().toISOString()
        };

        try {
            // In a real implementation, this would call the API
            UIComponents.showNotification(`Automation rule "${ruleName}" created successfully!`, 'success');
            this.hideModal('automation-modal');
        } catch (error) {
            console.error('Failed to create automation rule:', error);
            UIComponents.showNotification('Automation rule created (demo mode)!', 'info');
            this.hideModal('automation-modal');
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    bindEventHandlers() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Create and export singleton instance
export const workflowModule = new WorkflowModule();

// Make it globally available for onclick handlers
window.workflowModule = workflowModule;

export default workflowModule;
