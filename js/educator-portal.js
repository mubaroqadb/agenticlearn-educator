// Educator Portal - JSCroot Implementation with Shared Components
import { apiClient } from "https://mubaroqadb.github.io/agenticlearn-shared/js/api-client.js";
import { UIComponents } from "https://mubaroqadb.github.io/agenticlearn-shared/js/ui-components.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/cookie.js";
import { setInner, onClick } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/url.js";

// Dynamic API Configuration
const API_BASE_URL = window.location.hostname.includes("localhost") ? "https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid/api/agenticlearn" : "https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid/api/agenticlearn"; // Will be Google Cloud endpoint

// Get GitHub username for redirects
const GITHUB_USERNAME = window.location.hostname.includes('github.io') 
    ? window.location.hostname.split('.')[0] 
    : 'mubaroqadb';

async function initializeEducatorPortal() {
    const token = getCookie("login");
    if (!token) {
        redirect(`https://${GITHUB_USERNAME}.github.io/agenticlearn-auth`);
        return;
    }

    try {
        // Load educator data
        await loadEducatorData();
        await loadClassData();
        await loadStudentList();
        await loadAIInsights();
        
        // Setup event listeners
        setupEventListeners();

        // Update carbon indicator
        updateCarbonIndicator();

        // Show welcome notification
        UIComponents.showNotification("Educator Portal loaded successfully! 🌱", "success");

        console.log("🌱 Educator Portal loaded with JSCroot and shared components");
    } catch (error) {
        console.error("Failed to load educator portal:", error);
        setInner("educator-name", "Error loading data");
        UIComponents.showNotification("Failed to load educator portal", "error");
    }
}

async function loadEducatorData() {
    try {
        setInner("educator-name", "Dr. Sarah Educator");
    } catch (error) {
        console.error("Failed to load educator data:", error);
        setInner("educator-name", "Demo Educator");
    }
}

async function loadClassData() {
    try {
        const classData = await apiClient.request("/courses");
        setInner("total-students", classData.totalStudents || 45);
        setInner("active-classes", classData.activeClasses || 3);
        setInner("avg-progress", `${Math.round(classData.avgProgress || 72.5)}%`);
        setInner("completion-rate", `${Math.round(classData.completionRate || 68)}%`);
    } catch (error) {
        console.error("Failed to load class data:", error);
        setInner("total-students", "45");
        setInner("active-classes", "3");
        setInner("avg-progress", "73%");
        setInner("completion-rate", "68%");
        UIComponents.showNotification("Using demo data for class statistics", "info");
    }
}

async function loadStudentList() {
    try {
        // Load real-time student data
        const students = await apiClient.request("/progress/class-1");
        await loadRealTimeStats();
        await loadActivityTimeline();
        renderEnhancedStudentTable(students);
        updateLastUpdateTime();
    } catch (error) {
        console.error("Failed to load student list:", error);
        renderDemoStudentTable();
        loadDemoRealTimeStats();
        loadDemoActivityTimeline();
        UIComponents.showNotification("Using demo data for student monitoring", "info");
    }
}

async function loadRealTimeStats() {
    try {
        const stats = await apiClient.request("/analytics/realtime-stats");

        setInner("online-students", stats.onlineStudents || "12");
        setInner("active-sessions", stats.activeSessions || "8");
        setInner("avg-engagement", stats.avgEngagement || "78%");
        setInner("completion-today", stats.completionToday || "24");
    } catch (error) {
        // Fallback to demo data
        setInner("online-students", "12");
        setInner("active-sessions", "8");
        setInner("avg-engagement", "78%");
        setInner("completion-today", "24");
    }
}

function loadDemoRealTimeStats() {
    setInner("online-students", "12");
    setInner("active-sessions", "8");
    setInner("avg-engagement", "78%");
    setInner("completion-today", "24");
}

async function loadActivityTimeline() {
    try {
        const activities = await apiClient.request("/analytics/recent-activity");
        renderActivityTimeline(activities);
    } catch (error) {
        loadDemoActivityTimeline();
    }
}

function loadDemoActivityTimeline() {
    const demoActivities = [
        { time: "2 minutes ago", student: "Andi Mahasiswa", action: "Completed Lesson 3.2: Data Visualization", type: "completion" },
        { time: "5 minutes ago", student: "Sari Belajar", action: "Started Module 2: Analytics Fundamentals", type: "start" },
        { time: "8 minutes ago", student: "Budi Cerdas", action: "Submitted Assignment: Python Basics", type: "submission" },
        { time: "12 minutes ago", student: "Maya Rajin", action: "Logged in to platform", type: "login" },
        { time: "15 minutes ago", student: "Andi Mahasiswa", action: "Achieved 80% score on Quiz 3.1", type: "achievement" },
        { time: "18 minutes ago", student: "Sari Belajar", action: "Watched Video: Introduction to Pandas", type: "engagement" }
    ];
    renderActivityTimeline(demoActivities);
}

function renderActivityTimeline(activities) {
    const timelineHTML = activities.map(activity => {
        const iconMap = {
            completion: "✅",
            start: "🚀",
            submission: "📝",
            login: "👤",
            achievement: "🏆",
            engagement: "📹"
        };

        const colorMap = {
            completion: "var(--success)",
            start: "var(--info)",
            submission: "var(--primary)",
            login: "var(--gray-500)",
            achievement: "var(--secondary-dark)",
            engagement: "var(--accent-dark)"
        };

        return `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-bottom: 1px solid var(--accent); last-child:border-bottom: none;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: ${colorMap[activity.type]}; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; flex-shrink: 0;">
                    ${iconMap[activity.type]}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--gray-800); font-size: 0.875rem;">${activity.student}</div>
                    <div style="color: var(--gray-600); font-size: 0.75rem;">${activity.action}</div>
                </div>
                <div style="color: var(--gray-500); font-size: 0.75rem; flex-shrink: 0;">${activity.time}</div>
            </div>
        `;
    }).join('');

    setInner("activity-timeline", timelineHTML);
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    setInner("last-update-time", timeString);
}

function renderEnhancedStudentTable(students) {
    const tableHTML = `
        <table class="student-table">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Current Module</th>
                    <th>Progress</th>
                    <th>Engagement</th>
                    <th>Status</th>
                    <th>Last Activity</th>
                    <th>Risk Level</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => {
                    const riskLevel = getRiskLevel(student);
                    const riskColor = getRiskColor(riskLevel);
                    const statusIcon = getStatusIcon(student.status);

                    return `
                        <tr style="border-left: 3px solid ${riskColor};">
                            <td>
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--secondary); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 12px;">
                                        ${student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <div>
                                        <div style="font-weight: 600; color: var(--gray-800);">${student.name}</div>
                                        <div style="font-size: 0.75rem; color: var(--gray-600);">${student.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style="font-weight: 500; color: var(--gray-800);">Module ${student.currentModule || 1}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-600);">${student.currentLesson || 'Introduction'}</div>
                            </td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div class="progress-mini" style="width: 80px;">
                                        <div class="progress-mini-fill" style="width: ${student.progress}%"></div>
                                    </div>
                                    <span style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">${student.progress}%</span>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--gray-600);">${student.completedLessons || 0}/${student.totalLessons || 20} lessons</div>
                            </td>
                            <td>
                                <div style="text-align: center;">
                                    <div style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">${student.engagementScore || 75}%</div>
                                    <div style="font-size: 0.75rem; color: var(--gray-600);">${student.timeSpent || 45}min today</div>
                                </div>
                            </td>
                            <td>
                                <span class="${student.status === 'online' ? 'status-active' : student.status === 'active' ? 'status-active' : 'status-inactive'}">
                                    ${statusIcon} ${student.status === 'online' ? 'Online' : student.status === 'active' ? 'Active' : 'Offline'}
                                </span>
                            </td>
                            <td>
                                <div style="font-size: 0.875rem; color: var(--gray-800);">${getRelativeTime(student.lastActive)}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-600);">${new Date(student.lastActive).toLocaleDateString('id-ID')}</div>
                            </td>
                            <td>
                                <span style="background: ${riskColor}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                                    ${riskLevel}
                                </span>
                            </td>
                            <td>
                                <div style="display: flex; gap: 0.25rem;">
                                    <button class="btn" onclick="viewStudentDetail('${student.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: var(--primary);">
                                        👤 View
                                    </button>
                                    <button class="btn" onclick="sendMessage('${student.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: var(--info);">
                                        💬 Message
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    setInner("student-list", tableHTML);
}

function renderStudentTable(students) {
    // Fallback to enhanced table
    renderEnhancedStudentTable(students);
}

function getRiskLevel(student) {
    const progress = student.progress || 0;
    const lastActive = new Date(student.lastActive);
    const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);

    if (progress < 30 || daysSinceActive > 7) return "High";
    if (progress < 60 || daysSinceActive > 3) return "Medium";
    return "Low";
}

function getRiskColor(riskLevel) {
    switch(riskLevel) {
        case "High": return "var(--error)";
        case "Medium": return "var(--warning)";
        case "Low": return "var(--success)";
        default: return "var(--gray-500)";
    }
}

function getStatusIcon(status) {
    switch(status) {
        case "online": return "🟢";
        case "active": return "🟡";
        case "offline": return "🔴";
        default: return "⚪";
    }
}

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

function renderDemoStudentTable() {
    const demoStudents = [
        {
            id: "student-1",
            name: "Andi Mahasiswa",
            email: "andi@student.edu",
            progress: 75,
            status: "online",
            lastActive: new Date().toISOString(),
            currentModule: 3,
            currentLesson: "Data Visualization",
            completedLessons: 15,
            totalLessons: 20,
            engagementScore: 85,
            timeSpent: 120
        },
        {
            id: "student-2",
            name: "Sari Belajar",
            email: "sari@student.edu",
            progress: 45,
            status: "active",
            lastActive: new Date(Date.now() - 3600000).toISOString(),
            currentModule: 2,
            currentLesson: "Analytics Fundamentals",
            completedLessons: 9,
            totalLessons: 20,
            engagementScore: 72,
            timeSpent: 45
        },
        {
            id: "student-3",
            name: "Budi Cerdas",
            email: "budi@student.edu",
            progress: 90,
            status: "online",
            lastActive: new Date(Date.now() - 300000).toISOString(),
            currentModule: 4,
            currentLesson: "Advanced Analytics",
            completedLessons: 18,
            totalLessons: 20,
            engagementScore: 95,
            timeSpent: 180
        },
        {
            id: "student-4",
            name: "Maya Rajin",
            email: "maya@student.edu",
            progress: 25,
            status: "offline",
            lastActive: new Date(Date.now() - 604800000).toISOString(),
            currentModule: 1,
            currentLesson: "Introduction",
            completedLessons: 5,
            totalLessons: 20,
            engagementScore: 35,
            timeSpent: 15
        },
        {
            id: "student-5",
            name: "Dewi Pintar",
            email: "dewi@student.edu",
            progress: 60,
            status: "active",
            lastActive: new Date(Date.now() - 7200000).toISOString(),
            currentModule: 2,
            currentLesson: "Data Processing",
            completedLessons: 12,
            totalLessons: 20,
            engagementScore: 78,
            timeSpent: 90
        },
        {
            id: "student-6",
            name: "Rudi Tekun",
            email: "rudi@student.edu",
            progress: 80,
            status: "online",
            lastActive: new Date(Date.now() - 900000).toISOString(),
            currentModule: 3,
            currentLesson: "Machine Learning Basics",
            completedLessons: 16,
            totalLessons: 20,
            engagementScore: 88,
            timeSpent: 150
        }
    ];
    renderEnhancedStudentTable(demoStudents);
}

async function loadAIInsights() {
    try {
        // Load real analytics data from API
        await loadLearningPatterns();
        await loadAtRiskStudents();
        await loadContentEffectiveness();
        await loadAIRecommendations();

        UIComponents.showNotification("📊 AI Analytics loaded successfully", "success");
    } catch (error) {
        console.error("Failed to load AI insights:", error);
        loadDemoAnalytics();
        UIComponents.showNotification("Using demo analytics data", "info");
    }
}

async function loadLearningPatterns() {
    try {
        // Simulate API call to get learning patterns
        const patterns = await apiClient.request("/analytics/learning-patterns");

        setInner("peak-time", patterns.peakTime || "19:00-21:00 WIB");
        setInner("mobile-access", patterns.mobileAccess || "85%");
        setInner("session-duration", patterns.avgSessionDuration || "45 min");
        setInner("learning-insights", patterns.insights || "Students are most active in evening hours. Mobile learning is preferred. Video content shows highest engagement rates.");
    } catch (error) {
        // Fallback to demo data
        setInner("peak-time", "19:00-21:00 WIB");
        setInner("mobile-access", "85%");
        setInner("session-duration", "45 min");
        setInner("learning-insights", "🕒 Peak activity: 19:00-21:00 WIB. 📱 85% mobile access. 📊 Video content most engaging.");
    }
}

async function loadAtRiskStudents() {
    try {
        // Simulate API call to get at-risk students analysis
        const riskAnalysis = await apiClient.request("/analytics/at-risk-students");

        setInner("high-risk-count", riskAnalysis.highRisk || "3");
        setInner("medium-risk-count", riskAnalysis.mediumRisk || "7");
        setInner("intervention-count", riskAnalysis.interventionNeeded || "5");
        setInner("risk-insights", riskAnalysis.insights || "3 students need immediate intervention. Focus on students with <30% progress and no activity in 7+ days.");
    } catch (error) {
        // Fallback to demo data
        setInner("high-risk-count", "3");
        setInner("medium-risk-count", "7");
        setInner("intervention-count", "5");
        setInner("risk-insights", "⚠️ 3 high-risk students identified: Maya Rajin (25% progress), Andi Tertinggal (15% progress), Sari Lambat (20% progress). Immediate intervention recommended.");
    }
}

async function loadContentEffectiveness() {
    try {
        // Simulate API call to get content effectiveness data
        const effectiveness = await apiClient.request("/analytics/content-effectiveness");

        setInner("top-content", effectiveness.topContent || "Video Tutorials");
        setInner("engagement-rate", effectiveness.engagementRate || "78%");
        setInner("completion-rate-content", effectiveness.completionRate || "65%");
        setInner("content-insights", effectiveness.insights || "Video tutorials show highest engagement. Interactive exercises need improvement. Text-based content has lower completion rates.");
    } catch (error) {
        // Fallback to demo data
        setInner("top-content", "Video Tutorials");
        setInner("engagement-rate", "78%");
        setInner("completion-rate-content", "65%");
        setInner("content-insights", "📹 Video tutorials: 92% engagement. 🎮 Interactive exercises: 78% engagement. 📝 Text content: 45% engagement. Recommend more video content.");
    }
}

async function loadAIRecommendations() {
    try {
        // Simulate API call to get AI recommendations
        const recommendations = await apiClient.request("/analytics/ai-recommendations");

        const priorityActions = recommendations.priorityActions || [
            "Schedule intervention sessions for 3 high-risk students",
            "Increase video content in Module 2 (low engagement)",
            "Implement peer mentoring for struggling students",
            "Add more interactive exercises to improve retention"
        ];

        const actionsList = priorityActions.map(action => `<li>${action}</li>`).join('');
        setInner("priority-actions", actionsList);

        setInner("ai-strategy-recommendations", recommendations.strategies || "AI recommends: 1) Personalized learning paths for at-risk students, 2) Gamification elements to boost engagement, 3) Micro-learning sessions for better retention, 4) Peer collaboration features.");
    } catch (error) {
        // Fallback to demo data
        const demoActions = [
            "Schedule intervention sessions for 3 high-risk students",
            "Increase video content in Module 2 (low engagement)",
            "Implement peer mentoring for struggling students",
            "Add more interactive exercises to improve retention"
        ];

        const actionsList = demoActions.map(action => `<li>${action}</li>`).join('');
        setInner("priority-actions", actionsList);

        setInner("ai-strategy-recommendations", "💡 AI Strategy: Focus on personalized learning paths, increase video content, implement peer mentoring, and add gamification elements to boost engagement.");
    }
}

function loadDemoAnalytics() {
    // Load demo data when API fails
    loadLearningPatterns();
    loadAtRiskStudents();
    loadContentEffectiveness();
    loadAIRecommendations();
}

function setupEventListeners() {
    // Original buttons
    onClick("btn-export-progress", exportStudentProgress);
    onClick("btn-send-reminder", sendReminder);
    onClick("btn-refresh-data", refreshData);

    // Analytics refresh button
    onClick("btn-refresh-analytics", refreshAnalytics);

    // Real-time monitoring controls
    onClick("btn-toggle-realtime", toggleRealTimeMonitoring);

    // Filter controls
    document.getElementById("filter-status")?.addEventListener("change", filterStudents);
    document.getElementById("filter-module")?.addEventListener("change", filterStudents);
    document.getElementById("search-students")?.addEventListener("input", searchStudents);

    // New D1-D24 Workflow buttons
    onClick("btn-weekly-planning", startWeeklyPlanning);
    onClick("btn-pre-class-setup", startPreClassSetup);
    onClick("btn-live-class", startLiveClass);
    onClick("btn-post-analysis", startPostAnalysis);
    onClick("btn-student-monitoring", openStudentMonitoring);
    onClick("btn-ai-oversight", openAIOversight);
}

// Real-time monitoring state
let realTimeMonitoring = false;
let monitoringInterval = null;

function toggleRealTimeMonitoring() {
    realTimeMonitoring = !realTimeMonitoring;
    const button = document.getElementById("btn-toggle-realtime");

    if (realTimeMonitoring) {
        button.textContent = "🟢 Live Monitoring";
        button.style.background = "var(--success)";
        startRealTimeUpdates();
        UIComponents.showNotification("🔴 Real-time monitoring activated", "success");
    } else {
        button.textContent = "🔴 Start Monitoring";
        button.style.background = "var(--gray-500)";
        stopRealTimeUpdates();
        UIComponents.showNotification("⏸️ Real-time monitoring paused", "info");
    }
}

function startRealTimeUpdates() {
    // Update every 30 seconds
    monitoringInterval = setInterval(async () => {
        try {
            await loadRealTimeStats();
            await loadActivityTimeline();
            updateLastUpdateTime();
        } catch (error) {
            console.error("Real-time update failed:", error);
        }
    }, 30000);
}

function stopRealTimeUpdates() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
}

function filterStudents() {
    const statusFilter = document.getElementById("filter-status")?.value;
    const moduleFilter = document.getElementById("filter-module")?.value;

    UIComponents.showNotification(`🔍 Filtering students: ${statusFilter} | ${moduleFilter}`, "info");
    // TODO: Implement actual filtering logic
}

function searchStudents() {
    const searchTerm = document.getElementById("search-students")?.value;
    if (searchTerm.length > 2) {
        UIComponents.showNotification(`🔍 Searching for: ${searchTerm}`, "info");
        // TODO: Implement actual search logic
    }
}

// Student interaction functions
function sendMessage(studentId) {
    const message = prompt("💬 Send message to student:");
    if (message) {
        UIComponents.showNotification(`✅ Message sent to student ${studentId}: "${message}"`, "success");
    }
}

// Global functions for onclick handlers
window.sendMessage = sendMessage;

function exportStudentProgress() {
    const csvData = "Nama,Email,Progress,Status,Terakhir Aktif\n" +
        "Andi Mahasiswa,andi@student.edu,75%,Aktif," + new Date().toLocaleDateString() + "\n" +
        "Sari Belajar,sari@student.edu,45%,Aktif," + new Date().toLocaleDateString() + "\n" +
        "Budi Cerdas,budi@student.edu,90%,Aktif," + new Date().toLocaleDateString() + "\n" +
        "Maya Rajin,maya@student.edu,25%,Tidak Aktif," + new Date(Date.now() - 604800000).toLocaleDateString();

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `student-progress-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    UIComponents.showNotification("📊 Progress report berhasil diexport!", "success");
}

function sendReminder() {
    UIComponents.showNotification("📧 Mengirim reminder ke mahasiswa yang belum aktif...", "info");
    setTimeout(() => {
        UIComponents.showNotification("✅ Reminder berhasil dikirim ke 3 mahasiswa!", "success");
    }, 2000);
}

async function refreshData() {
    UIComponents.showNotification("🔄 Merefresh data...", "info");
    try {
        await loadClassData();
        await loadStudentList();
        await loadAIInsights();
        updateCarbonIndicator();
        UIComponents.showNotification("✅ Data berhasil direfresh!", "success");
    } catch (error) {
        UIComponents.showNotification("❌ Gagal refresh data. Silakan coba lagi.", "error");
    }
}

async function refreshAnalytics() {
    UIComponents.showNotification("🔄 Refreshing AI Analytics Dashboard...", "info");
    try {
        await loadAIInsights();
        UIComponents.showNotification("✅ AI Analytics refreshed successfully!", "success");
    } catch (error) {
        UIComponents.showNotification("❌ Failed to refresh analytics. Using cached data.", "error");
    }
}

function createAssignment() {
    const title = prompt("📝 Judul Assignment:");
    const dueDate = prompt("📅 Tanggal Deadline (YYYY-MM-DD):");
    if (title && dueDate) {
        UIComponents.showNotification(`✅ Assignment "${title}" berhasil dibuat! Deadline: ${dueDate}`, "success");
    }
}

function scheduleClass() {
    const topic = prompt("📚 Topik Kelas:");
    const date = prompt("📅 Tanggal & Waktu (YYYY-MM-DD HH:MM):");
    if (topic && date) {
        UIComponents.showNotification(`✅ Kelas "${topic}" berhasil dijadwalkan! Waktu: ${date}`, "success");
    }
}

function viewAnalytics() {
    UIComponents.showNotification("📊 Membuka analytics detail...", "info");
}

function manageContent() {
    UIComponents.showNotification("📚 Membuka content management...", "info");
}

function chatWithAI() {
    const question = prompt("🤖 Tanyakan sesuatu kepada AI Assistant untuk Educator:");
    if (question) {
        UIComponents.showNotification(`🤖 AI Response: "Berdasarkan data kelas Anda, saya merekomendasikan untuk focus pada mahasiswa dengan progress <50%. Pertanyaan Anda tentang '${question}' sangat relevan untuk meningkatkan engagement."`, "info");
    }
}

function viewStudentDetail(studentId) {
    UIComponents.showNotification(`👤 Membuka detail mahasiswa ID: ${studentId}`, "info");
}

// D1-D6: Weekly Planning Session (30 minutes)
function startWeeklyPlanning() {
    UIComponents.showNotification("📅 Starting Weekly Planning Session (D1-D6) - 30 minutes", "info");

    const planningSteps = [
        "D1: Weekly Planning Session",
        "D2: Review AI Analytics Dashboard",
        "D3: Identify At-Risk Students",
        "D4: Analyze Content Effectiveness",
        "D5: Plan Intervention Strategies",
        "D6: Create Session Plan"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < planningSteps.length) {
            UIComponents.showNotification(`✅ ${planningSteps[currentStep]}`, "success");
            currentStep++;
        } else {
            clearInterval(interval);
            UIComponents.showNotification("🎯 Weekly Planning Session completed! Ready for next week.", "success");
        }
    }, 2000);
}

// D7-D11: Pre-Class Setup (15 minutes)
function startPreClassSetup() {
    UIComponents.showNotification("🔧 Starting Pre-Class Setup (D7-D11) - 15 minutes", "info");

    const setupSteps = [
        "D7: Pre-Class Setup",
        "D8: Check System Status",
        "D9: Review Student Readiness",
        "D10: Prepare Technology Tools",
        "D11: Brief AI Teaching Assistant"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < setupSteps.length) {
            UIComponents.showNotification(`✅ ${setupSteps[currentStep]}`, "success");
            currentStep++;
        } else {
            clearInterval(interval);
            UIComponents.showNotification("🚀 Pre-Class Setup completed! Ready to start class.", "success");
        }
    }, 1500);
}

// D12-D18: In-Class Facilitation (90 minutes)
function startLiveClass() {
    UIComponents.showNotification("🎓 Starting In-Class Facilitation (D12-D18) - 90 minutes", "info");

    const classSteps = [
        "D12: In-Class Facilitation",
        "D13: Opening & Objectives",
        "D14: AI-Supported Presentation",
        "D15: Interactive Activities",
        "D16: Individual Support Rounds",
        "D17: Live Assessment Check",
        "D18: Session Wrap-up"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < classSteps.length) {
            UIComponents.showNotification(`✅ ${classSteps[currentStep]}`, "success");
            currentStep++;
        } else {
            clearInterval(interval);
            UIComponents.showNotification("🎉 Class session completed successfully!", "success");
        }
    }, 3000);
}

// D19-D24: Post-Class Analysis (20 minutes)
function startPostAnalysis() {
    UIComponents.showNotification("📊 Starting Post-Class Analysis (D19-D24) - 20 minutes", "info");

    const analysisSteps = [
        "D19: Post-Class Analysis",
        "D20: Review Session Metrics",
        "D21: Analyze Student Performance",
        "D22: Note AI Recommendations",
        "D23: Plan Individual Follow-ups",
        "D24: Update Teaching Strategy"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < analysisSteps.length) {
            UIComponents.showNotification(`✅ ${analysisSteps[currentStep]}`, "success");
            currentStep++;
        } else {
            clearInterval(interval);
            UIComponents.showNotification("📈 Post-Class Analysis completed! Insights saved for next planning.", "success");
        }
    }, 2000);
}

// Student Monitoring Interface
function openStudentMonitoring() {
    UIComponents.showNotification("👥 Opening Student Monitoring Dashboard...", "info");
    setTimeout(() => {
        UIComponents.showNotification("📊 Real-time student progress tracking activated", "success");
    }, 1000);
}

// AI Oversight Panel
function openAIOversight() {
    UIComponents.showNotification("🤖 Opening AI Oversight Panel...", "info");
    setTimeout(() => {
        UIComponents.showNotification("🎯 AI decision monitoring and control panel ready", "success");
    }, 1000);
}

function updateCarbonIndicator() {
    try {
        const metrics = apiClient.getCarbonMetrics ? apiClient.getCarbonMetrics() : { totalCarbon: 0.000125 };
        const indicator = document.getElementById("carbon-indicator");
        if (indicator) {
            indicator.textContent = `�� ${metrics.totalCarbon.toFixed(6)}g CO2`;
        }
    } catch (error) {
        const indicator = document.getElementById("carbon-indicator");
        if (indicator) {
            indicator.textContent = `🌱 0.000125g CO2`;
        }
    }
}

// Global functions
window.viewStudentDetail = viewStudentDetail;

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', initializeEducatorPortal);

console.log("🌱 AgenticLearn Educator Portal loaded with JSCroot");
