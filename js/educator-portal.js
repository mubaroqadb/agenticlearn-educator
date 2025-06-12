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
        // Initialize sidebar navigation
        initializeSidebar();

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

// Sidebar Navigation Functions
function initializeSidebar() {
    setupSidebarEventListeners();
    loadBerandaPage(); // Load default page
}

function setupSidebarEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
        });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected page
    document.getElementById(`page-${pageName}`).classList.add('active');

    // Add active class to selected menu item
    event.target.closest('.menu-item').classList.add('active');

    // Update page title and subtitle
    updatePageHeader(pageName);

    // Load page content
    loadPageContent(pageName);

    // Close mobile sidebar
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

function updatePageHeader(pageName) {
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const pageInfo = {
        beranda: {
            title: 'Dashboard Overview',
            subtitle: 'Welcome to your educator dashboard'
        },
        analytics: {
            title: 'Analytics & Insights',
            subtitle: 'AI-powered learning analytics and performance insights'
        },
        students: {
            title: 'Student Management',
            subtitle: 'Monitor and manage student progress and engagement'
        },
        communication: {
            title: 'Communication Center',
            subtitle: 'Manage student communications and announcements'
        },
        workflow: {
            title: 'Workflow Tools',
            subtitle: 'D1-D24 educator workflow and class management tools'
        },
        assessments: {
            title: 'Assessment Management',
            subtitle: 'Create, manage, and analyze student assessments'
        },
        'ai-recommendations': {
            title: 'AI Recommendations',
            subtitle: 'Personalized learning recommendations and adaptive content'
        },
        reports: {
            title: 'Reports & Export',
            subtitle: 'Generate comprehensive reports and export data'
        },
        integrations: {
            title: 'Integrations',
            subtitle: 'Manage external integrations and API connections'
        },
        security: {
            title: 'Security & Authentication',
            subtitle: 'Advanced security controls and authentication management'
        },
        performance: {
            title: 'Performance Optimization',
            subtitle: 'System performance monitoring and optimization tools'
        },
        'advanced-analytics': {
            title: 'Advanced Analytics',
            subtitle: 'Machine learning insights and predictive analytics'
        },
        mobile: {
            title: 'Mobile & PWA',
            subtitle: 'Mobile optimization and Progressive Web App features'
        },
        settings: {
            title: 'Settings',
            subtitle: 'Configure your preferences and system settings'
        }
    };

    if (pageInfo[pageName]) {
        pageTitle.textContent = pageInfo[pageName].title;
        pageSubtitle.textContent = pageInfo[pageName].subtitle;
    }
}

function loadPageContent(pageName) {
    switch(pageName) {
        case 'beranda':
            loadBerandaPage();
            break;
        case 'analytics':
            loadAnalyticsPage();
            break;
        case 'students':
            loadStudentsPage();
            break;
        case 'communication':
            loadCommunicationPage();
            break;
        case 'workflow':
            loadWorkflowPage();
            break;
        case 'assessments':
            loadAssessmentsPage();
            break;
        case 'ai-recommendations':
            loadAIRecommendationsPage();
            break;
        case 'reports':
            loadReportsPage();
            break;
        case 'integrations':
            loadIntegrationsPage();
            break;
        case 'security':
            loadSecurityPage();
            break;
        case 'performance':
            loadPerformancePage();
            break;
        case 'advanced-analytics':
            loadAdvancedAnalyticsPage();
            break;
        case 'mobile':
            loadMobilePage();
            break;
        case 'settings':
            loadSettingsPage();
            break;
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

        // Load communication center
        await loadCommunicationCenter();

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

    // Communication controls
    onClick("btn-mark-all-read", markAllMessagesRead);

    // Real-time monitoring controls
    onClick("btn-toggle-realtime", toggleRealTimeMonitoring);

    // Setup analytics event listeners
    setupAnalyticsEventListeners();

    // Setup student management event listeners
    setupStudentEventListeners();

    // Setup workflow event listeners
    setupWorkflowEventListeners();

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

// Communication Center Functions
async function loadCommunicationCenter() {
    try {
        // Load communication data
        await loadMessages();
        await loadAnnouncements();
        await loadDiscussions();
        await loadNotifications();
        await loadCommunicationAnalytics();

        // Set default active tab
        switchCommTab('messages');
    } catch (error) {
        console.error("Failed to load communication center:", error);
        loadDemoCommunicationData();
    }
}

function loadDemoCommunicationData() {
    loadDemoMessages();
    loadDemoAnnouncements();
    loadDemoDiscussions();
    loadDemoNotifications();
    loadDemoCommunicationAnalytics();
    switchCommTab('messages');
}

function switchCommTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.comm-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.comm-tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(`comm-tab-${tabName}`).classList.add('active');

    // Add active class to selected tab button
    event.target.classList.add('active');

    // Load tab-specific content if needed
    loadCommTabContent(tabName);
}

function loadCommTabContent(tabName) {
    switch(tabName) {
        case 'messages':
            loadDemoMessages();
            break;
        case 'announcements':
            loadDemoAnnouncements();
            break;
        case 'discussions':
            loadDemoDiscussions();
            break;
        case 'notifications':
            loadDemoNotifications();
            break;
        case 'analytics':
            loadDemoCommunicationAnalytics();
            break;
    }
}

async function loadMessages() {
    try {
        const messages = await apiClient.request("/communication/messages");
        renderMessages(messages);
    } catch (error) {
        loadDemoMessages();
    }
}

function loadDemoMessages() {
    const demoMessages = [
        {
            id: 1,
            sender: "Andi Mahasiswa",
            subject: "Question about Module 3",
            content: "Hi, I'm having trouble understanding the data visualization concepts in Module 3. Could you help explain the difference between bar charts and histograms?",
            time: "2 hours ago",
            unread: true,
            priority: "medium"
        },
        {
            id: 2,
            sender: "Sari Belajar",
            subject: "Assignment Submission",
            content: "I've completed the Python assignment but I'm not sure if I submitted it correctly. Can you confirm if you received my submission?",
            time: "5 hours ago",
            unread: true,
            priority: "high"
        },
        {
            id: 3,
            sender: "Budi Cerdas",
            subject: "Thank you for feedback",
            content: "Thank you for the detailed feedback on my project. The suggestions really helped me improve my analysis approach.",
            time: "1 day ago",
            unread: false,
            priority: "low"
        },
        {
            id: 4,
            sender: "Maya Rajin",
            subject: "Schedule conflict",
            content: "I have a conflict with the upcoming live session. Is it possible to get a recording or schedule a makeup session?",
            time: "2 days ago",
            unread: true,
            priority: "medium"
        }
    ];

    renderMessages(demoMessages);
}

function renderMessages(messages) {
    const messagesHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📨</span> Student Messages
                </h4>
                <button class="btn" onclick="composeMessage()" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                    ✏️ Compose Message
                </button>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <select id="message-filter" style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white); font-size: 0.75rem;">
                    <option value="all">All Messages</option>
                    <option value="unread">Unread Only</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                </select>
                <input type="search" placeholder="Search messages..." style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white); font-size: 0.75rem;">
            </div>
        </div>

        <div style="max-height: 400px; overflow-y: auto;">
            ${messages.map(message => `
                <div class="message-item ${message.unread ? 'unread' : ''}" onclick="openMessage(${message.id})">
                    <div class="message-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="message-sender">${message.sender}</span>
                            ${message.unread ? '<span style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 600;">NEW</span>' : ''}
                            ${message.priority === 'high' ? '<span style="background: var(--error); color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 600;">HIGH</span>' : ''}
                        </div>
                        <span class="message-time">${message.time}</span>
                    </div>
                    <div style="font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem; font-size: 0.875rem;">${message.subject}</div>
                    <div class="message-content">${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}</div>
                </div>
            `).join('')}
        </div>
    `;

    setInner("comm-tab-messages", messagesHTML);
}

function loadDemoAnnouncements() {
    const demoAnnouncements = [
        {
            id: 1,
            title: "New Module Released: Advanced Analytics",
            content: "We're excited to announce the release of Module 4: Advanced Analytics. This module covers machine learning fundamentals and advanced data visualization techniques.",
            date: "2024-12-10",
            priority: "high",
            author: "Dr. Sarah Johnson",
            recipients: "All Students"
        },
        {
            id: 2,
            title: "Upcoming Live Session: Q&A Session",
            content: "Join us for a live Q&A session this Friday at 2 PM. We'll be discussing common challenges in data analysis and answering your questions.",
            date: "2024-12-09",
            priority: "medium",
            author: "Prof. Michael Chen",
            recipients: "Class A & B"
        },
        {
            id: 3,
            title: "System Maintenance Notice",
            content: "The learning platform will undergo scheduled maintenance on Sunday from 2 AM to 6 AM. During this time, access may be limited.",
            date: "2024-12-08",
            priority: "low",
            author: "System Admin",
            recipients: "All Users"
        }
    ];

    const announcementsHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📢</span> Announcements
                </h4>
                <button class="btn" onclick="createAnnouncement()" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                    📝 Create Announcement
                </button>
            </div>
        </div>

        <div style="max-height: 400px; overflow-y: auto;">
            ${demoAnnouncements.map(announcement => `
                <div class="announcement-item announcement-priority-${announcement.priority}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                        <h5 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${announcement.title}</h5>
                        <span style="font-size: 0.75rem; color: var(--gray-600);">${new Date(announcement.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p style="color: var(--gray-700); margin-bottom: 0.75rem; line-height: 1.5;">${announcement.content}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--gray-600);">
                        <span>By: <strong>${announcement.author}</strong></span>
                        <span>To: ${announcement.recipients}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    setInner("comm-tab-announcements", announcementsHTML);
}

function loadDemoDiscussions() {
    const demoDiscussions = [
        {
            id: 1,
            title: "Best practices for data cleaning",
            author: "Andi Mahasiswa",
            replies: 12,
            lastActivity: "2 hours ago",
            category: "Technical Discussion"
        },
        {
            id: 2,
            title: "Study group for Module 3",
            author: "Sari Belajar",
            replies: 8,
            lastActivity: "5 hours ago",
            category: "Study Groups"
        },
        {
            id: 3,
            title: "Career advice: Data Analyst vs Data Scientist",
            author: "Budi Cerdas",
            replies: 15,
            lastActivity: "1 day ago",
            category: "Career Guidance"
        }
    ];

    const discussionsHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>💭</span> Discussion Forums
                </h4>
                <button class="btn" onclick="createDiscussion()" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--accent-dark);">
                    💬 Start Discussion
                </button>
            </div>
        </div>

        <div style="max-height: 400px; overflow-y: auto;">
            ${demoDiscussions.map(discussion => `
                <div style="background: var(--accent); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; border-left: 4px solid var(--accent-dark); cursor: pointer; transition: var(--transition);"
                     onclick="openDiscussion(${discussion.id})"
                     onmouseover="this.style.transform='translateX(2px)'"
                     onmouseout="this.style.transform='translateX(0)'">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h5 style="color: var(--gray-800); margin: 0; font-size: 0.875rem; font-weight: 600;">${discussion.title}</h5>
                        <span style="background: var(--primary); color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 600;">${discussion.category}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--gray-600);">
                        <span>By: <strong>${discussion.author}</strong> • ${discussion.replies} replies</span>
                        <span>${discussion.lastActivity}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    setInner("comm-tab-discussions", discussionsHTML);
}

function loadDemoNotifications() {
    const demoNotifications = [
        {
            id: 1,
            type: "assignment",
            title: "Assignment Due Reminder",
            message: "Python Basics assignment is due in 2 days",
            time: "1 hour ago",
            read: false
        },
        {
            id: 2,
            type: "achievement",
            title: "Student Achievement",
            message: "Andi Mahasiswa completed Module 3 with 95% score",
            time: "3 hours ago",
            read: false
        },
        {
            id: 3,
            type: "system",
            title: "System Update",
            message: "New features added to the analytics dashboard",
            time: "1 day ago",
            read: true
        }
    ];

    const notificationsHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: var(--gray-800); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🔔</span> Notifications
                </h4>
                <button class="btn" onclick="clearAllNotifications()" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--gray-500);">
                    🗑️ Clear All
                </button>
            </div>
        </div>

        <div style="max-height: 400px; overflow-y: auto;">
            ${demoNotifications.map(notification => {
                const iconMap = {
                    assignment: "📝",
                    achievement: "🏆",
                    system: "⚙️"
                };

                return `
                    <div style="background: ${notification.read ? 'var(--accent)' : 'var(--bg-light)'}; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; border-left: 4px solid ${notification.read ? 'var(--gray-400)' : 'var(--primary)'};">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 1.25rem;">${iconMap[notification.type]}</span>
                            <div style="flex: 1;">
                                <h5 style="color: var(--gray-800); margin: 0; font-size: 0.875rem; font-weight: 600;">${notification.title}</h5>
                                <p style="color: var(--gray-700); margin: 0; font-size: 0.75rem;">${notification.message}</p>
                            </div>
                            <span style="font-size: 0.75rem; color: var(--gray-600);">${notification.time}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    setInner("comm-tab-notifications", notificationsHTML);
}

function loadDemoCommunicationAnalytics() {
    const analyticsHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Communication Analytics
            </h4>
        </div>

        <!-- Communication Metrics -->
        <div class="grid" style="margin-bottom: 2rem;">
            <div style="background: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">24</div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">Messages This Week</div>
            </div>
            <div style="background: var(--secondary-light); padding: 1rem; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary-dark);">3</div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">Active Discussions</div>
            </div>
            <div style="background: var(--white); padding: 1rem; border-radius: 8px; text-align: center; border: 1px solid var(--accent);">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--info);">92%</div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">Response Rate</div>
            </div>
            <div style="background: var(--bg-light); padding: 1rem; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">2.5h</div>
                <div style="font-size: 0.75rem; color: var(--gray-600);">Avg Response Time</div>
            </div>
        </div>

        <!-- Communication Trends -->
        <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent); margin-bottom: 1.5rem;">
            <h5 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Weekly Communication Trends</h5>
            <div style="display: flex; align-items: end; height: 120px; gap: 8px;">
                ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const heights = [40, 65, 55, 80, 70, 30, 20];
                    return `
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="background: var(--info); width: 100%; height: ${heights[index]}px; border-radius: 4px 4px 0 0;"></div>
                            <div style="margin-top: 8px; font-size: 12px; color: var(--gray-600);">${day}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- Top Discussion Topics -->
        <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
            <h5 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Top Discussion Topics</h5>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${[
                    { topic: "Data Visualization", count: 15, color: "var(--primary)" },
                    { topic: "Python Programming", count: 12, color: "var(--secondary-dark)" },
                    { topic: "Statistical Analysis", count: 8, color: "var(--info)" },
                    { topic: "Machine Learning", count: 6, color: "var(--accent-dark)" }
                ].map(item => `
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 12px; height: 12px; background: ${item.color}; border-radius: 2px;"></div>
                        <span style="flex: 1; font-size: 0.875rem; color: var(--gray-700);">${item.topic}</span>
                        <span style="font-weight: 600; color: var(--gray-800); font-size: 0.875rem;">${item.count}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    setInner("comm-tab-analytics", analyticsHTML);
}

// Communication action functions
function markAllMessagesRead() {
    setInner("unread-messages", "0");
    UIComponents.showNotification("✅ All messages marked as read", "success");
}

function composeMessage() {
    const recipient = prompt("📧 Send message to (student name or 'all'):");
    if (recipient) {
        const message = prompt("💬 Enter your message:");
        if (message) {
            UIComponents.showNotification(`✅ Message sent to ${recipient}: "${message}"`, "success");
        }
    }
}

function openMessage(messageId) {
    UIComponents.showNotification(`📖 Opening message ID: ${messageId}`, "info");
}

function createAnnouncement() {
    const title = prompt("📢 Announcement title:");
    if (title) {
        const content = prompt("📝 Announcement content:");
        if (content) {
            UIComponents.showNotification(`✅ Announcement created: "${title}"`, "success");
        }
    }
}

function createDiscussion() {
    const title = prompt("💭 Discussion topic:");
    if (title) {
        UIComponents.showNotification(`✅ Discussion started: "${title}"`, "success");
    }
}

function openDiscussion(discussionId) {
    UIComponents.showNotification(`💬 Opening discussion ID: ${discussionId}`, "info");
}

function clearAllNotifications() {
    UIComponents.showNotification("🗑️ All notifications cleared", "success");
}

// Global functions for onclick handlers
window.switchCommTab = switchCommTab;
window.markAllMessagesRead = markAllMessagesRead;
window.composeMessage = composeMessage;
window.openMessage = openMessage;
window.createAnnouncement = createAnnouncement;
window.createDiscussion = createDiscussion;
window.openDiscussion = openDiscussion;
window.clearAllNotifications = clearAllNotifications;

// Page Content Loading Functions
function loadBerandaPage() {
    const berandaHTML = `
        <!-- Summary Cards -->
        <div class="grid" style="margin-bottom: 2rem;">
            <div class="metric-card" style="background: var(--primary); color: white;">
                <div class="metric-value" id="beranda-total-students">45</div>
                <div class="metric-label">Total Students</div>
            </div>
            <div class="metric-card" style="background: var(--success); color: white;">
                <div class="metric-value" id="beranda-avg-progress">73%</div>
                <div class="metric-label">Average Progress</div>
            </div>
            <div class="metric-card" style="background: var(--warning); color: white;">
                <div class="metric-value" id="beranda-unread-messages">3</div>
                <div class="metric-label">Unread Messages</div>
            </div>
            <div class="metric-card" style="background: var(--error); color: white;">
                <div class="metric-value" id="beranda-at-risk">3</div>
                <div class="metric-label">At-Risk Students</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Quick Actions
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <button class="btn" onclick="showPage('communication')" style="background: var(--info); padding: 1rem;">
                    📢 Send Announcement
                </button>
                <button class="btn" onclick="showPage('students')" style="background: var(--warning); padding: 1rem;">
                    ⚠️ View At-Risk Students
                </button>
                <button class="btn" onclick="exportReports()" style="background: var(--success); padding: 1rem;">
                    📊 Export Reports
                </button>
                <button class="btn" onclick="scheduleSession()" style="background: var(--primary); padding: 1rem;">
                    📅 Schedule Session
                </button>
            </div>
        </section>

        <!-- Today's Activities -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📅</span> Today's Activities
            </h3>
            <div id="todays-activities">
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--accent); border-radius: 8px; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.25rem;">🎓</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--gray-800);">Live Session: Data Analytics</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">14:00 - 16:00 | 24 students registered</div>
                    </div>
                    <span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Upcoming</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--accent); border-radius: 8px; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.25rem;">📝</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--gray-800);">Assignment Review: Python Basics</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Due: 23:59 | 18 submissions pending</div>
                    </div>
                    <span style="background: var(--warning); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Pending</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--accent); border-radius: 8px;">
                    <span style="font-size: 1.25rem;">📊</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--gray-800);">Weekly Progress Review</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Generate weekly reports for all classes</div>
                    </div>
                    <span style="background: var(--info); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Scheduled</span>
                </div>
            </div>
        </section>

        <!-- Recent Activity Feed -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📈</span> Recent Activity
            </h3>
            <div id="recent-activity-feed" style="max-height: 300px; overflow-y: auto;">
                <!-- Activity feed will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-beranda", berandaHTML);

    // Load beranda data
    setTimeout(() => {
        loadBerandaData();
        loadRecentActivityFeed();
    }, 100);
}

function loadBerandaData() {
    // Load summary card data
    try {
        setInner("beranda-total-students", "45");
        setInner("beranda-avg-progress", "73%");
        setInner("beranda-unread-messages", "3");
        setInner("beranda-at-risk", "3");
    } catch (error) {
        console.error("Failed to load beranda data:", error);
    }
}

function loadRecentActivityFeed() {
    const activities = [
        { time: "5 minutes ago", icon: "🏆", text: "Andi Mahasiswa achieved 95% on Module 3 Quiz", type: "achievement" },
        { time: "12 minutes ago", icon: "📝", text: "New assignment submitted by Sari Belajar", type: "submission" },
        { time: "25 minutes ago", icon: "💬", text: "New message from Maya Rajin about Module 2", type: "message" },
        { time: "1 hour ago", icon: "👥", text: "3 students joined the study group discussion", type: "social" },
        { time: "2 hours ago", icon: "📊", text: "Weekly analytics report generated", type: "system" },
        { time: "3 hours ago", icon: "🎓", text: "Live session completed: 24 students attended", type: "session" }
    ];

    const feedHTML = activities.map(activity => `
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-bottom: 1px solid var(--accent); last-child:border-bottom: none;">
            <span style="font-size: 1.25rem;">${activity.icon}</span>
            <div style="flex: 1;">
                <div style="color: var(--gray-800); font-size: 0.875rem;">${activity.text}</div>
                <div style="color: var(--gray-600); font-size: 0.75rem;">${activity.time}</div>
            </div>
        </div>
    `).join('');

    setInner("recent-activity-feed", feedHTML);
}

function loadAnalyticsPage() {
    const analyticsHTML = `
        <!-- AI Analytics Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🤖
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">AI Analytics Dashboard</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">AI-powered insights and learning analytics</p>
                </div>
                <div style="margin-left: auto;">
                    <button class="btn" id="btn-refresh-analytics" style="padding: 0.5rem 1rem; font-size: 0.75rem;">
                        🔄 Refresh Analytics
                    </button>
                </div>
            </div>

            <!-- AI Insights Grid -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="card" style="background: var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🕒</span> Learning Patterns
                    </h4>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Peak Time</span>
                        <span style="font-weight: 600; color: var(--primary);" id="peak-time">19:00-21:00 WIB</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Mobile Access</span>
                        <span style="font-weight: 600; color: var(--primary);" id="mobile-access">85%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Session Duration</span>
                        <span style="font-weight: 600; color: var(--primary);" id="session-duration">45 min</span>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent-dark);">
                        <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;" id="learning-insights">Students are most active in evening hours. Mobile learning is preferred.</p>
                    </div>
                </div>

                <div class="card" style="background: var(--secondary-light);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⚠️</span> At-Risk Students
                    </h4>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">High Risk</span>
                        <span style="font-weight: 600; color: var(--error);" id="high-risk-count">3</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Medium Risk</span>
                        <span style="font-weight: 600; color: var(--warning);" id="medium-risk-count">7</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Need Intervention</span>
                        <span style="font-weight: 600; color: var(--primary);" id="intervention-count">5</span>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent-dark);">
                        <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;" id="risk-insights">3 students need immediate intervention.</p>
                    </div>
                </div>

                <div class="card" style="background: var(--white);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📹</span> Content Effectiveness
                    </h4>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Top Content</span>
                        <span style="font-weight: 600; color: var(--primary);" id="top-content">Video Tutorials</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Engagement Rate</span>
                        <span style="font-weight: 600; color: var(--primary);" id="engagement-rate">78%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700);">Completion Rate</span>
                        <span style="font-weight: 600; color: var(--primary);" id="completion-rate-content">65%</span>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent-dark);">
                        <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;" id="content-insights">Video tutorials show highest engagement.</p>
                    </div>
                </div>

                <div class="card" style="background: var(--bg-light);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>💡</span> AI Recommendations
                    </h4>
                    <div style="margin-bottom: 1rem;">
                        <h5 style="color: var(--gray-700); font-size: 0.875rem; margin-bottom: 0.5rem;">Priority Actions:</h5>
                        <ul style="margin: 0; padding-left: 1rem; color: var(--gray-600); font-size: 0.875rem;" id="priority-actions">
                            <li>Schedule intervention sessions for 3 high-risk students</li>
                            <li>Increase video content in Module 2</li>
                            <li>Implement peer mentoring</li>
                        </ul>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--accent-dark);">
                        <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;" id="ai-strategy-recommendations">Focus on personalized learning paths and gamification.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Advanced Analytics Visualization -->
        <section class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="color: var(--gray-800); margin: 0; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📊</span> Advanced Analytics Dashboard
                </h3>
                <div style="display: flex; gap: 0.5rem;">
                    <select id="analytics-timeframe" style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white); font-size: 0.75rem;">
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="semester">This Semester</option>
                        <option value="all">All Time</option>
                    </select>
                    <button class="btn" id="btn-export-analytics" style="padding: 0.5rem 1rem; font-size: 0.75rem;">
                        📈 Export Charts
                    </button>
                </div>
            </div>

            <!-- Progress Trend Charts -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📈</span> Weekly Progress Trend
                    </h4>
                    <div id="progress-trend-chart" style="height: 200px; position: relative;">
                        <!-- Progress trend chart will be rendered here -->
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔥</span> Engagement Heatmap
                    </h4>
                    <div id="engagement-heatmap" style="height: 200px; position: relative;">
                        <!-- Engagement heatmap will be rendered here -->
                    </div>
                </div>
            </div>

            <!-- Performance Analytics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🎯</span> Performance Distribution
                    </h4>
                    <div id="performance-distribution" style="height: 200px; position: relative;">
                        <!-- Performance distribution chart will be rendered here -->
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⏱️</span> Learning Time Analysis
                    </h4>
                    <div id="time-analysis-chart" style="height: 200px; position: relative;">
                        <!-- Time analysis chart will be rendered here -->
                    </div>
                </div>
            </div>

            <!-- Comparative Analytics -->
            <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent); margin-bottom: 2rem;">
                <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📊</span> Class Performance Comparison
                </h4>
                <div id="class-comparison-chart" style="height: 250px; position: relative;">
                    <!-- Class comparison chart will be rendered here -->
                </div>
            </div>

            <!-- Learning Path Analytics -->
            <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🛤️</span> Learning Path Effectiveness
                </h4>
                <div id="learning-path-chart" style="height: 200px; position: relative;">
                    <!-- Learning path effectiveness chart will be rendered here -->
                </div>
            </div>
        </section>
    `;

    setInner("page-analytics", analyticsHTML);

    // Load analytics data and render charts
    setTimeout(() => {
        loadLearningPatterns();
        loadAtRiskStudents();
        loadContentEffectiveness();
        loadAIRecommendations();
        renderDemoCharts();
    }, 100);

    UIComponents.showNotification("📊 Analytics & Insights loaded successfully!", "success");
}

function loadStudentsPage() {
    const studentsHTML = `
        <!-- Real-time Student Monitoring Dashboard -->
        <section class="card">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    👥
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Real-time Student Monitoring</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Live tracking of student progress and engagement</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <div style="background: var(--accent); padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid var(--accent-dark);">
                        <span style="font-size: 0.75rem; color: var(--gray-600);">Last Update:</span>
                        <span style="font-weight: 600; color: var(--primary); font-size: 0.75rem;" id="last-update-time">Loading...</span>
                    </div>
                    <button class="btn" id="btn-toggle-realtime" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        🔴 Live Monitoring
                    </button>
                </div>
            </div>

            <!-- Real-time Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--accent);">
                    <div class="metric-value" id="online-students">12</div>
                    <div class="metric-label">Students Online Now</div>
                </div>
                <div class="metric-card" style="background: var(--secondary-light);">
                    <div class="metric-value" id="active-sessions">8</div>
                    <div class="metric-label">Active Learning Sessions</div>
                </div>
                <div class="metric-card" style="background: var(--white);">
                    <div class="metric-value" id="avg-engagement">78%</div>
                    <div class="metric-label">Avg Engagement Score</div>
                </div>
                <div class="metric-card" style="background: var(--bg-light);">
                    <div class="metric-value" id="completion-today">24</div>
                    <div class="metric-label">Lessons Completed Today</div>
                </div>
            </div>

            <!-- Filter and Action Controls -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <select id="filter-status" style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option value="all">All Students</option>
                        <option value="online">Online Now</option>
                        <option value="at-risk">At Risk</option>
                        <option value="high-performers">High Performers</option>
                        <option value="needs-attention">Needs Attention</option>
                    </select>
                    <select id="filter-module" style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option value="all">All Modules</option>
                        <option value="module-1">Module 1: Foundations</option>
                        <option value="module-2">Module 2: Analytics</option>
                        <option value="module-3">Module 3: Advanced</option>
                    </select>
                    <input type="search" id="search-students" placeholder="Search students..." style="padding: 0.5rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white); min-width: 200px;">
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-success" id="btn-export-progress">📊 Export Progress</button>
                    <button class="btn btn-warning" id="btn-send-reminder">📧 Send Reminder</button>
                    <button class="btn" id="btn-refresh-data">🔄 Refresh Data</button>
                </div>
            </div>

            <!-- Enhanced Student Table -->
            <div id="student-list" style="overflow-x: auto;">
                <p style="text-align: center; color: var(--gray-600); padding: 2rem;">Loading student data...</p>
            </div>

            <!-- Student Activity Timeline -->
            <div style="border-top: 1px solid var(--accent); padding-top: 1.5rem; margin-top: 1.5rem;">
                <h3 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span>📈</span> Recent Student Activity
                </h3>
                <div id="activity-timeline" style="background: var(--white); border: 1px solid var(--accent); border-radius: 8px; padding: 1rem; max-height: 300px; overflow-y: auto;">
                    <p style="color: var(--gray-600); text-align: center;">Loading recent activity...</p>
                </div>
            </div>
        </section>
    `;

    setInner("page-students", studentsHTML);

    // Load student data
    setTimeout(() => {
        loadRealTimeStats();
        loadActivityTimeline();
        renderDemoStudentTable();
        updateLastUpdateTime();
    }, 100);

    UIComponents.showNotification("👥 Student Management loaded successfully!", "success");
}

function loadCommunicationPage() {
    const communicationHTML = `
        <!-- Communication Center -->
        <section class="card">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--info); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    💬
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Communication Center</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Manage student communications and announcements</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <div style="background: var(--accent); padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid var(--accent-dark);">
                        <span style="font-size: 0.75rem; color: var(--gray-600);">Unread:</span>
                        <span style="font-weight: 600; color: var(--primary); font-size: 0.75rem;" id="unread-messages">3</span>
                    </div>
                    <button class="btn" id="btn-mark-all-read" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        ✅ Mark All Read
                    </button>
                </div>
            </div>

            <!-- Communication Tabs -->
            <div class="communication-tabs">
                <button class="comm-tab-button active" onclick="switchCommTab('messages')">📨 Messages</button>
                <button class="comm-tab-button" onclick="switchCommTab('announcements')">📢 Announcements</button>
                <button class="comm-tab-button" onclick="switchCommTab('discussions')">💭 Discussions</button>
                <button class="comm-tab-button" onclick="switchCommTab('notifications')">🔔 Notifications</button>
                <button class="comm-tab-button" onclick="switchCommTab('analytics')">📊 Comm Analytics</button>
            </div>

            <!-- Tab Content -->
            <div id="comm-tab-messages" class="comm-tab-content active">
                <!-- Messages content will be loaded here -->
            </div>

            <div id="comm-tab-announcements" class="comm-tab-content">
                <!-- Announcements content will be loaded here -->
            </div>

            <div id="comm-tab-discussions" class="comm-tab-content">
                <!-- Discussions content will be loaded here -->
            </div>

            <div id="comm-tab-notifications" class="comm-tab-content">
                <!-- Notifications content will be loaded here -->
            </div>

            <div id="comm-tab-analytics" class="comm-tab-content">
                <!-- Communication Analytics content will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-communication", communicationHTML);

    // Load communication data
    setTimeout(() => {
        loadDemoCommunicationData();
        setupCommunicationEventListeners();
    }, 100);

    UIComponents.showNotification("💬 Communication Center loaded successfully!", "success");
}

function loadWorkflowPage() {
    const workflowHTML = `
        <!-- D1-D24 Educator Workflow -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--secondary-dark); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    ⚡
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">D1-D24 Educator Workflow</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Comprehensive workflow tools for daily educator tasks</p>
                </div>
            </div>

            <!-- Workflow Categories -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="card" style="background: var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📅</span> Weekly Planning (D1-D6)
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" id="btn-weekly-planning" style="background: var(--primary); padding: 0.5rem;">
                            📋 Start Weekly Planning
                        </button>
                        <button class="btn" id="btn-pre-class-setup" style="background: var(--info); padding: 0.5rem;">
                            🎯 Pre-Class Setup
                        </button>
                        <button class="btn" id="btn-live-class" style="background: var(--success); padding: 0.5rem;">
                            🎓 Live Class Tools
                        </button>
                    </div>
                </div>

                <div class="card" style="background: var(--secondary-light);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📊</span> Analysis & Monitoring (D7-D18)
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" id="btn-post-analysis" style="background: var(--warning); padding: 0.5rem;">
                            📈 Post-Class Analysis
                        </button>
                        <button class="btn" id="btn-student-monitoring" style="background: var(--primary); padding: 0.5rem;">
                            👥 Student Monitoring
                        </button>
                        <button class="btn" id="btn-ai-oversight" style="background: var(--secondary-dark); padding: 0.5rem;">
                            🤖 AI Oversight
                        </button>
                    </div>
                </div>

                <div class="card" style="background: var(--white);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔄</span> Continuous Improvement (D19-D24)
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" style="background: var(--accent-dark); padding: 0.5rem;">
                            📝 Content Updates
                        </button>
                        <button class="btn" style="background: var(--info); padding: 0.5rem;">
                            🎯 Strategy Refinement
                        </button>
                        <button class="btn" style="background: var(--success); padding: 0.5rem;">
                            📊 Performance Review
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Class Management Tools -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎓</span> Class Management Tools
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.5rem;">📚 Course Materials</h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Manage course content and resources</p>
                    <button class="btn" style="background: var(--primary); width: 100%;">Manage Materials</button>
                </div>
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.5rem;">📝 Assignments</h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create and grade assignments</p>
                    <button class="btn" style="background: var(--warning); width: 100%;">Manage Assignments</button>
                </div>
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.5rem;">📊 Assessments</h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create quizzes and exams</p>
                    <button class="btn" style="background: var(--info); width: 100%;">Manage Assessments</button>
                </div>
                <div style="background: var(--accent); padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.5rem;">📅 Schedule</h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Manage class schedules</p>
                    <button class="btn" style="background: var(--success); width: 100%;">View Schedule</button>
                </div>
            </div>
        </section>

        <!-- Quick Actions -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Quick Workflow Actions
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
                <button class="btn" style="background: var(--primary); padding: 0.75rem 1rem;">
                    📋 Create Lesson Plan
                </button>
                <button class="btn" style="background: var(--success); padding: 0.75rem 1rem;">
                    🎯 Set Learning Objectives
                </button>
                <button class="btn" style="background: var(--warning); padding: 0.75rem 1rem;">
                    📊 Generate Reports
                </button>
                <button class="btn" style="background: var(--info); padding: 0.75rem 1rem;">
                    💬 Send Class Announcement
                </button>
                <button class="btn" style="background: var(--secondary-dark); padding: 0.75rem 1rem;">
                    🔄 Update Course Content
                </button>
                <button class="btn" style="background: var(--accent-dark); padding: 0.75rem 1rem;">
                    📈 Review Analytics
                </button>
            </div>
        </section>
    `;

    setInner("page-workflow", workflowHTML);
    UIComponents.showNotification("⚡ Workflow Tools loaded successfully!", "success");
}

function loadSettingsPage() {
    const settingsHTML = `
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>👤</span> Profile Settings
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Full Name</label>
                    <input type="text" value="Dr. Sarah Johnson" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Email</label>
                    <input type="email" value="sarah.johnson@university.edu" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Department</label>
                    <input type="text" value="Computer Science" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Phone</label>
                    <input type="tel" value="+1 (555) 123-4567" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                </div>
            </div>
        </section>

        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔔</span> Notification Preferences
            </h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                    <input type="checkbox" checked> Email notifications for new messages
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                    <input type="checkbox" checked> Weekly progress reports
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                    <input type="checkbox"> Daily activity summaries
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--gray-700);">
                    <input type="checkbox" checked> At-risk student alerts
                </label>
            </div>
        </section>

        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎨</span> Interface Preferences
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Theme</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option>Light Theme</option>
                        <option>Dark Theme</option>
                        <option>Auto (System)</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Language</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option>English</option>
                        <option>Bahasa Indonesia</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Timezone</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent); border-radius: 6px; background: var(--white);">
                        <option>UTC+7 (Jakarta)</option>
                        <option>UTC+0 (London)</option>
                        <option>UTC-5 (New York)</option>
                    </select>
                </div>
            </div>
            <div style="margin-top: 1.5rem;">
                <button class="btn" style="background: var(--primary); padding: 0.75rem 1.5rem;">
                    💾 Save Settings
                </button>
            </div>
        </section>
    `;

    setInner("page-settings", settingsHTML);
}

// Quick action functions
function exportReports() {
    UIComponents.showNotification("📊 Exporting comprehensive reports...", "success");
}

function scheduleSession() {
    UIComponents.showNotification("📅 Opening session scheduler...", "info");
}

// Global functions for onclick handlers
window.showPage = showPage;
window.exportReports = exportReports;
window.scheduleSession = scheduleSession;

// Setup additional event listeners for each page
function setupAnalyticsEventListeners() {
    // Analytics refresh button
    setTimeout(() => {
        const refreshBtn = document.getElementById("btn-refresh-analytics");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", refreshAnalytics);
        }

        const timeframeSelect = document.getElementById("analytics-timeframe");
        if (timeframeSelect) {
            timeframeSelect.addEventListener("change", updateAnalyticsTimeframe);
        }

        const exportBtn = document.getElementById("btn-export-analytics");
        if (exportBtn) {
            exportBtn.addEventListener("click", exportAnalytics);
        }
    }, 200);
}

function setupStudentEventListeners() {
    setTimeout(() => {
        const toggleBtn = document.getElementById("btn-toggle-realtime");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", toggleRealTimeMonitoring);
        }

        const exportBtn = document.getElementById("btn-export-progress");
        if (exportBtn) {
            exportBtn.addEventListener("click", exportStudentProgress);
        }

        const reminderBtn = document.getElementById("btn-send-reminder");
        if (reminderBtn) {
            reminderBtn.addEventListener("click", sendReminder);
        }

        const refreshBtn = document.getElementById("btn-refresh-data");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", refreshData);
        }

        const filterStatus = document.getElementById("filter-status");
        if (filterStatus) {
            filterStatus.addEventListener("change", filterStudents);
        }

        const filterModule = document.getElementById("filter-module");
        if (filterModule) {
            filterModule.addEventListener("change", filterStudents);
        }

        const searchInput = document.getElementById("search-students");
        if (searchInput) {
            searchInput.addEventListener("input", searchStudents);
        }
    }, 200);
}

function setupWorkflowEventListeners() {
    setTimeout(() => {
        const weeklyBtn = document.getElementById("btn-weekly-planning");
        if (weeklyBtn) {
            weeklyBtn.addEventListener("click", startWeeklyPlanning);
        }

        const preClassBtn = document.getElementById("btn-pre-class-setup");
        if (preClassBtn) {
            preClassBtn.addEventListener("click", startPreClassSetup);
        }

        const liveClassBtn = document.getElementById("btn-live-class");
        if (liveClassBtn) {
            liveClassBtn.addEventListener("click", startLiveClass);
        }

        const postAnalysisBtn = document.getElementById("btn-post-analysis");
        if (postAnalysisBtn) {
            postAnalysisBtn.addEventListener("click", startPostAnalysis);
        }

        const monitoringBtn = document.getElementById("btn-student-monitoring");
        if (monitoringBtn) {
            monitoringBtn.addEventListener("click", openStudentMonitoring);
        }

        const aiOversightBtn = document.getElementById("btn-ai-oversight");
        if (aiOversightBtn) {
            aiOversightBtn.addEventListener("click", openAIOversight);
        }
    }, 200);
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

function setupCommunicationEventListeners() {
    setTimeout(() => {
        const markAllReadBtn = document.getElementById("btn-mark-all-read");
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener("click", markAllMessagesRead);
        }
    }, 200);
}

// Week 3 Page Loading Functions
function loadAssessmentsPage() {
    const assessmentsHTML = `
        <!-- Assessment Management Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--secondary-dark); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    📝
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Assessment Management</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Create, manage, and analyze student assessments</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-create-assessment" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ➕ Create Assessment
                    </button>
                    <button class="btn" id="btn-import-questions" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📥 Import Questions
                    </button>
                </div>
            </div>

            <!-- Assessment Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="total-assessments">24</div>
                    <div class="metric-label">Total Assessments</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="active-assessments">8</div>
                    <div class="metric-label">Active Assessments</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="pending-grading">15</div>
                    <div class="metric-label">Pending Grading</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="avg-score">78%</div>
                    <div class="metric-label">Average Score</div>
                </div>
            </div>
        </section>

        <!-- Assessment Creation Tools -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🛠️</span> Assessment Creation Tools
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📋</span> Quick Quiz Builder
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create multiple choice, true/false, and short answer quizzes with automated grading.</p>
                    <button class="btn" onclick="openQuizBuilder()" style="background: var(--primary); width: 100%;">Start Quiz Builder</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--secondary-dark);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📄</span> Essay Assignment
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create essay assignments with rubric-based evaluation and plagiarism detection.</p>
                    <button class="btn" onclick="createEssayAssignment()" style="background: var(--secondary-dark); width: 100%;">Create Essay Assignment</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🧮</span> Math Assessment
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create mathematical assessments with formula support and step-by-step evaluation.</p>
                    <button class="btn" onclick="createMathAssessment()" style="background: var(--info); width: 100%;">Create Math Assessment</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>💻</span> Coding Challenge
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Create programming assignments with automated testing and code analysis.</p>
                    <button class="btn" onclick="createCodingChallenge()" style="background: var(--success); width: 100%;">Create Coding Challenge</button>
                </div>
            </div>
        </section>

        <!-- Recent Assessments -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Recent Assessments
            </h3>
            <div id="recent-assessments-list">
                <!-- Recent assessments will be loaded here -->
            </div>
        </section>

        <!-- Assessment Analytics -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📈</span> Assessment Analytics
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Score Distribution</h4>
                    <div id="score-distribution-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Score distribution chart will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Question Difficulty Analysis</h4>
                    <div id="difficulty-analysis-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Difficulty analysis chart will be rendered here
                    </div>
                </div>
            </div>
        </section>
    `;

    setInner("page-assessments", assessmentsHTML);

    // Load assessment data
    setTimeout(() => {
        loadRecentAssessments();
        setupAssessmentEventListeners();
    }, 100);

    UIComponents.showNotification("📝 Assessment Management loaded successfully!", "success");
}

function loadRecentAssessments() {
    const recentAssessments = [
        {
            id: 1,
            title: "Module 3 Quiz: Data Visualization",
            type: "Quiz",
            status: "Active",
            submissions: 18,
            totalStudents: 24,
            avgScore: 85,
            dueDate: "2024-12-15",
            created: "2024-12-10"
        },
        {
            id: 2,
            title: "Python Programming Assignment",
            type: "Coding",
            status: "Grading",
            submissions: 22,
            totalStudents: 24,
            avgScore: 78,
            dueDate: "2024-12-12",
            created: "2024-12-05"
        },
        {
            id: 3,
            title: "Data Analysis Essay",
            type: "Essay",
            status: "Completed",
            submissions: 24,
            totalStudents: 24,
            avgScore: 82,
            dueDate: "2024-12-08",
            created: "2024-12-01"
        },
        {
            id: 4,
            title: "Statistics Fundamentals Test",
            type: "Test",
            status: "Draft",
            submissions: 0,
            totalStudents: 24,
            avgScore: 0,
            dueDate: "2024-12-20",
            created: "2024-12-11"
        }
    ];

    const assessmentsHTML = recentAssessments.map(assessment => {
        const statusColors = {
            'Active': 'var(--success)',
            'Grading': 'var(--warning)',
            'Completed': 'var(--info)',
            'Draft': 'var(--gray-500)'
        };

        const typeIcons = {
            'Quiz': '📋',
            'Coding': '💻',
            'Essay': '📄',
            'Test': '📝'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[assessment.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">${typeIcons[assessment.type]}</span>
                        <div>
                            <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${assessment.title}</h4>
                            <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${assessment.type} • Created: ${new Date(assessment.created).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                    <span style="background: ${statusColors[assessment.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${assessment.status}
                    </span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${assessment.submissions}/${assessment.totalStudents}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Submissions</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--secondary-dark);">${assessment.avgScore}%</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Avg Score</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: var(--info);">${new Date(assessment.dueDate).toLocaleDateString('id-ID')}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Due Date</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="viewAssessment(${assessment.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        👁️ View
                    </button>
                    <button class="btn" onclick="editAssessment(${assessment.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Edit
                    </button>
                    <button class="btn" onclick="gradeAssessment(${assessment.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        📊 Grade
                    </button>
                    <button class="btn" onclick="duplicateAssessment(${assessment.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        📋 Duplicate
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("recent-assessments-list", assessmentsHTML);
}

function setupAssessmentEventListeners() {
    setTimeout(() => {
        const createBtn = document.getElementById("btn-create-assessment");
        if (createBtn) {
            createBtn.addEventListener("click", createNewAssessment);
        }

        const importBtn = document.getElementById("btn-import-questions");
        if (importBtn) {
            importBtn.addEventListener("click", importQuestions);
        }
    }, 200);
}

// Assessment action functions
function createNewAssessment() {
    UIComponents.showNotification("📝 Opening assessment creation wizard...", "info");
}

function importQuestions() {
    UIComponents.showNotification("📥 Opening question import tool...", "info");
}

function openQuizBuilder() {
    UIComponents.showNotification("📋 Opening Quick Quiz Builder...", "info");
}

function createEssayAssignment() {
    UIComponents.showNotification("📄 Creating new essay assignment...", "info");
}

function createMathAssessment() {
    UIComponents.showNotification("🧮 Opening Math Assessment Creator...", "info");
}

function createCodingChallenge() {
    UIComponents.showNotification("💻 Creating new coding challenge...", "info");
}

function viewAssessment(id) {
    UIComponents.showNotification(`👁️ Viewing assessment ID: ${id}`, "info");
}

function editAssessment(id) {
    UIComponents.showNotification(`✏️ Editing assessment ID: ${id}`, "info");
}

function gradeAssessment(id) {
    UIComponents.showNotification(`📊 Opening grading interface for assessment ID: ${id}`, "info");
}

function duplicateAssessment(id) {
    UIComponents.showNotification(`📋 Duplicating assessment ID: ${id}`, "success");
}

function loadAIRecommendationsPage() {
    const aiRecommendationsHTML = `
        <!-- AI-Powered Learning Recommendations Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🤖
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">AI-Powered Learning Recommendations</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Personalized learning recommendations and adaptive content delivery</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-generate-recommendations" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🔄 Generate New Recommendations
                    </button>
                    <button class="btn" id="btn-ai-settings" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ⚙️ AI Settings
                    </button>
                </div>
            </div>

            <!-- AI Recommendation Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="active-recommendations">156</div>
                    <div class="metric-label">Active Recommendations</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="recommendation-accuracy">94%</div>
                    <div class="metric-label">Accuracy Rate</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="students-helped">38</div>
                    <div class="metric-label">Students Helped</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="improvement-rate">+23%</div>
                    <div class="metric-label">Performance Improvement</div>
                </div>
            </div>
        </section>

        <!-- Personalized Learning Paths -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🛤️</span> Personalized Learning Paths
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🎯</span> Adaptive Difficulty Adjustment
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">AI automatically adjusts content difficulty based on student performance and learning pace.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Students with Adjusted Paths</span>
                            <span style="font-weight: 600; color: var(--primary);">28</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Average Improvement</span>
                            <span style="font-weight: 600; color: var(--success);">+31%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewAdaptivePaths()" style="background: var(--primary); width: 100%;">View Adaptive Paths</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--secondary-dark);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🧠</span> Learning Style Optimization
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Content delivery optimized based on individual learning styles (Visual, Auditory, Kinesthetic).</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Visual Learners</span>
                            <span style="font-weight: 600; color: var(--info);">18 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Auditory Learners</span>
                            <span style="font-weight: 600; color: var(--warning);">12 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Kinesthetic Learners</span>
                            <span style="font-weight: 600; color: var(--success);">15 students</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewLearningStyles()" style="background: var(--secondary-dark); width: 100%;">Analyze Learning Styles</button>
                </div>
            </div>
        </section>

        <!-- Content Recommendation Engine -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📚</span> Content Recommendation Engine
            </h3>
            <div id="content-recommendations-list">
                <!-- Content recommendations will be loaded here -->
            </div>
        </section>

        <!-- Predictive Analytics -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔮</span> Predictive Analytics for Student Success
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Success Prediction Model</h4>
                    <div id="success-prediction-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Success prediction visualization will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Intervention Recommendations</h4>
                    <div id="intervention-recommendations" style="height: 200px; overflow-y: auto;">
                        <!-- Intervention recommendations will be loaded here -->
                    </div>
                </div>
            </div>
        </section>

        <!-- AI Model Performance -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> AI Model Performance
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Model Accuracy Trends</h4>
                    <div id="model-accuracy-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Model accuracy chart will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Recommendation Effectiveness</h4>
                    <div id="recommendation-effectiveness-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Recommendation effectiveness chart will be rendered here
                    </div>
                </div>
            </div>
        </section>
    `;

    setInner("page-ai-recommendations", aiRecommendationsHTML);

    // Load AI recommendations data
    setTimeout(() => {
        loadContentRecommendations();
        loadInterventionRecommendations();
        setupAIRecommendationsEventListeners();
    }, 100);

    UIComponents.showNotification("🤖 AI Recommendations loaded successfully!", "success");
}

function loadContentRecommendations() {
    const contentRecommendations = [
        {
            id: 1,
            type: "Video Content",
            title: "Interactive Data Visualization Tutorial",
            targetStudents: ["Andi Mahasiswa", "Sari Belajar"],
            reason: "Students struggling with visual concepts",
            confidence: 92,
            expectedImprovement: "+25%",
            priority: "High"
        },
        {
            id: 2,
            type: "Practice Exercise",
            title: "Python Coding Challenges - Beginner Level",
            targetStudents: ["Maya Rajin", "Budi Cerdas"],
            reason: "Need more hands-on programming practice",
            confidence: 88,
            expectedImprovement: "+18%",
            priority: "Medium"
        },
        {
            id: 3,
            type: "Reading Material",
            title: "Statistics Fundamentals - Visual Guide",
            targetStudents: ["Andi Mahasiswa"],
            reason: "Visual learner needing conceptual reinforcement",
            confidence: 95,
            expectedImprovement: "+30%",
            priority: "High"
        },
        {
            id: 4,
            type: "Interactive Quiz",
            title: "Data Analysis Concepts - Adaptive Quiz",
            targetStudents: ["All Students"],
            reason: "Reinforce learning with adaptive difficulty",
            confidence: 85,
            expectedImprovement: "+15%",
            priority: "Low"
        }
    ];

    const recommendationsHTML = contentRecommendations.map(rec => {
        const priorityColors = {
            'High': 'var(--error)',
            'Medium': 'var(--warning)',
            'Low': 'var(--info)'
        };

        const typeIcons = {
            'Video Content': '🎥',
            'Practice Exercise': '💻',
            'Reading Material': '📖',
            'Interactive Quiz': '📋'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${priorityColors[rec.priority]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">${typeIcons[rec.type]}</span>
                        <div>
                            <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${rec.title}</h4>
                            <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${rec.type} • Confidence: ${rec.confidence}%</p>
                        </div>
                    </div>
                    <span style="background: ${priorityColors[rec.priority]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${rec.priority} Priority
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="margin-bottom: 0.75rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Target Students:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${Array.isArray(rec.targetStudents) ? rec.targetStudents.join(', ') : rec.targetStudents}</span>
                    </div>
                    <div style="margin-bottom: 0.75rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Reason:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${rec.reason}</span>
                    </div>
                    <div>
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Expected Improvement:</strong>
                        <span style="color: var(--success); font-size: 0.875rem; font-weight: 600;"> ${rec.expectedImprovement}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="implementRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ✅ Implement
                    </button>
                    <button class="btn" onclick="customizeRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Customize
                    </button>
                    <button class="btn" onclick="dismissRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--gray-500);">
                        ❌ Dismiss
                    </button>
                    <button class="btn" onclick="viewRecommendationDetails(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        📊 Details
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("content-recommendations-list", recommendationsHTML);
}

function loadInterventionRecommendations() {
    const interventions = [
        {
            student: "Andi Mahasiswa",
            risk: "Medium",
            intervention: "Schedule 1-on-1 tutoring session",
            urgency: "This Week",
            success_probability: 85
        },
        {
            student: "Maya Rajin",
            risk: "High",
            intervention: "Provide additional practice materials",
            urgency: "Immediate",
            success_probability: 92
        },
        {
            student: "Sari Belajar",
            risk: "Low",
            intervention: "Encourage peer mentoring role",
            urgency: "Next Month",
            success_probability: 78
        }
    ];

    const interventionsHTML = interventions.map(intervention => {
        const riskColors = {
            'High': 'var(--error)',
            'Medium': 'var(--warning)',
            'Low': 'var(--success)'
        };

        return `
            <div style="background: var(--accent); padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 3px solid ${riskColors[intervention.risk]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="color: var(--gray-800); font-size: 0.875rem;">${intervention.student}</strong>
                    <span style="background: ${riskColors[intervention.risk]}; color: white; padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; font-weight: 600;">
                        ${intervention.risk} Risk
                    </span>
                </div>
                <p style="color: var(--gray-700); font-size: 0.75rem; margin-bottom: 0.5rem;">${intervention.intervention}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--gray-600); font-size: 0.625rem;">Urgency: ${intervention.urgency}</span>
                    <span style="color: var(--success); font-size: 0.625rem; font-weight: 600;">Success: ${intervention.success_probability}%</span>
                </div>
            </div>
        `;
    }).join('');

    setInner("intervention-recommendations", interventionsHTML);
}

function setupAIRecommendationsEventListeners() {
    setTimeout(() => {
        const generateBtn = document.getElementById("btn-generate-recommendations");
        if (generateBtn) {
            generateBtn.addEventListener("click", generateNewRecommendations);
        }

        const settingsBtn = document.getElementById("btn-ai-settings");
        if (settingsBtn) {
            settingsBtn.addEventListener("click", openAISettings);
        }
    }, 200);
}

function loadReportsPage() {
    const reportsHTML = `
        <!-- Advanced Reporting & Export Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--info); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    📊
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Advanced Reporting & Export System</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Generate comprehensive reports and export data in multiple formats</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-generate-report" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        📈 Generate Report
                    </button>
                    <button class="btn" id="btn-schedule-report" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        ⏰ Schedule Reports
                    </button>
                </div>
            </div>

            <!-- Report Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="total-reports">47</div>
                    <div class="metric-label">Total Reports Generated</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="scheduled-reports">12</div>
                    <div class="metric-label">Scheduled Reports</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="export-formats">5</div>
                    <div class="metric-label">Export Formats</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="data-points">2.4K</div>
                    <div class="metric-label">Data Points Analyzed</div>
                </div>
            </div>
        </section>

        <!-- Quick Report Generation -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Quick Report Generation
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>👥</span> Student Progress Report
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Comprehensive overview of individual and class progress with detailed analytics.</p>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>All Students</option>
                            <option>Class A</option>
                            <option>Class B</option>
                            <option>At-Risk Students</option>
                        </select>
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>This Month</option>
                            <option>This Week</option>
                            <option>This Semester</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generateProgressReport()" style="background: var(--primary); width: 100%;">Generate Progress Report</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--secondary-dark);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📝</span> Assessment Analytics Report
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Detailed analysis of assessment performance, difficulty, and effectiveness.</p>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>All Assessments</option>
                            <option>Quizzes Only</option>
                            <option>Assignments Only</option>
                            <option>Exams Only</option>
                        </select>
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                            <option>This Semester</option>
                            <option>All Time</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generateAssessmentReport()" style="background: var(--secondary-dark); width: 100%;">Generate Assessment Report</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>💬</span> Engagement Analytics Report
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Communication patterns, participation rates, and engagement metrics.</p>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>All Activities</option>
                            <option>Discussion Forums</option>
                            <option>Live Sessions</option>
                            <option>Assignments</option>
                        </select>
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Custom</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generateEngagementReport()" style="background: var(--info); width: 100%;">Generate Engagement Report</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🤖</span> AI Insights Report
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">AI-generated insights, recommendations, and predictive analytics summary.</p>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>All Insights</option>
                            <option>Learning Patterns</option>
                            <option>Risk Predictions</option>
                            <option>Recommendations</option>
                        </select>
                        <select style="flex: 1; padding: 0.5rem; border: 1px solid var(--accent-dark); border-radius: 4px; background: var(--white); font-size: 0.75rem;">
                            <option>Latest</option>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Trending</option>
                        </select>
                    </div>
                    <button class="btn" onclick="generateAIInsightsReport()" style="background: var(--success); width: 100%;">Generate AI Report</button>
                </div>
            </div>
        </section>

        <!-- Custom Report Builder -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🛠️</span> Custom Report Builder
            </h3>
            <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Report Type</label>
                        <select id="custom-report-type" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Comprehensive Dashboard</option>
                            <option>Student Performance</option>
                            <option>Assessment Analysis</option>
                            <option>Engagement Metrics</option>
                            <option>AI Recommendations</option>
                            <option>Custom Analytics</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Date Range</label>
                        <select id="custom-date-range" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Semester</option>
                            <option>This Year</option>
                            <option>All Time</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Export Format</label>
                        <select id="custom-export-format" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>PDF Report</option>
                            <option>Excel Spreadsheet</option>
                            <option>CSV Data</option>
                            <option>PowerPoint Presentation</option>
                            <option>Interactive Dashboard</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Include Charts</label>
                        <select id="custom-include-charts" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>All Visualizations</option>
                            <option>Charts Only</option>
                            <option>Tables Only</option>
                            <option>Summary Only</option>
                            <option>Custom Selection</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn" onclick="previewCustomReport()" style="background: var(--info); flex: 1;">👁️ Preview Report</button>
                    <button class="btn" onclick="generateCustomReport()" style="background: var(--primary); flex: 1;">📊 Generate Custom Report</button>
                    <button class="btn" onclick="saveReportTemplate()" style="background: var(--success); flex: 1;">💾 Save as Template</button>
                </div>
            </div>
        </section>

        <!-- Recent Reports -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📋</span> Recent Reports
            </h3>
            <div id="recent-reports-list">
                <!-- Recent reports will be loaded here -->
            </div>
        </section>

        <!-- Scheduled Reports -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⏰</span> Scheduled Reports
            </h3>
            <div id="scheduled-reports-list">
                <!-- Scheduled reports will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-reports", reportsHTML);

    // Load reports data
    setTimeout(() => {
        loadRecentReports();
        loadScheduledReports();
        setupReportsEventListeners();
    }, 100);

    UIComponents.showNotification("📊 Reports & Export loaded successfully!", "success");
}

function loadRecentReports() {
    const recentReports = [
        {
            id: 1,
            title: "Weekly Student Progress Report",
            type: "Progress Report",
            format: "PDF",
            generated: "2024-12-11 14:30",
            size: "2.4 MB",
            status: "Completed",
            downloads: 3
        },
        {
            id: 2,
            title: "Module 3 Assessment Analytics",
            type: "Assessment Report",
            format: "Excel",
            generated: "2024-12-10 09:15",
            size: "1.8 MB",
            status: "Completed",
            downloads: 7
        },
        {
            id: 3,
            title: "AI Insights Summary - December",
            type: "AI Report",
            format: "PowerPoint",
            generated: "2024-12-09 16:45",
            size: "5.2 MB",
            status: "Completed",
            downloads: 12
        },
        {
            id: 4,
            title: "Engagement Analytics - Q4",
            type: "Engagement Report",
            format: "PDF",
            generated: "2024-12-08 11:20",
            size: "3.1 MB",
            status: "Processing",
            downloads: 0
        },
        {
            id: 5,
            title: "Custom Dashboard Export",
            type: "Custom Report",
            format: "Interactive",
            generated: "2024-12-07 13:10",
            size: "890 KB",
            status: "Completed",
            downloads: 5
        }
    ];

    const reportsHTML = recentReports.map(report => {
        const statusColors = {
            'Completed': 'var(--success)',
            'Processing': 'var(--warning)',
            'Failed': 'var(--error)'
        };

        const formatIcons = {
            'PDF': '📄',
            'Excel': '📊',
            'PowerPoint': '📋',
            'CSV': '📈',
            'Interactive': '🌐'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[report.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">${formatIcons[report.format]}</span>
                        <div>
                            <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${report.title}</h4>
                            <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${report.type} • ${report.format} • ${report.size}</p>
                        </div>
                    </div>
                    <span style="background: ${statusColors[report.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${report.status}
                    </span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div style="text-align: center;">
                        <div style="font-size: 1rem; font-weight: 700; color: var(--primary);">${new Date(report.generated).toLocaleDateString('id-ID')}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Generated</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1rem; font-weight: 700; color: var(--secondary-dark);">${new Date(report.generated).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Time</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1rem; font-weight: 700; color: var(--info);">${report.downloads}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Downloads</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${report.status === 'Completed' ? `
                        <button class="btn" onclick="downloadReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                            📥 Download
                        </button>
                        <button class="btn" onclick="shareReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                            📤 Share
                        </button>
                    ` : ''}
                    <button class="btn" onclick="viewReportDetails(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        👁️ View Details
                    </button>
                    <button class="btn" onclick="duplicateReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        📋 Duplicate
                    </button>
                    <button class="btn" onclick="deleteReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("recent-reports-list", reportsHTML);
}

function loadScheduledReports() {
    const scheduledReports = [
        {
            id: 1,
            title: "Weekly Progress Summary",
            type: "Progress Report",
            schedule: "Every Monday 08:00",
            nextRun: "2024-12-16 08:00",
            format: "PDF",
            recipients: "admin@university.edu, dean@university.edu",
            status: "Active"
        },
        {
            id: 2,
            title: "Monthly Assessment Analytics",
            type: "Assessment Report",
            schedule: "1st of every month",
            nextRun: "2025-01-01 09:00",
            format: "Excel",
            recipients: "department@university.edu",
            status: "Active"
        },
        {
            id: 3,
            title: "Quarterly AI Insights",
            type: "AI Report",
            schedule: "Every 3 months",
            nextRun: "2025-03-01 10:00",
            format: "PowerPoint",
            recipients: "research@university.edu",
            status: "Paused"
        }
    ];

    const scheduledHTML = scheduledReports.map(report => {
        const statusColors = {
            'Active': 'var(--success)',
            'Paused': 'var(--warning)',
            'Disabled': 'var(--error)'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[report.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${report.title}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${report.type} • ${report.format} • ${report.schedule}</p>
                    </div>
                    <span style="background: ${statusColors[report.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${report.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Next Run:</strong>
                        <span style="color: var(--primary); font-size: 0.875rem; font-weight: 600;"> ${new Date(report.nextRun).toLocaleString('id-ID')}</span>
                    </div>
                    <div>
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Recipients:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${report.recipients}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="editScheduledReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Edit
                    </button>
                    <button class="btn" onclick="runScheduledReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ▶️ Run Now
                    </button>
                    <button class="btn" onclick="toggleScheduledReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        ${report.status === 'Active' ? '⏸️ Pause' : '▶️ Resume'}
                    </button>
                    <button class="btn" onclick="deleteScheduledReport(${report.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("scheduled-reports-list", scheduledHTML);
}

function loadIntegrationsPage() {
    const integrationsHTML = `
        <!-- Integration & API Management Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--secondary-dark); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🔗
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Integration & API Management</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Manage external integrations and API connections</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-add-integration" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ➕ Add Integration
                    </button>
                    <button class="btn" id="btn-api-docs" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📚 API Documentation
                    </button>
                </div>
            </div>

            <!-- Integration Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="active-integrations">12</div>
                    <div class="metric-label">Active Integrations</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="api-calls-today">2.4K</div>
                    <div class="metric-label">API Calls Today</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="webhook-events">156</div>
                    <div class="metric-label">Webhook Events</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="sync-status">98%</div>
                    <div class="metric-label">Sync Success Rate</div>
                </div>
            </div>
        </section>

        <!-- Available Integrations -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🌐</span> Available Integrations
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🎓</span> Learning Management Systems
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Connect with popular LMS platforms for seamless data exchange.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" onclick="connectLMS('moodle')" style="background: var(--primary); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Moodle
                        </button>
                        <button class="btn" onclick="connectLMS('canvas')" style="background: var(--info); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Canvas
                        </button>
                        <button class="btn" onclick="connectLMS('blackboard')" style="background: var(--secondary-dark); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Blackboard
                        </button>
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--secondary-dark);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>💬</span> Communication Tools
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Integrate with communication platforms for enhanced collaboration.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" onclick="connectComm('slack')" style="background: var(--success); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Slack
                        </button>
                        <button class="btn" onclick="connectComm('teams')" style="background: var(--info); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Microsoft Teams
                        </button>
                        <button class="btn" onclick="connectComm('discord')" style="background: var(--warning); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Discord
                        </button>
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📊</span> Analytics & Reporting
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Connect with analytics platforms for advanced data insights.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" onclick="connectAnalytics('googleanalytics')" style="background: var(--warning); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Google Analytics
                        </button>
                        <button class="btn" onclick="connectAnalytics('powerbi')" style="background: var(--info); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Power BI
                        </button>
                        <button class="btn" onclick="connectAnalytics('tableau')" style="background: var(--primary); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Tableau
                        </button>
                    </div>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>☁️</span> Cloud Storage
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Integrate with cloud storage for file management and backup.</p>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn" onclick="connectStorage('googledrive')" style="background: var(--success); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Google Drive
                        </button>
                        <button class="btn" onclick="connectStorage('onedrive')" style="background: var(--info); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect OneDrive
                        </button>
                        <button class="btn" onclick="connectStorage('dropbox')" style="background: var(--primary); padding: 0.5rem; font-size: 0.75rem;">
                            🔗 Connect Dropbox
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Active Integrations -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔌</span> Active Integrations
            </h3>
            <div id="active-integrations-list">
                <!-- Active integrations will be loaded here -->
            </div>
        </section>

        <!-- API Management -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔑</span> API Management
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">API Keys</h4>
                    <div id="api-keys-list">
                        <!-- API keys will be loaded here -->
                    </div>
                    <button class="btn" onclick="generateAPIKey()" style="background: var(--primary); width: 100%; margin-top: 1rem;">
                        🔑 Generate New API Key
                    </button>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">API Usage Analytics</h4>
                    <div id="api-usage-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        API usage chart will be rendered here
                    </div>
                </div>
            </div>
        </section>

        <!-- Webhook Configuration -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔔</span> Webhook Configuration
            </h3>
            <div id="webhook-list">
                <!-- Webhooks will be loaded here -->
            </div>
            <button class="btn" onclick="addWebhook()" style="background: var(--success); margin-top: 1rem;">
                ➕ Add New Webhook
            </button>
        </section>

        <!-- Data Synchronization -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔄</span> Data Synchronization
            </h3>
            <div id="sync-status-list">
                <!-- Sync status will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-integrations", integrationsHTML);

    // Load integrations data
    setTimeout(() => {
        loadActiveIntegrations();
        loadAPIKeys();
        loadWebhooks();
        loadSyncStatus();
        setupIntegrationsEventListeners();
    }, 100);

    UIComponents.showNotification("🔗 Integrations & API Management loaded successfully!", "success");
}

function loadActiveIntegrations() {
    const activeIntegrations = [
        {
            id: 1,
            name: "Google Classroom",
            type: "LMS",
            status: "Connected",
            lastSync: "2024-12-11 14:30",
            dataPoints: "1,245 students synced",
            health: "Healthy"
        },
        {
            id: 2,
            name: "Slack Workspace",
            type: "Communication",
            status: "Connected",
            lastSync: "2024-12-11 15:45",
            dataPoints: "24 channels active",
            health: "Healthy"
        },
        {
            id: 3,
            name: "Google Analytics",
            type: "Analytics",
            status: "Connected",
            lastSync: "2024-12-11 16:00",
            dataPoints: "Real-time tracking",
            health: "Healthy"
        },
        {
            id: 4,
            name: "OneDrive Storage",
            type: "Storage",
            status: "Connected",
            lastSync: "2024-12-11 13:20",
            dataPoints: "2.4GB synchronized",
            health: "Warning"
        },
        {
            id: 5,
            name: "Zoom Integration",
            type: "Video Conferencing",
            status: "Disconnected",
            lastSync: "2024-12-10 09:15",
            dataPoints: "Connection lost",
            health: "Error"
        }
    ];

    const integrationsHTML = activeIntegrations.map(integration => {
        const statusColors = {
            'Connected': 'var(--success)',
            'Disconnected': 'var(--error)',
            'Connecting': 'var(--warning)'
        };

        const healthColors = {
            'Healthy': 'var(--success)',
            'Warning': 'var(--warning)',
            'Error': 'var(--error)'
        };

        const typeIcons = {
            'LMS': '🎓',
            'Communication': '💬',
            'Analytics': '📊',
            'Storage': '☁️',
            'Video Conferencing': '📹'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[integration.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 1.5rem;">${typeIcons[integration.type]}</span>
                        <div>
                            <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${integration.name}</h4>
                            <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${integration.type} • ${integration.dataPoints}</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <span style="background: ${statusColors[integration.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${integration.status}
                        </span>
                        <span style="background: ${healthColors[integration.health]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${integration.health}
                        </span>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Last Sync:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${new Date(integration.lastSync).toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="configureIntegration(${integration.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ⚙️ Configure
                    </button>
                    <button class="btn" onclick="testIntegration(${integration.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🧪 Test Connection
                    </button>
                    <button class="btn" onclick="syncIntegration(${integration.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        🔄 Sync Now
                    </button>
                    <button class="btn" onclick="disconnectIntegration(${integration.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🔌 Disconnect
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("active-integrations-list", integrationsHTML);
}

function loadAPIKeys() {
    const apiKeys = [
        {
            id: 1,
            name: "Production API Key",
            key: "ak_prod_1234567890abcdef",
            created: "2024-11-15",
            lastUsed: "2024-12-11 16:30",
            requests: "2,456",
            status: "Active"
        },
        {
            id: 2,
            name: "Development API Key",
            key: "ak_dev_abcdef1234567890",
            created: "2024-12-01",
            lastUsed: "2024-12-11 14:20",
            requests: "892",
            status: "Active"
        },
        {
            id: 3,
            name: "Testing API Key",
            key: "ak_test_567890abcdef1234",
            created: "2024-12-05",
            lastUsed: "2024-12-10 11:45",
            requests: "156",
            status: "Limited"
        }
    ];

    const apiKeysHTML = apiKeys.map(key => {
        const statusColors = {
            'Active': 'var(--success)',
            'Limited': 'var(--warning)',
            'Disabled': 'var(--error)'
        };

        return `
            <div style="background: var(--accent); padding: 1rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 3px solid ${statusColors[key.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="color: var(--gray-800); font-size: 0.875rem;">${key.name}</strong>
                    <span style="background: ${statusColors[key.status]}; color: white; padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; font-weight: 600;">
                        ${key.status}
                    </span>
                </div>
                <div style="font-family: monospace; font-size: 0.75rem; color: var(--gray-700); margin-bottom: 0.5rem; background: var(--white); padding: 0.5rem; border-radius: 4px;">
                    ${key.key}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.625rem; color: var(--gray-600);">
                    <span>Requests: ${key.requests}</span>
                    <span>Last used: ${new Date(key.lastUsed).toLocaleDateString('id-ID')}</span>
                </div>
                <div style="display: flex; gap: 0.25rem; margin-top: 0.5rem;">
                    <button class="btn" onclick="copyAPIKey('${key.key}')" style="padding: 0.25rem 0.5rem; font-size: 0.625rem; background: var(--info);">📋 Copy</button>
                    <button class="btn" onclick="regenerateAPIKey(${key.id})" style="padding: 0.25rem 0.5rem; font-size: 0.625rem; background: var(--warning);">🔄 Regenerate</button>
                    <button class="btn" onclick="deleteAPIKey(${key.id})" style="padding: 0.25rem 0.5rem; font-size: 0.625rem; background: var(--error);">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');

    setInner("api-keys-list", apiKeysHTML);
}

function loadWebhooks() {
    const webhooks = [
        {
            id: 1,
            name: "Student Progress Updates",
            url: "https://api.university.edu/webhooks/progress",
            events: ["student.progress.updated", "assessment.completed"],
            status: "Active",
            lastTriggered: "2024-12-11 16:45",
            successRate: "98%"
        },
        {
            id: 2,
            name: "Assessment Notifications",
            url: "https://notifications.edu/webhooks/assessments",
            events: ["assessment.created", "assessment.graded"],
            status: "Active",
            lastTriggered: "2024-12-11 15:30",
            successRate: "100%"
        },
        {
            id: 3,
            name: "Communication Alerts",
            url: "https://alerts.university.edu/webhooks/comm",
            events: ["message.sent", "announcement.posted"],
            status: "Paused",
            lastTriggered: "2024-12-10 14:20",
            successRate: "95%"
        }
    ];

    const webhooksHTML = webhooks.map(webhook => {
        const statusColors = {
            'Active': 'var(--success)',
            'Paused': 'var(--warning)',
            'Failed': 'var(--error)'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[webhook.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${webhook.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem; font-family: monospace;">${webhook.url}</p>
                    </div>
                    <span style="background: ${statusColors[webhook.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${webhook.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="margin-bottom: 0.5rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Events:</strong>
                        <span style="color: var(--gray-700); font-size: 0.875rem;"> ${webhook.events.join(', ')}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--gray-600); font-size: 0.75rem;">Last triggered: ${new Date(webhook.lastTriggered).toLocaleString('id-ID')}</span>
                        <span style="color: var(--success); font-size: 0.75rem; font-weight: 600;">Success rate: ${webhook.successRate}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="editWebhook(${webhook.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Edit
                    </button>
                    <button class="btn" onclick="testWebhook(${webhook.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🧪 Test
                    </button>
                    <button class="btn" onclick="toggleWebhook(${webhook.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        ${webhook.status === 'Active' ? '⏸️ Pause' : '▶️ Resume'}
                    </button>
                    <button class="btn" onclick="deleteWebhook(${webhook.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("webhook-list", webhooksHTML);
}

function loadSyncStatus() {
    const syncItems = [
        {
            id: 1,
            source: "Google Classroom",
            target: "AgenticLearn Database",
            type: "Student Data",
            status: "Syncing",
            progress: 75,
            lastSync: "2024-12-11 16:30",
            nextSync: "2024-12-11 17:00"
        },
        {
            id: 2,
            source: "Slack Workspace",
            target: "Communication Center",
            type: "Messages",
            status: "Completed",
            progress: 100,
            lastSync: "2024-12-11 16:45",
            nextSync: "2024-12-11 17:15"
        },
        {
            id: 3,
            source: "OneDrive Storage",
            target: "File Repository",
            type: "Documents",
            status: "Failed",
            progress: 45,
            lastSync: "2024-12-11 15:20",
            nextSync: "2024-12-11 17:20"
        },
        {
            id: 4,
            source: "Google Analytics",
            target: "Analytics Dashboard",
            type: "Usage Data",
            status: "Completed",
            progress: 100,
            lastSync: "2024-12-11 16:50",
            nextSync: "2024-12-11 17:50"
        }
    ];

    const syncHTML = syncItems.map(item => {
        const statusColors = {
            'Completed': 'var(--success)',
            'Syncing': 'var(--info)',
            'Failed': 'var(--error)',
            'Pending': 'var(--warning)'
        };

        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[item.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${item.source} → ${item.target}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${item.type} synchronization</p>
                    </div>
                    <span style="background: ${statusColors[item.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${item.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--gray-700); font-size: 0.875rem;">Progress</span>
                        <span style="color: var(--primary); font-size: 0.875rem; font-weight: 600;">${item.progress}%</span>
                    </div>
                    <div style="background: var(--accent); height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: ${statusColors[item.status]}; height: 100%; width: ${item.progress}%; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--gray-600);">
                        <span>Last: ${new Date(item.lastSync).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</span>
                        <span>Next: ${new Date(item.nextSync).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="forceSyncNow(${item.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🔄 Sync Now
                    </button>
                    <button class="btn" onclick="configureSyncSchedule(${item.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ⏰ Schedule
                    </button>
                    <button class="btn" onclick="viewSyncLogs(${item.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        📋 View Logs
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("sync-status-list", syncHTML);
}

// Global functions for onclick handlers
window.openQuizBuilder = openQuizBuilder;
window.createEssayAssignment = createEssayAssignment;
window.createMathAssessment = createMathAssessment;
window.createCodingChallenge = createCodingChallenge;
window.viewAssessment = viewAssessment;
window.editAssessment = editAssessment;
window.gradeAssessment = gradeAssessment;
window.duplicateAssessment = duplicateAssessment;

// AI Recommendations action functions
function generateNewRecommendations() {
    UIComponents.showNotification("🔄 Generating new AI recommendations based on latest student data...", "info");

    // Simulate AI processing
    setTimeout(() => {
        UIComponents.showNotification("✅ New recommendations generated successfully!", "success");
        loadContentRecommendations();
        loadInterventionRecommendations();
    }, 2000);
}

function openAISettings() {
    UIComponents.showNotification("⚙️ Opening AI model configuration settings...", "info");
}

function viewAdaptivePaths() {
    UIComponents.showNotification("🛤️ Viewing adaptive learning paths for all students...", "info");
}

function viewLearningStyles() {
    UIComponents.showNotification("🧠 Analyzing learning styles and optimization strategies...", "info");
}

function implementRecommendation(id) {
    UIComponents.showNotification(`✅ Implementing recommendation ID: ${id}. Content will be delivered to target students.`, "success");
}

function customizeRecommendation(id) {
    UIComponents.showNotification(`✏️ Opening customization interface for recommendation ID: ${id}`, "info");
}

function dismissRecommendation(id) {
    UIComponents.showNotification(`❌ Recommendation ID: ${id} dismissed. AI will learn from this feedback.`, "warning");
}

function viewRecommendationDetails(id) {
    UIComponents.showNotification(`📊 Viewing detailed analytics for recommendation ID: ${id}`, "info");
}

// Global functions for onclick handlers
window.generateNewRecommendations = generateNewRecommendations;
window.openAISettings = openAISettings;
window.viewAdaptivePaths = viewAdaptivePaths;
window.viewLearningStyles = viewLearningStyles;
window.implementRecommendation = implementRecommendation;
window.customizeRecommendation = customizeRecommendation;
window.dismissRecommendation = dismissRecommendation;
window.viewRecommendationDetails = viewRecommendationDetails;

function setupReportsEventListeners() {
    setTimeout(() => {
        const generateBtn = document.getElementById("btn-generate-report");
        if (generateBtn) {
            generateBtn.addEventListener("click", openReportGenerator);
        }

        const scheduleBtn = document.getElementById("btn-schedule-report");
        if (scheduleBtn) {
            scheduleBtn.addEventListener("click", openReportScheduler);
        }
    }, 200);
}

// Quick Report Generation Functions
function generateProgressReport() {
    UIComponents.showNotification("📈 Generating student progress report...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Student Progress Report generated successfully! Check Recent Reports.", "success");
        loadRecentReports();
    }, 2000);
}

function generateAssessmentReport() {
    UIComponents.showNotification("📝 Generating assessment analytics report...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Assessment Analytics Report generated successfully!", "success");
        loadRecentReports();
    }, 2000);
}

function generateEngagementReport() {
    UIComponents.showNotification("💬 Generating engagement analytics report...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Engagement Analytics Report generated successfully!", "success");
        loadRecentReports();
    }, 2000);
}

function generateAIInsightsReport() {
    UIComponents.showNotification("🤖 Generating AI insights report...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ AI Insights Report generated successfully!", "success");
        loadRecentReports();
    }, 2000);
}

// Custom Report Builder Functions
function previewCustomReport() {
    const reportType = document.getElementById("custom-report-type")?.value;
    const dateRange = document.getElementById("custom-date-range")?.value;
    const format = document.getElementById("custom-export-format")?.value;

    UIComponents.showNotification(`👁️ Previewing ${reportType} report (${dateRange}, ${format})...`, "info");
}

function generateCustomReport() {
    const reportType = document.getElementById("custom-report-type")?.value;
    const dateRange = document.getElementById("custom-date-range")?.value;
    const format = document.getElementById("custom-export-format")?.value;

    UIComponents.showNotification(`📊 Generating custom ${reportType} report in ${format} format...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Custom report generated successfully!", "success");
        loadRecentReports();
    }, 3000);
}

function saveReportTemplate() {
    UIComponents.showNotification("💾 Saving report configuration as template...", "success");
}

// Report Management Functions
function openReportGenerator() {
    UIComponents.showNotification("📈 Opening advanced report generator...", "info");
}

function openReportScheduler() {
    UIComponents.showNotification("⏰ Opening report scheduling interface...", "info");
}

function downloadReport(id) {
    UIComponents.showNotification(`📥 Downloading report ID: ${id}...`, "success");
}

function shareReport(id) {
    UIComponents.showNotification(`📤 Opening share options for report ID: ${id}`, "info");
}

function viewReportDetails(id) {
    UIComponents.showNotification(`👁️ Viewing detailed information for report ID: ${id}`, "info");
}

function duplicateReport(id) {
    UIComponents.showNotification(`📋 Creating duplicate of report ID: ${id}`, "success");
}

function deleteReport(id) {
    UIComponents.showNotification(`🗑️ Report ID: ${id} deleted successfully`, "warning");
    setTimeout(() => {
        loadRecentReports();
    }, 1000);
}

// Scheduled Reports Functions
function editScheduledReport(id) {
    UIComponents.showNotification(`✏️ Opening editor for scheduled report ID: ${id}`, "info");
}

function runScheduledReport(id) {
    UIComponents.showNotification(`▶️ Running scheduled report ID: ${id} now...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Scheduled report executed successfully!", "success");
        loadRecentReports();
    }, 2000);
}

function toggleScheduledReport(id) {
    UIComponents.showNotification(`⏸️ Toggling status for scheduled report ID: ${id}`, "info");

    setTimeout(() => {
        loadScheduledReports();
    }, 1000);
}

function deleteScheduledReport(id) {
    UIComponents.showNotification(`🗑️ Scheduled report ID: ${id} deleted successfully`, "warning");

    setTimeout(() => {
        loadScheduledReports();
    }, 1000);
}

// Global functions for onclick handlers
window.generateProgressReport = generateProgressReport;
window.generateAssessmentReport = generateAssessmentReport;
window.generateEngagementReport = generateEngagementReport;
window.generateAIInsightsReport = generateAIInsightsReport;
window.previewCustomReport = previewCustomReport;
window.generateCustomReport = generateCustomReport;
window.saveReportTemplate = saveReportTemplate;
window.downloadReport = downloadReport;
window.shareReport = shareReport;
window.viewReportDetails = viewReportDetails;
window.duplicateReport = duplicateReport;
window.deleteReport = deleteReport;
window.editScheduledReport = editScheduledReport;
window.runScheduledReport = runScheduledReport;
window.toggleScheduledReport = toggleScheduledReport;
window.deleteScheduledReport = deleteScheduledReport;

function setupIntegrationsEventListeners() {
    setTimeout(() => {
        const addBtn = document.getElementById("btn-add-integration");
        if (addBtn) {
            addBtn.addEventListener("click", openIntegrationMarketplace);
        }

        const docsBtn = document.getElementById("btn-api-docs");
        if (docsBtn) {
            docsBtn.addEventListener("click", openAPIDocs);
        }
    }, 200);
}

// Integration Connection Functions
function connectLMS(platform) {
    UIComponents.showNotification(`🔗 Connecting to ${platform.toUpperCase()} LMS...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ Successfully connected to ${platform.toUpperCase()}!`, "success");
        loadActiveIntegrations();
    }, 2000);
}

function connectComm(platform) {
    UIComponents.showNotification(`💬 Connecting to ${platform} communication platform...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ Successfully connected to ${platform}!`, "success");
        loadActiveIntegrations();
    }, 2000);
}

function connectAnalytics(platform) {
    UIComponents.showNotification(`📊 Connecting to ${platform} analytics platform...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ Successfully connected to ${platform}!`, "success");
        loadActiveIntegrations();
    }, 2000);
}

function connectStorage(platform) {
    UIComponents.showNotification(`☁️ Connecting to ${platform} cloud storage...`, "info");

    setTimeout(() => {
        UIComponents.showNotification(`✅ Successfully connected to ${platform}!`, "success");
        loadActiveIntegrations();
    }, 2000);
}

// Active Integration Management
function configureIntegration(id) {
    UIComponents.showNotification(`⚙️ Opening configuration for integration ID: ${id}`, "info");
}

function testIntegration(id) {
    UIComponents.showNotification(`🧪 Testing connection for integration ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Connection test successful!", "success");
    }, 1500);
}

function syncIntegration(id) {
    UIComponents.showNotification(`🔄 Starting manual sync for integration ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Synchronization completed successfully!", "success");
        loadActiveIntegrations();
        loadSyncStatus();
    }, 2000);
}

function disconnectIntegration(id) {
    UIComponents.showNotification(`🔌 Disconnecting integration ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("⚠️ Integration disconnected successfully", "warning");
        loadActiveIntegrations();
    }, 1500);
}

// API Key Management
function generateAPIKey() {
    UIComponents.showNotification("🔑 Generating new API key...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ New API key generated successfully!", "success");
        loadAPIKeys();
    }, 1500);
}

function copyAPIKey(key) {
    navigator.clipboard.writeText(key).then(() => {
        UIComponents.showNotification("📋 API key copied to clipboard!", "success");
    }).catch(() => {
        UIComponents.showNotification("❌ Failed to copy API key", "error");
    });
}

function regenerateAPIKey(id) {
    UIComponents.showNotification(`🔄 Regenerating API key ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("✅ API key regenerated successfully!", "success");
        loadAPIKeys();
    }, 1500);
}

function deleteAPIKey(id) {
    UIComponents.showNotification(`🗑️ Deleting API key ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("⚠️ API key deleted successfully", "warning");
        loadAPIKeys();
    }, 1000);
}

// Webhook Management
function addWebhook() {
    UIComponents.showNotification("➕ Opening webhook creation interface...", "info");
}

function editWebhook(id) {
    UIComponents.showNotification(`✏️ Opening webhook editor for ID: ${id}`, "info");
}

function testWebhook(id) {
    UIComponents.showNotification(`🧪 Testing webhook ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Webhook test successful!", "success");
    }, 1500);
}

function toggleWebhook(id) {
    UIComponents.showNotification(`⏸️ Toggling webhook status for ID: ${id}`, "info");

    setTimeout(() => {
        loadWebhooks();
    }, 1000);
}

function deleteWebhook(id) {
    UIComponents.showNotification(`🗑️ Deleting webhook ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("⚠️ Webhook deleted successfully", "warning");
        loadWebhooks();
    }, 1000);
}

// Data Synchronization Management
function forceSyncNow(id) {
    UIComponents.showNotification(`🔄 Starting immediate sync for ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Forced synchronization completed!", "success");
        loadSyncStatus();
    }, 2000);
}

function configureSyncSchedule(id) {
    UIComponents.showNotification(`⏰ Opening sync schedule configuration for ID: ${id}`, "info");
}

function viewSyncLogs(id) {
    UIComponents.showNotification(`📋 Opening sync logs for ID: ${id}`, "info");
}

// General Integration Functions
function openIntegrationMarketplace() {
    UIComponents.showNotification("🛒 Opening integration marketplace...", "info");
}

function openAPIDocs() {
    UIComponents.showNotification("📚 Opening API documentation...", "info");
}

// Global functions for onclick handlers
window.connectLMS = connectLMS;
window.connectComm = connectComm;
window.connectAnalytics = connectAnalytics;
window.connectStorage = connectStorage;
window.configureIntegration = configureIntegration;
window.testIntegration = testIntegration;
window.syncIntegration = syncIntegration;
window.disconnectIntegration = disconnectIntegration;
window.generateAPIKey = generateAPIKey;
window.copyAPIKey = copyAPIKey;
window.regenerateAPIKey = regenerateAPIKey;
window.deleteAPIKey = deleteAPIKey;
window.addWebhook = addWebhook;
window.editWebhook = editWebhook;
window.testWebhook = testWebhook;
window.toggleWebhook = toggleWebhook;
window.deleteWebhook = deleteWebhook;
window.forceSyncNow = forceSyncNow;
window.configureSyncSchedule = configureSyncSchedule;
window.viewSyncLogs = viewSyncLogs;

// Week 4 Page Loading Functions
function loadSecurityPage() {
    const securityHTML = `
        <!-- Advanced Security & Authentication Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--error); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🔐
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Advanced Security & Authentication</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Enterprise-grade security controls and authentication management</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-security-scan" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🔍 Security Scan
                    </button>
                    <button class="btn" id="btn-audit-logs" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        📋 Audit Logs
                    </button>
                </div>
            </div>

            <!-- Security Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="security-score">98%</div>
                    <div class="metric-label">Security Score</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="active-sessions">24</div>
                    <div class="metric-label">Active Sessions</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="failed-attempts">3</div>
                    <div class="metric-label">Failed Login Attempts</div>
                </div>
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="mfa-enabled">89%</div>
                    <div class="metric-label">MFA Adoption Rate</div>
                </div>
            </div>
        </section>

        <!-- Multi-Factor Authentication -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔑</span> Multi-Factor Authentication (MFA)
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📱</span> SMS Authentication
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Send verification codes via SMS for secure login.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Enabled Users</span>
                            <span style="font-weight: 600; color: var(--success);">32 users</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Success Rate</span>
                            <span style="font-weight: 600; color: var(--primary);">97%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="configureSMSAuth()" style="background: var(--success); width: 100%;">Configure SMS Auth</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔐</span> Authenticator Apps
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Support for Google Authenticator, Authy, and other TOTP apps.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Enabled Users</span>
                            <span style="font-weight: 600; color: var(--primary);">18 users</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Success Rate</span>
                            <span style="font-weight: 600; color: var(--success);">99%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="configureAuthenticatorApps()" style="background: var(--primary); width: 100%;">Configure Authenticator</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔑</span> Hardware Security Keys
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Support for FIDO2/WebAuthn hardware security keys.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Registered Keys</span>
                            <span style="font-weight: 600; color: var(--info);">8 keys</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Success Rate</span>
                            <span style="font-weight: 600; color: var(--success);">100%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="configureHardwareKeys()" style="background: var(--info); width: 100%;">Configure Hardware Keys</button>
                </div>
            </div>
        </section>

        <!-- Role-Based Access Control -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>👥</span> Role-Based Access Control (RBAC)
            </h3>
            <div id="rbac-roles-list">
                <!-- RBAC roles will be loaded here -->
            </div>
        </section>

        <!-- Security Audit Logs -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📋</span> Security Audit Logs
            </h3>
            <div id="security-audit-logs">
                <!-- Security audit logs will be loaded here -->
            </div>
        </section>

        <!-- Session Management -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔄</span> Active Session Management
            </h3>
            <div id="active-sessions-list">
                <!-- Active sessions will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-security", securityHTML);

    // Load security data
    setTimeout(() => {
        loadRBACRoles();
        loadSecurityAuditLogs();
        loadActiveSessions();
        setupSecurityEventListeners();
    }, 100);

    UIComponents.showNotification("🔐 Security & Authentication loaded successfully!", "success");
}

function loadRBACRoles() {
    const roles = [
        {
            id: 1,
            name: "Super Administrator",
            description: "Full system access with all permissions",
            users: 2,
            permissions: ["all"],
            color: "var(--error)"
        },
        {
            id: 2,
            name: "Educator",
            description: "Teaching and student management permissions",
            users: 15,
            permissions: ["students.view", "students.edit", "assessments.create", "reports.generate"],
            color: "var(--primary)"
        },
        {
            id: 3,
            name: "Teaching Assistant",
            description: "Limited teaching support permissions",
            users: 8,
            permissions: ["students.view", "assessments.grade", "communication.send"],
            color: "var(--info)"
        },
        {
            id: 4,
            name: "Content Manager",
            description: "Content creation and management permissions",
            users: 5,
            permissions: ["content.create", "content.edit", "assessments.create"],
            color: "var(--success)"
        },
        {
            id: 5,
            name: "Analyst",
            description: "Analytics and reporting permissions",
            users: 3,
            permissions: ["analytics.view", "reports.generate", "data.export"],
            color: "var(--warning)"
        }
    ];

    const rolesHTML = roles.map(role => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${role.color};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${role.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.875rem;">${role.description}</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: ${role.color};">${role.users}</div>
                        <div style="font-size: 0.75rem; color: var(--gray-600);">Users</div>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <strong style="color: var(--gray-800); font-size: 0.875rem;">Permissions:</strong>
                    <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.25rem;">
                        ${role.permissions.map(permission => `
                            <span style="background: ${role.color}; color: white; padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; font-weight: 600;">
                                ${permission}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="editRole(${role.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        ✏️ Edit Role
                    </button>
                    <button class="btn" onclick="viewRoleUsers(${role.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        👥 View Users
                    </button>
                    <button class="btn" onclick="duplicateRole(${role.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        📋 Duplicate
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("rbac-roles-list", rolesHTML);
}

function loadSecurityAuditLogs() {
    const auditLogs = [
        {
            id: 1,
            timestamp: "2024-12-11 16:45:23",
            user: "admin@university.edu",
            action: "Login Success",
            details: "Successful login with MFA",
            ip: "192.168.1.100",
            severity: "Info"
        },
        {
            id: 2,
            timestamp: "2024-12-11 16:30:15",
            user: "educator@university.edu",
            action: "Permission Changed",
            details: "Role permissions updated for Teaching Assistant",
            ip: "192.168.1.105",
            severity: "Warning"
        },
        {
            id: 3,
            timestamp: "2024-12-11 16:15:42",
            user: "unknown",
            action: "Login Failed",
            details: "Failed login attempt - invalid credentials",
            ip: "203.0.113.45",
            severity: "Error"
        },
        {
            id: 4,
            timestamp: "2024-12-11 15:58:30",
            user: "ta@university.edu",
            action: "Data Export",
            details: "Student progress data exported",
            ip: "192.168.1.110",
            severity: "Info"
        },
        {
            id: 5,
            timestamp: "2024-12-11 15:45:18",
            user: "admin@university.edu",
            action: "Security Scan",
            details: "Automated security scan completed",
            ip: "127.0.0.1",
            severity: "Info"
        }
    ];

    const severityColors = {
        'Info': 'var(--info)',
        'Warning': 'var(--warning)',
        'Error': 'var(--error)'
    };

    const auditHTML = auditLogs.map(log => {
        return `
            <div style="background: var(--accent); border-radius: 6px; padding: 1rem; margin-bottom: 0.75rem; border-left: 3px solid ${severityColors[log.severity]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">${log.action}</strong>
                        <span style="background: ${severityColors[log.severity]}; color: white; padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; font-weight: 600;">
                            ${log.severity}
                        </span>
                    </div>
                    <span style="color: var(--gray-600); font-size: 0.75rem;">${new Date(log.timestamp).toLocaleString('id-ID')}</span>
                </div>
                <p style="color: var(--gray-700); font-size: 0.75rem; margin-bottom: 0.5rem;">${log.details}</p>
                <div style="display: flex; justify-content: space-between; font-size: 0.625rem; color: var(--gray-600);">
                    <span>User: ${log.user}</span>
                    <span>IP: ${log.ip}</span>
                </div>
            </div>
        `;
    }).join('');

    setInner("security-audit-logs", auditHTML);
}

function loadActiveSessions() {
    const sessions = [
        {
            id: 1,
            user: "Dr. Sarah Johnson",
            email: "sarah@university.edu",
            device: "Chrome on Windows 11",
            location: "Jakarta, Indonesia",
            loginTime: "2024-12-11 14:30:00",
            lastActivity: "2024-12-11 16:45:00",
            ip: "192.168.1.100",
            status: "Active"
        },
        {
            id: 2,
            user: "Prof. Ahmad Rahman",
            email: "ahmad@university.edu",
            device: "Safari on macOS",
            location: "Bandung, Indonesia",
            loginTime: "2024-12-11 15:15:00",
            lastActivity: "2024-12-11 16:30:00",
            ip: "192.168.1.105",
            status: "Active"
        },
        {
            id: 3,
            user: "Dr. Maria Santos",
            email: "maria@university.edu",
            device: "Firefox on Ubuntu",
            location: "Surabaya, Indonesia",
            loginTime: "2024-12-11 13:45:00",
            lastActivity: "2024-12-11 16:00:00",
            ip: "192.168.1.110",
            status: "Idle"
        }
    ];

    const statusColors = {
        'Active': 'var(--success)',
        'Idle': 'var(--warning)',
        'Expired': 'var(--error)'
    };

    const sessionsHTML = sessions.map(session => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[session.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${session.user}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${session.email}</p>
                    </div>
                    <span style="background: ${statusColors[session.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${session.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; font-size: 0.75rem;">
                        <div><strong>Device:</strong> ${session.device}</div>
                        <div><strong>Location:</strong> ${session.location}</div>
                        <div><strong>IP Address:</strong> ${session.ip}</div>
                        <div><strong>Login:</strong> ${new Date(session.loginTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</div>
                        <div><strong>Last Activity:</strong> ${new Date(session.lastActivity).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="viewSessionDetails(${session.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        👁️ View Details
                    </button>
                    <button class="btn" onclick="terminateSession(${session.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--error);">
                        🚫 Terminate Session
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("active-sessions-list", sessionsHTML);
}

function setupSecurityEventListeners() {
    setTimeout(() => {
        const scanBtn = document.getElementById("btn-security-scan");
        if (scanBtn) {
            scanBtn.addEventListener("click", runSecurityScan);
        }

        const auditBtn = document.getElementById("btn-audit-logs");
        if (auditBtn) {
            auditBtn.addEventListener("click", openAuditLogs);
        }
    }, 200);
}

// MFA Configuration Functions
function configureSMSAuth() {
    UIComponents.showNotification("📱 Opening SMS authentication configuration...", "info");
}

function configureAuthenticatorApps() {
    UIComponents.showNotification("🔐 Opening authenticator app configuration...", "info");
}

function configureHardwareKeys() {
    UIComponents.showNotification("🔑 Opening hardware security key configuration...", "info");
}

// RBAC Functions
function editRole(id) {
    UIComponents.showNotification(`✏️ Opening role editor for role ID: ${id}`, "info");
}

function viewRoleUsers(id) {
    UIComponents.showNotification(`👥 Viewing users assigned to role ID: ${id}`, "info");
}

function duplicateRole(id) {
    UIComponents.showNotification(`📋 Creating duplicate of role ID: ${id}`, "success");
}

// Session Management Functions
function viewSessionDetails(id) {
    UIComponents.showNotification(`👁️ Viewing detailed information for session ID: ${id}`, "info");
}

function terminateSession(id) {
    UIComponents.showNotification(`🚫 Terminating session ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("⚠️ Session terminated successfully", "warning");
        loadActiveSessions();
    }, 1500);
}

// Security Functions
function runSecurityScan() {
    UIComponents.showNotification("🔍 Starting comprehensive security scan...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Security scan completed! No vulnerabilities found.", "success");
    }, 3000);
}

function openAuditLogs() {
    UIComponents.showNotification("📋 Opening detailed audit log viewer...", "info");
}

function loadPerformancePage() {
    const performanceHTML = `
        <!-- Performance Optimization & Caching Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--success); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    ⚡
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Performance Optimization & Caching</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">System performance monitoring and optimization tools</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-performance-test" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        🚀 Run Performance Test
                    </button>
                    <button class="btn" id="btn-clear-cache" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        🗑️ Clear Cache
                    </button>
                </div>
            </div>

            <!-- Performance Metrics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="page-load-time">1.2s</div>
                    <div class="metric-label">Average Load Time</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="cache-hit-rate">94%</div>
                    <div class="metric-label">Cache Hit Rate</div>
                </div>
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="memory-usage">68%</div>
                    <div class="metric-label">Memory Usage</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="cpu-usage">23%</div>
                    <div class="metric-label">CPU Usage</div>
                </div>
            </div>
        </section>

        <!-- Real-time Performance Monitoring -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Real-time Performance Monitoring
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Response Time Trends</h4>
                    <div id="response-time-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Response time chart will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Resource Usage</h4>
                    <div id="resource-usage-chart" style="height: 200px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Resource usage chart will be rendered here
                    </div>
                </div>
            </div>
        </section>

        <!-- Caching System -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>💾</span> Advanced Caching System
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🗄️</span> Database Query Cache
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Intelligent caching of frequently accessed database queries.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Cache Size</span>
                            <span style="font-weight: 600; color: var(--primary);">2.4 GB</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Hit Rate</span>
                            <span style="font-weight: 600; color: var(--success);">96%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Entries</span>
                            <span style="font-weight: 600; color: var(--info);">15,432</span>
                        </div>
                    </div>
                    <button class="btn" onclick="manageQueryCache()" style="background: var(--primary); width: 100%;">Manage Query Cache</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🌐</span> CDN & Static Assets
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Content Delivery Network optimization for static assets.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">CDN Hit Rate</span>
                            <span style="font-weight: 600; color: var(--success);">98%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Bandwidth Saved</span>
                            <span style="font-weight: 600; color: var(--primary);">1.8 TB</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Edge Locations</span>
                            <span style="font-weight: 600; color: var(--info);">24</span>
                        </div>
                    </div>
                    <button class="btn" onclick="manageCDN()" style="background: var(--success); width: 100%;">Manage CDN</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⚡</span> Redis Memory Cache
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">High-performance in-memory caching for session data.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Memory Used</span>
                            <span style="font-weight: 600; color: var(--info);">512 MB</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Keys Stored</span>
                            <span style="font-weight: 600; color: var(--primary);">8,924</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Avg Response</span>
                            <span style="font-weight: 600; color: var(--success);">0.3ms</span>
                        </div>
                    </div>
                    <button class="btn" onclick="manageRedisCache()" style="background: var(--info); width: 100%;">Manage Redis Cache</button>
                </div>
            </div>
        </section>

        <!-- Database Optimization -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🗃️</span> Database Query Optimization
            </h3>
            <div id="database-optimization-list">
                <!-- Database optimization info will be loaded here -->
            </div>
        </section>

        <!-- Performance Recommendations -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>💡</span> Performance Recommendations
            </h3>
            <div id="performance-recommendations-list">
                <!-- Performance recommendations will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-performance", performanceHTML);

    // Load performance data
    setTimeout(() => {
        loadDatabaseOptimization();
        loadPerformanceRecommendations();
        setupPerformanceEventListeners();
    }, 100);

    UIComponents.showNotification("⚡ Performance Optimization loaded successfully!", "success");
}

function loadDatabaseOptimization() {
    const dbOptimizations = [
        {
            id: 1,
            query: "SELECT * FROM students WHERE progress > 80",
            executionTime: "45ms",
            optimizedTime: "12ms",
            improvement: "73%",
            frequency: "High",
            status: "Optimized"
        },
        {
            id: 2,
            query: "SELECT COUNT(*) FROM assessments GROUP BY module_id",
            executionTime: "120ms",
            optimizedTime: "35ms",
            improvement: "71%",
            frequency: "Medium",
            status: "Optimized"
        },
        {
            id: 3,
            query: "SELECT * FROM communication_logs ORDER BY timestamp DESC",
            executionTime: "200ms",
            optimizedTime: "200ms",
            improvement: "0%",
            frequency: "Low",
            status: "Needs Optimization"
        },
        {
            id: 4,
            query: "SELECT AVG(score) FROM assessment_results WHERE date >= '2024-12-01'",
            executionTime: "80ms",
            optimizedTime: "25ms",
            improvement: "69%",
            frequency: "High",
            status: "Optimized"
        }
    ];

    const statusColors = {
        'Optimized': 'var(--success)',
        'Needs Optimization': 'var(--warning)',
        'Critical': 'var(--error)'
    };

    const frequencyColors = {
        'High': 'var(--error)',
        'Medium': 'var(--warning)',
        'Low': 'var(--info)'
    };

    const dbHTML = dbOptimizations.map(opt => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[opt.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">Query Optimization #${opt.id}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem; font-family: monospace; background: var(--white); padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem;">${opt.query}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <span style="background: ${frequencyColors[opt.frequency]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${opt.frequency} Freq
                        </span>
                        <span style="background: ${statusColors[opt.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${opt.status}
                        </span>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--error);">${opt.executionTime}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Original Time</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${opt.optimizedTime}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Optimized Time</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--primary);">${opt.improvement}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Improvement</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="analyzeQuery(${opt.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        🔍 Analyze Query
                    </button>
                    <button class="btn" onclick="optimizeQuery(${opt.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        ⚡ Optimize
                    </button>
                    <button class="btn" onclick="viewQueryPlan(${opt.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        📋 Execution Plan
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("database-optimization-list", dbHTML);
}

function loadPerformanceRecommendations() {
    const recommendations = [
        {
            id: 1,
            title: "Enable Gzip Compression",
            description: "Reduce bandwidth usage by 60-80% with gzip compression for text-based assets.",
            impact: "High",
            effort: "Low",
            savings: "2.4s load time reduction",
            status: "Pending"
        },
        {
            id: 2,
            title: "Implement Image Lazy Loading",
            description: "Load images only when they enter the viewport to improve initial page load.",
            impact: "Medium",
            effort: "Medium",
            savings: "1.8s load time reduction",
            status: "In Progress"
        },
        {
            id: 3,
            title: "Optimize Database Indexes",
            description: "Add composite indexes for frequently queried student progress data.",
            impact: "High",
            effort: "High",
            savings: "45% query time reduction",
            status: "Completed"
        },
        {
            id: 4,
            title: "Implement Service Worker Caching",
            description: "Cache static assets and API responses for offline functionality.",
            impact: "Medium",
            effort: "Medium",
            savings: "Offline capability",
            status: "Pending"
        },
        {
            id: 5,
            title: "Minify CSS and JavaScript",
            description: "Reduce file sizes by removing unnecessary whitespace and comments.",
            impact: "Low",
            effort: "Low",
            savings: "0.5s load time reduction",
            status: "Completed"
        }
    ];

    const impactColors = {
        'High': 'var(--error)',
        'Medium': 'var(--warning)',
        'Low': 'var(--info)'
    };

    const statusColors = {
        'Completed': 'var(--success)',
        'In Progress': 'var(--warning)',
        'Pending': 'var(--gray-500)'
    };

    const recommendationsHTML = recommendations.map(rec => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${impactColors[rec.impact]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${rec.title}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.875rem; margin-top: 0.25rem;">${rec.description}</p>
                    </div>
                    <span style="background: ${statusColors[rec.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${rec.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: ${impactColors[rec.impact]};">${rec.impact}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Impact</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--info);">${rec.effort}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Effort</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${rec.savings}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Expected Savings</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${rec.status === 'Pending' ? `
                        <button class="btn" onclick="implementRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                            🚀 Implement
                        </button>
                    ` : ''}
                    <button class="btn" onclick="viewRecommendationDetails(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📋 View Details
                    </button>
                    <button class="btn" onclick="scheduleRecommendation(${rec.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        ⏰ Schedule
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("performance-recommendations-list", recommendationsHTML);
}

function loadAdvancedAnalyticsPage() {
    const advancedAnalyticsHTML = `
        <!-- Advanced Analytics & Machine Learning Dashboard -->
        <section class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: var(--shadow-sm);">
                    🧠
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-900); margin: 0;">Advanced Analytics & Machine Learning</h2>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">AI-powered insights and predictive analytics for enhanced learning outcomes</p>
                </div>
                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn" id="btn-train-model" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🤖 Train ML Model
                    </button>
                    <button class="btn" id="btn-generate-insights" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        💡 Generate Insights
                    </button>
                </div>
            </div>

            <!-- ML Model Statistics -->
            <div class="grid" style="margin-bottom: 2rem;">
                <div class="metric-card" style="background: var(--primary); color: white;">
                    <div class="metric-value" id="model-accuracy">96.8%</div>
                    <div class="metric-label">Model Accuracy</div>
                </div>
                <div class="metric-card" style="background: var(--success); color: white;">
                    <div class="metric-value" id="predictions-made">1,247</div>
                    <div class="metric-label">Predictions Made</div>
                </div>
                <div class="metric-card" style="background: var(--info); color: white;">
                    <div class="metric-value" id="data-points">45.2K</div>
                    <div class="metric-label">Training Data Points</div>
                </div>
                <div class="metric-card" style="background: var(--warning); color: white;">
                    <div class="metric-value" id="model-confidence">94.3%</div>
                    <div class="metric-label">Average Confidence</div>
                </div>
            </div>
        </section>

        <!-- Predictive Learning Analytics -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🔮</span> Predictive Learning Analytics
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📈</span> Student Success Prediction
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">AI model predicts student success probability based on learning patterns and engagement.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">High Success Probability</span>
                            <span style="font-weight: 600; color: var(--success);">32 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Medium Risk</span>
                            <span style="font-weight: 600; color: var(--warning);">8 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">High Risk</span>
                            <span style="font-weight: 600; color: var(--error);">5 students</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewSuccessPredictions()" style="background: var(--primary); width: 100%;">View Detailed Predictions</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--success);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🎯</span> Learning Path Optimization
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">ML algorithms optimize learning paths based on individual student performance and preferences.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Optimized Paths</span>
                            <span style="font-weight: 600; color: var(--success);">28 paths</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Avg Improvement</span>
                            <span style="font-weight: 600; color: var(--primary);">+34%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Completion Rate</span>
                            <span style="font-weight: 600; color: var(--info);">89%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewPathOptimizations()" style="background: var(--success); width: 100%;">View Path Analytics</button>
                </div>

                <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--info);">
                    <h4 style="color: var(--gray-800); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⏰</span> Engagement Forecasting
                    </h4>
                    <p style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1rem;">Predict future engagement levels and identify optimal intervention timing.</p>
                    <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Next Week Forecast</span>
                            <span style="font-weight: 600; color: var(--info);">82% avg</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Declining Trend</span>
                            <span style="font-weight: 600; color: var(--warning);">6 students</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 0.875rem; color: var(--gray-700);">Intervention Needed</span>
                            <span style="font-weight: 600; color: var(--error);">3 students</span>
                        </div>
                    </div>
                    <button class="btn" onclick="viewEngagementForecasts()" style="background: var(--info); width: 100%;">View Forecasts</button>
                </div>
            </div>
        </section>

        <!-- Advanced Data Visualization -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📊</span> Advanced Data Visualization
            </h3>
            <div class="grid">
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">ML Model Performance</h4>
                    <div id="ml-performance-chart" style="height: 250px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        ML model performance visualization will be rendered here
                    </div>
                </div>
                <div style="background: var(--white); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                    <h4 style="color: var(--gray-800); margin-bottom: 1rem; font-size: 0.875rem;">Predictive Analytics Dashboard</h4>
                    <div id="predictive-dashboard" style="height: 250px; background: var(--accent); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gray-600); font-size: 0.875rem;">
                        Predictive analytics dashboard will be rendered here
                    </div>
                </div>
            </div>
        </section>

        <!-- Machine Learning Models -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🤖</span> Machine Learning Models
            </h3>
            <div id="ml-models-list">
                <!-- ML models will be loaded here -->
            </div>
        </section>

        <!-- Custom Analytics Builder -->
        <section class="card" style="margin-bottom: 2rem;">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🛠️</span> Custom Analytics Builder
            </h3>
            <div style="background: var(--accent); padding: 1.5rem; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Data Source</label>
                        <select id="analytics-data-source" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Student Performance Data</option>
                            <option>Engagement Metrics</option>
                            <option>Assessment Results</option>
                            <option>Communication Logs</option>
                            <option>Learning Path Data</option>
                            <option>Custom Dataset</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Analysis Type</label>
                        <select id="analytics-type" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Predictive Modeling</option>
                            <option>Clustering Analysis</option>
                            <option>Trend Analysis</option>
                            <option>Correlation Analysis</option>
                            <option>Anomaly Detection</option>
                            <option>Classification</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Time Period</label>
                        <select id="analytics-timeframe" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Semester</option>
                            <option>This Year</option>
                            <option>All Time</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem;">Visualization</label>
                        <select id="analytics-visualization" style="width: 100%; padding: 0.75rem; border: 1px solid var(--accent-dark); border-radius: 6px; background: var(--white);">
                            <option>Interactive Dashboard</option>
                            <option>Statistical Charts</option>
                            <option>Heatmaps</option>
                            <option>Network Graphs</option>
                            <option>3D Visualizations</option>
                            <option>Custom Charts</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn" onclick="previewAnalytics()" style="background: var(--info); flex: 1;">👁️ Preview Analytics</button>
                    <button class="btn" onclick="runCustomAnalytics()" style="background: var(--primary); flex: 1;">🚀 Run Analysis</button>
                    <button class="btn" onclick="saveAnalyticsTemplate()" style="background: var(--success); flex: 1;">💾 Save Template</button>
                </div>
            </div>
        </section>

        <!-- Real-time Data Processing -->
        <section class="card">
            <h3 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> Real-time Data Processing
            </h3>
            <div id="realtime-processing-status">
                <!-- Real-time processing status will be loaded here -->
            </div>
        </section>
    `;

    setInner("page-advanced-analytics", advancedAnalyticsHTML);

    // Load advanced analytics data
    setTimeout(() => {
        loadMLModels();
        loadRealtimeProcessingStatus();
        setupAdvancedAnalyticsEventListeners();
    }, 100);

    UIComponents.showNotification("🧠 Advanced Analytics & Machine Learning loaded successfully!", "success");
}

function loadMLModels() {
    const mlModels = [
        {
            id: 1,
            name: "Student Success Predictor",
            type: "Classification",
            algorithm: "Random Forest",
            accuracy: "96.8%",
            lastTrained: "2024-12-11 14:30",
            status: "Active",
            predictions: 1247,
            features: ["engagement_score", "assignment_completion", "time_spent", "quiz_performance"]
        },
        {
            id: 2,
            name: "Learning Path Optimizer",
            type: "Recommendation",
            algorithm: "Collaborative Filtering",
            accuracy: "94.2%",
            lastTrained: "2024-12-10 16:45",
            status: "Active",
            predictions: 892,
            features: ["learning_style", "progress_rate", "difficulty_preference", "topic_interest"]
        },
        {
            id: 3,
            name: "Engagement Forecaster",
            type: "Time Series",
            algorithm: "LSTM Neural Network",
            accuracy: "91.5%",
            lastTrained: "2024-12-09 10:20",
            status: "Training",
            predictions: 634,
            features: ["daily_activity", "session_duration", "interaction_frequency", "content_type"]
        },
        {
            id: 4,
            name: "Content Difficulty Analyzer",
            type: "Regression",
            algorithm: "Gradient Boosting",
            accuracy: "89.7%",
            lastTrained: "2024-12-08 13:15",
            status: "Active",
            predictions: 456,
            features: ["content_complexity", "student_level", "completion_time", "error_rate"]
        },
        {
            id: 5,
            name: "Anomaly Detector",
            type: "Unsupervised",
            algorithm: "Isolation Forest",
            accuracy: "87.3%",
            lastTrained: "2024-12-07 09:30",
            status: "Inactive",
            predictions: 234,
            features: ["behavior_pattern", "access_time", "performance_deviation", "engagement_anomaly"]
        }
    ];

    const statusColors = {
        'Active': 'var(--success)',
        'Training': 'var(--warning)',
        'Inactive': 'var(--gray-500)',
        'Error': 'var(--error)'
    };

    const typeColors = {
        'Classification': 'var(--primary)',
        'Recommendation': 'var(--info)',
        'Time Series': 'var(--success)',
        'Regression': 'var(--warning)',
        'Unsupervised': 'var(--secondary-dark)'
    };

    const modelsHTML = mlModels.map(model => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[model.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${model.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${model.algorithm} • ${model.type} Model</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <span style="background: ${typeColors[model.type]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${model.type}
                        </span>
                        <span style="background: ${statusColors[model.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${model.status}
                        </span>
                    </div>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--primary);">${model.accuracy}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Accuracy</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${model.predictions}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Predictions</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--info);">${model.features.length}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Features</div>
                        </div>
                    </div>
                    <div>
                        <strong style="color: var(--gray-800); font-size: 0.875rem;">Features:</strong>
                        <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.25rem;">
                            ${model.features.map(feature => `
                                <span style="background: var(--accent); color: var(--gray-700); padding: 0.125rem 0.5rem; border-radius: 8px; font-size: 0.625rem; border: 1px solid var(--accent-dark);">
                                    ${feature}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="viewModelDetails(${model.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📊 View Details
                    </button>
                    <button class="btn" onclick="retrainModel(${model.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--primary);">
                        🔄 Retrain
                    </button>
                    <button class="btn" onclick="testModel(${model.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--success);">
                        🧪 Test Model
                    </button>
                    <button class="btn" onclick="exportModel(${model.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        📤 Export
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("ml-models-list", modelsHTML);
}

function loadRealtimeProcessingStatus() {
    const processingStreams = [
        {
            id: 1,
            name: "Student Activity Stream",
            type: "Real-time Events",
            status: "Active",
            throughput: "1,247 events/min",
            latency: "12ms",
            errorRate: "0.02%"
        },
        {
            id: 2,
            name: "Assessment Results Pipeline",
            type: "Batch Processing",
            status: "Active",
            throughput: "456 records/min",
            latency: "45ms",
            errorRate: "0.01%"
        },
        {
            id: 3,
            name: "ML Inference Engine",
            type: "Prediction Service",
            status: "Active",
            throughput: "892 predictions/min",
            latency: "8ms",
            errorRate: "0.05%"
        },
        {
            id: 4,
            name: "Analytics Aggregator",
            type: "Data Aggregation",
            status: "Warning",
            throughput: "234 aggregations/min",
            latency: "120ms",
            errorRate: "0.15%"
        }
    ];

    const statusColors = {
        'Active': 'var(--success)',
        'Warning': 'var(--warning)',
        'Error': 'var(--error)',
        'Stopped': 'var(--gray-500)'
    };

    const streamHTML = processingStreams.map(stream => {
        return `
            <div style="background: var(--accent); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border-left: 4px solid ${statusColors[stream.status]};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: var(--gray-800); margin: 0; font-size: 1rem; font-weight: 600;">${stream.name}</h4>
                        <p style="color: var(--gray-600); margin: 0; font-size: 0.75rem;">${stream.type}</p>
                    </div>
                    <span style="background: ${statusColors[stream.status]}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        ${stream.status}
                    </span>
                </div>

                <div style="background: var(--white); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--primary);">${stream.throughput}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Throughput</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--info);">${stream.latency}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Latency</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--success);">${stream.errorRate}</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Error Rate</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn" onclick="viewStreamMetrics(${stream.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--info);">
                        📊 Metrics
                    </button>
                    <button class="btn" onclick="restartStream(${stream.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--warning);">
                        🔄 Restart
                    </button>
                    <button class="btn" onclick="configureStream(${stream.id})" style="padding: 0.5rem 1rem; font-size: 0.75rem; background: var(--secondary-dark);">
                        ⚙️ Configure
                    </button>
                </div>
            </div>
        `;
    }).join('');

    setInner("realtime-processing-status", streamHTML);
}

function loadMobilePage() {
    UIComponents.showNotification("📱 Mobile & PWA page coming soon...", "info");
}

// Global functions for onclick handlers
window.configureSMSAuth = configureSMSAuth;
window.configureAuthenticatorApps = configureAuthenticatorApps;
window.configureHardwareKeys = configureHardwareKeys;
window.editRole = editRole;
window.viewRoleUsers = viewRoleUsers;
window.duplicateRole = duplicateRole;
window.viewSessionDetails = viewSessionDetails;
window.terminateSession = terminateSession;
window.runSecurityScan = runSecurityScan;
window.openAuditLogs = openAuditLogs;

function setupPerformanceEventListeners() {
    setTimeout(() => {
        const testBtn = document.getElementById("btn-performance-test");
        if (testBtn) {
            testBtn.addEventListener("click", runPerformanceTest);
        }

        const clearBtn = document.getElementById("btn-clear-cache");
        if (clearBtn) {
            clearBtn.addEventListener("click", clearAllCache);
        }
    }, 200);
}

// Performance Test Functions
function runPerformanceTest() {
    UIComponents.showNotification("🚀 Starting comprehensive performance test...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Performance test completed! Average load time: 1.2s", "success");
        // Update metrics
        document.getElementById("page-load-time").textContent = "1.2s";
        document.getElementById("cache-hit-rate").textContent = "94%";
        document.getElementById("memory-usage").textContent = "68%";
        document.getElementById("cpu-usage").textContent = "23%";
    }, 3000);
}

function clearAllCache() {
    UIComponents.showNotification("🗑️ Clearing all cache layers...", "warning");

    setTimeout(() => {
        UIComponents.showNotification("✅ All cache cleared successfully! Performance may be temporarily affected.", "success");
        // Update cache metrics
        document.getElementById("cache-hit-rate").textContent = "0%";

        // Simulate cache rebuilding
        setTimeout(() => {
            document.getElementById("cache-hit-rate").textContent = "94%";
            UIComponents.showNotification("🔄 Cache rebuilt successfully!", "success");
        }, 5000);
    }, 2000);
}

// Cache Management Functions
function manageQueryCache() {
    UIComponents.showNotification("🗄️ Opening database query cache management...", "info");
}

function manageCDN() {
    UIComponents.showNotification("🌐 Opening CDN configuration panel...", "info");
}

function manageRedisCache() {
    UIComponents.showNotification("⚡ Opening Redis cache management interface...", "info");
}

// Database Optimization Functions
function analyzeQuery(id) {
    UIComponents.showNotification(`🔍 Analyzing query performance for ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("📊 Query analysis completed! Check recommendations.", "success");
    }, 2000);
}

function optimizeQuery(id) {
    UIComponents.showNotification(`⚡ Optimizing query ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Query optimization completed! Performance improved by 45%.", "success");
        loadDatabaseOptimization();
    }, 3000);
}

function viewQueryPlan(id) {
    UIComponents.showNotification(`📋 Opening execution plan for query ID: ${id}`, "info");
}

// Performance Recommendations Functions
function implementRecommendation(id) {
    UIComponents.showNotification(`🚀 Implementing performance recommendation ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Recommendation implemented successfully!", "success");
        loadPerformanceRecommendations();
    }, 3000);
}

function viewRecommendationDetails(id) {
    UIComponents.showNotification(`📋 Viewing detailed information for recommendation ID: ${id}`, "info");
}

function scheduleRecommendation(id) {
    UIComponents.showNotification(`⏰ Scheduling implementation for recommendation ID: ${id}`, "info");
}

// Global functions for onclick handlers
window.runPerformanceTest = runPerformanceTest;
window.clearAllCache = clearAllCache;
window.manageQueryCache = manageQueryCache;
window.manageCDN = manageCDN;
window.manageRedisCache = manageRedisCache;
window.analyzeQuery = analyzeQuery;
window.optimizeQuery = optimizeQuery;
window.viewQueryPlan = viewQueryPlan;
window.implementRecommendation = implementRecommendation;
window.viewRecommendationDetails = viewRecommendationDetails;
window.scheduleRecommendation = scheduleRecommendation;

function setupAdvancedAnalyticsEventListeners() {
    setTimeout(() => {
        const trainBtn = document.getElementById("btn-train-model");
        if (trainBtn) {
            trainBtn.addEventListener("click", trainMLModel);
        }

        const insightsBtn = document.getElementById("btn-generate-insights");
        if (insightsBtn) {
            insightsBtn.addEventListener("click", generateMLInsights);
        }
    }, 200);
}

// ML Model Training Functions
function trainMLModel() {
    UIComponents.showNotification("🤖 Starting ML model training with latest data...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ ML model training completed! Accuracy improved to 97.2%", "success");
        // Update model accuracy
        document.getElementById("model-accuracy").textContent = "97.2%";
        loadMLModels();
    }, 5000);
}

function generateMLInsights() {
    UIComponents.showNotification("💡 Generating AI-powered insights from latest data...", "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ New insights generated! Check the predictive analytics dashboard.", "success");
        // Update predictions count
        const currentPredictions = parseInt(document.getElementById("predictions-made").textContent.replace(',', ''));
        document.getElementById("predictions-made").textContent = (currentPredictions + 156).toLocaleString();
    }, 3000);
}

// Predictive Analytics Functions
function viewSuccessPredictions() {
    UIComponents.showNotification("📈 Opening detailed student success predictions dashboard...", "info");
}

function viewPathOptimizations() {
    UIComponents.showNotification("🎯 Opening learning path optimization analytics...", "info");
}

function viewEngagementForecasts() {
    UIComponents.showNotification("⏰ Opening engagement forecasting dashboard...", "info");
}

// ML Model Management Functions
function viewModelDetails(id) {
    UIComponents.showNotification(`📊 Opening detailed analytics for ML model ID: ${id}`, "info");
}

function retrainModel(id) {
    UIComponents.showNotification(`🔄 Starting retraining process for model ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Model retraining completed successfully!", "success");
        loadMLModels();
    }, 4000);
}

function testModel(id) {
    UIComponents.showNotification(`🧪 Running test suite for model ID: ${id}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Model testing completed! All tests passed.", "success");
    }, 2000);
}

function exportModel(id) {
    UIComponents.showNotification(`📤 Exporting model ID: ${id} for deployment...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Model exported successfully! Download ready.", "success");
    }, 1500);
}

// Custom Analytics Builder Functions
function previewAnalytics() {
    const dataSource = document.getElementById("analytics-data-source")?.value;
    const analysisType = document.getElementById("analytics-type")?.value;
    const timeframe = document.getElementById("analytics-timeframe")?.value;
    const visualization = document.getElementById("analytics-visualization")?.value;

    UIComponents.showNotification(`👁️ Previewing ${analysisType} on ${dataSource} (${timeframe}, ${visualization})...`, "info");
}

function runCustomAnalytics() {
    const dataSource = document.getElementById("analytics-data-source")?.value;
    const analysisType = document.getElementById("analytics-type")?.value;
    const timeframe = document.getElementById("analytics-timeframe")?.value;
    const visualization = document.getElementById("analytics-visualization")?.value;

    UIComponents.showNotification(`🚀 Running ${analysisType} analysis on ${dataSource}...`, "info");

    setTimeout(() => {
        UIComponents.showNotification("✅ Custom analytics completed! Results available in dashboard.", "success");
    }, 4000);
}

function saveAnalyticsTemplate() {
    UIComponents.showNotification("💾 Saving analytics configuration as reusable template...", "success");
}

// Real-time Processing Functions
function viewStreamMetrics(id) {
    UIComponents.showNotification(`📊 Opening detailed metrics for processing stream ID: ${id}`, "info");
}

function restartStream(id) {
    UIComponents.showNotification(`🔄 Restarting processing stream ID: ${id}...`, "warning");

    setTimeout(() => {
        UIComponents.showNotification("✅ Processing stream restarted successfully!", "success");
        loadRealtimeProcessingStatus();
    }, 2000);
}

function configureStream(id) {
    UIComponents.showNotification(`⚙️ Opening configuration for processing stream ID: ${id}`, "info");
}

// Global functions for onclick handlers
window.viewSuccessPredictions = viewSuccessPredictions;
window.viewPathOptimizations = viewPathOptimizations;
window.viewEngagementForecasts = viewEngagementForecasts;
window.viewModelDetails = viewModelDetails;
window.retrainModel = retrainModel;
window.testModel = testModel;
window.exportModel = exportModel;
window.previewAnalytics = previewAnalytics;
window.runCustomAnalytics = runCustomAnalytics;
window.saveAnalyticsTemplate = saveAnalyticsTemplate;
window.viewStreamMetrics = viewStreamMetrics;
window.restartStream = restartStream;
window.configureStream = configureStream;

// Global functions
window.viewStudentDetail = viewStudentDetail;

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', initializeEducatorPortal);

console.log("🌱 AgenticLearn Educator Portal loaded with JSCroot");
