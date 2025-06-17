// ===== AI SYSTEM MODULE =====

import { apiClient } from '../core/api-client.js';
import { API_CONFIG } from '../core/config.js';
import { UIComponents } from '../components/ui-components.js';
import { formatDate, formatNumber, formatPercentage, setInner, showError, showSuccess } from '../core/utils.js';

export class AISystemManager {
    constructor() {
        this.aiInsights = null;
        this.aiRecommendations = null;
        this.learningPatterns = null;
        this.isLoading = false;
        this.currentView = 'insights'; // insights, recommendations, patterns
    }

    async initialize() {
        console.log('🔄 Initializing AI System...');
        try {
            await this.loadAllAIData();
            this.renderAIInterface();
            this.setupEventListeners();
            this.startAutoRefresh();
            console.log('✅ AI System initialized successfully');
        } catch (error) {
            console.error('❌ AI System initialization failed:', error);
            this.renderError(error.message);
        }
    }

    async loadAllAIData() {
        await Promise.all([
            this.loadAIInsights(),
            this.loadAIRecommendations(),
            this.loadLearningPatterns()
        ]);
    }

    async loadAIInsights() {
        try {
            console.log('🔄 Loading AI insights from backend...');
            const response = await apiClient.getAIInsights();
            
            if (response && response.success && response.data) {
                this.aiInsights = response.data;
                console.log('✅ AI insights loaded successfully');
            }
        } catch (error) {
            console.error('❌ Failed to load AI insights:', error);
            throw error;
        }
    }

    async loadAIRecommendations() {
        try {
            console.log('🔄 Loading AI recommendations from backend...');
            const response = await apiClient.getAIRecommendations();
            
            if (response && response.success && response.data) {
                this.aiRecommendations = response.data;
                console.log('✅ AI recommendations loaded successfully');
            }
        } catch (error) {
            console.error('❌ Failed to load AI recommendations:', error);
            throw error;
        }
    }

    async loadLearningPatterns() {
        try {
            console.log('🔄 Loading learning patterns from backend...');
            const response = await apiClient.getLearningPatterns();
            
            if (response && response.success && response.data) {
                this.learningPatterns = response.data;
                console.log('✅ Learning patterns loaded successfully');
            }
        } catch (error) {
            console.error('❌ Failed to load learning patterns:', error);
            throw error;
        }
    }

    renderAIInterface() {
        const aiHTML = `
            <div class="ai-container">
                <div class="ai-header">
                    <h2>🤖 AI Recommendations & Insights</h2>
                    <div class="ai-tabs">
                        <button class="tab-btn ${this.currentView === 'insights' ? 'active' : ''}" 
                                onclick="aiSystemManager.switchView('insights')">
                            🧠 AI Insights
                        </button>
                        <button class="tab-btn ${this.currentView === 'recommendations' ? 'active' : ''}" 
                                onclick="aiSystemManager.switchView('recommendations')">
                            💡 Recommendations
                        </button>
                        <button class="tab-btn ${this.currentView === 'patterns' ? 'active' : ''}" 
                                onclick="aiSystemManager.switchView('patterns')">
                            📊 Learning Patterns
                        </button>
                    </div>
                </div>
                
                <div class="ai-content">
                    <div id="insights-view" class="view-content ${this.currentView === 'insights' ? 'active' : 'hidden'}">
                        ${this.renderInsightsView()}
                    </div>
                    
                    <div id="recommendations-view" class="view-content ${this.currentView === 'recommendations' ? 'active' : 'hidden'}">
                        ${this.renderRecommendationsView()}
                    </div>
                    
                    <div id="patterns-view" class="view-content ${this.currentView === 'patterns' ? 'active' : 'hidden'}">
                        ${this.renderPatternsView()}
                    </div>
                </div>
            </div>
            
            <style>
                .ai-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem;
                }
                
                .ai-header {
                    margin-bottom: 2rem;
                }
                
                .ai-tabs {
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
                
                .ai-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    transition: all 0.2s;
                }
                
                .ai-card:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
                }
                
                .card-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .insights-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .metric-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                
                .metric-item {
                    text-align: center;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 0.375rem;
                }
                
                .metric-value {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #3b82f6;
                }
                
                .metric-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-top: 0.25rem;
                }
                
                .prediction-item {
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                
                .prediction-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                
                .student-name {
                    font-weight: 500;
                    color: #1f2937;
                }
                
                .success-probability {
                    font-weight: 600;
                    color: #059669;
                }
                
                .recommendation-item {
                    background: #f8fafc;
                    border-left: 4px solid #3b82f6;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border-radius: 0 0.375rem 0.375rem 0;
                }
                
                .recommendation-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                
                .strategy-title {
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .effectiveness-score {
                    background: #059669;
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                .intervention-item {
                    background: #fef3c7;
                    border-left: 4px solid #d97706;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border-radius: 0 0.375rem 0.375rem 0;
                }
                
                .urgency-high { border-left-color: #dc2626; background: #fef2f2; }
                .urgency-medium { border-left-color: #d97706; background: #fef3c7; }
                .urgency-low { border-left-color: #059669; background: #ecfdf5; }
                
                .pattern-list {
                    list-style: none;
                    padding: 0;
                }
                
                .pattern-item {
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .pattern-label {
                    font-weight: 500;
                    color: #374151;
                }
                
                .pattern-value {
                    font-weight: 600;
                    color: #3b82f6;
                }
                
                .confidence-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 1rem;
                    padding: 0.75rem;
                    background: #ecfdf5;
                    border-radius: 0.375rem;
                }
                
                .confidence-bar {
                    flex: 1;
                    height: 0.5rem;
                    background: #e5e7eb;
                    border-radius: 0.25rem;
                    overflow: hidden;
                }
                
                .confidence-fill {
                    height: 100%;
                    background: #059669;
                    transition: width 0.3s ease;
                }
                
                .refresh-button {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }
                
                .refresh-button:hover {
                    background: #2563eb;
                }
                
                .data-source-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.75rem;
                    color: #6b7280;
                    background: #f3f4f6;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                }
            </style>
        `;
        
        setInner('ai-recommendations-content', aiHTML);
    }

    renderInsightsView() {
        if (!this.aiInsights) {
            return `
                <div class="loading-state" style="text-align: center; padding: 3rem; color: #6b7280;">
                    <h3>🔄 Loading AI Insights...</h3>
                    <p>Analyzing student data and generating insights...</p>
                </div>
            `;
        }

        const insights = this.aiInsights;

        return `
            <div class="insights-container">
                <div class="insights-grid">
                    <div class="ai-card">
                        <div class="card-title">📊 Learning Patterns Analysis</div>
                        <div class="data-source-indicator">
                            🔗 Source: ${insights.source || 'ai_model'} |
                            📅 Updated: ${formatDate(insights.learning_patterns?.analysis_timestamp || new Date())}
                        </div>

                        <div class="metric-grid">
                            <div class="metric-item">
                                <div class="metric-value">${formatPercentage(insights.learning_patterns?.completion_rate || 0)}</div>
                                <div class="metric-label">Completion Rate</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${insights.learning_patterns?.average_attention_span || 'N/A'}</div>
                                <div class="metric-label">Attention Span</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${insights.learning_patterns?.most_effective_content_type || 'N/A'}</div>
                                <div class="metric-label">Best Content Type</div>
                            </div>
                        </div>

                        <div style="margin-top: 1rem;">
                            <strong>Peak Learning Hours:</strong>
                            <div style="margin-top: 0.5rem;">
                                ${(insights.learning_patterns?.peak_learning_hours || []).map(hour =>
                                    `<span style="background: #3b82f6; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-right: 0.5rem; font-size: 0.875rem;">${hour}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="ai-card">
                        <div class="card-title">🎯 Student Predictions</div>
                        <div class="predictions-list">
                            ${(insights.student_predictions || []).map(prediction => `
                                <div class="prediction-item">
                                    <div class="prediction-header">
                                        <div class="student-name">${prediction.student_name}</div>
                                        <div class="success-probability">${formatNumber(prediction.success_probability, 1)}% Success</div>
                                    </div>
                                    <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">
                                        Expected completion: ${formatDate(prediction.predicted_completion_date)}
                                    </div>
                                    <div style="font-size: 0.875rem;">
                                        <strong>Recommended interventions:</strong>
                                        ${(prediction.recommended_interventions || []).map(intervention =>
                                            `<span style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-right: 0.25rem; font-size: 0.75rem;">${intervention}</span>`
                                        ).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="ai-card">
                    <div class="card-title">🔧 Course Optimization</div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                        <div>
                            <h4 style="color: #374151; margin-bottom: 0.5rem;">Content Adjustments</h4>
                            <ul style="list-style: none; padding: 0;">
                                ${(insights.course_optimization?.suggested_content_adjustments || []).map(adjustment =>
                                    `<li style="background: #f8fafc; padding: 0.5rem; border-radius: 0.25rem; margin-bottom: 0.25rem; font-size: 0.875rem;">💡 ${adjustment}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div>
                            <h4 style="color: #374151; margin-bottom: 0.5rem;">Engagement Bottlenecks</h4>
                            <ul style="list-style: none; padding: 0;">
                                ${(insights.course_optimization?.engagement_bottlenecks || []).map(bottleneck =>
                                    `<li style="background: #fef3c7; padding: 0.5rem; border-radius: 0.25rem; margin-bottom: 0.25rem; font-size: 0.875rem;">⚠️ ${bottleneck}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem;">
                        <strong>Optimization Priority:</strong>
                        <span style="color: ${insights.course_optimization?.optimization_priority === 'high' ? '#dc2626' : insights.course_optimization?.optimization_priority === 'medium' ? '#d97706' : '#059669'};">
                            ${insights.course_optimization?.optimization_priority || 'N/A'}
                        </span>
                    </div>
                </div>

                <div class="ai-card">
                    <div class="card-title">📈 Predictive Analytics</div>
                    <div class="metric-grid">
                        <div class="metric-item">
                            <div class="metric-value">${insights.predictive_analytics?.at_risk_students_next_week || 0}</div>
                            <div class="metric-label">At Risk Next Week</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-value">${formatPercentage(insights.predictive_analytics?.expected_completion_rate || 0)}</div>
                            <div class="metric-label">Expected Completion</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-value">${insights.predictive_analytics?.optimal_class_size || 'N/A'}</div>
                            <div class="metric-label">Optimal Class Size</div>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 2rem;">
                    <button class="refresh-button" onclick="aiSystemManager.refreshInsights()">
                        🔄 Refresh AI Analysis
                    </button>
                </div>
            </div>
        `;
    }

    renderRecommendationsView() {
        if (!this.aiRecommendations) {
            return `
                <div class="loading-state" style="text-align: center; padding: 3rem; color: #6b7280;">
                    <h3>🔄 Loading AI Recommendations...</h3>
                    <p>Generating personalized teaching recommendations...</p>
                </div>
            `;
        }

        const recommendations = this.aiRecommendations;

        return `
            <div class="recommendations-container">
                <div class="ai-card">
                    <div class="card-title">💡 Teaching Strategies</div>
                    <div class="recommendations-list">
                        ${(recommendations.teaching_strategies || []).map(strategy => `
                            <div class="recommendation-item">
                                <div class="recommendation-header">
                                    <div class="strategy-title">${strategy.strategy}</div>
                                    <div class="effectiveness-score">${formatNumber(strategy.effectiveness_score, 1)}% Effective</div>
                                </div>
                                <div style="color: #6b7280; margin-bottom: 0.5rem; font-size: 0.875rem;">
                                    ${strategy.description}
                                </div>
                                <div style="margin-bottom: 0.5rem;">
                                    <strong>Expected improvement:</strong> ${strategy.expected_improvement}
                                </div>
                                <div style="margin-bottom: 0.5rem;">
                                    <strong>Implementation time:</strong> ${strategy.implementation_time}
                                </div>
                                <div>
                                    <strong>Applicable lessons:</strong>
                                    ${(strategy.applicable_lessons || []).map(lesson =>
                                        `<span style="background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-right: 0.25rem; font-size: 0.75rem;">${lesson}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="ai-card">
                    <div class="card-title">🚨 Intervention Suggestions</div>
                    <div class="interventions-list">
                        ${(recommendations.intervention_suggestions || []).map(intervention => `
                            <div class="intervention-item urgency-${intervention.urgency}">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <strong>${intervention.intervention_type}</strong>
                                    <span style="background: ${intervention.urgency === 'high' ? '#dc2626' : intervention.urgency === 'medium' ? '#d97706' : '#059669'}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; text-transform: uppercase;">
                                        ${intervention.urgency} Priority
                                    </span>
                                </div>
                                <div style="margin-bottom: 0.5rem; color: #374151;">
                                    ${intervention.description}
                                </div>
                                <div style="font-size: 0.875rem; color: #6b7280;">
                                    <strong>Timeline:</strong> ${intervention.timeline}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="ai-card">
                    <div class="card-title">📊 Class Performance Summary</div>
                    <div class="metric-grid">
                        <div class="metric-item">
                            <div class="metric-value">${formatPercentage(recommendations.class_performance_summary?.average_progress || 0)}</div>
                            <div class="metric-label">Average Progress</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-value">${formatNumber(recommendations.class_performance_summary?.average_engagement || 0, 1)}</div>
                            <div class="metric-label">Average Engagement</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-value">${recommendations.class_performance_summary?.students_at_risk || 0}</div>
                            <div class="metric-label">Students at Risk</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-value">${recommendations.class_performance_summary?.total_students || 0}</div>
                            <div class="metric-label">Total Students</div>
                        </div>
                    </div>

                    <div class="confidence-indicator">
                        <span style="font-weight: 500;">Recommendation Confidence:</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${recommendations.recommendation_confidence || 0}%;"></div>
                        </div>
                        <span style="font-weight: 600; color: #059669;">${formatNumber(recommendations.recommendation_confidence || 0, 1)}%</span>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 2rem;">
                    <button class="refresh-button" onclick="aiSystemManager.refreshRecommendations()">
                        🔄 Generate New Recommendations
                    </button>
                </div>
            </div>
        `;
    }

    renderPatternsView() {
        if (!this.learningPatterns) {
            return `
                <div class="loading-state" style="text-align: center; padding: 3rem; color: #6b7280;">
                    <h3>🔄 Loading Learning Patterns...</h3>
                    <p>Analyzing learning behavior patterns...</p>
                </div>
            `;
        }

        const patterns = this.learningPatterns;

        return `
            <div class="patterns-container">
                <div class="ai-card">
                    <div class="card-title">📊 Learning Behavior Analysis</div>
                    <div class="data-source-indicator">
                        🔗 Source: ${patterns.source || 'ml_analysis'} |
                        📅 Updated: ${formatDate(patterns.analysis_timestamp || new Date())}
                    </div>

                    <ul class="pattern-list">
                        <li class="pattern-item">
                            <div class="pattern-label">Peak Learning Hours</div>
                            <div class="pattern-value">
                                ${(patterns.peak_learning_hours || []).join(', ')}
                            </div>
                        </li>
                        <li class="pattern-item">
                            <div class="pattern-label">Most Effective Content Type</div>
                            <div class="pattern-value">${patterns.most_effective_content_type || 'N/A'}</div>
                        </li>
                        <li class="pattern-item">
                            <div class="pattern-label">Average Attention Span</div>
                            <div class="pattern-value">${patterns.average_attention_span || 'N/A'}</div>
                        </li>
                        <li class="pattern-item">
                            <div class="pattern-label">Preferred Difficulty Progression</div>
                            <div class="pattern-value">${patterns.preferred_difficulty_progression || 'N/A'}</div>
                        </li>
                        <li class="pattern-item">
                            <div class="pattern-label">Overall Completion Rate</div>
                            <div class="pattern-value">${formatPercentage(patterns.completion_rate || 0)}</div>
                        </li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 2rem;">
                    <button class="refresh-button" onclick="aiSystemManager.refreshPatterns()">
                        🔄 Refresh Pattern Analysis
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // No specific event listeners needed for AI system
        // All interactions are handled via onclick handlers
    }

    switchView(view) {
        this.currentView = view;
        this.renderAIInterface();
    }

    async refreshInsights() {
        try {
            console.log('🔄 Refreshing AI insights...');
            await this.loadAIInsights();
            this.renderAIInterface();
            showSuccess('AI insights refreshed successfully!');
        } catch (error) {
            console.error('❌ Failed to refresh AI insights:', error);
            showError('Failed to refresh AI insights: ' + error.message);
        }
    }

    async refreshRecommendations() {
        try {
            console.log('🔄 Refreshing AI recommendations...');
            await this.loadAIRecommendations();
            this.renderAIInterface();
            showSuccess('AI recommendations refreshed successfully!');
        } catch (error) {
            console.error('❌ Failed to refresh AI recommendations:', error);
            showError('Failed to refresh AI recommendations: ' + error.message);
        }
    }

    async refreshPatterns() {
        try {
            console.log('🔄 Refreshing learning patterns...');
            await this.loadLearningPatterns();
            this.renderAIInterface();
            showSuccess('Learning patterns refreshed successfully!');
        } catch (error) {
            console.error('❌ Failed to refresh learning patterns:', error);
            showError('Failed to refresh learning patterns: ' + error.message);
        }
    }

    startAutoRefresh() {
        // Refresh AI insights every 5 minutes
        setInterval(() => {
            if (this.currentView === 'insights') {
                this.loadAIInsights().then(() => {
                    if (this.currentView === 'insights') {
                        this.renderAIInterface();
                    }
                }).catch(error => {
                    console.error('Auto-refresh failed:', error);
                });
            }
        }, 5 * 60 * 1000);

        // Refresh recommendations every 10 minutes
        setInterval(() => {
            if (this.currentView === 'recommendations') {
                this.loadAIRecommendations().then(() => {
                    if (this.currentView === 'recommendations') {
                        this.renderAIInterface();
                    }
                }).catch(error => {
                    console.error('Auto-refresh failed:', error);
                });
            }
        }, 10 * 60 * 1000);
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
                <h3>❌ AI System Error</h3>
                <p>${message}</p>
                <button class="refresh-button" onclick="aiSystemManager.initialize()" style="margin-top: 1rem;">
                    Retry
                </button>
            </div>
        `;

        setInner('ai-recommendations-content', errorHTML);
    }
}

// Create and export singleton instance
export const aiSystemManager = new AISystemManager();

// Make it globally available for onclick handlers
window.aiSystemManager = aiSystemManager;
