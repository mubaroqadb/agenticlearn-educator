# 🧮 Mathematical Calculations Specification for Educator Portal

## 🎯 Problem Statement
The educator portal should use **real mathematical calculations** instead of hardcoded values. All percentages, scores, and metrics must be computed dynamically from actual data.

## 📊 Core Calculation Principles

### 1. **Student Progress Calculation**
```sql
-- Backend SQL Calculation
SELECT 
    student_id,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_lessons,
    COUNT(*) as total_lessons,
    ROUND((COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)), 2) as progress_percentage
FROM student_lessons 
WHERE student_id = ? AND course_id = ?
GROUP BY student_id;
```

```javascript
// Frontend Calculation (if needed)
const calculateProgress = (completedLessons, totalLessons) => {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
};
```

### 2. **Assessment Score Calculation**
```sql
-- Average Assessment Score
SELECT 
    student_id,
    assessment_id,
    SUM(points_earned) as total_points_earned,
    SUM(points_possible) as total_points_possible,
    ROUND((SUM(points_earned) * 100.0 / SUM(points_possible)), 2) as percentage_score
FROM assessment_submissions 
WHERE student_id = ? AND assessment_id = ?
GROUP BY student_id, assessment_id;
```

### 3. **Class Average Calculation**
```sql
-- Class Performance Average
SELECT 
    course_id,
    COUNT(DISTINCT student_id) as total_students,
    AVG(progress_percentage) as average_progress,
    STDDEV(progress_percentage) as progress_std_dev,
    MIN(progress_percentage) as min_progress,
    MAX(progress_percentage) as max_progress
FROM (
    SELECT 
        student_id,
        course_id,
        ROUND((COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)), 2) as progress_percentage
    FROM student_lessons 
    WHERE course_id = ?
    GROUP BY student_id, course_id
) student_progress
GROUP BY course_id;
```

### 4. **Engagement Score Calculation**
```sql
-- Student Engagement Score (0-100)
SELECT 
    student_id,
    -- Login frequency (30%)
    LEAST(100, (login_count_last_30_days * 100.0 / 30)) * 0.3 as login_score,
    -- Content interaction (40%)
    LEAST(100, (content_interactions_last_30_days * 100.0 / expected_interactions)) * 0.4 as interaction_score,
    -- Assignment submission (30%)
    (assignments_submitted_on_time * 100.0 / total_assignments) * 0.3 as submission_score,
    -- Total engagement score
    (
        LEAST(100, (login_count_last_30_days * 100.0 / 30)) * 0.3 +
        LEAST(100, (content_interactions_last_30_days * 100.0 / expected_interactions)) * 0.4 +
        (assignments_submitted_on_time * 100.0 / total_assignments) * 0.3
    ) as total_engagement_score
FROM student_engagement_metrics 
WHERE student_id = ?;
```

---

## 📊 Specific API Response Calculations

### 1. Student List API Response
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "student_001",
        "name": "Ahmad Mahasiswa",
        "phonenumber": "+62 812-3456-7890",
        "course": "Digital Literacy Course",
        
        // ✅ CALCULATED FIELDS - NOT HARDCODED
        "completed_lessons": 15,           // COUNT from database
        "total_lessons": 20,              // COUNT from database  
        "progress": 75,                   // CALCULATED: (15/20) * 100
        "grade_points": 340,              // SUM of all assessment points
        "total_possible_points": 400,     // SUM of all possible points
        "grade_percentage": 85,           // CALCULATED: (340/400) * 100
        "grade_letter": "A-",             // CALCULATED: based on percentage
        
        // ✅ TIME-BASED CALCULATIONS
        "last_active": "2024-12-16T10:30:00Z",  // ACTUAL timestamp from database
        "days_since_last_active": 0,            // CALCULATED: NOW() - last_active
        "total_study_hours": 45.5,              // SUM from session_logs
        "average_session_duration": 1.5,       // AVG from session_logs
        
        // ✅ ENGAGEMENT CALCULATIONS
        "login_frequency": 0.8,           // CALCULATED: logins_last_30_days / 30
        "assignment_submission_rate": 90, // CALCULATED: (submitted/total) * 100
        "forum_participation": 12,        // COUNT of forum posts
        "engagement_score": 78,           // CALCULATED: weighted formula
        
        // ✅ RISK ASSESSMENT CALCULATIONS
        "risk_level": "low",              // CALCULATED: based on multiple factors
        "risk_score": 0.15,              // CALCULATED: ML model or rule-based
        "intervention_needed": false      // CALCULATED: risk_score > threshold
      }
    ],
    
    // ✅ CLASS-LEVEL CALCULATIONS
    "class_statistics": {
      "total_students": 25,                    // COUNT(*)
      "active_students": 23,                   // COUNT WHERE last_active > 7 days
      "average_progress": 78.4,               // AVG(progress)
      "progress_std_deviation": 12.3,         // STDDEV(progress)
      "completion_rate": 68,                  // COUNT(progress=100) / total * 100
      "at_risk_students": 3,                  // COUNT WHERE risk_score > threshold
      "high_performers": 8,                   // COUNT WHERE progress > 90
      "class_engagement_average": 75.2        // AVG(engagement_score)
    }
  }
}
```

### 2. Analytics API Response
```json
{
  "success": true,
  "data": {
    // ✅ PERFORMANCE METRICS - ALL CALCULATED
    "performance_metrics": {
      "completion_rate": 87.5,           // CALCULATED: completed_students / total_students * 100
      "satisfaction_score": 92.3,       // CALCULATED: AVG(satisfaction_ratings)
      "knowledge_retention": 78.1,      // CALCULATED: post_test_avg / pre_test_avg * 100
      
      // Time-series data for charts
      "monthly_completion_trends": [
        {
          "month": "2024-10",
          "completion_rate": 85.2,       // CALCULATED for that month
          "student_count": 120,          // COUNT for that month
          "average_score": 78.5          // AVG for that month
        },
        {
          "month": "2024-11", 
          "completion_rate": 87.1,       // CALCULATED for that month
          "student_count": 135,          // COUNT for that month
          "average_score": 81.2          // AVG for that month
        }
      ]
    },
    
    // ✅ ENGAGEMENT ANALYTICS - ALL CALCULATED
    "engagement_analytics": {
      "daily_active_users": [45, 48, 52, 47, 51],  // COUNT(DISTINCT student_id) per day
      "average_session_duration": 25.5,            // AVG(session_end - session_start)
      "content_interaction_rate": 0.85,            // interactions / total_content_items
      "forum_participation_rate": 0.67,            // students_with_posts / total_students
      
      // Peak activity analysis
      "peak_activity_hours": {
        "hour_19": 156,                 // COUNT of activities at 7 PM
        "hour_20": 189,                 // COUNT of activities at 8 PM  
        "hour_21": 145                  // COUNT of activities at 9 PM
      },
      
      // Content effectiveness
      "content_effectiveness": [
        {
          "content_id": "video_001",
          "title": "Introduction to Programming",
          "view_count": 234,            // COUNT of views
          "completion_rate": 0.89,      // completed_views / total_views
          "average_watch_time": 12.5,   // AVG(watch_duration)
          "engagement_score": 0.92      // CALCULATED: weighted formula
        }
      ]
    },
    
    // ✅ PREDICTIVE ANALYTICS - ML CALCULATIONS
    "predictive_insights": {
      "dropout_risk_predictions": [
        {
          "student_id": "student_001",
          "dropout_probability": 0.15,   // ML MODEL OUTPUT
          "confidence": 0.87,            // ML MODEL CONFIDENCE
          "risk_factors": [              // ML MODEL FEATURE IMPORTANCE
            {"factor": "attendance", "weight": 0.4},
            {"factor": "assignment_delays", "weight": 0.3}
          ]
        }
      ],
      "course_completion_forecast": {
        "expected_completion_date": "2025-01-15",  // ML PREDICTION
        "completion_probability": 0.92,           // ML MODEL OUTPUT
        "factors_affecting": [                    // ML ANALYSIS
          {"factor": "current_pace", "impact": 0.6},
          {"factor": "historical_performance", "impact": 0.4}
        ]
      }
    }
  }
}
```

### 3. Assessment Results API Response
```json
{
  "success": true,
  "data": {
    "assessment": {
      "id": "assessment_001",
      "title": "Digital Literacy Quiz",
      "total_questions": 20,
      "total_points": 100
    },
    
    // ✅ SUBMISSION STATISTICS - ALL CALCULATED
    "submission_statistics": {
      "total_submissions": 23,                    // COUNT(*)
      "submission_rate": 92,                      // (submissions/enrolled_students) * 100
      "average_score": 78.5,                     // AVG(score)
      "median_score": 80,                        // MEDIAN(score)
      "highest_score": 95,                       // MAX(score)
      "lowest_score": 45,                        // MIN(score)
      "standard_deviation": 12.3,                // STDDEV(score)
      "pass_rate": 87,                           // COUNT(score >= passing_grade) / total * 100
      
      // Score distribution
      "score_distribution": {
        "90-100": 8,                             // COUNT WHERE score BETWEEN 90 AND 100
        "80-89": 10,                             // COUNT WHERE score BETWEEN 80 AND 89
        "70-79": 4,                              // COUNT WHERE score BETWEEN 70 AND 79
        "60-69": 1,                              // COUNT WHERE score BETWEEN 60 AND 69
        "below_60": 0                            // COUNT WHERE score < 60
      },
      
      // Time analysis
      "average_completion_time": 22.5,           // AVG(completion_time_minutes)
      "fastest_completion": 15,                  // MIN(completion_time_minutes)
      "slowest_completion": 35                   // MAX(completion_time_minutes)
    },
    
    // ✅ QUESTION ANALYSIS - ALL CALCULATED
    "question_analysis": [
      {
        "question_id": "q001",
        "question_text": "What is a computer?",
        "correct_answers": 22,                   // COUNT WHERE answer_correct = true
        "incorrect_answers": 1,                  // COUNT WHERE answer_correct = false
        "accuracy_rate": 95.7,                  // (correct_answers / total_answers) * 100
        "average_time_spent": 45,               // AVG(time_spent_seconds)
        "difficulty_level": "easy"              // CALCULATED: based on accuracy_rate
      }
    ],
    
    // ✅ INDIVIDUAL SUBMISSIONS - ALL CALCULATED
    "individual_submissions": [
      {
        "student_id": "student_001",
        "student_name": "Ahmad Mahasiswa",
        "score": 85,                            // SUM(question_points)
        "percentage": 85,                       // (score / total_points) * 100
        "grade": "A-",                          // CALCULATED: based on percentage
        "completion_time": 25,                  // submission_time - start_time (minutes)
        "submitted_at": "2024-12-15T14:20:00Z", // ACTUAL timestamp
        "time_taken_formatted": "25 minutes",   // FORMATTED: completion_time
        "questions_correct": 17,                // COUNT WHERE answer_correct = true
        "questions_incorrect": 3,               // COUNT WHERE answer_correct = false
        "accuracy_rate": 85                     // (questions_correct / total_questions) * 100
      }
    ]
  }
}
```

---

## 🧮 Mathematical Formulas Reference

### 1. Progress Calculations
```javascript
// Student Progress
progress_percentage = (completed_items / total_items) * 100

// Course Completion Rate  
completion_rate = (students_completed / total_enrolled) * 100

// Assignment Submission Rate
submission_rate = (assignments_submitted / assignments_assigned) * 100
```

### 2. Performance Calculations
```javascript
// Grade Point Average
gpa = total_grade_points / total_credit_hours

// Weighted Average Score
weighted_average = Σ(score_i * weight_i) / Σ(weight_i)

// Improvement Rate
improvement_rate = ((current_score - previous_score) / previous_score) * 100
```

### 3. Engagement Calculations
```javascript
// Engagement Score (0-100)
engagement_score = (
    (login_frequency * 0.3) +           // 30% weight
    (content_interaction_rate * 0.4) +  // 40% weight  
    (assignment_timeliness * 0.3)       // 30% weight
) * 100

// Activity Rate
activity_rate = active_days / total_days_in_period

// Participation Rate
participation_rate = (students_participated / total_students) * 100
```

### 4. Risk Assessment Calculations
```javascript
// Risk Score (0-1, where 1 = highest risk)
risk_score = (
    (1 - attendance_rate) * 0.4 +           // 40% weight
    (assignment_delay_factor) * 0.3 +       // 30% weight
    (1 - engagement_score/100) * 0.3        // 30% weight
)

// Risk Level Classification
if (risk_score >= 0.7) risk_level = "high"
else if (risk_score >= 0.4) risk_level = "medium"  
else risk_level = "low"
```

### 5. Time-based Calculations
```javascript
// Days Since Last Activity
days_since_last_active = Math.floor((NOW() - last_active_timestamp) / (24 * 60 * 60 * 1000))

// Average Session Duration (minutes)
avg_session_duration = SUM(session_end - session_start) / COUNT(sessions) / 60

// Study Streak
study_streak = consecutive_days_with_activity
```

### 6. Statistical Calculations
```javascript
// Standard Deviation
std_dev = Math.sqrt(Σ(x_i - mean)² / (n - 1))

// Percentile Rank
percentile_rank = (number_of_scores_below / total_scores) * 100

// Z-Score (how many standard deviations from mean)
z_score = (individual_score - mean) / standard_deviation
```

---

## 🎯 Implementation Guidelines

### Backend Requirements:
1. **No Hardcoded Values** - All metrics calculated from actual data
2. **Real-time Calculations** - Compute on request or cache with TTL
3. **Efficient Queries** - Use database aggregation functions
4. **Consistent Formulas** - Same calculation logic across all endpoints
5. **Precision Control** - Round to appropriate decimal places

### Frontend Requirements:
1. **Display Calculated Values** - Show the computed results
2. **Show Calculation Details** - Allow users to see how values are derived
3. **Real-time Updates** - Refresh calculations when data changes
4. **Error Handling** - Handle division by zero and edge cases
5. **Loading States** - Show calculation in progress

### Database Design:
1. **Audit Trail** - Track all data changes for accurate calculations
2. **Timestamps** - Precise timing for time-based calculations
3. **Normalized Data** - Avoid redundant calculated fields in storage
4. **Indexes** - Optimize for aggregation queries
5. **Data Integrity** - Ensure consistent data for accurate calculations

This specification ensures that ALL values in the educator portal are mathematically calculated from real data, not hardcoded numbers.
