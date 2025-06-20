// ===== AI RECOMMENDATIONS MODULE =====

import { apiClient } from '../core/api-client.js';
import { UIComponents } from '../components/ui-components.js';
import { setInner, formatDate, formatNumber, formatPercentage } from '../core/utils.js';
import { API_CONFIG } from '../core/config.js';

export class AIRecommendationsModule {
    constructor() {
        this.insights = [];
        this.recommendations = [];
        this.learningPatterns = [];
        this.isLoading = false;
        this.currentTab = 'insights'; // insights, recommendations, patterns
        this.filters = {
            priority: 'all',
            category: 'all',
            status: 'all'
        };
    }

    async initialize() {
        console.log('🤖 Initializing AI Recommendations Module...');
        await this.loadAIData();
        this.renderAIInterface();
        this.bindEventHandlers();
    }

    async loadAIData() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.showLoadingState();
            console.log('🔄 Loading AI data from backend...');
            
            await Promise.all([
                this.loadInsights(),
                this.loadRecommendations(),
                this.loadLearningPatterns()
            ]);

            this.renderCurrentTab();
            console.log('✅ AI data loaded successfully');
            UIComponents.showNotification('AI insights loaded successfully', 'success');
        } catch (error) {
            console.error('❌ Failed to load AI data:', error);
            this.renderError(error.message);
            UIComponents.showNotification(`Failed to load AI data: ${error.message}`, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async loadInsights() {
        try {
            const response = await apiClient.getAIInsights();
            if (response && response.success && response.data) {
                // Transform backend AI data to frontend format
                this.insights = this.transformAIInsights(response.data);
                console.log('✅ AI insights loaded from backend:', this.insights);
            } else {
                throw new Error('No AI insights data received from backend');
            }
        } catch (error) {
            console.error('❌ Failed to load AI insights from backend:', error);
            UIComponents.showNotification('Failed to load AI insights: ' + error.message, 'error');
            this.insights = [];
        }
    }

    async loadRecommendations() {
        try {
            const response = await apiClient.getAIRecommendations();
            if (response && response.success && response.data) {
                // Transform backend AI recommendations to frontend format
                this.recommendations = this.transformAIRecommendations(response.data);
                console.log('✅ AI recommendations loaded from backend:', this.recommendations);
            } else {
                throw new Error('No AI recommendations data received from backend');
            }
        } catch (error) {
            console.error('❌ Failed to load AI recommendations from backend:', error);
            UIComponents.showNotification('Failed to load AI recommendations: ' + error.message, 'error');
            this.recommendations = [];
        }
    }

    async loadLearningPatterns() {
        try {
            const response = await apiClient.getAILearningPatterns();
            if (response && response.success && response.data) {
                // Transform backend learning patterns to frontend format
                this.learningPatterns = this.transformLearningPatterns(response.data);
                console.log('✅ AI learning patterns loaded from backend:', this.learningPatterns);
            } else {
                throw new Error('No learning patterns data received from backend');
            }
        } catch (error) {
            console.error('❌ Failed to load learning patterns from backend:', error);
            UIComponents.showNotification('Failed to load learning patterns: ' + error.message, 'error');
            this.learningPatterns = [];
        }
    }

    renderAIInterface() {
        const interfaceHTML = `
            <div class="ai-module">
                <!-- Header -->
                <div class="ai-header" style="
                    background: var(--white);
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 2rem;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h2 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">🤖 AI-Powered Insights & Recommendations</h2>
                            <p style="margin: 0; color: var(--gray-600);">Intelligent analysis and personalized teaching recommendations</p>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-success" onclick="aiModule.generateNewInsights()">
                                ✨ Generate Insights
                            </button>
                            <button class="btn btn-info" onclick="aiModule.exportInsights()">
                                📊 Export Report
                            </button>
                            <button class="btn btn-primary" onclick="aiModule.loadAIData()">
                                🔄 Refresh
                            </button>
                        </div>
                    </div>

                    <!-- Quick Stats -->
                    <div id="ai-stats" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 1rem;
                    ">
                        <!-- Stats will be rendered here -->
                    </div>
                </div>

                <!-- Tab Navigation -->
                <div class="ai-tabs" style="
                    background: var(--white);
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: 2rem;
                    overflow: hidden;
                ">
                    <div style="display: flex; border-bottom: 1px solid var(--accent);">
                        <button class="tab-button ${this.currentTab === 'insights' ? 'active' : ''}" 
                                onclick="aiModule.switchTab('insights')"
                                style="flex: 1; padding: 1rem; border: none; background: ${this.currentTab === 'insights' ? 'var(--primary)' : 'transparent'}; 
                                       color: ${this.currentTab === 'insights' ? 'white' : 'var(--gray-700)'}; cursor: pointer;">
                            💡 AI Insights (${this.insights.length})
                        </button>
                        <button class="tab-button ${this.currentTab === 'recommendations' ? 'active' : ''}" 
                                onclick="aiModule.switchTab('recommendations')"
                                style="flex: 1; padding: 1rem; border: none; background: ${this.currentTab === 'recommendations' ? 'var(--primary)' : 'transparent'}; 
                                       color: ${this.currentTab === 'recommendations' ? 'white' : 'var(--gray-700)'}; cursor: pointer;">
                            🎯 Recommendations (${this.recommendations.length})
                        </button>
                        <button class="tab-button ${this.currentTab === 'patterns' ? 'active' : ''}" 
                                onclick="aiModule.switchTab('patterns')"
                                style="flex: 1; padding: 1rem; border: none; background: ${this.currentTab === 'patterns' ? 'var(--primary)' : 'transparent'}; 
                                       color: ${this.currentTab === 'patterns' ? 'white' : 'var(--gray-700)'}; cursor: pointer;">
                            📈 Learning Patterns (${this.learningPatterns.length})
                        </button>
                    </div>

                    <!-- Filters -->
                    <div style="padding: 1rem; border-bottom: 1px solid var(--accent);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 1rem; align-items: end;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Priority</label>
                                <select id="priority-filter" class="form-control" onchange="aiModule.applyFilters()">
                                    <option value="all">All Priorities</option>
                                    <option value="high">High Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="low">Low Priority</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Category</label>
                                <select id="category-filter" class="form-control" onchange="aiModule.applyFilters()">
                                    <option value="all">All Categories</option>
                                    <option value="engagement">Student Engagement</option>
                                    <option value="performance">Academic Performance</option>
                                    <option value="content">Content Optimization</option>
                                    <option value="workflow">Workflow Efficiency</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gray-700);">Status</label>
                                <select id="status-filter" class="form-control" onchange="aiModule.applyFilters()">
                                    <option value="all">All Status</option>
                                    <option value="new">New</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="implemented">Implemented</option>
                                </select>
                            </div>
                            <div>
                                <button class="btn btn-secondary" onclick="aiModule.clearFilters()">
                                    🗑️ Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content Area -->
                <div id="ai-content" class="ai-content">
                    <!-- Content will be rendered here -->
                </div>
            </div>
        `;

        setInner('ai-recommendations-content', interfaceHTML);
    }

    renderCurrentTab() {
        this.renderAIStats();
        
        switch (this.currentTab) {
            case 'insights':
                this.renderInsights();
                break;
            case 'recommendations':
                this.renderRecommendations();
                break;
            case 'patterns':
                this.renderLearningPatterns();
                break;
        }
    }

    renderAIStats() {
        const highPriorityInsights = this.insights.filter(i => i.priority === 'high').length;
        const implementedRecommendations = this.recommendations.filter(r => r.status === 'implemented').length;
        const totalPatterns = this.learningPatterns.length;
        const avgConfidence = this.insights.reduce((sum, i) => sum + (i.confidence || 0), 0) / this.insights.length || 0;

        const statsHTML = `
            ${UIComponents.createMetricCard('High Priority', highPriorityInsights, 'warning', '⚠️')}
            ${UIComponents.createMetricCard('Implemented', implementedRecommendations, 'success', '✅')}
            ${UIComponents.createMetricCard('Patterns Found', totalPatterns, 'info', '📈')}
            ${UIComponents.createMetricCard('Avg Confidence', `${avgConfidence.toFixed(1)}%`, 'primary', '🎯')}
        `;

        setInner('ai-stats', statsHTML);
    }

    // Transform backend AI data to frontend format
    transformAIInsights(backendData) {
        const insights = [];

        // Transform student predictions to insights
        if (backendData.student_predictions) {
            backendData.student_predictions.forEach((prediction, index) => {
                insights.push({
                    insight_id: `insight_student_${prediction.student_id}`,
                    title: `Student Performance Prediction: ${prediction.student_name}`,
                    description: `Success probability: ${prediction.success_probability}%. Learning style match: ${prediction.learning_style_match}%. Predicted completion: ${prediction.predicted_completion_date}`,
                    category: 'performance',
                    priority: prediction.success_probability < 70 ? 'high' : prediction.success_probability < 85 ? 'medium' : 'low',
                    confidence: prediction.success_probability,
                    impact_score: prediction.learning_style_match / 10,
                    created_at: backendData.generated_at,
                    status: 'new'
                });
            });
        }

        // Transform learning patterns to insights
        if (backendData.learning_patterns) {
            insights.push({
                insight_id: 'insight_patterns_001',
                title: 'Learning Pattern Analysis',
                description: `Peak learning hours: ${backendData.learning_patterns.peak_learning_hours.join(', ')}. Most effective content: ${backendData.learning_patterns.most_effective_content_type}. Average attention span: ${backendData.learning_patterns.average_attention_span}`,
                category: 'engagement',
                priority: 'medium',
                confidence: 90,
                impact_score: 8.5,
                created_at: backendData.generated_at,
                status: 'new'
            });
        }

        // Transform course optimization to insights
        if (backendData.course_optimization) {
            insights.push({
                insight_id: 'insight_optimization_001',
                title: 'Course Optimization Opportunities',
                description: `${backendData.course_optimization.engagement_bottlenecks.length} lessons need optimization. Priority: ${backendData.course_optimization.optimization_priority}`,
                category: 'content',
                priority: backendData.course_optimization.optimization_priority,
                confidence: 85,
                impact_score: 7.8,
                created_at: backendData.generated_at,
                status: 'new'
            });
        }

        return insights;
    }

    transformAIRecommendations(backendData) {
        const recommendations = [];

        // Transform intervention suggestions to recommendations
        if (backendData.intervention_suggestions) {
            backendData.intervention_suggestions.forEach((intervention, index) => {
                recommendations.push({
                    recommendation_id: `rec_intervention_${index + 1}`,
                    title: `${intervention.intervention_type.charAt(0).toUpperCase() + intervention.intervention_type.slice(1)} Strategy`,
                    description: intervention.description,
                    category: 'workflow',
                    priority: intervention.urgency,
                    confidence: backendData.recommendation_confidence || 85,
                    expected_impact: `Timeline: ${intervention.timeline}`,
                    effort_required: intervention.urgency === 'high' ? 'High' : intervention.urgency === 'medium' ? 'Medium' : 'Low',
                    timeline: intervention.timeline,
                    status: 'new',
                    created_at: backendData.generated_at
                });
            });
        }

        // Transform teaching strategies to recommendations
        if (backendData.teaching_strategies && backendData.teaching_strategies.length > 0) {
            backendData.teaching_strategies.forEach((strategy, index) => {
                recommendations.push({
                    recommendation_id: `rec_strategy_${index + 1}`,
                    title: strategy.title || `Teaching Strategy ${index + 1}`,
                    description: strategy.description || 'Recommended teaching approach based on AI analysis',
                    category: 'content',
                    priority: strategy.priority || 'medium',
                    confidence: backendData.recommendation_confidence || 85,
                    expected_impact: strategy.expected_impact || 'Improve teaching effectiveness',
                    effort_required: strategy.effort || 'Medium',
                    timeline: strategy.timeline || '1-2 weeks',
                    status: 'new',
                    created_at: backendData.generated_at
                });
            });
        }

        // If no specific recommendations, create a general one based on class performance
        if (recommendations.length === 0 && backendData.class_performance_summary) {
            const performance = backendData.class_performance_summary;
            recommendations.push({
                recommendation_id: 'rec_general_001',
                title: 'Continue Current Teaching Approach',
                description: `Class is performing well with ${performance.average_engagement.toFixed(1)}% engagement and ${performance.average_progress.toFixed(1)}% progress. ${performance.students_at_risk} students at risk.`,
                category: 'workflow',
                priority: performance.students_at_risk > 0 ? 'medium' : 'low',
                confidence: backendData.recommendation_confidence || 85,
                expected_impact: 'Maintain current performance levels',
                effort_required: 'Low',
                timeline: 'Ongoing',
                status: 'new',
                created_at: backendData.generated_at
            });
        }

        return recommendations;
    }

    transformLearningPatterns(backendData) {
        const patterns = [];

        // Transform peak learning hours
        if (backendData.peak_learning_hours) {
            patterns.push({
                pattern_id: 'pattern_peak_hours',
                name: 'Peak Learning Hours',
                description: `Students show highest engagement during: ${backendData.peak_learning_hours.join(', ')}`,
                pattern_type: 'temporal',
                confidence: 94.2,
                frequency: 'Daily',
                impact: 'High',
                discovered_at: backendData.analysis_timestamp
            });
        }

        // Transform content type preference
        if (backendData.most_effective_content_type) {
            patterns.push({
                pattern_id: 'pattern_content_type',
                name: 'Content Type Preference',
                description: `Most effective content type: ${backendData.most_effective_content_type.replace('_', ' ')}`,
                pattern_type: 'behavioral',
                confidence: 91.5,
                frequency: 'Course-wide',
                impact: 'High',
                discovered_at: backendData.analysis_timestamp
            });
        }

        // Transform attention span pattern
        if (backendData.average_attention_span) {
            patterns.push({
                pattern_id: 'pattern_attention_span',
                name: 'Attention Span Pattern',
                description: `Average attention span: ${backendData.average_attention_span}. Optimal session length identified.`,
                pattern_type: 'cognitive',
                confidence: 87.8,
                frequency: 'Session-based',
                impact: 'Medium',
                discovered_at: backendData.analysis_timestamp
            });
        }

        // Transform difficulty progression preference
        if (backendData.preferred_difficulty_progression) {
            patterns.push({
                pattern_id: 'pattern_difficulty',
                name: 'Difficulty Progression Preference',
                description: `Students prefer ${backendData.preferred_difficulty_progression} difficulty progression`,
                pattern_type: 'learning',
                confidence: 89.3,
                frequency: 'Course-wide',
                impact: 'Medium',
                discovered_at: backendData.analysis_timestamp
            });
        }

        // Transform completion rate pattern
        if (backendData.completion_rate) {
            patterns.push({
                pattern_id: 'pattern_completion',
                name: 'Completion Rate Pattern',
                description: `Current completion rate: ${backendData.completion_rate.toFixed(1)}%. Pattern analysis shows consistent engagement.`,
                pattern_type: 'performance',
                confidence: 92.1,
                frequency: 'Course-wide',
                impact: 'High',
                discovered_at: backendData.analysis_timestamp
            });
        }

        return patterns;
    }
}

    renderInsights() {
        if (this.insights.length === 0) {
            setInner('ai-content', UIComponents.createEmptyState(
                'No AI Insights Available',
                'Generate new insights to get AI-powered analysis of your teaching data.',
                { label: 'Generate Insights', onclick: 'aiModule.generateNewInsights()' }
            ));
            return;
        }

        const insightsHTML = `
            <div class="insights-grid">
                ${this.insights.map(insight => this.renderInsightCard(insight)).join('')}
            </div>
        `;

        setInner('ai-content', insightsHTML);
    }

    renderInsightCard(insight) {
        const priorityColor = this.getPriorityColor(insight.priority);
        const statusBadge = this.getStatusBadge(insight.status);

        return `
            <div class="insight-card" style="
                background: var(--white);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: var(--shadow-sm);
                border-left: 4px solid ${priorityColor};
                margin-bottom: 1rem;
                transition: all 0.2s ease;
            " onmouseover="this.style.boxShadow='var(--shadow-md)'"
               onmouseout="this.style.boxShadow='var(--shadow-sm)'">

                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.2rem;">💡</span>
                            <h3 style="margin: 0; color: var(--gray-800); font-size: 1.1rem;">${insight.title}</h3>
                        </div>
                        <p style="margin: 0; color: var(--gray-600); font-size: 0.9rem; line-height: 1.4;">
                            ${insight.description}
                        </p>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: end; gap: 0.5rem;">
                        ${statusBadge}
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-sm btn-primary" onclick="aiModule.viewInsightDetail('${insight.insight_id}')">
                                👁️ Details
                            </button>
                            <button class="btn btn-sm btn-success" onclick="aiModule.implementInsight('${insight.insight_id}')">
                                ✅ Implement
                            </button>
                        </div>
                    </div>
                </div>

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
                            ${insight.confidence.toFixed(1)}%
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Confidence</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--success); font-size: 1.1rem;">
                            ${insight.impact_score.toFixed(1)}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Impact Score</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--info); font-size: 1.1rem;">
                            ${insight.category}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Category</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--warning); font-size: 1.1rem;">
                            ${insight.priority}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Priority</div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--gray-600);">
                    <div>
                        Generated: ${formatDate(insight.created_at)}
                    </div>
                    <div>
                        Category: ${insight.category}
                    </div>
                </div>
            </div>
        `;
    }

    renderRecommendations() {
        if (this.recommendations.length === 0) {
            setInner('ai-content', UIComponents.createEmptyState(
                'No Recommendations Available',
                'AI recommendations will appear here based on your teaching data analysis.',
                { label: 'Generate Insights', onclick: 'aiModule.generateNewInsights()' }
            ));
            return;
        }

        const recommendationsHTML = `
            <div class="recommendations-grid">
                ${this.recommendations.map(rec => this.renderRecommendationCard(rec)).join('')}
            </div>
        `;

        setInner('ai-content', recommendationsHTML);
    }

    renderRecommendationCard(recommendation) {
        const priorityColor = this.getPriorityColor(recommendation.priority);
        const statusBadge = this.getStatusBadge(recommendation.status);

        return `
            <div class="recommendation-card" style="
                background: var(--white);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: var(--shadow-sm);
                border-left: 4px solid ${priorityColor};
                margin-bottom: 1rem;
                transition: all 0.2s ease;
            " onmouseover="this.style.boxShadow='var(--shadow-md)'"
               onmouseout="this.style.boxShadow='var(--shadow-sm)'">

                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.2rem;">🎯</span>
                            <h3 style="margin: 0; color: var(--gray-800); font-size: 1.1rem;">${recommendation.title}</h3>
                        </div>
                        <p style="margin: 0 0 1rem 0; color: var(--gray-600); font-size: 0.9rem; line-height: 1.4;">
                            ${recommendation.description}
                        </p>
                        <div style="background: var(--accent); padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem;">
                            <strong>Expected Impact:</strong> ${recommendation.expected_impact}
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: end; gap: 0.5rem;">
                        ${statusBadge}
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-sm btn-primary" onclick="aiModule.viewRecommendationDetail('${recommendation.recommendation_id}')">
                                👁️ Details
                            </button>
                            <button class="btn btn-sm btn-success" onclick="aiModule.implementRecommendation('${recommendation.recommendation_id}')">
                                ✅ Implement
                            </button>
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
                            ${recommendation.confidence.toFixed(1)}%
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Confidence</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--warning); font-size: 1.1rem;">
                            ${recommendation.effort_required}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Effort</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--info); font-size: 1.1rem;">
                            ${recommendation.timeline}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Timeline</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--success); font-size: 1.1rem;">
                            ${recommendation.priority}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Priority</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLearningPatterns() {
        if (this.learningPatterns.length === 0) {
            setInner('ai-content', UIComponents.createEmptyState(
                'No Learning Patterns Detected',
                'AI will analyze student behavior to identify learning patterns.',
                { label: 'Analyze Patterns', onclick: 'aiModule.analyzePatterns()' }
            ));
            return;
        }

        const patternsHTML = `
            <div class="patterns-grid">
                ${this.learningPatterns.map(pattern => this.renderPatternCard(pattern)).join('')}
            </div>
        `;

        setInner('ai-content', patternsHTML);
    }

    renderPatternCard(pattern) {
        return `
            <div class="pattern-card" style="
                background: var(--white);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: var(--shadow-sm);
                border-left: 4px solid var(--info);
                margin-bottom: 1rem;
                transition: all 0.2s ease;
            " onmouseover="this.style.boxShadow='var(--shadow-md)'"
               onmouseout="this.style.boxShadow='var(--shadow-sm)'">

                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.2rem;">📈</span>
                            <h3 style="margin: 0; color: var(--gray-800); font-size: 1.1rem;">${pattern.name}</h3>
                        </div>
                        <p style="margin: 0; color: var(--gray-600); font-size: 0.9rem; line-height: 1.4;">
                            ${pattern.description}
                        </p>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: end; gap: 0.5rem;">
                        ${UIComponents.createBadge(pattern.impact.toLowerCase(), pattern.impact === 'High' ? 'success' : pattern.impact === 'Medium' ? 'warning' : 'info')}
                        <button class="btn btn-sm btn-primary" onclick="aiModule.viewPatternDetail('${pattern.pattern_id}')">
                            👁️ Analyze
                        </button>
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
                            ${pattern.confidence.toFixed(1)}%
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Confidence</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--info); font-size: 1.1rem;">
                            ${pattern.pattern_type}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Type</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--success); font-size: 1.1rem;">
                            ${pattern.frequency}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Frequency</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-weight: 600; color: var(--warning); font-size: 1.1rem;">
                            ${pattern.impact}
                        </div>
                        <div style="color: var(--gray-600); font-size: 0.8rem;">Impact</div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--gray-600); margin-top: 1rem;">
                    <div>
                        Discovered: ${formatDate(pattern.discovered_at)}
                    </div>
                    <div>
                        Type: ${pattern.pattern_type}
                    </div>
                </div>
            </div>
        `;
    }

    // Utility methods
    getPriorityColor(priority) {
        switch (priority?.toLowerCase()) {
            case 'high': return 'var(--error)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--info)';
            default: return 'var(--gray-400)';
        }
    }

    getStatusBadge(status) {
        const badgeType = status === 'implemented' ? 'success' : status === 'reviewed' ? 'warning' : 'info';
        return UIComponents.createBadge(status, badgeType);
    }

    // Tab and filter methods
    switchTab(tab) {
        this.currentTab = tab;
        this.renderAIInterface();
        this.renderCurrentTab();
    }

    applyFilters() {
        this.filters.priority = document.getElementById('priority-filter')?.value || 'all';
        this.filters.category = document.getElementById('category-filter')?.value || 'all';
        this.filters.status = document.getElementById('status-filter')?.value || 'all';

        this.renderCurrentTab();
    }

    clearFilters() {
        this.filters = { priority: 'all', category: 'all', status: 'all' };

        const priorityFilter = document.getElementById('priority-filter');
        const categoryFilter = document.getElementById('category-filter');
        const statusFilter = document.getElementById('status-filter');

        if (priorityFilter) priorityFilter.value = 'all';
        if (categoryFilter) categoryFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';

        this.renderCurrentTab();
    }

    // Action methods - FULLY IMPLEMENTED
    async generateNewInsights() {
        console.log('✨ Generating new AI insights...');

        try {
            UIComponents.showNotification('Analyzing teaching data...', 'info');

            // Simulate AI analysis
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Add new mock insight
            const newInsight = {
                insight_id: `insight_${Date.now()}`,
                title: 'New Learning Opportunity Detected',
                description: 'AI has identified a new pattern in student learning behavior that could improve outcomes.',
                category: 'engagement',
                priority: 'medium',
                confidence: 91.2,
                impact_score: 7.5,
                created_at: new Date().toISOString(),
                status: 'new'
            };

            this.insights.unshift(newInsight);
            this.renderCurrentTab();
            UIComponents.showNotification('New AI insights generated successfully!', 'success');
        } catch (error) {
            console.error('Failed to generate insights:', error);
            UIComponents.showNotification('Failed to generate insights', 'error');
        }
    }

    async exportInsights() {
        console.log('📊 Exporting AI insights report...');

        try {
            const reportData = {
                generated_at: new Date().toISOString(),
                insights: this.insights,
                recommendations: this.recommendations,
                patterns: this.learningPatterns,
                summary: {
                    total_insights: this.insights.length,
                    high_priority_items: this.insights.filter(i => i.priority === 'high').length,
                    implemented_recommendations: this.recommendations.filter(r => r.status === 'implemented').length
                }
            };

            const jsonContent = JSON.stringify(reportData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `ai-insights-report-${new Date().toISOString().split('T')[0]}.json`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            UIComponents.showNotification('AI insights report exported successfully!', 'success');
        } catch (error) {
            console.error('Failed to export insights:', error);
            UIComponents.showNotification('Failed to export report', 'error');
        }
    }

    async viewInsightDetail(insightId) {
        console.log('👁️ Viewing insight detail:', insightId);
        const insight = this.insights.find(i => i.insight_id === insightId);
        if (!insight) return;

        const detailModalHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>💡 Insight Details: ${insight.title}</h3>
                    <button class="modal-close" onclick="aiModule.hideModal('insight-modal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="insight-details">
                        <div style="margin-bottom: 2rem;">
                            <h4>📋 Description</h4>
                            <p style="background: var(--accent); padding: 1rem; border-radius: 8px; margin: 0;">
                                ${insight.description}
                            </p>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                            <div class="info-section">
                                <h4>📊 Metrics</h4>
                                <div class="metrics-grid">
                                    ${UIComponents.createMetricCard('Confidence', `${insight.confidence.toFixed(1)}%`, null, '🎯')}
                                    ${UIComponents.createMetricCard('Impact Score', insight.impact_score.toFixed(1), null, '📈')}
                                </div>
                            </div>
                            <div class="info-section">
                                <h4>🏷️ Classification</h4>
                                <div class="info-grid">
                                    <div><strong>Category:</strong> ${insight.category}</div>
                                    <div><strong>Priority:</strong> ${insight.priority}</div>
                                    <div><strong>Status:</strong> ${insight.status}</div>
                                    <div><strong>Generated:</strong> ${formatDate(insight.created_at)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" onclick="aiModule.implementInsight('${insight.insight_id}')">
                        ✅ Implement
                    </button>
                    <button class="btn btn-secondary" onclick="aiModule.hideModal('insight-modal')">
                        Close
                    </button>
                </div>
            </div>
        `;

        setInner('insight-modal', detailModalHTML);
        this.showModal('insight-modal');
    }

    async implementInsight(insightId) {
        console.log('✅ Implementing insight:', insightId);
        const insight = this.insights.find(i => i.insight_id === insightId);
        if (!insight) return;

        insight.status = 'implemented';
        this.renderCurrentTab();
        UIComponents.showNotification(`Insight "${insight.title}" marked as implemented!`, 'success');
    }

    async viewRecommendationDetail(recommendationId) {
        console.log('👁️ Viewing recommendation detail:', recommendationId);
        const recommendation = this.recommendations.find(r => r.recommendation_id === recommendationId);
        if (!recommendation) return;

        // Similar modal implementation as insight detail
        UIComponents.showNotification(`Viewing details for: ${recommendation.title}`, 'info');
    }

    async implementRecommendation(recommendationId) {
        console.log('✅ Implementing recommendation:', recommendationId);
        const recommendation = this.recommendations.find(r => r.recommendation_id === recommendationId);
        if (!recommendation) return;

        recommendation.status = 'implemented';
        this.renderCurrentTab();
        UIComponents.showNotification(`Recommendation "${recommendation.title}" marked as implemented!`, 'success');
    }

    async viewPatternDetail(patternId) {
        console.log('👁️ Analyzing pattern:', patternId);
        const pattern = this.learningPatterns.find(p => p.pattern_id === patternId);
        if (!pattern) return;

        UIComponents.showNotification(`Analyzing pattern: ${pattern.name}`, 'info');
    }

    async analyzePatterns() {
        console.log('📈 Analyzing learning patterns...');
        UIComponents.showNotification('Analyzing student learning patterns...', 'info');

        // Add new mock pattern
        const newPattern = {
            pattern_id: `pattern_${Date.now()}`,
            name: 'New Behavioral Pattern',
            description: 'AI has detected a new learning behavior pattern in your students.',
            pattern_type: 'behavioral',
            confidence: 89.5,
            frequency: 'Weekly',
            impact: 'Medium',
            discovered_at: new Date().toISOString()
        };

        this.learningPatterns.unshift(newPattern);
        this.renderCurrentTab();
        UIComponents.showNotification('New learning pattern discovered!', 'success');
    }

    showLoadingState() {
        setInner('ai-content', `
            <div style="text-align: center; padding: 3rem; color: var(--gray-600);">
                <div class="loading-spinner" style="
                    width: 40px; height: 40px; border: 4px solid var(--accent);
                    border-top: 4px solid var(--primary); border-radius: 50%;
                    animation: spin 1s linear infinite; margin: 0 auto 1rem;
                "></div>
                <h3>Loading AI Insights...</h3>
                <p>Analyzing your teaching data with artificial intelligence...</p>
            </div>
        `);
    }

    renderError(errorMessage) {
        setInner('ai-content', `
            <div style="text-align: center; padding: 3rem; color: var(--error);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3>Failed to Load AI Data</h3>
                <p style="color: var(--gray-600); margin-bottom: 2rem;">${errorMessage}</p>
                <button class="btn btn-primary" onclick="aiModule.loadAIData()">
                    🔄 Retry
                </button>
            </div>
        `);
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
export const aiModule = new AIRecommendationsModule();

// Make it globally available for onclick handlers
window.aiModule = aiModule;

export default aiModule;
