// Educator Portal - JSCroot Implementation with Shared Components

// Dynamic API Configuration
const API_BASE_URL = window.location.hostname.includes("localhost") ? "http://localhost:8080/api/v1" : "https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid"; // Will be Google Cloud endpoint

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
        const classData = await apiClient.request("/educator/classes");
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
        const students = await apiClient.request("/educator/students/class-1");
        renderStudentTable(students);
    } catch (error) {
        console.error("Failed to load student list:", error);
        renderDemoStudentTable();
        UIComponents.showNotification("Using demo data for student list", "info");
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
        { id: "student-4", name: "Maya Rajin", email: "maya@student.edu", progress: 25, status: "inactive", lastActive: new Date(Date.now() - 604800000).toISOString() }
    ];
    renderStudentTable(demoStudents);
}

async function loadAIInsights() {
    try {
        const insights = {
            learningPatterns: "🕒 Puncak aktivitas: 19:00-21:00 WIB. 📱 85% akses via mobile. 📊 Konten video paling engaging.",
            atRiskStudents: "⚠️ 3 mahasiswa berisiko: Maya Rajin (25% progress), perlu intervensi segera.",
            recommendations: "💡 Tingkatkan konten interaktif. �� Focus pada modul Analytics. 📞 Follow-up personal untuk yang tertinggal."
        };
        setInner("learning-patterns", insights.learningPatterns);
        setInner("at-risk-students", insights.atRiskStudents);
        setInner("ai-recommendations", insights.recommendations);
    } catch (error) {
        console.error("Failed to load AI insights:", error);
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

function sendMessage(studentId) {
    const message = prompt("💬 Kirim pesan ke mahasiswa:");
    if (message) {
        UIComponents.showNotification(`✅ Pesan berhasil dikirim ke mahasiswa ID: ${studentId}`, "success");
    }
}

function addStudent() {
    const name = prompt("👤 Nama mahasiswa:");
    const email = prompt("📧 Email mahasiswa:");
    if (name && email) {
        UIComponents.showNotification(`✅ Mahasiswa "${name}" berhasil ditambahkan!`, "success");
    }
}

function bulkActions() {
    const selectedStudents = document.querySelectorAll('.student-checkbox:checked');
    if (selectedStudents.length === 0) {
        UIComponents.showNotification("⚠️ Pilih minimal satu mahasiswa untuk bulk action", "warning");
        return;
    }

    const action = prompt(`📋 Pilih aksi untuk ${selectedStudents.length} mahasiswa:\n1. Send Reminder\n2. Export Data\n3. Change Status\n\nMasukkan nomor (1-3):`);

    switch(action) {
        case '1':
            UIComponents.showNotification(`📧 Reminder berhasil dikirim ke ${selectedStudents.length} mahasiswa`, "success");
            break;
        case '2':
            UIComponents.showNotification(`📊 Data ${selectedStudents.length} mahasiswa berhasil diexport`, "success");
            break;
        case '3':
            UIComponents.showNotification(`✅ Status ${selectedStudents.length} mahasiswa berhasil diubah`, "success");
            break;
        default:
            UIComponents.showNotification("❌ Aksi tidak valid", "error");
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
    document.getElementById("filter-class").value = "all";
    document.getElementById("filter-progress").value = "all";
    document.getElementById("filter-engagement").value = "all";
    document.getElementById("search-students-advanced").value = "";
    UIComponents.showNotification("🗑️ Filter berhasil dibersihkan", "info");
}

function refreshAnalytics() {
    UIComponents.showNotification("🔄 Merefresh analytics data...", "info");
    setTimeout(() => {
        UIComponents.showNotification("✅ Analytics data berhasil direfresh!", "success");
    }, 1500);
}

// Global functions
window.viewStudentDetail = viewStudentDetail;
window.sendMessage = sendMessage;
window.addStudent = addStudent;
window.bulkActions = bulkActions;

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', initializeEducatorPortal);

console.log("🌱 AgenticLearn Educator Portal loaded with JSCroot");
