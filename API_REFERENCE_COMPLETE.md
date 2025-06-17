# 📚 AgenticLearn API Reference - Complete Documentation

## 🌐 **Base Configuration**

### **Base URL**
```
https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid
```

### **Authentication**
```javascript
headers: {
  'Authorization': 'Bearer YOUR_PASETO_TOKEN',
  'Content-Type': 'application/json'
}

// Test Phone Number: 082119000486
```

### **Standard Response Format**
```javascript
{
  "success": true,
  "data": { /* response data */ },
  "source": "database", // or "fallback"
  "total": 10, // for list endpoints
  "message": "Success message"
}
```

---

## 📊 **ANALYTICS & DASHBOARD**

### **Dashboard Analytics**
```http
GET /api/agenticlearn/educator/dashboard/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_students": 3,
      "active_students": 3,
      "average_progress": 89.1,
      "average_engagement": 15.56,
      "average_score": 85.0
    },
    "course_statistics": {
      "total_courses": 3,
      "active_courses": 2,
      "draft_courses": 1
    },
    "students_summary": [
      {
        "student_id": "student_001",
        "name": "Ahmad Mahasiswa",
        "progress_percentage": 75.0,
        "engagement_score": 15.56,
        "average_score": 85.0,
        "risk_level": "Low"
      }
    ]
  },
  "source": "database"
}
```

### **Students List**
```http
GET /api/agenticlearn/educator/students/list
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "student_id": "student_001",
      "name": "Ahmad Mahasiswa",
      "progress_percentage": 75.0,
      "completed_lessons": 15,
      "total_lessons": 20,
      "average_score": 85.0,
      "engagement_score": 15.56,
      "total_time_minutes": 615,
      "risk_level": "Low",
      "status": "active"
    }
  ],
  "total": 3,
  "source": "database"
}
```

### **Student Detail**
```http
GET /api/agenticlearn/educator/students/detail?student_id=student_001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "student_info": {
      "student_id": "student_001",
      "name": "Ahmad Mahasiswa",
      "progress_percentage": 75.0,
      "risk_level": "Low"
    },
    "performance_analytics": {
      "average_score": 85.0,
      "total_assessments": 3,
      "completion_rate": 75.0
    },
    "learning_patterns": {
      "total_time_minutes": 615,
      "avg_session_minutes": 41,
      "most_active_hour": "18:00-19:00"
    }
  },
  "source": "database"
}
```

---

## 🤖 **AI SYSTEM**

### **AI Insights**
```http
GET /api/agenticlearn/educator/ai/insights
```

**Response:**
```json
{
  "success": true,
  "data": {
    "learning_patterns": {
      "peak_learning_hours": ["10:00-11:00", "18:00-19:00", "08:00-09:00"],
      "most_effective_content_type": "interactive_videos",
      "average_attention_span": "38 minutes",
      "completion_rate": 88.68
    },
    "student_predictions": [
      {
        "student_id": "student_001",
        "student_name": "Ahmad Mahasiswa",
        "predicted_completion_date": "2025-06-29",
        "success_probability": 62.3,
        "recommended_interventions": ["additional_practice", "peer_collaboration"]
      }
    ],
    "course_optimization": {
      "suggested_content_adjustments": ["Add more visual examples to lesson_016"],
      "engagement_bottlenecks": ["lesson_016", "lesson_019"],
      "optimization_priority": "medium"
    },
    "predictive_analytics": {
      "at_risk_students_next_week": 1,
      "expected_completion_rate": 75.74,
      "optimal_class_size": 15
    }
  },
  "source": "ai_model",
  "data_source": "real_database_analysis"
}
```

### **AI Recommendations**
```http
GET /api/agenticlearn/educator/ai/recommendations
```

**Response:**
```json
{
  "success": true,
  "data": {
    "teaching_strategies": [
      {
        "strategy": "Interactive Content Integration",
        "description": "Add more interactive elements like quizzes and hands-on exercises",
        "effectiveness_score": 82.1,
        "applicable_lessons": ["lesson_005", "lesson_012", "lesson_016"],
        "expected_improvement": "20% higher engagement",
        "implementation_time": "1 week"
      }
    ],
    "intervention_suggestions": [
      {
        "intervention_type": "maintenance",
        "description": "Continue current approach - students are performing well",
        "urgency": "low",
        "timeline": "Ongoing monitoring"
      }
    ],
    "class_performance_summary": {
      "average_progress": 89.1,
      "average_engagement": 15.56,
      "students_at_risk": 0,
      "total_students": 3
    },
    "recommendation_confidence": 88.5
  },
  "source": "ai_model"
}
```

### **Learning Patterns**
```http
GET /api/agenticlearn/educator/ai/learning-patterns
```

**Response:**
```json
{
  "success": true,
  "data": {
    "peak_learning_hours": ["10:00-11:00", "18:00-19:00", "08:00-09:00"],
    "most_effective_content_type": "interactive_videos",
    "average_attention_span": "38 minutes",
    "preferred_difficulty_progression": "gradual",
    "completion_rate": 88.68,
    "analysis_timestamp": "2025-06-17T13:51:56.917546465Z"
  },
  "source": "ml_analysis"
}
```

---

## 💬 **COMMUNICATION**

### **Messages List**
```http
GET /api/agenticlearn/educator/communication/messages/list
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "message_id": "msg_001",
      "conversation_id": "conv_001",
      "from_id": "educator_001",
      "from_name": "Dr. Sarah Johnson",
      "to_id": "student_001",
      "to_name": "Ahmad Mahasiswa",
      "subject": "Great Progress!",
      "content": "I noticed you've completed 75% of the Digital Literacy course. Keep up the excellent work!",
      "timestamp": "2025-06-17T11:51:56Z",
      "status": "sent",
      "read": true,
      "message_type": "encouragement"
    }
  ],
  "total": 5,
  "source": "database"
}
```

### **Send Message**
```http
POST /api/agenticlearn/educator/communication/messages/send
```

**Request Body:**
```json
{
  "conversation_id": "conv_001",
  "from_id": "educator_001",
  "from_name": "Dr. Sarah Johnson",
  "to_id": "student_001",
  "to_name": "Ahmad Mahasiswa",
  "subject": "Assignment Feedback",
  "content": "Great work on your recent submission!",
  "message_type": "feedback"
}
```

**Response:**
```json
{
  "success": true,
  "message_id": "msg_1734442316",
  "message": "Message sent successfully",
  "source": "database"
}
```

### **Announcements List**
```http
GET /api/agenticlearn/educator/communication/announcements/list
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "announcement_id": "ann_004",
      "title": "Congratulations to Top Performers",
      "content": "Congratulations to Budi Santoso for completing the Digital Literacy course with 92% average score!",
      "course_id": "course_001",
      "priority": "normal",
      "created_at": "2025-06-17T10:51:56Z",
      "expires_at": "2025-06-22T10:51:56Z",
      "read_count": 3,
      "total_recipients": 3,
      "read_percentage": 100.0,
      "status": "active",
      "audience": "all"
    }
  ],
  "total": 4,
  "source": "database"
}
```

### **Create Announcement**
```http
POST /api/agenticlearn/educator/communication/announcements/create
```

**Request Body:**
```json
{
  "title": "New Assignment Available",
  "content": "A new programming assignment has been posted. Due date: Friday.",
  "course_id": "course_002",
  "priority": "medium",
  "audience": "all",
  "expires_at": "2025-06-25T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "announcement_id": "ann_1734442316",
  "message": "Announcement created successfully",
  "source": "database"
}
```

### **Notifications**
```http
GET /api/agenticlearn/educator/communication/notifications
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "notification_id": "685162a2a71f49aa050a227d",
      "type": "assessment_submitted",
      "title": "New Assessment Submission",
      "message": "Siti Nurhaliza has submitted Programming Basics Quiz",
      "read": false,
      "created_at": "2025-06-17T13:51:56Z",
      "priority": "high",
      "action_url": "/assessments/assessment_002"
    }
  ],
  "total": 4,
  "unread": 4,
  "source": "database"
}
```

---

## 📝 **ASSESSMENT MANAGEMENT**

### **Assessment List**
```http
GET /api/agenticlearn/educator/assessment/list
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "assessment_id": "assessment_001",
      "title": "Digital Literacy Assessment",
      "course_id": "course_001",
      "total_questions": 20,
      "total_points": 100,
      "duration_minutes": 60,
      "submissions_count": 3,
      "average_score": 82.33,
      "completion_rate": 100.0,
      "status": "active",
      "created_at": "2025-06-10T10:00:00Z",
      "due_date": "2025-06-20T23:59:59Z"
    }
  ],
  "total": 3,
  "source": "database"
}
```

### **Assessment Detail**
```http
GET /api/agenticlearn/educator/assessment/detail?assessment_id=assessment_001
```

### **Create Assessment**
```http
POST /api/agenticlearn/educator/assessment/create
```

### **Update Assessment**
```http
PUT /api/agenticlearn/educator/assessment/update
```

### **Delete Assessment**
```http
DELETE /api/agenticlearn/educator/assessment/delete?assessment_id=assessment_001
```

### **Assessment Results**
```http
GET /api/agenticlearn/educator/assessment/results?assessment_id=assessment_001
```

### **Grade Submission**
```http
POST /api/agenticlearn/educator/assessment/grade
```

---

## 🔄 **WORKFLOW AUTOMATION**

### **Workflow List**
```http
GET /api/agenticlearn/educator/workflow/list
```

### **Create Workflow**
```http
POST /api/agenticlearn/educator/workflow/create
```

### **Execute Workflow**
```http
POST /api/agenticlearn/educator/workflow/execute
```

---

## 📊 **ADVANCED ANALYTICS**

### **Advanced Analytics**
```http
GET /api/agenticlearn/educator/analytics/advanced
```

### **Learning Analytics**
```http
GET /api/agenticlearn/educator/analytics/learning
```

---

## 💾 **DATA MANAGEMENT**

### **Data Export**
```http
GET /api/agenticlearn/educator/data/export?type=students&format=json
```

**Available Types:** `students`, `assessments`, `messages`, `analytics`
**Available Formats:** `json`, `csv`, `excel`, `pdf`

### **Data Population (Testing)**
```http
POST /api/agenticlearn/educator/data/populate
```

---

## 🔧 **ERROR HANDLING**

### **Standard Error Response**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### **Common Error Codes**
- `METHOD_NOT_ALLOWED` - Wrong HTTP method
- `BAD_REQUEST` - Invalid request data
- `NOT_FOUND` - Resource not found
- `INTERNAL_ERROR` - Server error
- `UNAUTHORIZED` - Invalid or expired token

---

## 🎯 **QUICK START GUIDE**

### **1. Authentication**
```javascript
const token = 'YOUR_PASETO_TOKEN';
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### **2. Fetch Dashboard Data**
```javascript
const response = await fetch('/api/agenticlearn/educator/dashboard/analytics', { headers });
const data = await response.json();
```

### **3. Send Message**
```javascript
const messageData = {
  to_id: 'student_001',
  subject: 'Hello',
  content: 'How are you doing?'
};

const response = await fetch('/api/agenticlearn/educator/communication/messages/send', {
  method: 'POST',
  headers,
  body: JSON.stringify(messageData)
});
```

### **4. Create Assessment**
```javascript
const assessmentData = {
  title: 'New Quiz',
  total_questions: 10,
  duration_minutes: 30
};

const response = await fetch('/api/agenticlearn/educator/assessment/create', {
  method: 'POST',
  headers,
  body: JSON.stringify(assessmentData)
});
```

---

## 🚀 **All 25+ Endpoints Ready for Integration!**

**AgenticLearn Backend is 100% complete and production-ready!** ✨
