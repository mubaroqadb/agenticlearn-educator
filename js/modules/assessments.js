// ===== ASSESSMENT MANAGEMENT MODULE =====

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
                                <div class="stat-value">${results.total_students}</div>
                                <div class="stat-label">Total Students</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${results.submitted}</div>
                                <div class="stat-label">Submitted</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatPercentage(results.completion_rate)}</div>
                                <div class="stat-label">Completion</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatNumber(results.average_score, 1)}</div>
                                <div class="stat-label">Average Score</div>
                            </div>
                        </div>
                    </div>

                    <div class="results-card">
                        <h4>🎯 Score Analytics</h4>
                        <div class="assessment-stats">
                            <div class="stat-item">
                                <div class="stat-value">${formatNumber(results.analytics.highest_score, 1)}</div>
                                <div class="stat-label">Highest</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatNumber(results.analytics.lowest_score, 1)}</div>
                                <div class="stat-label">Lowest</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatNumber(results.analytics.median_score, 1)}</div>
                                <div class="stat-label">Median</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${formatPercentage(results.analytics.pass_rate)}</div>
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
                        ${results.detailed_results.map(student => `
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
                                    <div style="font-weight: 500;">${student.student_name}</div>
                                    <div style="font-size: 0.875rem; color: #6b7280;">
                                        Submitted: ${formatDate(student.submitted_at)} |
                                        Time: ${student.time_taken_minutes} min
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 1.25rem; font-weight: 600; color: #3b82f6;">
                                        ${formatNumber(student.score, 1)} (${student.letter_grade})
                                    </div>
                                    <div style="font-size: 0.875rem; color: #6b7280;">
                                        ${formatPercentage(student.percentage)}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
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

        // Collect form data
        const questions = this.collectQuestions();
        const formData = {
            title: document.getElementById('assessment-title').value,
            description: document.getElementById('assessment-description').value,
            course_id: document.getElementById('assessment-course').value,
            total_points: parseInt(document.getElementById('assessment-points').value),
            duration_minutes: parseInt(document.getElementById('assessment-duration').value),
            due_date: new Date(document.getElementById('assessment-due-date').value).toISOString(),
            total_questions: questions.length,
            questions: questions
        };

        try {
            console.log('🔄 Creating assessment...', formData);
            const response = await apiClient.createAssessment(formData);

            if (response && response.success) {
                UIComponents.showNotification('Assessment created successfully!', 'success');
                await this.loadAssessments();
                this.switchView('list');
            }
        } catch (error) {
            console.error('❌ Failed to create assessment:', error);
            UIComponents.showNotification('Failed to create assessment: ' + error.message, 'error');
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
        if (!confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
            return;
        }

        try {
            console.log('🔄 Deleting assessment:', assessmentId);
            const response = await apiClient.deleteAssessment(assessmentId);

            if (response && response.success) {
                UIComponents.showNotification('Assessment deleted successfully!', 'success');
                await this.loadAssessments();
                this.renderAssessmentInterface();
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
}

// Create and export singleton instance
export const assessmentManager = new AssessmentManager();

// Make it globally available for onclick handlers
window.assessmentManager = assessmentManager;
