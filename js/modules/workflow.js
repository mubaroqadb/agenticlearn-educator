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

    // Action methods (to be implemented)
    async createWorkflow() {
        console.log('➕ Creating new workflow...');
        UIComponents.showNotification('Create workflow feature - Coming soon!', 'info');
    }

    async executeWorkflow(workflowId = null) {
        console.log('▶️ Executing workflow:', workflowId);
        UIComponents.showNotification('Execute workflow feature - Coming soon!', 'info');
    }

    async editWorkflow(workflowId) {
        console.log('✏️ Editing workflow:', workflowId);
        UIComponents.showNotification('Edit workflow feature - Coming soon!', 'info');
    }

    async viewWorkflow(workflowId) {
        console.log('👁️ Viewing workflow:', workflowId);
        UIComponents.showNotification('View workflow feature - Coming soon!', 'info');
    }

    async loadExecutions() {
        console.log('📊 Loading execution history...');
        UIComponents.showNotification('Execution history feature - Coming soon!', 'info');
    }

    async configureAutomation() {
        console.log('⚙️ Configuring automation...');
        UIComponents.showNotification('Automation configuration feature - Coming soon!', 'info');
    }

    bindEventHandlers() {
        // Add any additional event handlers here
    }
}

// Create and export singleton instance
export const workflowModule = new WorkflowModule();
export default workflowModule;
