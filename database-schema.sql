-- AgenticLearn Database Schema for Complete Real Data
-- This schema will replace all hardcode data with real database entries

-- ===== CORE TABLES (Already exist) =====
-- educators table (existing)
-- students table (existing) 
-- assessments table (existing)

-- ===== NEW TABLES FOR COMPLETE REAL DATA =====

-- Advanced Analytics Tables
CREATE TABLE learning_analytics (
    id VARCHAR(50) PRIMARY KEY,
    educator_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50),
    total_learning_time INT DEFAULT 0,
    average_session_duration INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    retention_rate DECIMAL(5,2) DEFAULT 0,
    learning_velocity DECIMAL(5,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES educators(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE concept_mastery (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    concept_name VARCHAR(100) NOT NULL,
    mastery_percentage DECIMAL(5,2) DEFAULT 0,
    last_practiced TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE engagement_analytics (
    id VARCHAR(50) PRIMARY KEY,
    educator_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    overall_engagement DECIMAL(5,2) DEFAULT 0,
    daily_active_users INT DEFAULT 0,
    weekly_active_users INT DEFAULT 0,
    monthly_active_users INT DEFAULT 0,
    session_frequency DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

CREATE TABLE content_interaction (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    content_type ENUM('videos', 'quizzes', 'assignments', 'discussions', 'resources') NOT NULL,
    interaction_score DECIMAL(5,2) DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Communication Tables
CREATE TABLE student_messages (
    id VARCHAR(50) PRIMARY KEY,
    from_student_id VARCHAR(50) NOT NULL,
    to_educator_id VARCHAR(50) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_student_id) REFERENCES students(id),
    FOREIGN KEY (to_educator_id) REFERENCES educators(id)
);

CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    educator_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('reminder', 'announcement', 'alert', 'info') DEFAULT 'info',
    recipients ENUM('all', 'specific', 'group') DEFAULT 'all',
    scheduled_at TIMESTAMP,
    status ENUM('draft', 'scheduled', 'sent') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

CREATE TABLE discussion_forums (
    id VARCHAR(50) PRIMARY KEY,
    educator_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    posts_count INT DEFAULT 0,
    participants_count INT DEFAULT 0,
    last_activity TIMESTAMP,
    status ENUM('active', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

CREATE TABLE video_sessions (
    id VARCHAR(50) PRIMARY KEY,
    educator_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 60,
    participants_count INT DEFAULT 0,
    max_participants INT DEFAULT 50,
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    type ENUM('office-hours', 'workshop', 'meeting', 'lecture') DEFAULT 'meeting',
    meeting_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

-- Content Management Tables
CREATE TABLE content_library (
    id VARCHAR(50) PRIMARY KEY,
    educator_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    type ENUM('video', 'document', 'interactive', 'audio', 'image') NOT NULL,
    duration_minutes INT,
    file_size_mb DECIMAL(10,2),
    file_format VARCHAR(20),
    file_url VARCHAR(500),
    views_count INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

CREATE TABLE content_tags (
    id VARCHAR(50) PRIMARY KEY,
    content_id VARCHAR(50) NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content_library(id) ON DELETE CASCADE
);

CREATE TABLE resources (
    id VARCHAR(50) PRIMARY KEY,
    educator_id VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    type ENUM('book', 'reference', 'data', 'tool', 'link') NOT NULL,
    url VARCHAR(500),
    description TEXT,
    category VARCHAR(100),
    access_level ENUM('all', 'students', 'educators') DEFAULT 'all',
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

CREATE TABLE curriculum_maps (
    id VARCHAR(50) PRIMARY KEY,
    educator_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    total_lessons INT DEFAULT 0,
    total_duration_minutes INT DEFAULT 0,
    overall_completion DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

CREATE TABLE curriculum_modules (
    id VARCHAR(50) PRIMARY KEY,
    curriculum_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    lessons_count INT DEFAULT 0,
    duration_minutes INT DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (curriculum_id) REFERENCES curriculum_maps(id) ON DELETE CASCADE
);

-- AI Insights Tables
CREATE TABLE ai_insights (
    id VARCHAR(50) PRIMARY KEY,
    educator_id VARCHAR(50) NOT NULL,
    insight_type ENUM('learning_pattern', 'at_risk_student', 'content_effectiveness', 'recommendation') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    confidence_score DECIMAL(5,2) DEFAULT 0,
    action_required BOOLEAN DEFAULT FALSE,
    status ENUM('new', 'reviewed', 'acted_upon', 'dismissed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

CREATE TABLE student_performance_alerts (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    educator_id VARCHAR(50) NOT NULL,
    alert_type ENUM('at-risk', 'low-performance', 'inactive', 'improvement', 'achievement') NOT NULL,
    message TEXT NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('new', 'acknowledged', 'resolved') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

-- System Health Tables
CREATE TABLE system_health (
    id VARCHAR(50) PRIMARY KEY,
    component_name VARCHAR(100) NOT NULL,
    status ENUM('healthy', 'warning', 'error', 'maintenance') DEFAULT 'healthy',
    uptime_percentage DECIMAL(5,2) DEFAULT 100.0,
    last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_time_ms INT DEFAULT 0,
    error_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Timeline Tables
CREATE TABLE activity_timeline (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    educator_id VARCHAR(50) NOT NULL,
    activity_type ENUM('completion', 'start', 'submission', 'login', 'achievement') NOT NULL,
    description TEXT NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (educator_id) REFERENCES educators(id)
);

-- Indexes for Performance
CREATE INDEX idx_learning_analytics_educator ON learning_analytics(educator_id);
CREATE INDEX idx_learning_analytics_student ON learning_analytics(student_id);
CREATE INDEX idx_student_messages_educator ON student_messages(to_educator_id);
CREATE INDEX idx_student_messages_status ON student_messages(status);
CREATE INDEX idx_content_library_educator ON content_library(educator_id);
CREATE INDEX idx_content_library_status ON content_library(status);
CREATE INDEX idx_activity_timeline_educator ON activity_timeline(educator_id);
CREATE INDEX idx_activity_timeline_created ON activity_timeline(created_at);
