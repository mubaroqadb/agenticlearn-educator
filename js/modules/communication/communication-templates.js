// ===== COMMUNICATION TEMPLATES MODULE =====

export class CommunicationTemplates {
    static getMessageTemplates() {
        return [
            {
                id: 'encouragement',
                name: '🌟 Encouragement',
                subject: 'Keep up the great work!',
                content: 'Hi {student_name},\n\nI wanted to take a moment to acknowledge your excellent progress in the course. Your dedication and hard work are truly paying off!\n\nKeep up the fantastic work!\n\nBest regards,\n{educator_name}'
            },
            {
                id: 'reminder',
                name: '⏰ Assignment Reminder',
                subject: 'Upcoming Assignment Due',
                content: 'Hi {student_name},\n\nThis is a friendly reminder that your assignment "{assignment_name}" is due on {due_date}.\n\nIf you have any questions or need help, please don\'t hesitate to reach out.\n\nBest regards,\n{educator_name}'
            },
            {
                id: 'feedback',
                name: '📝 Feedback',
                subject: 'Feedback on your recent work',
                content: 'Hi {student_name},\n\nI\'ve reviewed your recent submission and wanted to provide some feedback:\n\n[Your specific feedback here]\n\nOverall, you\'re making great progress. Keep up the good work!\n\nBest regards,\n{educator_name}'
            },
            {
                id: 'check_in',
                name: '🤝 Check-in',
                subject: 'How are you doing?',
                content: 'Hi {student_name},\n\nI hope you\'re doing well! I wanted to check in and see how you\'re finding the course so far.\n\nIf you have any questions, concerns, or need any support, please feel free to reach out to me.\n\nLooking forward to hearing from you!\n\nBest regards,\n{educator_name}'
            },
            {
                id: 'congratulations',
                name: '🎉 Congratulations',
                subject: 'Congratulations on your achievement!',
                content: 'Hi {student_name},\n\nCongratulations on {achievement}! This is a significant milestone and you should be proud of your accomplishment.\n\nYour hard work and dedication have really paid off. Keep up the excellent work!\n\nBest regards,\n{educator_name}'
            },
            {
                id: 'support',
                name: '💪 Support & Help',
                subject: 'I\'m here to help',
                content: 'Hi {student_name},\n\nI noticed you might be facing some challenges with {topic/assignment}. Please know that this is completely normal and I\'m here to support you.\n\nWould you like to schedule a one-on-one session to discuss this further? I\'m confident we can work through this together.\n\nBest regards,\n{educator_name}'
            }
        ];
    }

    static getAnnouncementTemplates() {
        return [
            {
                id: 'course_update',
                name: '📚 Course Update',
                title: 'Important Course Update',
                content: 'Dear Students,\n\nI wanted to inform you about an important update to our course:\n\n[Update details here]\n\nPlease review this information carefully and let me know if you have any questions.\n\nBest regards,\n{educator_name}'
            },
            {
                id: 'deadline_reminder',
                name: '⏰ Deadline Reminder',
                title: 'Upcoming Deadline Reminder',
                content: 'Dear Students,\n\nThis is a reminder about the upcoming deadline for {assignment_name} on {due_date}.\n\nPlease ensure you submit your work on time. If you need any assistance, don\'t hesitate to reach out.\n\nBest regards,\n{educator_name}'
            },
            {
                id: 'new_material',
                name: '📖 New Material Available',
                title: 'New Learning Material Available',
                content: 'Dear Students,\n\nNew learning materials have been added to the course:\n\n• {material_list}\n\nThese materials will help enhance your understanding of the current topics. Please review them at your earliest convenience.\n\nBest regards,\n{educator_name}'
            },
            {
                id: 'assessment_announcement',
                name: '📝 Assessment Announcement',
                title: 'Upcoming Assessment Information',
                content: 'Dear Students,\n\nI wanted to inform you about an upcoming assessment:\n\n• Assessment: {assessment_name}\n• Date: {assessment_date}\n• Duration: {duration}\n• Topics covered: {topics}\n\nPlease prepare accordingly and let me know if you have any questions.\n\nBest regards,\n{educator_name}'
            }
        ];
    }

    static getBulkMessageRecipients() {
        return [
            { value: 'all', label: 'All Students', description: 'Send to all enrolled students' },
            { value: 'at_risk', label: 'At-Risk Students', description: 'Students who may need additional support' },
            { value: 'high_performers', label: 'High Performers', description: 'Students with excellent performance' },
            { value: 'low_engagement', label: 'Low Engagement', description: 'Students with low activity levels' },
            { value: 'course_001', label: 'Digital Literacy Course', description: 'Students in Digital Literacy course' },
            { value: 'course_002', label: 'Programming Basics Course', description: 'Students in Programming course' },
            { value: 'recent_submissions', label: 'Recent Submissions', description: 'Students who submitted recently' },
            { value: 'pending_assignments', label: 'Pending Assignments', description: 'Students with pending work' }
        ];
    }

    static getNotificationTypes() {
        return [
            { value: 'info', label: 'Information', icon: 'ℹ️', color: '#3b82f6' },
            { value: 'success', label: 'Success', icon: '✅', color: '#10b981' },
            { value: 'warning', label: 'Warning', icon: '⚠️', color: '#f59e0b' },
            { value: 'error', label: 'Error', icon: '❌', color: '#ef4444' },
            { value: 'reminder', label: 'Reminder', icon: '⏰', color: '#8b5cf6' },
            { value: 'achievement', label: 'Achievement', icon: '🏆', color: '#f59e0b' }
        ];
    }

    static getPriorityLevels() {
        return [
            { value: 'low', label: 'Low', color: '#6b7280', description: 'Non-urgent information' },
            { value: 'normal', label: 'Normal', color: '#3b82f6', description: 'Standard priority' },
            { value: 'high', label: 'High', color: '#f59e0b', description: 'Important information' },
            { value: 'urgent', label: 'Urgent', color: '#ef4444', description: 'Requires immediate attention' }
        ];
    }

    static getMessageTypes() {
        return [
            { value: 'general', label: 'General', description: 'General communication' },
            { value: 'feedback', label: 'Feedback', description: 'Feedback on student work' },
            { value: 'encouragement', label: 'Encouragement', description: 'Motivational message' },
            { value: 'reminder', label: 'Reminder', description: 'Assignment or deadline reminder' },
            { value: 'support', label: 'Support', description: 'Offering help and support' },
            { value: 'congratulations', label: 'Congratulations', description: 'Celebrating achievements' }
        ];
    }

    static getAudienceOptions() {
        return [
            { value: 'all', label: 'All Students', description: 'All enrolled students' },
            { value: 'course_001', label: 'Digital Literacy Course', description: 'Students in Digital Literacy' },
            { value: 'course_002', label: 'Programming Basics Course', description: 'Students in Programming' },
            { value: 'course_003', label: 'Data Analysis Course', description: 'Students in Data Analysis' },
            { value: 'active_students', label: 'Active Students', description: 'Recently active students' },
            { value: 'new_students', label: 'New Students', description: 'Recently enrolled students' }
        ];
    }

    static getStudentOptions() {
        return [
            { value: 'student_001', label: 'Ahmad Mahasiswa', course: 'Digital Literacy', status: 'active' },
            { value: 'student_002', label: 'Siti Nurhaliza', course: 'Programming Basics', status: 'active' },
            { value: 'student_003', label: 'Budi Santoso', course: 'Data Analysis', status: 'active' },
            { value: 'student_004', label: 'Rina Sari', course: 'Digital Literacy', status: 'active' },
            { value: 'student_005', label: 'Andi Wijaya', course: 'Programming Basics', status: 'inactive' }
        ];
    }

    static formatTemplate(template, variables = {}) {
        let content = template.content;
        let subject = template.subject || '';

        // Default variables
        const defaultVars = {
            student_name: variables.student_name || '[Student Name]',
            educator_name: variables.educator_name || 'Dr. Sarah Johnson',
            course_name: variables.course_name || '[Course Name]',
            assignment_name: variables.assignment_name || '[Assignment Name]',
            due_date: variables.due_date || '[Due Date]',
            achievement: variables.achievement || '[Achievement]',
            topic: variables.topic || '[Topic]'
        };

        // Merge with provided variables
        const allVars = { ...defaultVars, ...variables };

        // Replace placeholders in content and subject
        Object.keys(allVars).forEach(key => {
            const placeholder = `{${key}}`;
            content = content.replace(new RegExp(placeholder, 'g'), allVars[key]);
            subject = subject.replace(new RegExp(placeholder, 'g'), allVars[key]);
        });

        return {
            subject,
            content,
            variables: allVars
        };
    }

    static validateTemplate(template) {
        const errors = [];

        if (!template.subject || template.subject.trim().length < 3) {
            errors.push('Subject must be at least 3 characters long');
        }

        if (!template.content || template.content.trim().length < 10) {
            errors.push('Content must be at least 10 characters long');
        }

        if (template.subject && template.subject.length > 100) {
            errors.push('Subject must be less than 100 characters');
        }

        if (template.content && template.content.length > 2000) {
            errors.push('Content must be less than 2000 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
