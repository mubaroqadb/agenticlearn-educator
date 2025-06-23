// ===== COMMUNICATION VALIDATOR MODULE =====

export class CommunicationValidator {
    static validateMessageForm() {
        const toStudent = document.getElementById('message-to-student')?.value;
        const subject = document.getElementById('message-subject')?.value?.trim();
        const content = document.getElementById('message-content')?.value?.trim();

        if (!toStudent) {
            return { isValid: false, message: 'Please select a student to send the message to.' };
        }

        if (!subject || subject.length < 3) {
            return { isValid: false, message: 'Subject must be at least 3 characters long.' };
        }

        if (subject.length > 100) {
            return { isValid: false, message: 'Subject must be less than 100 characters.' };
        }

        if (!content || content.length < 10) {
            return { isValid: false, message: 'Message content must be at least 10 characters long.' };
        }

        if (content.length > 2000) {
            return { isValid: false, message: 'Message content must be less than 2000 characters.' };
        }

        return { isValid: true, message: 'Validation passed' };
    }

    static validateAnnouncementForm() {
        const title = document.getElementById('announcement-title')?.value?.trim();
        const content = document.getElementById('announcement-content')?.value?.trim();
        const expires = document.getElementById('announcement-expires')?.value;

        if (!title || title.length < 5) {
            return { isValid: false, message: 'Announcement title must be at least 5 characters long.' };
        }

        if (title.length > 100) {
            return { isValid: false, message: 'Announcement title must be less than 100 characters.' };
        }

        if (!content || content.length < 10) {
            return { isValid: false, message: 'Announcement content must be at least 10 characters long.' };
        }

        if (content.length > 5000) {
            return { isValid: false, message: 'Announcement content must be less than 5000 characters.' };
        }

        // Validate expiration date if provided
        if (expires) {
            const expirationDate = new Date(expires);
            const now = new Date();
            
            if (expirationDate <= now) {
                return { isValid: false, message: 'Expiration date must be in the future.' };
            }

            // Check if expiration is too far in the future (more than 1 year)
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            
            if (expirationDate > oneYearFromNow) {
                return { isValid: false, message: 'Expiration date cannot be more than 1 year in the future.' };
            }
        }

        return { isValid: true, message: 'Validation passed' };
    }

    static validateBulkMessageForm() {
        const recipients = document.getElementById('bulk-recipients')?.selectedOptions;
        const subject = document.getElementById('bulk-subject')?.value?.trim();
        const content = document.getElementById('bulk-content')?.value?.trim();

        if (!recipients || recipients.length === 0) {
            return { isValid: false, message: 'Please select at least one recipient group.' };
        }

        if (!subject || subject.length < 3) {
            return { isValid: false, message: 'Subject must be at least 3 characters long.' };
        }

        if (subject.length > 100) {
            return { isValid: false, message: 'Subject must be less than 100 characters.' };
        }

        if (!content || content.length < 10) {
            return { isValid: false, message: 'Message content must be at least 10 characters long.' };
        }

        if (content.length > 2000) {
            return { isValid: false, message: 'Message content must be less than 2000 characters.' };
        }

        return { isValid: true, message: 'Validation passed' };
    }

    static validateNotificationData(data) {
        const errors = [];

        if (!data.title || data.title.trim().length < 3) {
            errors.push('Notification title must be at least 3 characters long');
        }

        if (data.title && data.title.length > 100) {
            errors.push('Notification title must be less than 100 characters');
        }

        if (!data.message || data.message.trim().length < 5) {
            errors.push('Notification message must be at least 5 characters long');
        }

        if (data.message && data.message.length > 500) {
            errors.push('Notification message must be less than 500 characters');
        }

        const validPriorities = ['low', 'normal', 'high', 'urgent'];
        if (data.priority && !validPriorities.includes(data.priority)) {
            errors.push('Invalid priority level');
        }

        const validTypes = ['info', 'success', 'warning', 'error', 'reminder', 'achievement'];
        if (data.type && !validTypes.includes(data.type)) {
            errors.push('Invalid notification type');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static validateEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhoneFormat(phone) {
        // Indonesian phone number format
        const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, ''); // Remove event handlers
    }

    static validateFileUpload(file, allowedTypes = [], maxSize = 5 * 1024 * 1024) {
        const errors = [];

        if (!file) {
            errors.push('No file selected');
            return { isValid: false, errors };
        }

        // Check file size (default 5MB)
        if (file.size > maxSize) {
            errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
        }

        // Check file type
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }

        // Check file name
        if (file.name.length > 100) {
            errors.push('File name must be less than 100 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static validateFormData(formData, rules) {
        const errors = [];

        Object.keys(rules).forEach(field => {
            const rule = rules[field];
            const value = formData[field];

            // Required field check
            if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
                errors.push(`${rule.label || field} is required`);
                return;
            }

            // Skip other validations if field is empty and not required
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return;
            }

            // String length validations
            if (typeof value === 'string') {
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push(`${rule.label || field} must be at least ${rule.minLength} characters long`);
                }

                if (rule.maxLength && value.length > rule.maxLength) {
                    errors.push(`${rule.label || field} must be less than ${rule.maxLength} characters`);
                }

                // Pattern validation
                if (rule.pattern && !rule.pattern.test(value)) {
                    errors.push(`${rule.label || field} format is invalid`);
                }
            }

            // Number validations
            if (typeof value === 'number' || (typeof value === 'string' && !isNaN(value))) {
                const numValue = Number(value);

                if (rule.min !== undefined && numValue < rule.min) {
                    errors.push(`${rule.label || field} must be at least ${rule.min}`);
                }

                if (rule.max !== undefined && numValue > rule.max) {
                    errors.push(`${rule.label || field} must be at most ${rule.max}`);
                }
            }

            // Custom validation function
            if (rule.validator && typeof rule.validator === 'function') {
                const customResult = rule.validator(value);
                if (customResult !== true) {
                    errors.push(customResult || `${rule.label || field} is invalid`);
                }
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static getValidationRules() {
        return {
            message: {
                to_student: { required: true, label: 'Recipient' },
                subject: { required: true, minLength: 3, maxLength: 100, label: 'Subject' },
                content: { required: true, minLength: 10, maxLength: 2000, label: 'Message content' }
            },
            announcement: {
                title: { required: true, minLength: 5, maxLength: 100, label: 'Title' },
                content: { required: true, minLength: 10, maxLength: 5000, label: 'Content' },
                priority: { required: true, label: 'Priority' },
                audience: { required: true, label: 'Audience' }
            },
            bulkMessage: {
                recipients: { required: true, label: 'Recipients' },
                subject: { required: true, minLength: 3, maxLength: 100, label: 'Subject' },
                content: { required: true, minLength: 10, maxLength: 2000, label: 'Message content' }
            }
        };
    }
}
