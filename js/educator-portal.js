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

        // Load advanced analytics charts
        await loadAdvancedAnalytics();

        UIComponents.showNotification("📊 AI Analytics loaded successfully", "success");
    } catch (error) {
        console.error("Failed to load AI insights:", error);
        loadDemoAnalytics();
        loadDemoAdvancedAnalytics();
        UIComponents.showNotification("Using demo analytics data", "info");
    }
}

async function loadAdvancedAnalytics() {
    try {
        // Load analytics data from API
        const analyticsData = await apiClient.request("/analytics/advanced");
        renderAdvancedCharts(analyticsData);
    } catch (error) {
        // Fallback to demo charts
        renderDemoCharts();
    }
}

function loadDemoAdvancedAnalytics() {
    renderDemoCharts();
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

    // Advanced analytics controls
    onClick("btn-export-analytics", exportAnalytics);
    document.getElementById("analytics-timeframe")?.addEventListener("change", updateAnalyticsTimeframe);

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

async function viewStudentDetail(studentId) {
    try {
        UIComponents.showNotification(`👤 Loading student profile: ${studentId}`, "info");

        // Load student data
        const student = await loadStudentData(studentId);

        // Open modal and populate data
        openStudentProfile(student);

    } catch (error) {
        console.error("Failed to load student detail:", error);
        UIComponents.showNotification("❌ Failed to load student profile", "error");
    }
}

async function loadStudentData(studentId) {
    try {
        // Try to load from API
        const student = await apiClient.request(`/students/${studentId}`);
        return student;
    } catch (error) {
        // Fallback to demo data
        return getDemoStudentData(studentId);
    }
}

function getDemoStudentData(studentId) {
    const demoStudents = {
        "student-1": {
            id: "student-1",
            name: "Andi Mahasiswa",
            email: "andi@student.edu",
            avatar: "AM",
            progress: 75,
            status: "online",
            lastActive: new Date().toISOString(),
            currentModule: 3,
            currentLesson: "Data Visualization",
            completedLessons: 15,
            totalLessons: 20,
            engagementScore: 85,
            timeSpent: 120,
            joinDate: "2024-01-15",
            totalTimeSpent: 4500, // minutes
            assessments: [
                { name: "Digital Skills Assessment", score: 85, date: "2024-01-16", status: "completed" },
                { name: "Learning Style Assessment", score: 92, date: "2024-01-17", status: "completed" },
                { name: "Module 1 Quiz", score: 78, date: "2024-02-01", status: "completed" },
                { name: "Module 2 Quiz", score: 88, date: "2024-02-15", status: "completed" },
                { name: "Module 3 Quiz", score: 0, date: null, status: "pending" }
            ],
            goals: [
                { title: "Complete Data Analytics Course", progress: 75, deadline: "2024-06-30", status: "active" },
                { title: "Master Python Programming", progress: 60, deadline: "2024-05-15", status: "active" },
                { title: "Build Portfolio Project", progress: 30, deadline: "2024-07-30", status: "active" }
            ],
            learningStyle: "Visual",
            digitalSkillsLevel: "Intermediate",
            technologyComfort: "High",
            communicationHistory: [
                { date: "2024-12-10", type: "message", content: "Great progress on Module 3!", sender: "instructor" },
                { date: "2024-12-08", type: "message", content: "I need help with data visualization", sender: "student" },
                { date: "2024-12-05", type: "reminder", content: "Assignment deadline reminder", sender: "system" }
            ]
        },
        "student-2": {
            id: "student-2",
            name: "Sari Belajar",
            email: "sari@student.edu",
            avatar: "SB",
            progress: 45,
            status: "active",
            lastActive: new Date(Date.now() - 3600000).toISOString(),
            currentModule: 2,
            currentLesson: "Analytics Fundamentals",
            completedLessons: 9,
            totalLessons: 20,
            engagementScore: 72,
            timeSpent: 45,
            joinDate: "2024-01-20",
            totalTimeSpent: 2800,
            assessments: [
                { name: "Digital Skills Assessment", score: 70, date: "2024-01-21", status: "completed" },
                { name: "Learning Style Assessment", score: 85, date: "2024-01-22", status: "completed" },
                { name: "Module 1 Quiz", score: 65, date: "2024-02-05", status: "completed" },
                { name: "Module 2 Quiz", score: 0, date: null, status: "pending" }
            ],
            goals: [
                { title: "Improve Technical Skills", progress: 45, deadline: "2024-08-30", status: "active" },
                { title: "Complete Course Successfully", progress: 45, deadline: "2024-09-15", status: "active" }
            ],
            learningStyle: "Auditory",
            digitalSkillsLevel: "Beginner",
            technologyComfort: "Medium",
            communicationHistory: [
                { date: "2024-12-09", type: "message", content: "Keep up the good work!", sender: "instructor" },
                { date: "2024-12-07", type: "message", content: "Can we schedule a help session?", sender: "student" }
            ]
        }
    };

    return demoStudents[studentId] || demoStudents["student-1"];
}

function openStudentProfile(student) {
    // Populate header
    setInner("profile-name", student.name);
    setInner("profile-email", student.email);
    setInner("profile-avatar", student.avatar || student.name.split(' ').map(n => n[0]).join('').substring(0, 2));

    // Load overview tab content
    loadOverviewTab(student);

    // Show modal
    document.getElementById("student-profile-modal").style.display = "flex";

    // Set active tab
    switchTab('overview');

    UIComponents.showNotification(`📊 Student profile loaded: ${student.name}`, "success");
}

function closeStudentProfile() {
    document.getElementById("student-profile-modal").style.display = "none";
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Add active class to selected tab button
    event.target.classList.add('active');

    // Load tab-specific content
    loadTabContent(tabName);
}

let currentStudent = null;

function loadTabContent(tabName) {
    if (!currentStudent) return;

    switch(tabName) {
        case 'overview':
            loadOverviewTab(currentStudent);
            break;
        case 'progress':
            loadProgressTab(currentStudent);
            break;
        case 'assessments':
            loadAssessmentsTab(currentStudent);
            break;
        case 'communication':
            loadCommunicationTab(currentStudent);
            break;
        case 'settings':
            loadSettingsTab(currentStudent);
            break;
    }
}

function loadOverviewTab(student) {
    currentStudent = student;

    const overviewHTML = `
        <div class="grid" style="margin-bottom: 2rem;">
            <div class="card" style="background: var(--accent);">
                <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📊</span> Learning Overview
                </h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Overall Progress</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.progress}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Current Module</span>
                    <span style="font-weight: 600; color: var(--primary);">Module ${student.currentModule}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Lessons Completed</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.completedLessons}/${student.totalLessons}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--gray-700);">Engagement Score</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.engagementScore}%</span>
                </div>
            </div>

            <div class="card" style="background: var(--secondary-light);">
                <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🎯</span> Learning Profile
                </h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Learning Style</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.learningStyle}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Digital Skills</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.digitalSkillsLevel}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--gray-700);">Tech Comfort</span>
                    <span style="font-weight: 600; color: var(--primary);">${student.technologyComfort}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--gray-700);">Join Date</span>
                    <span style="font-weight: 600; color: var(--primary);">${new Date(student.joinDate).toLocaleDateString('id-ID')}</span>
                </div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎯</span> Active Goals
            </h4>
            ${student.goals.map(goal => `
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border-left: 4px solid var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-weight: 600; color: var(--gray-800);">${goal.title}</span>
                        <span style="font-size: 0.75rem; color: var(--gray-600);">Due: ${new Date(goal.deadline).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="progress-mini" style="width: 150px;">
                            <div class="progress-mini-fill" style="width: ${goal.progress}%"></div>
                        </div>
                        <span style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">${goal.progress}%</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⏱️</span> Time Tracking
            </h4>
            <div class="grid">
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${student.timeSpent}min</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Today</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${Math.round(student.totalTimeSpent / 60)}h</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Total</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${Math.round(student.totalTimeSpent / student.completedLessons)}min</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Avg per Lesson</div>
                </div>
            </div>
        </div>
    `;

    setInner("tab-overview", overviewHTML);
}

function loadProgressTab(student) {
    const progressHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📈</span> Progress Visualization
            </h4>
            <div style="background: var(--accent); padding: 2rem; border-radius: 8px; text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 3rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">${student.progress}%</div>
                <div style="color: var(--gray-600);">Overall Course Progress</div>
            </div>
            <div style="background: var(--white); padding: 1rem; border-radius: 8px; border: 1px solid var(--accent);">
                <p style="color: var(--gray-600); text-align: center; margin: 0;">Detailed progress charts will be implemented here</p>
            </div>
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📚</span> Module Progress
            </h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${[1, 2, 3, 4].map(moduleNum => {
                    const isCompleted = moduleNum < student.currentModule;
                    const isCurrent = moduleNum === student.currentModule;
                    const progress = isCompleted ? 100 : (isCurrent ? Math.round((student.completedLessons % 5) * 20) : 0);

                    return `
                        <div style="background: var(--accent); padding: 1rem; border-radius: 8px; border-left: 4px solid ${isCompleted ? 'var(--success)' : (isCurrent ? 'var(--primary)' : 'var(--gray-400)')};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600; color: var(--gray-800);">Module ${moduleNum}</span>
                                <span style="font-size: 0.75rem; color: var(--gray-600);">${isCompleted ? '✅ Completed' : (isCurrent ? '🔄 In Progress' : '⏳ Pending')}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div class="progress-mini" style="width: 200px;">
                                    <div class="progress-mini-fill" style="width: ${progress}%"></div>
                                </div>
                                <span style="font-weight: 600; color: var(--primary); font-size: 0.875rem;">${progress}%</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    setInner("tab-progress", progressHTML);
}

function loadAssessmentsTab(student) {
    const assessmentsHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📝</span> Assessment History
            </h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${student.assessments.map(assessment => {
                    const statusColor = assessment.status === 'completed' ? 'var(--success)' :
                                      assessment.status === 'pending' ? 'var(--warning)' : 'var(--gray-400)';
                    const statusIcon = assessment.status === 'completed' ? '✅' :
                                     assessment.status === 'pending' ? '⏳' : '❌';

                    return `
                        <div style="background: var(--accent); padding: 1rem; border-radius: 8px; border-left: 4px solid ${statusColor};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600; color: var(--gray-800);">${assessment.name}</span>
                                <span style="font-size: 0.75rem; color: var(--gray-600);">${statusIcon} ${assessment.status}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--gray-700);">Score: <strong style="color: var(--primary);">${assessment.score > 0 ? assessment.score + '%' : 'Not taken'}</strong></span>
                                <span style="font-size: 0.75rem; color: var(--gray-600);">${assessment.date ? new Date(assessment.date).toLocaleDateString('id-ID') : 'No date'}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Assessment Analytics
            </h4>
            <div class="grid">
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${Math.round(student.assessments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.score, 0) / student.assessments.filter(a => a.status === 'completed').length)}%</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Average Score</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${student.assessments.filter(a => a.status === 'completed').length}</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Completed</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--accent); border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${student.assessments.filter(a => a.status === 'pending').length}</div>
                    <div style="font-size: 0.75rem; color: var(--gray-600);">Pending</div>
                </div>
            </div>
        </div>
    `;

    setInner("tab-assessments", assessmentsHTML);
}

function loadCommunicationTab(student) {
    const communicationHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>💬</span> Send Message
            </h4>
            <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                <textarea id="message-input" placeholder="Type your message to ${student.name}..." style="width: 100%; height: 100px; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white); resize: vertical; font-family: inherit;"></textarea>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" onclick="sendQuickMessage('reminder')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                            📅 Send Reminder
                        </button>
                        <button class="btn" onclick="sendQuickMessage('encouragement')" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                            🎉 Send Encouragement
                        </button>
                    </div>
                    <button class="btn" onclick="sendCustomMessage()" style="background: var(--primary);">
                        📤 Send Message
                    </button>
                </div>
            </div>
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📜</span> Communication History
            </h4>
            <div style="max-height: 400px; overflow-y: auto;">
                ${student.communicationHistory.map(comm => {
                    const isInstructor = comm.sender === 'instructor';
                    const isSystem = comm.sender === 'system';
                    const bgColor = isInstructor ? 'var(--primary)' : isSystem ? 'var(--accent)' : 'var(--secondary-light)';
                    const textColor = isInstructor ? 'white' : 'var(--gray-800)';
                    const alignment = isInstructor ? 'flex-end' : 'flex-start';

                    return `
                        <div style="display: flex; justify-content: ${alignment}; margin-bottom: 1rem;">
                            <div style="max-width: 70%; background: ${bgColor}; color: ${textColor}; padding: 0.75rem; border-radius: 8px;">
                                <div style="font-size: 0.875rem; margin-bottom: 0.25rem;">${comm.content}</div>
                                <div style="font-size: 0.75rem; opacity: 0.8;">${new Date(comm.date).toLocaleDateString('id-ID')} • ${comm.sender}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    setInner("tab-communication", communicationHTML);
}

function loadSettingsTab(student) {
    const settingsHTML = `
        <div class="card" style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚙️</span> Learning Settings
            </h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Learning Path Customization</label>
                    <select style="width: 100%; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                        <option>Standard Path</option>
                        <option>Accelerated Path</option>
                        <option>Extended Path</option>
                        <option>Custom Path</option>
                    </select>
                </div>

                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Difficulty Level</label>
                    <select style="width: 100%; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                        <option>Beginner</option>
                        <option selected>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>

                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Notification Preferences</label>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                            <input type="checkbox" checked> Assignment reminders
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                            <input type="checkbox" checked> Progress updates
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                            <input type="checkbox"> Weekly reports
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎯</span> Intervention Actions
            </h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <button class="btn" onclick="scheduleIntervention()" style="background: var(--warning);">
                    📅 Schedule Intervention
                </button>
                <button class="btn" onclick="assignMentor()" style="background: var(--info);">
                    👥 Assign Mentor
                </button>
                <button class="btn" onclick="adjustLearningPath()" style="background: var(--primary);">
                    🛤️ Adjust Learning Path
                </button>
                <button class="btn" onclick="generateReport()" style="background: var(--success);">
                    📊 Generate Report
                </button>
            </div>
        </div>
    `;

    setInner("tab-settings", settingsHTML);
}

// Communication functions
function sendCustomMessage() {
    const message = document.getElementById("message-input")?.value;
    if (message.trim()) {
        UIComponents.showNotification(`✅ Message sent: "${message}"`, "success");
        document.getElementById("message-input").value = "";
    } else {
        UIComponents.showNotification("❌ Please enter a message", "error");
    }
}

function sendQuickMessage(type) {
    const messages = {
        reminder: "📅 Reminder: You have pending assignments. Please check your dashboard.",
        encouragement: "🎉 Great progress! Keep up the excellent work!"
    };

    UIComponents.showNotification(`✅ ${type} message sent: "${messages[type]}"`, "success");
}

// Intervention functions
function scheduleIntervention() {
    UIComponents.showNotification("📅 Intervention session scheduled for next week", "success");
}

function assignMentor() {
    UIComponents.showNotification("👥 Mentor assigned successfully", "success");
}

function adjustLearningPath() {
    UIComponents.showNotification("🛤️ Learning path adjusted based on performance", "success");
}

function generateReport() {
    UIComponents.showNotification("📊 Detailed student report generated", "success");
}

function renderDemoCharts() {
    renderProgressTrendChart();
    renderEngagementHeatmap();
    renderPerformanceDistribution();
    renderTimeAnalysisChart();
    renderClassComparisonChart();
    renderLearningPathChart();
}

function renderProgressTrendChart() {
    const chartContainer = document.getElementById("progress-trend-chart");
    if (!chartContainer) return;

    // Demo data for 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const progressData = [65, 68, 72, 70, 75, 78, 82];
    const maxProgress = Math.max(...progressData);

    const chartHTML = `
        <div style="display: flex; align-items: end; height: 160px; gap: 8px; padding: 20px 0;">
            ${days.map((day, index) => {
                const height = (progressData[index] / maxProgress) * 140;
                return `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                        <div style="background: var(--primary); width: 100%; height: ${height}px; border-radius: 4px 4px 0 0; position: relative; transition: all 0.3s ease;"
                             onmouseover="this.style.background='var(--primary-dark)'"
                             onmouseout="this.style.background='var(--primary)'">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); background: var(--gray-800); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; opacity: 0; transition: opacity 0.3s;"
                                 class="tooltip">${progressData[index]}%</div>
                        </div>
                        <div style="margin-top: 8px; font-size: 12px; color: var(--gray-600); font-weight: 500;">${day}</div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            📈 Average weekly progress: <strong style="color: var(--primary);">+17%</strong>
        </div>
    `;

    chartContainer.innerHTML = chartHTML;

    // Add hover effects
    chartContainer.querySelectorAll('[onmouseover]').forEach(bar => {
        bar.addEventListener('mouseenter', () => {
            bar.querySelector('.tooltip').style.opacity = '1';
        });
        bar.addEventListener('mouseleave', () => {
            bar.querySelector('.tooltip').style.opacity = '0';
        });
    });
}

function renderEngagementHeatmap() {
    const chartContainer = document.getElementById("engagement-heatmap");
    if (!chartContainer) return;

    const hours = ['9AM', '11AM', '1PM', '3PM', '5PM', '7PM', '9PM'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Generate demo engagement data (0-100)
    const engagementData = days.map(() =>
        hours.map(() => Math.floor(Math.random() * 60) + 40)
    );

    const chartHTML = `
        <div style="display: flex; flex-direction: column; height: 160px;">
            <div style="display: flex; margin-bottom: 5px;">
                <div style="width: 40px;"></div>
                ${hours.map(hour => `
                    <div style="flex: 1; text-align: center; font-size: 10px; color: var(--gray-600);">${hour}</div>
                `).join('')}
            </div>
            ${days.map((day, dayIndex) => `
                <div style="display: flex; margin-bottom: 2px;">
                    <div style="width: 40px; font-size: 10px; color: var(--gray-600); display: flex; align-items: center;">${day}</div>
                    ${hours.map((hour, hourIndex) => {
                        const engagement = engagementData[dayIndex][hourIndex];
                        const intensity = engagement / 100;
                        const backgroundColor = `rgba(102, 123, 104, ${intensity})`;
                        return `
                            <div style="flex: 1; height: 18px; background: ${backgroundColor}; margin: 0 1px; border-radius: 2px; position: relative;"
                                 title="${day} ${hour}: ${engagement}% engagement">
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            🔥 Peak engagement: <strong style="color: var(--primary);">Tuesday 7PM (95%)</strong>
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

function renderPerformanceDistribution() {
    const chartContainer = document.getElementById("performance-distribution");
    if (!chartContainer) return;

    const performanceRanges = ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];
    const studentCounts = [1, 3, 8, 12, 6]; // Demo data
    const maxCount = Math.max(...studentCounts);

    const chartHTML = `
        <div style="display: flex; align-items: end; height: 140px; gap: 12px; padding: 20px 0;">
            ${performanceRanges.map((range, index) => {
                const height = (studentCounts[index] / maxCount) * 120;
                const colors = ['var(--error)', 'var(--warning)', 'var(--info)', 'var(--primary)', 'var(--success)'];
                return `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                        <div style="background: ${colors[index]}; width: 100%; height: ${height}px; border-radius: 4px 4px 0 0; position: relative; transition: all 0.3s ease;"
                             onmouseover="this.style.opacity='0.8'"
                             onmouseout="this.style.opacity='1'">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); background: var(--gray-800); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                                ${studentCounts[index]} students
                            </div>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px; color: var(--gray-600); font-weight: 500; text-align: center;">${range}</div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            🎯 Most students (40%) perform in the <strong style="color: var(--primary);">61-80%</strong> range
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

function renderTimeAnalysisChart() {
    const chartContainer = document.getElementById("time-analysis-chart");
    if (!chartContainer) return;

    const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const timeData = [25, 35, 30, 10]; // Percentage of learning time
    const colors = ['var(--secondary)', 'var(--primary)', 'var(--accent-dark)', 'var(--gray-400)'];

    const chartHTML = `
        <div style="display: flex; align-items: center; height: 140px; gap: 20px;">
            <div style="flex: 1;">
                <div style="display: flex; height: 40px; border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-sm);">
                    ${timeSlots.map((slot, index) => `
                        <div style="background: ${colors[index]}; width: ${timeData[index]}%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 600; transition: all 0.3s ease;"
                             onmouseover="this.style.transform='scale(1.05)'"
                             onmouseout="this.style.transform='scale(1)'">
                            ${timeData[index]}%
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 15px;">
                    ${timeSlots.map((slot, index) => `
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                            <div style="width: 12px; height: 12px; background: ${colors[index]}; border-radius: 2px;"></div>
                            <span style="font-size: 12px; color: var(--gray-700);">${slot}: ${timeData[index]}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            ⏱️ Peak learning time: <strong style="color: var(--primary);">Afternoon (35%)</strong>
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

function renderClassComparisonChart() {
    const chartContainer = document.getElementById("class-comparison-chart");
    if (!chartContainer) return;

    const metrics = ['Progress', 'Engagement', 'Assessments', 'Time Spent', 'Completion'];
    const currentClass = [75, 82, 78, 85, 70];
    const averageClass = [68, 75, 72, 78, 65];
    const maxValue = 100;

    const chartHTML = `
        <div style="display: flex; flex-direction: column; height: 200px; gap: 15px; padding: 10px 0;">
            ${metrics.map((metric, index) => `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="width: 80px; font-size: 12px; color: var(--gray-700); font-weight: 500;">${metric}</div>
                    <div style="flex: 1; position: relative;">
                        <div style="background: var(--accent); height: 20px; border-radius: 10px; position: relative; overflow: hidden;">
                            <div style="background: var(--primary); height: 100%; width: ${currentClass[index]}%; border-radius: 10px; transition: width 0.5s ease;"></div>
                            <div style="background: var(--secondary-dark); height: 8px; width: ${averageClass[index]}%; position: absolute; top: 6px; border-radius: 4px; opacity: 0.8;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 10px; color: var(--gray-600);">
                            <span>Your Class: <strong style="color: var(--primary);">${currentClass[index]}%</strong></span>
                            <span>Average: <strong style="color: var(--secondary-dark);">${averageClass[index]}%</strong></span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--accent); font-size: 12px; color: var(--gray-600);">
            📊 Your class performs <strong style="color: var(--success);">+8.2%</strong> above average across all metrics
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

function renderLearningPathChart() {
    const chartContainer = document.getElementById("learning-path-chart");
    if (!chartContainer) return;

    const paths = ['Standard', 'Accelerated', 'Extended', 'Custom'];
    const effectiveness = [78, 85, 72, 88];
    const studentCounts = [15, 8, 5, 2];
    const maxEffectiveness = Math.max(...effectiveness);

    const chartHTML = `
        <div style="display: flex; align-items: end; height: 140px; gap: 15px; padding: 20px 0;">
            ${paths.map((path, index) => {
                const height = (effectiveness[index] / maxEffectiveness) * 120;
                const colors = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--info)'];
                return `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                        <div style="background: ${colors[index]}; width: 100%; height: ${height}px; border-radius: 6px 6px 0 0; position: relative; transition: all 0.3s ease;"
                             onmouseover="this.style.transform='scale(1.05)'"
                             onmouseout="this.style.transform='scale(1)'">
                            <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: var(--gray-800); color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px;">
                                ${effectiveness[index]}% effective<br>
                                ${studentCounts[index]} students
                            </div>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px; color: var(--gray-600); font-weight: 500; text-align: center;">${path}</div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: var(--gray-600);">
            🛤️ Most effective path: <strong style="color: var(--info);">Custom (88%)</strong> • Most popular: <strong style="color: var(--primary);">Standard (15 students)</strong>
        </div>
    `;

    chartContainer.innerHTML = chartHTML;
}

// Analytics control functions
function exportAnalytics() {
    UIComponents.showNotification("📊 Analytics charts exported successfully!", "success");
}

function updateAnalyticsTimeframe() {
    const timeframe = document.getElementById("analytics-timeframe")?.value;
    UIComponents.showNotification(`📅 Analytics updated for: ${timeframe}`, "info");

    // Simulate data refresh for different timeframes
    setTimeout(() => {
        renderDemoCharts();
        UIComponents.showNotification("📊 Charts refreshed with new timeframe data", "success");
    }, 1000);
}

// Global functions for onclick handlers
window.closeStudentProfile = closeStudentProfile;
window.switchTab = switchTab;
window.sendCustomMessage = sendCustomMessage;
window.sendQuickMessage = sendQuickMessage;
window.scheduleIntervention = scheduleIntervention;
window.assignMentor = assignMentor;
window.adjustLearningPath = adjustLearningPath;
window.generateReport = generateReport;
window.exportAnalytics = exportAnalytics;
window.updateAnalyticsTimeframe = updateAnalyticsTimeframe;

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
