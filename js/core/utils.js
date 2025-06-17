// ===== AGENTICLEARN UTILITIES =====

// ===== COOKIE UTILITIES =====

export function setCookie(name, value, days = 30) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ===== DATE & TIME UTILITIES =====

export function getRelativeTime(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return time.toLocaleDateString();
}

export function formatDate(timestamp, format = 'short') {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    
    switch (format) {
        case 'short':
            return date.toLocaleDateString();
        case 'long':
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        case 'time':
            return date.toLocaleTimeString();
        case 'datetime':
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        default:
            return date.toLocaleDateString();
    }
}

export function formatDuration(minutes) {
    if (!minutes || minutes === 0) return '0 min';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

// ===== NUMBER UTILITIES =====

export function formatNumber(num, decimals = 0) {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('en-US', { 
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals 
    });
}

export function formatPercentage(value, decimals = 1) {
    if (value === null || value === undefined) return '0%';
    return `${Number(value).toFixed(decimals)}%`;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// ===== STRING UTILITIES =====

export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

export function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

// ===== VALIDATION UTILITIES =====

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isEmpty(value) {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'object' && Object.keys(value).length === 0);
}

// ===== ARRAY UTILITIES =====

export function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
}

export function sortBy(array, key, direction = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (direction === 'desc') {
            return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
}

export function unique(array, key = null) {
    if (key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) return false;
            seen.add(value);
            return true;
        });
    }
    return [...new Set(array)];
}

// ===== DOM UTILITIES =====

export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key.startsWith('on')) {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

export function setInner(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
    } else {
        console.warn(`Element with ID '${elementId}' not found`);
    }
}

export function show(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

export function hide(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// ===== STORAGE UTILITIES =====

export function saveToStorage(key, data, useSessionStorage = false) {
    try {
        const storage = useSessionStorage ? sessionStorage : localStorage;
        storage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save to storage:', error);
        return false;
    }
}

export function loadFromStorage(key, defaultValue = null, useSessionStorage = false) {
    try {
        const storage = useSessionStorage ? sessionStorage : localStorage;
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Failed to load from storage:', error);
        return defaultValue;
    }
}

export function removeFromStorage(key, useSessionStorage = false) {
    try {
        const storage = useSessionStorage ? sessionStorage : localStorage;
        storage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Failed to remove from storage:', error);
        return false;
    }
}

// ===== DEBOUNCE & THROTTLE =====

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
