// ===== AGENTICLEARN UI COMPONENTS =====

import { createElement, formatDate, formatPercentage } from '../core/utils.js';
import { APP_CONFIG } from '../core/config.js';

export class UIComponents {
    
    // ===== NOTIFICATION SYSTEM =====
    
    static showNotification(message, type = 'info', duration = 3000) {
        const notification = createElement('div', {
            className: `notification notification-${type}`,
            innerHTML: message,
            style: `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${this.getNotificationColor(type)};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                font-weight: 500;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
            `
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    static getNotificationColor(type) {
        switch (type) {
            case 'success': return APP_CONFIG.THEME.SUCCESS;
            case 'warning': return APP_CONFIG.THEME.WARNING;
            case 'error': return APP_CONFIG.THEME.ERROR;
            case 'info':
            default: return APP_CONFIG.THEME.INFO;
        }
    }

    static showConfirmation(title, message, onConfirm, onCancel = null) {
        const confirmationHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>⚠️ ${title}</h3>
                </div>
                <div class="modal-body">
                    <p style="margin: 0; color: var(--gray-700); line-height: 1.5;">
                        ${message}
                    </p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="UIComponents.hideConfirmation(); ${onCancel ? onCancel + '()' : ''}">
                        Cancel
                    </button>
                    <button class="btn btn-danger" onclick="UIComponents.hideConfirmation(); ${onConfirm}()">
                        Confirm
                    </button>
                </div>
            </div>
        `;

        const modal = document.getElementById('confirmation-modal');
        if (modal) {
            modal.innerHTML = confirmationHTML;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    static hideConfirmation() {
        const modal = document.getElementById('confirmation-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // ===== LOADING STATES =====

    static showLoading(elementId, message = 'Loading...') {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="loading-container" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    color: var(--gray-600);
                ">
                    <div class="loading-spinner" style="
                        width: 40px;
                        height: 40px;
                        border: 4px solid var(--gray-200);
                        border-top: 4px solid var(--primary);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 1rem;
                    "></div>
                    <div>${message}</div>
                </div>
            `;
        }
    }

    static hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const loadingContainer = element.querySelector('.loading-container');
            if (loadingContainer) {
                loadingContainer.remove();
            }
        }
    }

    // ===== CARDS =====

    static createCard(title, content, actions = []) {
        const actionsHTML = actions.map(action => 
            `<button class="btn btn-${action.type || 'primary'}" onclick="${action.onclick}">
                ${action.icon || ''} ${action.label}
            </button>`
        ).join('');

        return `
            <div class="card" style="
                background: var(--white);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: var(--shadow-md);
                border: 1px solid var(--accent);
                margin-bottom: 1rem;
            ">
                <div class="card-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                ">
                    <h3 style="margin: 0; color: var(--gray-800);">${title}</h3>
                    <div class="card-actions" style="display: flex; gap: 0.5rem;">
                        ${actionsHTML}
                    </div>
                </div>
                <div class="card-content">
                    ${content}
                </div>
            </div>
        `;
    }

    // ===== TABLES =====

    static createTable(headers, rows, options = {}) {
        const headerHTML = headers.map(header => 
            `<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid var(--accent);">
                ${header}
            </th>`
        ).join('');

        const rowsHTML = rows.map(row => 
            `<tr style="border-bottom: 1px solid var(--accent);">
                ${row.map(cell => 
                    `<td style="padding: 0.75rem;">${cell}</td>`
                ).join('')}
            </tr>`
        ).join('');

        return `
            <div class="table-container" style="overflow-x: auto;">
                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    background: var(--white);
                    border-radius: 8px;
                    overflow: hidden;
                ">
                    <thead style="background: var(--gray-50);">
                        <tr>${headerHTML}</tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>
            </div>
        `;
    }

    // ===== METRICS =====

    static createMetricCard(title, value, change = null, icon = null) {
        const changeHTML = change ? `
            <div style="
                display: flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.875rem;
                color: ${change.value >= 0 ? APP_CONFIG.THEME.SUCCESS : APP_CONFIG.THEME.ERROR};
            ">
                ${change.value >= 0 ? '↗️' : '↘️'}
                ${Math.abs(change.value)}${change.unit || '%'}
                <span style="color: var(--gray-500);">${change.period || ''}</span>
            </div>
        ` : '';

        return `
            <div class="metric-card" style="
                background: var(--white);
                border-radius: 10px;
                padding: 1rem;
                border-left: 4px solid var(--primary);
                box-shadow: var(--shadow-sm);
                transition: transform 0.2s, box-shadow 0.2s;
                height: 100px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                flex: 1;
                min-width: 0;
            ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <div style="
                        font-size: 0.75rem;
                        color: var(--gray-600);
                        font-weight: 500;
                        line-height: 1.2;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    ">${title}</div>
                    ${icon ? `<div style="
                        font-size: 1.2rem;
                        opacity: 0.8;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">${icon}</div>` : ''}
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                    <div style="
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: var(--gray-800);
                        margin-bottom: 0.25rem;
                        line-height: 1;
                    ">${value}</div>
                    ${changeHTML}
                </div>
            </div>
        `;
    }

    // ===== PROGRESS BARS =====

    static createProgressBar(percentage, label = '', color = null) {
        const progressColor = color || APP_CONFIG.THEME.PRIMARY;
        const clampedPercentage = Math.min(100, Math.max(0, percentage));

        return `
            <div class="progress-container" style="margin-bottom: 1rem;">
                ${label ? `<div style="
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--gray-700);
                ">
                    <span>${label}</span>
                    <span>${clampedPercentage}%</span>
                </div>` : ''}
                <div style="
                    width: 100%;
                    height: 8px;
                    background: var(--gray-200);
                    border-radius: 4px;
                    overflow: hidden;
                ">
                    <div style="
                        width: ${clampedPercentage}%;
                        height: 100%;
                        background: ${progressColor};
                        transition: width 0.3s ease;
                    "></div>
                </div>
            </div>
        `;
    }

    // ===== BADGES =====

    static createBadge(text, type = 'default') {
        const colors = {
            default: 'var(--gray-500)',
            primary: APP_CONFIG.THEME.PRIMARY,
            success: APP_CONFIG.THEME.SUCCESS,
            warning: APP_CONFIG.THEME.WARNING,
            error: APP_CONFIG.THEME.ERROR,
            info: APP_CONFIG.THEME.INFO
        };

        return `
            <span class="badge badge-${type}" style="
                background: ${colors[type] || colors.default};
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.025em;
            ">${text}</span>
        `;
    }

    // ===== EMPTY STATES =====

    static createEmptyState(title, message, actionButton = null) {
        const actionHTML = actionButton ? `
            <button class="btn btn-primary" onclick="${actionButton.onclick}">
                ${actionButton.icon || ''} ${actionButton.label}
            </button>
        ` : '';

        return `
            <div class="empty-state" style="
                text-align: center;
                padding: 3rem 2rem;
                color: var(--gray-600);
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">📭</div>
                <h3 style="margin: 0 0 0.5rem 0; color: var(--gray-800);">${title}</h3>
                <p style="margin: 0 0 1.5rem 0; max-width: 400px; margin-left: auto; margin-right: auto;">
                    ${message}
                </p>
                ${actionHTML}
            </div>
        `;
    }

    // ===== ALERTS =====

    static createAlert(message, type = 'info', dismissible = true) {
        const colors = {
            info: { bg: '#e0f2fe', border: '#0891b2', text: '#0c4a6e' },
            success: { bg: '#dcfce7', border: '#059669', text: '#14532d' },
            warning: { bg: '#fef3c7', border: '#d97706', text: '#92400e' },
            error: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' }
        };

        const color = colors[type] || colors.info;
        const dismissButton = dismissible ? `
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: ${color.text};
                cursor: pointer;
                padding: 0;
                margin-left: 1rem;
                font-size: 1.25rem;
            ">×</button>
        ` : '';

        return `
            <div class="alert alert-${type}" style="
                background: ${color.bg};
                border: 1px solid ${color.border};
                border-left: 4px solid ${color.border};
                color: ${color.text};
                padding: 1rem;
                border-radius: 6px;
                margin-bottom: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>${message}</div>
                ${dismissButton}
            </div>
        `;
    }

    // ===== ENHANCED FEATURES =====

    static createModal(title, content, actions = [], options = {}) {
        const modalId = `modal-${Date.now()}`;
        const actionsHTML = actions.map(action => `
            <button class="btn btn-${action.type || 'primary'}" onclick="${action.onclick}">
                ${action.label}
            </button>
        `).join('');

        const modal = `
            <div id="${modalId}" class="modal-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(2px);
            ">
                <div class="modal-content" style="
                    background: white;
                    border-radius: 8px;
                    padding: 0;
                    max-width: ${options.maxWidth || '600px'};
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
                    animation: modalSlideIn 0.3s ease-out;
                ">
                    <div class="modal-header" style="
                        padding: 1.5rem;
                        border-bottom: 1px solid var(--gray-200);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h3 style="margin: 0; color: var(--gray-800);">${title}</h3>
                        <button onclick="UIComponents.closeModal('${modalId}')" style="
                            background: none;
                            border: none;
                            font-size: 1.5rem;
                            cursor: pointer;
                            color: var(--gray-500);
                        ">×</button>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        ${content}
                    </div>
                    ${actions.length > 0 ? `
                        <div class="modal-footer" style="
                            padding: 1.5rem;
                            border-top: 1px solid var(--gray-200);
                            display: flex;
                            gap: 0.5rem;
                            justify-content: flex-end;
                        ">
                            ${actionsHTML}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modal);
        return modalId;
    }

    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.animation = 'modalSlideOut 0.3s ease-in';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }

    static createTooltip(element, content, position = 'top') {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = content;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            white-space: nowrap;
        `;

        document.body.appendChild(tooltip);

        element.addEventListener('mouseenter', () => {
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            switch (position) {
                case 'top':
                    tooltip.style.left = `${rect.left + (rect.width - tooltipRect.width) / 2}px`;
                    tooltip.style.top = `${rect.top - tooltipRect.height - 5}px`;
                    break;
                case 'bottom':
                    tooltip.style.left = `${rect.left + (rect.width - tooltipRect.width) / 2}px`;
                    tooltip.style.top = `${rect.bottom + 5}px`;
                    break;
                case 'left':
                    tooltip.style.left = `${rect.left - tooltipRect.width - 5}px`;
                    tooltip.style.top = `${rect.top + (rect.height - tooltipRect.height) / 2}px`;
                    break;
                case 'right':
                    tooltip.style.left = `${rect.right + 5}px`;
                    tooltip.style.top = `${rect.top + (rect.height - tooltipRect.height) / 2}px`;
                    break;
            }

            tooltip.style.opacity = '1';
        });

        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        return tooltip;
    }

    static createSkeletonLoader(lines = 3, width = '100%') {
        const skeletonLines = Array.from({ length: lines }, (_, i) => `
            <div style="
                height: 1rem;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 4px;
                margin-bottom: 0.5rem;
                width: ${i === lines - 1 ? '60%' : width};
            "></div>
        `).join('');

        return `
            <div class="skeleton-loader">
                ${skeletonLines}
            </div>
        `;
    }

    static addGlobalStyles() {
        if (!document.getElementById('ui-components-styles')) {
            const styles = document.createElement('style');
            styles.id = 'ui-components-styles';
            styles.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }

                @keyframes modalSlideIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @keyframes modalSlideOut {
                    from { transform: scale(1); opacity: 1; }
                    to { transform: scale(0.9); opacity: 0; }
                }

                @keyframes skeleton-loading {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                .btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .btn-primary {
                    background: var(--primary);
                    color: white;
                }

                .btn-secondary {
                    background: var(--gray-500);
                    color: white;
                }

                .btn-success {
                    background: var(--success);
                    color: white;
                }

                .btn-warning {
                    background: var(--warning);
                    color: white;
                }

                .btn-error {
                    background: var(--error);
                    color: white;
                }

                .btn-info {
                    background: var(--info);
                    color: white;
                }

                .metric-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }
            `;
            document.head.appendChild(styles);
        }
    }
}

// Initialize global styles when module loads
UIComponents.addGlobalStyles();

export default UIComponents;
