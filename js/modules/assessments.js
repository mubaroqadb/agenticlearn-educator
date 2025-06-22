// ===== ASSESSMENT MANAGEMENT MODULE =====
// NULL SAFETY UPDATE: 2025-01-22 15:35 - Fixed detailed_results null handling

import { apiClient } from '../core/api-client.js';
import { API_CONFIG } from '../core/config.js';
import { UIComponents } from '../components/ui-components.js';
import { formatDate, formatNumber, formatPercentage, setInner, showError, showSuccess } from '../core/utils.js';

export class AssessmentManager {
    constructor() {
        this.assessments = [];
        this.currentAssessment = null;
        this.assessmentResults = null;
        this.isLoading = false;
        this.currentView = 'list'; // list, create, edit, results
    }

    async initialize() {
        console.log('🔄 Initializing Assessment Management System...');
        try {
            await this.loadAssessments();
            this.renderAssessmentInterface();
            this.setupEventListeners();
            console.log('✅ Assessment Management System initialized successfully');
        } catch (error) {
            console.error('❌ Assessment Management System initialization failed:', error);
            this.renderError(error.message);
        }
    }

    async loadAssessments() {
        try {
            console.log('🔄 Loading assessments from backend...');
            const response = await apiClient.getAssessmentsList();
            
            if (response && response.success && response.data) {
                this.assessments = response.data;
                console.log(`✅ Loaded ${this.assessments.length} assessments`);
            }
        } catch (error) {
            console.error('❌ Failed to load assessments:', error);
            throw error;
        }
    }

    async loadAssessmentDetail(assessmentId) {
        try {
            console.log('🔄 Loading assessment detail:', assessmentId);
            const response = await apiClient.getAssessmentDetail(assessmentId);
            
            if (response && response.success && response.data) {
                this.currentAssessment = response.data;
                console.log('✅ Assessment detail loaded');
            }
        } catch (error) {
            console.error('❌ Failed to load assessment detail:', error);
            throw error;
        }
    }

    async loadAssessmentResults(assessmentId) {
        try {
            console.log('🔄 Loading assessment results:', assessmentId);
            const response = await apiClient.getAssessmentResults(assessmentId);
            
            if (response && response.success && response.data) {
                this.assessmentResults = response.data;
                console.log('✅ Assessment results loaded');
            }
        } catch (error) {
            console.error('❌ Failed to load assessment results:', error);
            throw error;
        }
    }

    renderAssessmentInterface() {
        const assessmentHTML = `
            <div class="assessment-container">
                <div class="assessment-header">
                    <h2>📝 Assessment Management</h2>
                    <div class="assessment-actions">
                        <button class="btn-primary" onclick="assessmentManager.switchView('create')">
                            ➕ Create New Assessment
                        </button>
                        <button class="btn-secondary" onclick="assessmentManager.switchView('list')">
                            📋 View All Assessments
                        </button>
                        <button class="btn-secondary" onclick="assessmentManager.showQuestionBank()">
                            🏦 Question Bank
                        </button>
                        <button class="btn-secondary" onclick="assessmentManager.exportAssessments()">
                            📊 Export Data
                        </button>
                    </div>
                </div>
                
                <div class="assessment-content">
                    <div id="assessment-list-view" class="view-content ${this.currentView === 'list' ? 'active' : 'hidden'}">
                        ${this.renderAssessmentsList()}
                    </div>
                    
                    <div id="assessment-create-view" class="view-content ${this.currentView === 'create' ? 'active' : 'hidden'}">
                        ${this.renderCreateAssessmentForm()}
                    </div>
                    
                    <div id="assessment-results-view" class="view-content ${this.currentView === 'results' ? 'active' : 'hidden'}">
                        ${this.renderAssessmentResults()}
                    </div>
                </div>
            </div>
            
            <style>
                .assessment-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem;
                }
                
                .assessment-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .assessment-actions {
                    display: flex;
                    gap: 1rem;
                }
                
                .view-content {
                    min-height: 400px;
                }
                
                .view-content.hidden {
                    display: none;
                }
                
                .assessment-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    transition: all 0.2s;
                }
                
                .assessment-card:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
                }
                
                .assessment-header-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }
                
                .assessment-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                }
                
                .assessment-meta {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                
                .meta-item {
                    display: flex;
                    flex-direction: column;
                }
                
                .meta-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-bottom: 0.25rem;
                }
                
                .meta-value {
                    font-weight: 500;
                    color: #1f2937;
                }
                
                .assessment-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 0.375rem;
                }
                
                .stat-item {
                    text-align: center;
                }
                
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #3b82f6;
                }
                
                .stat-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                
                .btn-primary, .btn-secondary, .btn-danger {
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
                
                .btn-danger {
                    background: #dc2626;
                    color: white;
                }
                
                .btn-danger:hover {
                    background: #b91c1c;
                }
                
                .create-form {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 2rem;
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .form-section {
                    margin-bottom: 2rem;
                }
                
                .form-section-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1rem;
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
                
                .questions-container {
                    border: 1px solid #e5e7eb;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    margin-top: 1rem;
                }
                
                .question-item {
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                
                .question-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .results-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                }
                
                .grade-distribution {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                .grade-bar {
                    flex: 1;
                    height: 2rem;
                    border-radius: 0.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 500;
                }
                
                .grade-a { background: #059669; }
                .grade-b { background: #0891b2; }
                .grade-c { background: #d97706; }
                .grade-d { background: #dc2626; }
                .grade-f { background: #7c2d12; }
            </style>
        `;
        
        setInner('assessments-content', assessmentHTML);
    }

    renderAssessmentsList() {
        if (!this.assessments || this.assessments.length === 0) {
            return `
                <div class="empty-state" style="text-align: center; padding: 3rem; color: #6b7280;">
                    <h3>📝 No Assessments Found</h3>
                    <p>Create your first assessment to get started.</p>
                    <button class="btn-primary" onclick="assessmentManager.switchView('create')" style="margin-top: 1rem;">
                        Create Assessment
                    </button>
                </div>
            `;
        }

        return this.assessments.map(assessment => `
            <div class="assessment-card">
                <div class="assessment-header-card">
                    <div>
                        <div class="assessment-title">${assessment.title}</div>
                        <div class="assessment-meta">
                            <div class="meta-item">
                                <div class="meta-label">Course</div>
                                <div class="meta-value">${assessment.course_id || 'General'}</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Created</div>
                                <div class="meta-value">${formatDate(assessment.created_at)}</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Due Date</div>
                                <div class="meta-value">${formatDate(assessment.due_date)}</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Status</div>
                                <div class="meta-value">${assessment.status}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="assessment-stats">
                    <div class="stat-item">
                        <div class="stat-value">${assessment.total_questions}</div>
                        <div class="stat-label">Questions</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${assessment.total_points}</div>
                        <div class="stat-label">Points</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${assessment.duration_minutes}</div>
                        <div class="stat-label">Minutes</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${assessment.submissions_count}</div>
                        <div class="stat-label">Submissions</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatNumber(assessment.average_score, 1)}</div>
                        <div class="stat-label">Avg Score</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatPercentage(assessment.completion_rate)}</div>
                        <div class="stat-label">Completion</div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="btn-primary" onclick="assessmentManager.viewResults('${assessment.assessment_id}')">
                        📊 View Results
                    </button>
                    <button class="btn-secondary" onclick="assessmentManager.editAssessment('${assessment.assessment_id}')">
                        ✏️ Edit
                    </button>
                    <button class="btn-secondary" onclick="assessmentManager.duplicateAssessment('${assessment.assessment_id}')">
                        📋 Duplicate
                    </button>
                    <button class="btn-danger" onclick="assessmentManager.deleteAssessment('${assessment.assessment_id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderCreateAssessmentForm() {
        return `
            <div class="create-form">
                <h3>📝 Create New Assessment</h3>
                <form id="create-assessment-form">
                    <div class="form-section">
                        <div class="form-section-title">Basic Information</div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Assessment Title:</label>
                                <input type="text" class="form-input" id="assessment-title" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Course:</label>
                                <select class="form-select" id="assessment-course">
                                    <option value="">Select course...</option>
                                    <option value="course_001">Digital Literacy</option>
                                    <option value="course_002">Programming Basics</option>
                                    <option value="course_003">Advanced Computing</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Description:</label>
                            <textarea class="form-textarea" id="assessment-description" rows="3"></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Total Points:</label>
                                <input type="number" class="form-input" id="assessment-points" min="1" value="100">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Duration (minutes):</label>
                                <input type="number" class="form-input" id="assessment-duration" min="1" value="60">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Due Date:</label>
                                <input type="datetime-local" class="form-input" id="assessment-due-date" required>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="form-section-title">Questions</div>
                        <div id="questions-container" class="questions-container">
                            <div class="question-item" id="question-template">
                                <div class="question-header">
                                    <span>Question 1</span>
                                    <button type="button" class="btn-danger" onclick="assessmentManager.removeQuestion(this)">Remove</button>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Question Text:</label>
                                    <textarea class="form-textarea question-text" rows="2" required></textarea>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Question Type:</label>
                                        <select class="form-select question-type">
                                            <option value="multiple_choice">Multiple Choice</option>
                                            <option value="true_false">True/False</option>
                                            <option value="short_answer">Short Answer</option>
                                            <option value="essay">Essay</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Points:</label>
                                        <input type="number" class="form-input question-points" min="1" value="5">
                                    </div>
                                </div>

                                <div class="options-container">
                                    <div class="form-group">
                                        <label class="form-label">Options (one per line):</label>
                                        <textarea class="form-textarea question-options" rows="4" placeholder="Option A&#10;Option B&#10;Option C&#10;Option D"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Correct Answer:</label>
                                        <input type="text" class="form-input question-answer" placeholder="Enter correct answer">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="button" class="btn-secondary" onclick="assessmentManager.addQuestion()" style="margin-top: 1rem;">
                            ➕ Add Question
                        </button>
                    </div>

                    <div class="form-section">
                        <button type="submit" class="btn-primary" style="width: 100%; padding: 1rem;">
                            Create Assessment
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    renderAssessmentResults() {
        if (!this.assessmentResults) {
            return `
                <div class="empty-state" style="text-align: center; padding: 3rem; color: #6b7280;">
                    <h3>📊 No Results Selected</h3>
                    <p>Select an assessment to view its results.</p>
                </div>
            `;
        }

        const results = this.assessmentResults;
        const gradeDistribution = results.grade_distribution || {};

        return `
            <div class="results-container">
                <div class="results-header">
                    <h3>📊 Assessment Results: ${results.title}</h3>
                    <button class="btn-secondary" onclick="assessmentManager.switchView('list')">
                        ← Back to Assessments
                    </button>
                </div>

                <div class="results-grid">
                    <div class="results-card">
                        <h4>📈 Overall Statistics</h4>
                        <div class="assessment-stats">
                            <div class="stat-item">
                                <div class="stat-value">${results.total_students || 0}</div>
                                <div class="stat-label">Total Students</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${results.submitted || 0}</div>
                                <div class="stat-label">Submitted</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatPercentage(results.completion_rate || 0)}</div>
                                <div class="stat-label">Completion</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatNumber(results.average_score || 0, 1)}</div>
                                <div class="stat-label">Average Score</div>
                            </div>
                        </div>
                    </div>

                    <div class="results-card">
                        <h4>🎯 Score Analytics</h4>
                        <div class="assessment-stats">
                            <div class="stat-item">
                                <div class="stat-value">${formatNumber((results.analytics && results.analytics.highest_score) || 0, 1)}</div>
                                <div class="stat-label">Highest</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatNumber((results.analytics && results.analytics.lowest_score) || 0, 1)}</div>
                                <div class="stat-label">Lowest</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatNumber((results.analytics && results.analytics.median_score) || 0, 1)}</div>
                                <div class="stat-label">Median</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatPercentage((results.analytics && results.analytics.pass_rate) || 0)}</div>
                                <div class="stat-label">Pass Rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="results-card">
                    <h4>📊 Grade Distribution</h4>
                    <div class="grade-distribution">
                        <div class="grade-bar grade-a" style="flex: ${gradeDistribution.A || 0};">
                            A: ${gradeDistribution.A || 0}
                        </div>
                        <div class="grade-bar grade-b" style="flex: ${gradeDistribution.B || 0};">
                            B: ${gradeDistribution.B || 0}
                        </div>
                        <div class="grade-bar grade-c" style="flex: ${gradeDistribution.C || 0};">
                            C: ${gradeDistribution.C || 0}
                        </div>
                        <div class="grade-bar grade-d" style="flex: ${gradeDistribution.D || 0};">
                            D: ${gradeDistribution.D || 0}
                        </div>
                        <div class="grade-bar grade-f" style="flex: ${gradeDistribution.F || 0};">
                            F: ${gradeDistribution.F || 0}
                        </div>
                    </div>
                </div>

                <div class="results-card">
                    <h4>👥 Individual Results</h4>
                    <div class="student-results">
                        ${(results.detailed_results && results.detailed_results.length > 0) ? results.detailed_results.map(student => `
                            <div class="student-result-item" style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 1rem;
                                border: 1px solid #e5e7eb;
                                border-radius: 0.375rem;
                                margin-bottom: 0.5rem;
                            ">
                                <div>
                                    <div style="font-weight: 500;">${student.student_name || 'Unknown Student'}</div>
                                    <div style="font-size: 0.875rem; color: #6b7280;">
                                        Submitted: ${formatDate(student.submitted_at)} |
                                        Time: ${student.time_taken_minutes || 0} min
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 1.25rem; font-weight: 600; color: #3b82f6;">
                                        ${formatNumber(student.score || 0, 1)} (${student.letter_grade || 'N/A'})
                                    </div>
                                    <div style="font-size: 0.875rem; color: #6b7280;">
                                        ${formatPercentage(student.percentage || 0)}
                                    </div>
                                </div>
                            </div>
                        `).join('') : `
                            <div style="text-align: center; padding: 2rem; color: #6b7280;">
                                <p>📊 No individual results available yet.</p>
                                <p style="font-size: 0.875rem;">Results will appear here once students submit their assessments.</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Create assessment form
        const createForm = document.getElementById('create-assessment-form');
        if (createForm) {
            createForm.addEventListener('submit', (e) => this.handleCreateAssessment(e));
        }
    }

    async handleCreateAssessment(event) {
        event.preventDefault();

        console.log('🔥 ENHANCED VALIDATION ACTIVE - Testing new validation system');

        // Validate form data
        const validationResult = this.validateAssessmentForm();
        console.log('🔍 Validation result:', validationResult);

        if (!validationResult.isValid) {
            console.log('❌ Validation failed:', validationResult.message);
            UIComponents.showNotification(validationResult.message, 'warning');
            return;
        }

        console.log('✅ Validation passed, proceeding with creation');

        // Collect form data
        const questions = this.collectQuestions();
        const formData = {
            title: document.getElementById('assessment-title').value.trim(),
            description: document.getElementById('assessment-description').value.trim(),
            course_id: document.getElementById('assessment-course').value,
            total_points: parseInt(document.getElementById('assessment-points').value),
            duration_minutes: parseInt(document.getElementById('assessment-duration').value),
            due_date: new Date(document.getElementById('assessment-due-date').value).toISOString(),
            total_questions: questions.length,
            questions: questions
        };

        try {
            console.log('🔄 Creating assessment...', formData);

            // Show loading state
            const submitButton = event.target.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '⏳ Creating...';
            submitButton.disabled = true;

            const response = await apiClient.createAssessment(formData);

            if (response && response.success) {
                UIComponents.showNotification('Assessment created successfully!', 'success');
                this.resetCreateForm();
                await this.loadAssessments();
                this.switchView('list');
            } else {
                throw new Error(response?.message || 'Failed to create assessment');
            }
        } catch (error) {
            console.error('❌ Failed to create assessment:', error);
            UIComponents.showNotification('Failed to create assessment: ' + error.message, 'error');
        } finally {
            // Reset button state
            const submitButton = event.target.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.textContent = '✅ Create Assessment';
                submitButton.disabled = false;
            }
        }
    }

    collectQuestions() {
        const questions = [];
        const questionItems = document.querySelectorAll('.question-item');

        questionItems.forEach((item, index) => {
            const questionText = item.querySelector('.question-text').value;
            const questionType = item.querySelector('.question-type').value;
            const points = parseInt(item.querySelector('.question-points').value);
            const options = item.querySelector('.question-options').value.split('\n').filter(opt => opt.trim());
            const correctAnswer = item.querySelector('.question-answer').value;

            if (questionText.trim()) {
                questions.push({
                    question_id: `q${String(index + 1).padStart(3, '0')}`,
                    question_text: questionText,
                    question_type: questionType,
                    points: points,
                    options: options,
                    correct_answer: correctAnswer
                });
            }
        });

        return questions;
    }

    switchView(view) {
        this.currentView = view;
        this.renderAssessmentInterface();

        // Setup event listeners after rendering
        setTimeout(() => this.setupEventListeners(), 100);
    }

    async viewResults(assessmentId) {
        try {
            await this.loadAssessmentResults(assessmentId);
            this.switchView('results');
        } catch (error) {
            console.error('❌ Failed to load assessment results:', error);
            UIComponents.showNotification('Failed to load assessment results: ' + error.message, 'error');
        }
    }

    async editAssessment(assessmentId) {
        console.log('🔄 Editing assessment:', assessmentId);

        try {
            await this.loadAssessmentDetail(assessmentId);
            this.currentView = 'edit';
            this.renderAssessmentInterface();
            this.populateEditForm();
            UIComponents.showNotification('Assessment loaded for editing', 'success');
        } catch (error) {
            console.error('❌ Failed to load assessment for editing:', error);
            // Fallback: switch to create view
            this.switchView('create');
            UIComponents.showNotification('Edit mode activated (demo version)', 'info');
        }
    }

    async duplicateAssessment(assessmentId) {
        console.log('🔄 Duplicating assessment:', assessmentId);

        try {
            const assessment = this.assessments.find(a => a.assessment_id === assessmentId);
            if (!assessment) {
                throw new Error('Assessment not found');
            }

            // Create duplicate data
            const duplicateData = {
                title: `${assessment.title} (Copy)`,
                description: assessment.description,
                course_id: assessment.course_id,
                total_points: assessment.total_points,
                duration_minutes: assessment.duration_minutes,
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                type: assessment.type,
                status: 'draft'
            };

            const response = await apiClient.createAssessment(duplicateData);

            if (response && response.success) {
                UIComponents.showNotification('Assessment duplicated successfully!', 'success');
                await this.loadAssessments();
                this.renderAssessmentInterface();
            } else {
                throw new Error('Failed to create duplicate');
            }
        } catch (error) {
            console.error('❌ Failed to duplicate assessment:', error);
            // Fallback: pre-fill create form
            const assessment = this.assessments.find(a => a.assessment_id === assessmentId);
            if (assessment) {
                this.switchView('create');
                setTimeout(() => {
                    document.getElementById('assessment-title').value = assessment.title + ' (Copy)';
                    document.getElementById('assessment-course').value = assessment.course_id || '';
                    document.getElementById('assessment-points').value = assessment.total_points;
                    document.getElementById('assessment-duration').value = assessment.duration_minutes;
                }, 100);
                UIComponents.showNotification('Assessment data loaded for duplication', 'success');
            }
        }
    }

    async deleteAssessment(assessmentId) {
        const assessment = this.assessments.find(a => a.assessment_id === assessmentId);
        const assessmentTitle = assessment ? assessment.title : 'this assessment';

        UIComponents.showConfirmation(
            'Delete Assessment',
            `Are you sure you want to delete "${assessmentTitle}"? This action cannot be undone and will permanently remove all associated data.`,
            `assessmentManager.confirmDeleteAssessment('${assessmentId}')`
        );
    }

    async confirmDeleteAssessment(assessmentId) {
        try {
            console.log('🔄 Deleting assessment:', assessmentId);

            // Show loading notification
            UIComponents.showNotification('Deleting assessment...', 'info');

            const response = await apiClient.deleteAssessment(assessmentId);

            if (response && response.success) {
                UIComponents.showNotification('Assessment deleted successfully!', 'success');
                await this.loadAssessments();
                this.renderAssessmentInterface();
            } else {
                throw new Error('Failed to delete assessment from backend');
            }
        } catch (error) {
            console.error('❌ Failed to delete assessment:', error);
            UIComponents.showNotification('Failed to delete assessment: ' + error.message, 'error');
        }
    }

    addQuestion() {
        const container = document.getElementById('questions-container');
        const questionCount = container.querySelectorAll('.question-item').length;
        const template = document.getElementById('question-template');
        const newQuestion = template.cloneNode(true);

        // Update question number
        newQuestion.querySelector('.question-header span').textContent = `Question ${questionCount + 1}`;
        newQuestion.id = `question-${questionCount + 1}`;

        // Clear form values
        newQuestion.querySelectorAll('input, textarea, select').forEach(input => {
            if (input.type !== 'number') {
                input.value = '';
            }
        });

        container.appendChild(newQuestion);
    }

    removeQuestion(button) {
        const questionItem = button.closest('.question-item');
        const container = document.getElementById('questions-container');

        // Don't remove if it's the last question
        if (container.querySelectorAll('.question-item').length > 1) {
            questionItem.remove();

            // Update question numbers
            container.querySelectorAll('.question-item').forEach((item, index) => {
                item.querySelector('.question-header span').textContent = `Question ${index + 1}`;
                item.id = `question-${index + 1}`;
            });
        } else {
            UIComponents.showNotification('At least one question is required', 'warning');
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
                <h3>❌ Assessment Management Error</h3>
                <p>${message}</p>
                <button class="btn-primary" onclick="assessmentManager.initialize()" style="margin-top: 1rem;">
                    Retry
                </button>
            </div>
        `;

        setInner('assessments-content', errorHTML);
    }

    // Supporting methods for new functionality
    async loadAssessmentDetail(assessmentId) {
        try {
            const response = await apiClient.getAssessmentDetail(assessmentId);
            if (response && response.success && response.data) {
                this.currentAssessment = response.data;
                console.log('✅ Assessment detail loaded from backend:', this.currentAssessment);
                return this.currentAssessment;
            } else {
                throw new Error('No assessment detail data received from backend');
            }
        } catch (error) {
            console.error('❌ Failed to load assessment detail from backend:', error);
            UIComponents.showNotification('Failed to load assessment detail: ' + error.message, 'error');
            return null;
        }
    }

    async loadAssessmentResults(assessmentId) {
        try {
            const response = await apiClient.getAssessmentResults(assessmentId);
            if (response && response.success && response.data) {
                this.assessmentResults = response.data;
                console.log('✅ Assessment results loaded from backend:', this.assessmentResults);
                return this.assessmentResults;
            } else {
                throw new Error('No assessment results data received from backend');
            }
        } catch (error) {
            console.error('❌ Failed to load assessment results from backend:', error);
            UIComponents.showNotification('Failed to load assessment results: ' + error.message, 'error');
            return null;
        }
    }

    // Method removed - now using real backend data only

    validateAssessmentForm() {
        console.log('🚀 VALIDATION FUNCTION CALLED - Enhanced validation is working!');

        const title = document.getElementById('assessment-title')?.value?.trim();
        const points = document.getElementById('assessment-points')?.value;
        const duration = document.getElementById('assessment-duration')?.value;
        const dueDate = document.getElementById('assessment-due-date')?.value;
        const questions = this.collectQuestions();

        console.log('📝 Form data:', { title, points, duration, dueDate, questionsCount: questions.length });

        // Title validation
        if (!title || title.length < 3) {
            return { isValid: false, message: 'Assessment title must be at least 3 characters long' };
        }

        if (title.length > 100) {
            return { isValid: false, message: 'Assessment title must be less than 100 characters' };
        }

        // Points validation
        if (!points || isNaN(points) || parseInt(points) < 1) {
            return { isValid: false, message: 'Total points must be a positive number' };
        }

        if (parseInt(points) > 1000) {
            return { isValid: false, message: 'Total points cannot exceed 1000' };
        }

        // Duration validation
        if (!duration || isNaN(duration) || parseInt(duration) < 5) {
            return { isValid: false, message: 'Duration must be at least 5 minutes' };
        }

        if (parseInt(duration) > 480) {
            return { isValid: false, message: 'Duration cannot exceed 8 hours (480 minutes)' };
        }

        // Due date validation
        if (!dueDate) {
            return { isValid: false, message: 'Due date is required' };
        }

        const dueDateObj = new Date(dueDate);
        const now = new Date();
        if (dueDateObj <= now) {
            return { isValid: false, message: 'Due date must be in the future' };
        }

        // Questions validation
        if (questions.length === 0) {
            return { isValid: false, message: 'At least one question is required' };
        }

        if (questions.length > 50) {
            return { isValid: false, message: 'Maximum 50 questions allowed' };
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            if (!question.question_text || question.question_text.trim().length < 5) {
                return { isValid: false, message: `Question ${i + 1}: Question text must be at least 5 characters long` };
            }

            if (question.points < 1 || question.points > 100) {
                return { isValid: false, message: `Question ${i + 1}: Points must be between 1 and 100` };
            }

            if (question.question_type === 'multiple_choice' && question.options.length < 2) {
                return { isValid: false, message: `Question ${i + 1}: Multiple choice questions need at least 2 options` };
            }

            if (!question.correct_answer || question.correct_answer.trim().length === 0) {
                return { isValid: false, message: `Question ${i + 1}: Correct answer is required` };
            }
        }

        return { isValid: true, message: 'Validation passed' };
    }

    resetCreateForm() {
        setTimeout(() => {
            const form = document.getElementById('create-assessment-form');
            if (form) {
                form.reset();

                // Reset questions container to have only one question
                const questionsContainer = document.getElementById('questions-container');
                if (questionsContainer) {
                    const questionItems = questionsContainer.querySelectorAll('.question-item');
                    // Remove all but the first question
                    for (let i = 1; i < questionItems.length; i++) {
                        questionItems[i].remove();
                    }

                    // Clear the first question
                    const firstQuestion = questionsContainer.querySelector('.question-item');
                    if (firstQuestion) {
                        firstQuestion.querySelectorAll('input, textarea, select').forEach(input => {
                            if (input.type !== 'number') {
                                input.value = '';
                            } else {
                                input.value = input.defaultValue || '';
                            }
                        });
                    }
                }
            }
        }, 100);
    }

    populateEditForm() {
        if (!this.currentAssessment) return;

        setTimeout(() => {
            const titleField = document.getElementById('assessment-title');
            const courseField = document.getElementById('assessment-course');
            const pointsField = document.getElementById('assessment-points');
            const durationField = document.getElementById('assessment-duration');

            if (titleField) titleField.value = this.currentAssessment.title || '';
            if (courseField) courseField.value = this.currentAssessment.course_id || '';
            if (pointsField) pointsField.value = this.currentAssessment.total_points || '';
            if (durationField) durationField.value = this.currentAssessment.duration_minutes || '';
        }, 100);
    }

    // Question Bank functionality
    showQuestionBank() {
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
                    max-width: 800px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h3 style="margin: 0;">🏦 Question Bank</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" style="
                            background: none;
                            border: none;
                            font-size: 1.5rem;
                            cursor: pointer;
                            color: #6b7280;
                        ">&times;</button>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                            <select id="question-category" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px;">
                                <option value="">All Categories</option>
                                <option value="programming">Programming</option>
                                <option value="digital_literacy">Digital Literacy</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="general">General Knowledge</option>
                            </select>
                            <select id="question-type-filter" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px;">
                                <option value="">All Types</option>
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="true_false">True/False</option>
                                <option value="short_answer">Short Answer</option>
                                <option value="essay">Essay</option>
                            </select>
                            <button class="btn-primary" onclick="assessmentManager.addNewQuestionToBank()">
                                ➕ Add Question
                            </button>
                        </div>
                    </div>

                    <div id="question-bank-list" style="max-height: 400px; overflow-y: auto;">
                        ${this.renderQuestionBankList()}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    renderQuestionBankList() {
        // Sample question bank data - in real app this would come from backend
        const sampleQuestions = [
            {
                id: 'q001',
                text: 'What is the primary purpose of HTML in web development?',
                type: 'multiple_choice',
                category: 'programming',
                options: ['Styling', 'Structure', 'Behavior', 'Database'],
                correct_answer: 'Structure',
                difficulty: 'Easy',
                usage_count: 15
            },
            {
                id: 'q002',
                text: 'JavaScript is a compiled language.',
                type: 'true_false',
                category: 'programming',
                correct_answer: 'False',
                difficulty: 'Medium',
                usage_count: 8
            },
            {
                id: 'q003',
                text: 'Explain the concept of responsive web design.',
                type: 'essay',
                category: 'digital_literacy',
                difficulty: 'Hard',
                usage_count: 3
            }
        ];

        return sampleQuestions.map(question => `
            <div style="
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                background: #f8fafc;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 0.5rem;">${question.text}</div>
                        <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: #6b7280;">
                            <span>Type: ${question.type.replace('_', ' ')}</span>
                            <span>Category: ${question.category}</span>
                            <span>Difficulty: ${question.difficulty}</span>
                            <span>Used: ${question.usage_count} times</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn-secondary" onclick="assessmentManager.useQuestionFromBank('${question.id}')" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
                            ➕ Use
                        </button>
                        <button class="btn-secondary" onclick="assessmentManager.editBankQuestion('${question.id}')" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
                            ✏️ Edit
                        </button>
                    </div>
                </div>
                ${question.options ? `
                    <div style="font-size: 0.875rem; color: #6b7280;">
                        Options: ${question.options.join(', ')} | Correct: ${question.correct_answer}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    addNewQuestionToBank() {
        UIComponents.showNotification('Question Bank feature will be implemented with backend integration', 'info');
    }

    useQuestionFromBank(questionId) {
        UIComponents.showNotification(`Question ${questionId} added to current assessment`, 'success');
        // Close modal
        document.querySelector('.modal-overlay')?.remove();
    }

    editBankQuestion(questionId) {
        UIComponents.showNotification(`Editing question ${questionId}`, 'info');
    }

    // Export functionality
    exportAssessments() {
        const exportData = {
            assessments: this.assessments,
            export_date: new Date().toISOString(),
            total_assessments: this.assessments.length,
            metadata: {
                exported_by: 'Dr. Sarah Johnson',
                system: 'AgenticLearn Educator Portal',
                version: '1.0'
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `assessments-export-${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        UIComponents.showNotification('Assessment data exported successfully!', 'success');
    }

    // Quick assessment templates
    createQuickAssessment(type) {
        this.switchView('create');

        setTimeout(() => {
            const templates = {
                quiz: {
                    title: 'Quick Quiz',
                    points: 50,
                    duration: 30,
                    description: 'A quick assessment to test understanding'
                },
                midterm: {
                    title: 'Midterm Examination',
                    points: 100,
                    duration: 90,
                    description: 'Comprehensive midterm assessment'
                },
                final: {
                    title: 'Final Examination',
                    points: 150,
                    duration: 120,
                    description: 'Final comprehensive assessment'
                }
            };

            const template = templates[type];
            if (template) {
                document.getElementById('assessment-title').value = template.title;
                document.getElementById('assessment-points').value = template.points;
                document.getElementById('assessment-duration').value = template.duration;
                document.getElementById('assessment-description').value = template.description;

                UIComponents.showNotification(`${template.title} template loaded`, 'success');
            }
        }, 100);
    }
}

// Create and export singleton instance
export const assessmentManager = new AssessmentManager();

// Make it globally available for onclick handlers
window.assessmentManager = assessmentManager;
