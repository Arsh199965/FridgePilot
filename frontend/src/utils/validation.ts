import { VALIDATION } from '@/constants';

export const validateEmail = (email: string): boolean => {
    return VALIDATION.EMAIL_PATTERN.test(email);
};

export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateUsername = (username: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (username.length < VALIDATION.USERNAME_MIN_LENGTH) {
        errors.push(`Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters long`);
    }

    if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
        errors.push(`Username must be no more than ${VALIDATION.USERNAME_MAX_LENGTH} characters long`);
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateImageFile = (file: File): {
    isValid: boolean;
    error?: string;
} => {
    if (!file) {
        return { isValid: false, error: 'No file selected' };
    }

    const { UI_CONSTANTS } = require('@/constants');

    if (!UI_CONSTANTS.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        return { 
            isValid: false, 
            error: `File type not supported. Please use: ${UI_CONSTANTS.SUPPORTED_IMAGE_TYPES.join(', ')}` 
        };
    }

    if (file.size > UI_CONSTANTS.MAX_FILE_SIZE) {
        return { 
            isValid: false, 
            error: `File size must be less than ${UI_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB` 
        };
    }

    return { isValid: true };
}; 