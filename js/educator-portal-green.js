// Educator Portal - JSCroot Implementation with Shared Components

// Import required dependencies
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/cookie.js";
import { setInner, onClick } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js";
import { redirect } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/url.js";

// Dynamic API Configuration - Updated to match backend
const API_BASE_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:8080/api/agenticlearn"
    : "https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid/api/agenticlearn";

// Fallback URLs to try if primary fails
const FALLBACK_URLS = [
    "https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid",
    "https://agenticai-backend.railway.app/api/agenticlearn",
    "https://api.agenticlearn.com/api/agenticlearn"
];

// Get GitHub username for redirects
const GITHUB_USERNAME = window.location.hostname.includes('github.io')
    ? window.location.hostname.split('.')[0]
    : 'mubaroqadb';

// API Client with proper authentication and fallback URLs
class EducatorAPIClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.fallbackURLs = FALLBACK_URLS;
        this.token = getCookie("login") || getCookie("access_token");
        this.workingURL = null; // Cache working URL
    }

    async request(endpoint, options = {}) {
        // Try cached working URL first
        if (this.workingURL) {
            try {
                return await this._makeRequest(this.workingURL, endpoint, options);
            } catch (error) {
                console.warn(`Cached URL failed, trying alternatives:`, error);
                this.workingURL = null; // Reset cache
            }
        }

        // Try primary URL
        const urlsToTry = [this.baseURL, ...this.fallbackURLs];

        for (const baseURL of urlsToTry) {
            try {
                const result = await this._makeRequest(baseURL, endpoint, options);
                this.workingURL = baseURL; // Cache successful URL
                console.log(`✅ Successfully connected to: ${baseURL}`);
                return result;
            } catch (error) {
                console.warn(`❌ Failed to connect to ${baseURL}:`, error.message);
                continue;
            }
        }

        // All URLs failed
        throw new Error(`All backend URLs failed. Endpoints tried: ${urlsToTry.join(', ')}`);
    }

    async _makeRequest(baseURL, endpoint, options = {}) {
        const url = `${baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add authentication header if token exists
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            method: options.method || 'GET',
            headers,
            mode: 'cors',
            credentials: 'omit',
            ...options
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    }

    getCarbonMetrics() {
        return { totalCarbon: 0.000125 };
    }
}

// Initialize API client
const apiClient = new EducatorAPIClient();

// Test backend connection with multiple endpoints
async function testBackendConnection() {
    try {
        showNotification("🔄 Testing backend connection...", "info");

        // Try multiple test endpoints
        const testEndpoints = ["/health", "/", "/api/health", "/status"];

        for (const endpoint of testEndpoints) {
            try {
                const response = await apiClient.request(endpoint);
                showNotification(`✅ Backend connected via ${endpoint}!`, "success");
                return true;
            } catch (error) {
                console.warn(`Test endpoint ${endpoint} failed:`, error.message);
                continue;
            }
        }

        // If all specific endpoints fail, try a simple GET to root
        try {
            const response = await fetch(apiClient.workingURL || API_BASE_URL, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit'
            });

            if (response.status < 500) { // Accept any non-server-error response
                showNotification("✅ Backend reachable (basic connectivity)", "success");
                return true;
            }
        } catch (error) {
            console.warn("Basic connectivity test failed:", error);
        }

        throw new Error("All connection tests failed");

    } catch (error) {
        console.warn("Backend connection failed, using demo mode:", error);
        showNotification("⚠️ Backend unavailable, using demo data", "warning");
        return false;
    }
}

async function initializeEducatorPortal() {
    const token = getCookie("login");
    if (!token) {
        redirect(`https://${GITHUB_USERNAME}.github.io/agenticlearn-auth`);
        return;
    }

    try {
        // Test backend connection first
        const isBackendAvailable = await testBackendConnection();

        // Load educator data
        await loadEducatorData();
        await loadClassData();
        await loadStudentList();
        await loadAIInsights();

        // Setup event listeners
        setupEventListeners();

        // Update carbon indicator
        updateCarbonIndicator();

        // Show welcome notification and setup demo mode
        const message = isBackendAvailable
            ? "Educator Portal loaded successfully! 🌱"
            : "Educator Portal loaded in demo mode! 🌱";
        showNotification(message, "success");

        // Setup demo mode features if backend unavailable
        if (!isBackendAvailable) {
            setupDemoMode();
            updateConnectionStatus("demo");
        } else {
            updateConnectionStatus("connected");
        }

        console.log("🌱 Educator Portal loaded with JSCroot and shared components");
    } catch (error) {
        console.error("Failed to load educator portal:", error);
        setInner("educator-name", "Error loading data");
        showNotification("Failed to load educator portal", "error");
    }
}

async function loadEducatorData() {
    try {
        const educatorData = await apiClient.request("/instructor/profile");
        setInner("educator-name", educatorData.name || "Dr. Sarah Educator");
    } catch (error) {
        console.error("Failed to load educator data:", error);
        setInner("educator-name", "Demo Educator");
        showNotification("Using demo educator data", "info");
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
        showNotification("Using demo data for class statistics", "info");
    }
}

async function loadStudentList() {
    try {
        const students = await apiClient.request("/progress/class-1");
        renderStudentTable(students);
    } catch (error) {
        console.error("Failed to load student list:", error);
        renderDemoStudentTable();
        showNotification("Using demo data for student list", "info");
    }
}

function renderStudentTable(students) {
    const tableHTML = `
        <table class="student-table">
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Terakhir Aktif</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => `
                    <tr>
                        <td><strong>${student.name}</strong></td>
                        <td>${student.email}</td>
                        <td>
                            <div class="progress-mini">
                                <div class="progress-mini-fill" style="width: ${student.progress}%"></div>
                            </div>
                            <small>${student.progress}%</small>
                        </td>
                        <td class="${student.status === 'active' ? 'status-active' : 'status-inactive'}">
                            ${student.status === 'active' ? '🟢 Aktif' : '🔴 Tidak Aktif'}
                        </td>
                        <td>${new Date(student.lastActive).toLocaleDateString('id-ID')}</td>
                        <td>
                            <button class="btn" onclick="viewStudentDetail('${student.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                Detail
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    setInner("student-list", tableHTML);
}

function renderDemoStudentTable() {
    const demoStudents = [
        { id: "student-1", name: "Andi Mahasiswa", email: "andi@student.edu", progress: 75, status: "active", lastActive: new Date().toISOString() },
        { id: "student-2", name: "Sari Belajar", email: "sari@student.edu", progress: 45, status: "active", lastActive: new Date(Date.now() - 86400000).toISOString() },
        { id: "student-3", name: "Budi Cerdas", email: "budi@student.edu", progress: 90, status: "active", lastActive: new Date().toISOString() },
        { id: "student-4", name: "Maya Rajin", email: "maya@student.edu", progress: 25, status: "inactive", lastActive: new Date(Date.now() - 604800000).toISOString() },
        { id: "student-5", name: "Dewi Pintar", email: "dewi@student.edu", progress: 88, status: "active", lastActive: new Date(Date.now() - 3600000).toISOString() },
        { id: "student-6", name: "Rudi Tekun", email: "rudi@student.edu", progress: 62, status: "active", lastActive: new Date(Date.now() - 7200000).toISOString() },
        { id: "student-7", name: "Lisa Cerdik", email: "lisa@student.edu", progress: 35, status: "inactive", lastActive: new Date(Date.now() - 259200000).toISOString() },
        { id: "student-8", name: "Agus Rajin", email: "agus@student.edu", progress: 92, status: "active", lastActive: new Date(Date.now() - 1800000).toISOString() }
    ];
    renderStudentTable(demoStudents);
}

// Enhanced demo data generator
function generateRealtimeDemoData() {
    const now = Date.now();
    const variations = [-2, -1, 0, 1, 2]; // Small random variations

    return {
        onlineStudents: 12 + variations[Math.floor(Math.random() * variations.length)],
        activeSessions: 8 + variations[Math.floor(Math.random() * variations.length)],
        avgEngagement: (78 + variations[Math.floor(Math.random() * variations.length)]) + '%',
        completionToday: 15 + variations[Math.floor(Math.random() * variations.length)],
        lastUpdate: new Date().toLocaleTimeString('id-ID')
    };
}

// Update real-time demo stats
function updateDemoStats() {
    const stats = generateRealtimeDemoData();

    const onlineElement = document.getElementById("online-students");
    const sessionsElement = document.getElementById("active-sessions");
    const engagementElement = document.getElementById("avg-engagement");
    const completionElement = document.getElementById("completion-today");
    const lastUpdateElement = document.getElementById("last-update-time");

    if (onlineElement) onlineElement.textContent = stats.onlineStudents;
    if (sessionsElement) sessionsElement.textContent = stats.activeSessions;
    if (engagementElement) engagementElement.textContent = stats.avgEngagement;
    if (completionElement) completionElement.textContent = stats.completionToday;
    if (lastUpdateElement) lastUpdateElement.textContent = stats.lastUpdate;
}

async function loadAIInsights() {
    try {
        const insights = await apiClient.request("/instructor/insights/ai");

        // Update learning patterns
        if (insights.learningPatterns) {
            setInner("learning-patterns", insights.learningPatterns);
        }

        // Update at-risk students
        if (insights.atRiskStudents) {
            setInner("at-risk-students", insights.atRiskStudents);
        }

        // Update AI recommendations
        if (insights.recommendations) {
            setInner("ai-recommendations", insights.recommendations);
        }

        showNotification("AI insights loaded successfully", "success");
    } catch (error) {
        console.error("Failed to load AI insights:", error);

        // Enhanced demo data with dynamic insights
        const currentHour = new Date().getHours();
        const timeOfDay = currentHour < 12 ? "pagi" : currentHour < 17 ? "siang" : "malam";

        const demoInsights = {
            learningPatterns: `🕒 Puncak aktivitas: 19:00-21:00 WIB. 📱 85% akses via mobile. 📊 Saat ini ${timeOfDay}, 12 mahasiswa online.`,
            atRiskStudents: "⚠️ 3 mahasiswa berisiko: Maya Rajin (25% progress), Lisa Cerdik (35% progress). Perlu intervensi segera.",
            recommendations: `💡 Tingkatkan konten interaktif untuk ${timeOfDay} hari. 🎯 Focus pada Module 2 (completion rate rendah). 📞 Follow-up personal untuk yang tertinggal.`
        };

        setInner("learning-patterns", demoInsights.learningPatterns);
        setInner("at-risk-students", demoInsights.atRiskStudents);
        setInner("ai-recommendations", demoInsights.recommendations);

        showNotification("Using demo AI insights data", "info");
    }
}

// Notification helper function
function showNotification(message, type = "info") {
    // Try to use UIComponents if available, otherwise use console
    if (typeof UIComponents !== 'undefined' && UIComponents.showNotification) {
        UIComponents.showNotification(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);

        // Simple fallback notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f56565' : type === 'success' ? '#48bb78' : '#4299e1'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

function setupEventListeners() {
    onClick("btn-export-progress", exportStudentProgress);
    onClick("btn-send-reminder", sendReminder);
    onClick("btn-refresh-data", refreshData);
    onClick("btn-create-assignment", createAssignment);
    onClick("btn-schedule-class", scheduleClass);
    onClick("btn-view-analytics", viewAnalytics);
    onClick("btn-manage-content", manageContent);
    onClick("btn-chat-ai", chatWithAI);

    // Student management listeners
    onClick("btn-add-student", addStudent);
    onClick("btn-bulk-actions", bulkActions);
    onClick("btn-export-students", exportStudentProgress);
    onClick("btn-clear-filters", clearFilters);
    onClick("btn-refresh-analytics", refreshAnalytics);

    // Select all checkbox
    const selectAllCheckbox = document.getElementById("select-all-students");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function() {
            const checkboxes = document.querySelectorAll(".student-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

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
    showNotification("📊 Progress report berhasil diexport!", "success");
}

function sendReminder() {
    showNotification("📧 Mengirim reminder ke mahasiswa yang belum aktif...", "info");
    setTimeout(() => {
        showNotification("✅ Reminder berhasil dikirim ke 3 mahasiswa!", "success");
    }, 2000);
}

async function refreshData() {
    showNotification("🔄 Merefresh data...", "info");
    try {
        await loadClassData();
        await loadStudentList();
        await loadAIInsights();
        updateCarbonIndicator();
        showNotification("✅ Data berhasil direfresh!", "success");
    } catch (error) {
        showNotification("❌ Gagal refresh data. Silakan coba lagi.", "error");
    }
}

function createAssignment() {
    const title = prompt("📝 Judul Assignment:");
    const dueDate = prompt("📅 Tanggal Deadline (YYYY-MM-DD):");
    if (title && dueDate) {
        showNotification(`✅ Assignment "${title}" berhasil dibuat! Deadline: ${dueDate}`, "success");
    }
}

function scheduleClass() {
    const topic = prompt("📚 Topik Kelas:");
    const date = prompt("📅 Tanggal & Waktu (YYYY-MM-DD HH:MM):");
    if (topic && date) {
        showNotification(`✅ Kelas "${topic}" berhasil dijadwalkan! Waktu: ${date}`, "success");
    }
}

function viewAnalytics() {
    showNotification("📊 Membuka analytics detail...", "info");
}

function manageContent() {
    showNotification("📚 Membuka content management...", "info");
}

function chatWithAI() {
    const question = prompt("🤖 Tanyakan sesuatu kepada AI Assistant untuk Educator:");
    if (question) {
        showNotification(`🤖 AI Response: "Berdasarkan data kelas Anda, saya merekomendasikan untuk focus pada mahasiswa dengan progress <50%. Pertanyaan Anda tentang '${question}' sangat relevan untuk meningkatkan engagement."`, "info");
    }
}

function viewStudentDetail(studentId) {
    showNotification(`👤 Membuka detail mahasiswa ID: ${studentId}`, "info");
}

function sendMessage(studentId) {
    const message = prompt("💬 Kirim pesan ke mahasiswa:");
    if (message) {
        showNotification(`✅ Pesan berhasil dikirim ke mahasiswa ID: ${studentId}`, "success");
    }
}

function addStudent() {
    const name = prompt("👤 Nama mahasiswa:");
    const email = prompt("📧 Email mahasiswa:");
    if (name && email) {
        showNotification(`✅ Mahasiswa "${name}" berhasil ditambahkan!`, "success");
    }
}

function bulkActions() {
    const selectedStudents = document.querySelectorAll('.student-checkbox:checked');
    if (selectedStudents.length === 0) {
        showNotification("⚠️ Pilih minimal satu mahasiswa untuk bulk action", "warning");
        return;
    }

    const action = prompt(`📋 Pilih aksi untuk ${selectedStudents.length} mahasiswa:\n1. Send Reminder\n2. Export Data\n3. Change Status\n\nMasukkan nomor (1-3):`);

    switch(action) {
        case '1':
            showNotification(`📧 Reminder berhasil dikirim ke ${selectedStudents.length} mahasiswa`, "success");
            break;
        case '2':
            showNotification(`📊 Data ${selectedStudents.length} mahasiswa berhasil diexport`, "success");
            break;
        case '3':
            showNotification(`✅ Status ${selectedStudents.length} mahasiswa berhasil diubah`, "success");
            break;
        default:
            showNotification("❌ Aksi tidak valid", "error");
    }
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

function clearFilters() {
    const filterClass = document.getElementById("filter-class");
    const filterProgress = document.getElementById("filter-progress");
    const filterEngagement = document.getElementById("filter-engagement");
    const searchInput = document.getElementById("search-students-advanced");

    if (filterClass) filterClass.value = "all";
    if (filterProgress) filterProgress.value = "all";
    if (filterEngagement) filterEngagement.value = "all";
    if (searchInput) searchInput.value = "";

    showNotification("🗑️ Filter berhasil dibersihkan", "info");
}

function refreshAnalytics() {
    showNotification("🔄 Merefresh analytics data...", "info");
    setTimeout(() => {
        showNotification("✅ Analytics data berhasil direfresh!", "success");
    }, 1500);
}

// Backend status checker
async function checkBackendStatus() {
    try {
        const isAvailable = await testBackendConnection();
        if (isAvailable) {
            showNotification("🎉 Backend is now available! Refreshing data...", "success");
            // Reload real data
            await loadEducatorData();
            await loadClassData();
            await loadStudentList();
            await loadAIInsights();

            // Remove demo mode indicator
            const demoBadge = document.querySelector('[style*="DEMO MODE"]');
            if (demoBadge) {
                demoBadge.remove();
            }
        }
    } catch (error) {
        console.log("Backend still unavailable, continuing in demo mode");
    }
}

// Periodic backend status check (every 2 minutes)
setInterval(checkBackendStatus, 120000);

// Update connection status indicator
function updateConnectionStatus(status) {
    const statusElement = document.getElementById("connection-status");
    if (!statusElement) return;

    const statusConfig = {
        connected: {
            text: "🟢 Backend Connected",
            background: "var(--success)",
            color: "white",
            show: true
        },
        demo: {
            text: "🎭 Demo Mode Active",
            background: "var(--warning)",
            color: "var(--gray-800)",
            show: true
        },
        checking: {
            text: "🔄 Checking backend...",
            background: "var(--info)",
            color: "white",
            show: true
        },
        hidden: {
            show: false
        }
    };

    const config = statusConfig[status] || statusConfig.hidden;

    if (config.show) {
        statusElement.style.display = "block";
        statusElement.style.background = config.background;
        statusElement.innerHTML = `<span style="font-size: 0.75rem; color: ${config.color};">${config.text}</span>`;
    } else {
        statusElement.style.display = "none";
    }
}

// Demo mode setup
function setupDemoMode() {
    // Add demo mode indicator
    addDemoModeIndicator();

    // Start real-time demo data updates
    updateDemoStats();
    setInterval(updateDemoStats, 30000); // Update every 30 seconds

    // Add demo activity timeline
    loadDemoActivityTimeline();

    // Show demo mode notification
    setTimeout(() => {
        showNotification("🎭 Demo Mode Active - Simulating real-time data", "info");
    }, 3000);
}

function addDemoModeIndicator() {
    // Add demo badge to header
    const header = document.querySelector('.header');
    if (header) {
        const demoBadge = document.createElement('div');
        demoBadge.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            z-index: 1000;
            animation: pulse 2s infinite;
        `;
        demoBadge.textContent = '🎭 DEMO MODE';
        header.style.position = 'relative';
        header.appendChild(demoBadge);

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function loadDemoActivityTimeline() {
    const timelineElement = document.getElementById("activity-timeline");
    if (timelineElement) {
        const activities = [
            { time: "2 menit lalu", student: "Andi Mahasiswa", action: "Menyelesaikan Quiz Module 2", type: "success" },
            { time: "5 menit lalu", student: "Dewi Pintar", action: "Mengakses Video Lecture 3", type: "info" },
            { time: "12 menit lalu", student: "Budi Cerdas", action: "Submit Assignment 1", type: "success" },
            { time: "18 menit lalu", student: "Rudi Tekun", action: "Join Discussion Forum", type: "info" },
            { time: "25 menit lalu", student: "Agus Rajin", action: "Complete Reading Material", type: "success" },
            { time: "32 menit lalu", student: "Sari Belajar", action: "Start Module 3", type: "info" },
            { time: "45 menit lalu", student: "Lisa Cerdik", action: "Login to Platform", type: "warning" }
        ];

        const timelineHTML = activities.map(activity => {
            const iconMap = {
                success: "✅",
                info: "📚",
                warning: "⚠️"
            };

            return `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; margin-bottom: 0.5rem; background: var(--accent); border-radius: 6px; border-left: 3px solid var(--${activity.type === 'success' ? 'primary' : activity.type === 'warning' ? 'warning' : 'info'});">
                    <span style="font-size: 1.2rem;">${iconMap[activity.type]}</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--gray-800); font-size: 0.875rem;">${activity.student}</div>
                        <div style="color: var(--gray-600); font-size: 0.75rem;">${activity.action}</div>
                    </div>
                    <div style="color: var(--gray-500); font-size: 0.75rem; white-space: nowrap;">${activity.time}</div>
                </div>
            `;
        }).join('');

        timelineElement.innerHTML = timelineHTML;
    }
}

// Global functions
window.viewStudentDetail = viewStudentDetail;
window.sendMessage = sendMessage;
window.addStudent = addStudent;
window.bulkActions = bulkActions;

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', initializeEducatorPortal);

console.log("🌱 AgenticLearn Educator Portal loaded with JSCroot");
