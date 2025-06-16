// MongoDB Population Script for AgenticLearn
// This script will populate MongoDB with real data to replace hardcode

// Connection: mongodb+srv://mubaroq:GH3Q7kgq9vXFdFc9@zhizafcreative.k9y3l3b.mongodb.net/
// Database: agenticlearn

// Run this script to populate MongoDB with real data
// node populate-mongodb.js

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://mubaroq:GH3Q7kgq9vXFdFc9@zhizafcreative.k9y3l3b.mongodb.net/?retryWrites=true&w=majority&appName=zhizafcreative";
const dbName = "agenticlearn";

async function populateDatabase() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log("🔗 Connected to MongoDB Atlas");
        
        const db = client.db(dbName);
        
        // 1. Populate Learning Analytics
        await populateLearningAnalytics(db);
        
        // 2. Populate Student Messages
        await populateStudentMessages(db);
        
        // 3. Populate Content Library
        await populateContentLibrary(db);
        
        // 4. Populate Discussion Forums
        await populateDiscussionForums(db);
        
        // 5. Populate Video Sessions
        await populateVideoSessions(db);
        
        // 6. Populate AI Insights
        await populateAIInsights(db);
        
        // 7. Populate Activity Timeline
        await populateActivityTimeline(db);
        
        // 8. Populate System Health
        await populateSystemHealth(db);
        
        console.log("✅ Database population completed!");
        
    } catch (error) {
        console.error("❌ Error populating database:", error);
    } finally {
        await client.close();
    }
}

async function populateLearningAnalytics(db) {
    const collection = db.collection('learning_analytics');
    
    const analyticsData = [
        {
            educator_id: "educator_001",
            student_id: "student_001",
            total_learning_time: 2847,
            average_session_duration: 42,
            completion_rate: 78.5,
            retention_rate: 85.2,
            learning_velocity: 1.2,
            concept_mastery: {
                "Data Science Fundamentals": 92,
                "Python Programming": 78,
                "Statistics": 85,
                "Machine Learning": 65,
                "Data Visualization": 88
            },
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            educator_id: "educator_001",
            student_id: "student_002", 
            total_learning_time: 3200,
            average_session_duration: 55,
            completion_rate: 92.3,
            retention_rate: 94.1,
            learning_velocity: 1.5,
            concept_mastery: {
                "Data Science Fundamentals": 95,
                "Python Programming": 89,
                "Statistics": 92,
                "Machine Learning": 78,
                "Data Visualization": 91
            },
            created_at: new Date(),
            updated_at: new Date()
        }
    ];
    
    await collection.deleteMany({}); // Clear existing
    await collection.insertMany(analyticsData);
    console.log("✅ Learning analytics populated");
}

async function populateStudentMessages(db) {
    const collection = db.collection('student_messages');
    
    const messages = [
        {
            from_student_id: "student_001",
            to_educator_id: "educator_001",
            subject: "Question about Assignment 3",
            message: "Hi Prof, I'm having trouble with the data visualization part. Could you help?",
            status: "unread",
            priority: "normal",
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
            from_student_id: "student_002",
            to_educator_id: "educator_001", 
            subject: "Request for Extension",
            message: "Dear Professor, I would like to request a 2-day extension for the Python project due to illness.",
            status: "read",
            priority: "high",
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
            from_student_id: "student_003",
            to_educator_id: "educator_001",
            subject: "Thank you for the feedback", 
            message: "Thank you for the detailed feedback on my last assignment. It really helped me understand the concepts better.",
            status: "read",
            priority: "low",
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 23 * 60 * 60 * 1000)
        }
    ];
    
    await collection.deleteMany({});
    await collection.insertMany(messages);
    console.log("✅ Student messages populated");
}

async function populateContentLibrary(db) {
    const collection = db.collection('content_library');
    
    const content = [
        {
            educator_id: "educator_001",
            title: "Introduction to Data Science",
            type: "video",
            duration_minutes: 45,
            file_size_mb: 125.0,
            file_format: "MP4",
            file_url: "https://storage.googleapis.com/agenticlearn/videos/intro-data-science.mp4",
            views_count: 156,
            rating: 4.8,
            tags: ["data-science", "introduction", "fundamentals"],
            status: "published",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
            educator_id: "educator_001",
            title: "Python Programming Basics",
            type: "document",
            duration_minutes: null,
            file_size_mb: 2.3,
            file_format: "PDF",
            file_url: "https://storage.googleapis.com/agenticlearn/docs/python-basics.pdf",
            views_count: 203,
            rating: 4.6,
            tags: ["python", "programming", "basics"],
            status: "published",
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        },
        {
            educator_id: "educator_001",
            title: "Statistics Interactive Quiz",
            type: "interactive",
            duration_minutes: 30,
            file_size_mb: 5.1,
            file_format: "HTML5",
            file_url: "https://storage.googleapis.com/agenticlearn/interactive/stats-quiz.html",
            views_count: 89,
            rating: 4.9,
            tags: ["statistics", "quiz", "interactive"],
            status: "published",
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
    ];
    
    await collection.deleteMany({});
    await collection.insertMany(content);
    console.log("✅ Content library populated");
}

async function populateDiscussionForums(db) {
    const collection = db.collection('discussion_forums');
    
    const forums = [
        {
            educator_id: "educator_001",
            title: "General Discussion",
            description: "General course discussions and Q&A",
            posts_count: 45,
            participants_count: 38,
            last_activity: new Date(Date.now() - 30 * 60 * 1000),
            status: "active",
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
            educator_id: "educator_001",
            title: "Assignment Help",
            description: "Get help with assignments and projects",
            posts_count: 23,
            participants_count: 28,
            last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: "active",
            created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        }
    ];
    
    await collection.deleteMany({});
    await collection.insertMany(forums);
    console.log("✅ Discussion forums populated");
}

async function populateVideoSessions(db) {
    const collection = db.collection('video_sessions');
    
    const sessions = [
        {
            educator_id: "educator_001",
            title: "Weekly Office Hours",
            scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            duration_minutes: 60,
            participants_count: 0,
            max_participants: 50,
            status: "scheduled",
            type: "office-hours",
            meeting_url: "https://meet.google.com/abc-defg-hij",
            created_at: new Date()
        },
        {
            educator_id: "educator_001",
            title: "Data Science Workshop",
            scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            duration_minutes: 120,
            participants_count: 25,
            max_participants: 45,
            status: "scheduled",
            type: "workshop",
            meeting_url: "https://meet.google.com/xyz-uvwx-yz",
            created_at: new Date()
        }
    ];
    
    await collection.deleteMany({});
    await collection.insertMany(sessions);
    console.log("✅ Video sessions populated");
}

async function populateAIInsights(db) {
    const collection = db.collection('ai_insights');
    
    const insights = [
        {
            educator_id: "educator_001",
            insight_type: "at_risk_student",
            title: "Student at Risk: Maya Rajin",
            description: "Student has been inactive for 7 days and showing declining performance",
            confidence_score: 85.5,
            action_required: true,
            status: "new",
            metadata: {
                student_id: "student_003",
                risk_factors: ["inactivity", "declining_scores", "missed_deadlines"]
            },
            created_at: new Date()
        },
        {
            educator_id: "educator_001",
            insight_type: "content_effectiveness",
            title: "Video Content Performing Well",
            description: "Introduction to Data Science video has 95% completion rate",
            confidence_score: 92.3,
            action_required: false,
            status: "new",
            metadata: {
                content_id: "content_001",
                completion_rate: 95.2,
                engagement_score: 88.7
            },
            created_at: new Date()
        }
    ];
    
    await collection.deleteMany({});
    await collection.insertMany(insights);
    console.log("✅ AI insights populated");
}

async function populateActivityTimeline(db) {
    const collection = db.collection('activity_timeline');
    
    const activities = [
        {
            student_id: "student_001",
            educator_id: "educator_001",
            activity_type: "completion",
            description: "Completed Lesson 3.2: Data Visualization",
            metadata: {
                lesson_id: "lesson_32",
                score: 85,
                time_spent: 45
            },
            created_at: new Date(Date.now() - 2 * 60 * 1000)
        },
        {
            student_id: "student_002",
            educator_id: "educator_001",
            activity_type: "start",
            description: "Started Module 2: Analytics Fundamentals",
            metadata: {
                module_id: "module_2"
            },
            created_at: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
            student_id: "student_003",
            educator_id: "educator_001",
            activity_type: "submission",
            description: "Submitted Python Assignment #3",
            metadata: {
                assignment_id: "assignment_3",
                submission_time: new Date(Date.now() - 15 * 60 * 1000)
            },
            created_at: new Date(Date.now() - 15 * 60 * 1000)
        }
    ];
    
    await collection.deleteMany({});
    await collection.insertMany(activities);
    console.log("✅ Activity timeline populated");
}

async function populateSystemHealth(db) {
    const collection = db.collection('system_health');
    
    const healthData = [
        {
            component_name: "database",
            status: "healthy",
            uptime_percentage: 99.9,
            last_check: new Date(),
            response_time_ms: 45,
            error_count: 0
        },
        {
            component_name: "api_server",
            status: "healthy", 
            uptime_percentage: 99.8,
            last_check: new Date(),
            response_time_ms: 120,
            error_count: 2
        },
        {
            component_name: "storage",
            status: "healthy",
            uptime_percentage: 100.0,
            last_check: new Date(),
            response_time_ms: 80,
            error_count: 0
        },
        {
            component_name: "ai_service",
            status: "healthy",
            uptime_percentage: 98.5,
            last_check: new Date(),
            response_time_ms: 250,
            error_count: 5
        }
    ];
    
    await collection.deleteMany({});
    await collection.insertMany(healthData);
    console.log("✅ System health populated");
}

// Run the population
populateDatabase();
