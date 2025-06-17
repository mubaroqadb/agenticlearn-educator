// Admin Advanced Features JavaScript

// ===== NAVIGATION MANAGEMENT =====

function showAdminPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.admin-page-content');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(`admin-page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Add active class to clicked button
    const activeButton = document.querySelector(`[onclick="showAdminPage('${pageId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Load page-specific content
    loadAdminPageContent(pageId);
}

function loadAdminPageContent(pageId) {
    switch (pageId) {
        case 'integrations':
            loadIntegrationsContent();
            break;
        case 'security':
            loadSecurityContent();
            break;
        case 'performance':
            loadPerformanceContent();
            break;
        case 'advanced-analytics':
            loadAdvancedAnalyticsContent();
            break;
        case 'mobile':
            loadMobileContent();
            break;
        case 'settings':
            loadSettingsContent();
            break;
    }
}

// ===== INTEGRATIONS MANAGEMENT =====

function loadIntegrationsContent() {
    console.log('Loading integrations content...');
    
    // Add event listeners for configure buttons
    const configureButtons = document.querySelectorAll('.btn-configure');
    configureButtons.forEach(btn => {
        btn.onclick = function() {
            const integrationName = this.parentElement.querySelector('span').textContent;
            showNotification(`Configuring ${integrationName}...`, 'info');
        };
    });
}

// ===== SECURITY MANAGEMENT =====

function loadSecurityContent() {
    console.log('Loading security content...');
    
    // Add event listeners for security settings
    const twoFactorCheckbox = document.getElementById('2fa-enabled');
    if (twoFactorCheckbox) {
        twoFactorCheckbox.onchange = function() {
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`Two-Factor Authentication ${status}`, 'success');
        };
    }
}

// ===== PERFORMANCE MONITORING =====

function loadPerformanceContent() {
    console.log('Loading performance content...');
    
    // Simulate real-time performance updates
    updatePerformanceMetrics();
    
    // Update metrics every 30 seconds
    setInterval(updatePerformanceMetrics, 30000);
}

function updatePerformanceMetrics() {
    const metrics = {
        responseTime: Math.floor(Math.random() * 300) + 100,
        queries: Math.floor(Math.random() * 2000) + 1000,
        memory: Math.floor(Math.random() * 40) + 50
    };

    const metricElements = document.querySelectorAll('.metric-value');
    if (metricElements.length >= 3) {
        metricElements[0].textContent = `${metrics.responseTime}ms`;
        metricElements[1].textContent = `${metrics.queries.toLocaleString()}/min`;
        metricElements[2].textContent = `${metrics.memory}%`;
    }
}

// ===== ADVANCED ANALYTICS =====

function loadAdvancedAnalyticsContent() {
    console.log('Loading advanced analytics content...');
    
    // Add event listeners for analytics configuration
    const checkboxes = document.querySelectorAll('#admin-page-advanced-analytics input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.onchange = function() {
            const setting = this.parentElement.textContent.trim();
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`${setting} ${status}`, 'info');
        };
    });
}

// ===== MOBILE & PWA MANAGEMENT =====

function loadMobileContent() {
    console.log('Loading mobile content...');
    
    // Add event listeners for mobile settings
    const pwaCheckbox = document.querySelector('#admin-page-mobile input[type="checkbox"]');
    if (pwaCheckbox) {
        pwaCheckbox.onchange = function() {
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`PWA ${status}`, 'success');
        };
    }

    // Handle file upload for app icon
    const fileInput = document.querySelector('#admin-page-mobile input[type="file"]');
    if (fileInput) {
        fileInput.onchange = function() {
            if (this.files.length > 0) {
                showNotification(`App icon uploaded: ${this.files[0].name}`, 'success');
            }
        };
    }
}

// ===== SETTINGS MANAGEMENT =====

function loadSettingsContent() {
    console.log('Loading settings content...');
    
    // Add event listeners for general settings
    const inputs = document.querySelectorAll('#admin-page-settings input, #admin-page-settings select');
    inputs.forEach(input => {
        input.onchange = function() {
            const setting = this.parentElement.querySelector('label').textContent;
            showNotification(`${setting} updated`, 'success');
        };
    });

    // Handle maintenance mode toggle
    const maintenanceCheckbox = document.querySelector('#admin-page-settings input[type="checkbox"]');
    if (maintenanceCheckbox) {
        maintenanceCheckbox.onchange = function() {
            const status = this.checked ? 'enabled' : 'disabled';
            const message = this.checked ? 
                'Maintenance mode enabled - System will be unavailable to users' : 
                'Maintenance mode disabled - System is now available';
            showNotification(message, this.checked ? 'warning' : 'success');
        };
    }
}

// ===== NOTIFICATION SYSTEM =====

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        font-weight: 500;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#059669';
        case 'warning': return '#d97706';
        case 'error': return '#dc2626';
        case 'info':
        default: return '#2563eb';
    }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Advanced Features initialized');
    
    // Load default page content
    loadAdminPageContent('integrations');
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ===== UTILITY FUNCTIONS =====

function exportConfiguration() {
    const config = {
        integrations: getIntegrationSettings(),
        security: getSecuritySettings(),
        performance: getPerformanceSettings(),
        analytics: getAnalyticsSettings(),
        mobile: getMobileSettings(),
        general: getGeneralSettings(),
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agenticlearn-admin-config.json';
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Configuration exported successfully', 'success');
}

function getIntegrationSettings() {
    return {
        email: 'configured',
        storage: 'configured',
        analytics: 'configured'
    };
}

function getSecuritySettings() {
    return {
        twoFactor: document.getElementById('2fa-enabled')?.checked || false,
        sessionTimeout: 30,
        passwordPolicy: 'standard'
    };
}

function getPerformanceSettings() {
    return {
        monitoring: 'enabled',
        caching: 'enabled',
        optimization: 'auto'
    };
}

function getAnalyticsSettings() {
    return {
        retention: '90 days',
        realtime: true,
        exportFormats: ['CSV', 'PDF']
    };
}

function getMobileSettings() {
    return {
        pwa: true,
        offline: false,
        notifications: true
    };
}

function getGeneralSettings() {
    return {
        systemName: 'AgenticLearn',
        language: 'English',
        timezone: 'UTC+7',
        maintenance: false
    };
}
