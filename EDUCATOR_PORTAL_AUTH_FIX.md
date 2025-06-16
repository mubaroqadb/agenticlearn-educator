# 👩‍🏫 Educator Portal Authentication Fix
## agenticlearn-educator Repository - Critical Update Guide

**Repository**: agenticlearn-educator  
**Priority**: CRITICAL  
**Estimated Time**: 2-3 hours

---

## 🎯 **SPECIFIC CHANGES FOR EDUCATOR PORTAL**

### **1. Update educator-portal-integration.js**

#### **✅ FIXED Implementation:**
```javascript
// ✅ CORRECT - Updated Educator Portal Manager
class EducatorPortalManager {
    constructor() {
        this.pasetoToken = this.getPasetoToken();
        this.apiBase = 'https://asia-southeast2-agenticai-462517.cloudfunctions.net/domyid/api/agenticlearn';
    }
    
    getPasetoToken() {
        const tokenNames = ['paseto_token', 'login', 'access_token', 'educator_token'];
        for (const name of tokenNames) {
            const token = this.getCookie(name);
            if (token) return token;
        }
        return null;
    }
    
    async makeRequest(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // ✅ CORRECT - Use 'login' header with PASETO token
        if (this.pasetoToken) {
            headers['login'] = this.pasetoToken;
        }
        
        const config = {
            ...options,
            headers: { ...headers, ...options.headers }
        };
        
        try {
            const response = await fetch(`${this.apiBase}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('Educator API Error:', error);
            throw error;
        }
    }
    
    // ✅ CORRECT - Educator login with phone number
    async login(phonenumber, password) {
        const response = await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                phonenumber: phonenumber, // NOT email
                password: password,
                role: 'educator'
            })
        });
        
        if (response.success && response.paseto) {
            this.setPasetoToken(response.paseto);
            this.setEducatorData(response.user);
        }
        
        return response;
    }
    
    setPasetoToken(pasetoToken) {
        this.pasetoToken = pasetoToken;
        document.cookie = `paseto_token=${pasetoToken}; path=/; max-age=86400`;
        document.cookie = `login=${pasetoToken}; path=/; max-age=86400`;
        document.cookie = `educator_token=${pasetoToken}; path=/; max-age=86400`;
        localStorage.setItem('paseto_token', pasetoToken);
    }
    
    setEducatorData(educatorData) {
        localStorage.setItem('educator_data', JSON.stringify(educatorData));
        localStorage.setItem('educator_phone', educatorData.phonenumber);
        localStorage.setItem('educator_name', educatorData.name);
    }
    
    getEducatorData() {
        const data = localStorage.getItem('educator_data');
        return data ? JSON.parse(data) : null;
    }
    
    getEducatorPhone() {
        return localStorage.getItem('educator_phone');
    }
    
    // ✅ CORRECT - Load educator dashboard data
    async loadDashboardData() {
        try {
            const [profile, stats, students, assessments] = await Promise.all([
                this.makeRequest('/educator/profile'),
                this.makeRequest('/educator/dashboard/stats'),
                this.makeRequest('/educator/students'),
                this.makeRequest('/educator/assessments')
            ]);
            
            return {
                profile: profile.success ? profile.profile : null,
                stats: stats.success ? stats.stats : null,
                students: students.success ? students.students : [],
                assessments: assessments.success ? assessments.assessments : []
            };
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            throw error;
        }
    }
    
    // ✅ CORRECT - Load advanced analytics
    async loadAnalytics() {
        try {
            const [advanced, patterns, engagement, trends, alerts] = await Promise.all([
                this.makeRequest('/educator/analytics/advanced'),
                this.makeRequest('/educator/analytics/learning-patterns'),
                this.makeRequest('/educator/analytics/engagement'),
                this.makeRequest('/educator/analytics/performance-trends'),
                this.makeRequest('/educator/analytics/student-alerts')
            ]);
            
            return {
                advanced: advanced.success ? advanced.data : null,
                patterns: patterns.success ? patterns.data : null,
                engagement: engagement.success ? engagement.data : null,
                trends: trends.success ? trends.data : null,
                alerts: alerts.success ? alerts.data : []
            };
        } catch (error) {
            console.error('Failed to load analytics:', error);
            throw error;
        }
    }
    
    logout() {
        const tokenNames = ['paseto_token', 'login', 'educator_token', 'access_token'];
        tokenNames.forEach(name => {
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });
        
        localStorage.removeItem('paseto_token');
        localStorage.removeItem('educator_data');
        localStorage.removeItem('educator_phone');
        localStorage.removeItem('educator_name');
        
        window.location.href = 'https://mubaroqadb.github.io/agenticlearn-auth/?type=educator';
    }
    
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
}

// Initialize global educator portal
window.educatorPortal = new EducatorPortalManager();
```

### **2. Update educator-dashboard.js**

#### **Profile Display Fix:**
```javascript
// ✅ CORRECT - Updated profile display
function displayEducatorProfile(profile) {
    document.getElementById('educatorName').textContent = profile.name;
    document.getElementById('educatorPhone').textContent = profile.phonenumber; // Correct field
    document.getElementById('educatorDepartment').textContent = profile.department;
    document.getElementById('educatorExperience').textContent = profile.experience;
    document.getElementById('educatorRating').textContent = profile.rating;
    
    // Update avatar if available
    if (profile.avatar) {
        document.getElementById('educatorAvatar').src = profile.avatar;
    }
}

// ✅ CORRECT - Updated students display
function displayStudents(students) {
    const container = document.getElementById('studentsContainer');
    container.innerHTML = '';
    
    students.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.innerHTML = `
            <div class="student-info">
                <h4>${student.name}</h4>
                <p class="student-phone">${student.phonenumber}</p>
                <p class="student-course">${student.course}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${student.progress}%"></div>
                </div>
                <span class="progress-text">${student.progress}% Complete</span>
                <span class="grade badge">${student.grade}</span>
            </div>
        `;
        container.appendChild(studentCard);
    });
}
```

#### **Data Loading Fix:**
```javascript
// ✅ CORRECT - Updated data loading
async function loadEducatorDashboard() {
    try {
        // Show loading state
        showLoadingState();
        
        // Load real data from backend
        const dashboardData = await window.educatorPortal.loadDashboardData();
        
        if (dashboardData.profile) {
            displayEducatorProfile(dashboardData.profile);
        }
        
        if (dashboardData.stats) {
            displayDashboardStats(dashboardData.stats);
        }
        
        if (dashboardData.students) {
            displayStudents(dashboardData.students);
        }
        
        if (dashboardData.assessments) {
            displayAssessments(dashboardData.assessments);
        }
        
        // Hide loading state
        hideLoadingState();
        
    } catch (error) {
        console.error('Failed to load educator dashboard:', error);
        // Show error message
        showErrorMessage('Failed to load dashboard data. Please try again.');
        // Fallback to demo data
        loadDemoData();
    }
}

// ✅ CORRECT - Load analytics data
async function loadAnalyticsData() {
    try {
        const analyticsData = await window.educatorPortal.loadAnalytics();
        
        if (analyticsData.advanced) {
            displayAdvancedAnalytics(analyticsData.advanced);
        }
        
        if (analyticsData.patterns) {
            displayLearningPatterns(analyticsData.patterns);
        }
        
        if (analyticsData.engagement) {
            displayEngagementMetrics(analyticsData.engagement);
        }
        
        if (analyticsData.trends) {
            displayPerformanceTrends(analyticsData.trends);
        }
        
        if (analyticsData.alerts) {
            displayStudentAlerts(analyticsData.alerts);
        }
        
    } catch (error) {
        console.error('Failed to load analytics:', error);
        showErrorMessage('Failed to load analytics data.');
    }
}
```

### **3. Update HTML Templates**

#### **Profile Section:**
```html
<!-- ✅ CORRECT - Educator profile display -->
<div class="educator-profile">
    <div class="profile-header">
        <img id="educatorAvatar" src="https://via.placeholder.com/150" alt="Educator Avatar">
        <div class="profile-info">
            <h2 id="educatorName">Loading...</h2>
            <p class="phone-number" id="educatorPhone">Loading...</p>
            <p class="department" id="educatorDepartment">Loading...</p>
            <div class="experience-rating">
                <span class="experience" id="educatorExperience">Loading...</span>
                <span class="rating" id="educatorRating">★ 0.0</span>
            </div>
        </div>
    </div>
</div>
```

#### **Students List:**
```html
<!-- ✅ CORRECT - Students display with phone numbers -->
<div class="students-section">
    <h3>My Students</h3>
    <div id="studentsContainer" class="students-grid">
        <!-- Students will be loaded here -->
    </div>
</div>

<style>
.student-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 16px;
}

.student-phone {
    color: #666;
    font-size: 0.9em;
    margin: 4px 0;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    margin: 8px 0;
}

.progress-fill {
    height: 100%;
    background: #4CAF50;
    transition: width 0.3s ease;
}

.badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: bold;
    background: #e3f2fd;
    color: #1976d2;
}
</style>
```

### **4. Update Navigation and Authentication**

```javascript
// ✅ CORRECT - Authentication check
function checkAuthentication() {
    const token = window.educatorPortal.getPasetoToken();
    const educatorData = window.educatorPortal.getEducatorData();
    
    if (!token || !educatorData) {
        // Redirect to login
        window.location.href = 'https://mubaroqadb.github.io/agenticlearn-auth/?type=educator';
        return false;
    }
    
    // Display educator info in navigation
    document.getElementById('navEducatorName').textContent = educatorData.name;
    document.getElementById('navEducatorPhone').textContent = educatorData.phonenumber;
    
    return true;
}

// ✅ CORRECT - Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.educatorPortal.logout();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuthentication()) {
        loadEducatorDashboard();
    }
});
```

---

## 🧪 **TESTING CHECKLIST FOR EDUCATOR PORTAL**

### **Authentication Test:**
- [ ] Login form accepts phone number (082119000486)
- [ ] PASETO token stored correctly
- [ ] API requests use 'login' header
- [ ] Logout clears all tokens
- [ ] Redirect to auth works

### **Profile Test:**
- [ ] Educator profile displays phone number
- [ ] Department and experience show
- [ ] Rating displays correctly
- [ ] Avatar loads properly

### **Students Test:**
- [ ] Students list loads from API
- [ ] Student phone numbers display
- [ ] Progress bars work
- [ ] Grades show correctly
- [ ] Student cards are clickable

### **Dashboard Test:**
- [ ] Dashboard stats load
- [ ] Course metrics display
- [ ] Recent activity shows
- [ ] Assessment data loads

### **Analytics Test:**
- [ ] Advanced analytics load
- [ ] Learning patterns display
- [ ] Engagement metrics work
- [ ] Performance trends show
- [ ] Student alerts appear

---

## 📋 **DEPLOYMENT STEPS**

### **1. Update Files:**
```bash
git checkout main
git pull origin main

# Update these files:
# - js/educator-portal-integration.js
# - js/educator-dashboard.js
# - index.html
# - Add js/config.js
# - Add js/auth-manager.js

git add .
git commit -m "fix: update educator authentication to use PASETO and phone numbers"
git push origin main
```

### **2. Test Integration:**
```javascript
// Test in browser console
console.log('EducatorPortalManager:', typeof EducatorPortalManager);
console.log('Token:', window.educatorPortal.getPasetoToken());

// Test API call
const profile = await window.educatorPortal.makeRequest('/educator/profile');
console.log('Profile:', profile);
```

**Timeline**: Complete within 24 hours for critical authentication fix.
