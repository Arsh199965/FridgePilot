// API Configuration
export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    AUTH_ERROR: 'Authentication failed. Please log in again.',
    NOT_FOUND: 'The requested resource was not found.',
} as const;

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    PROFILE: '/profile',
    PANTRY: '/pantry',
    RECIPES: '/recipes',
    ALERTS: '/alerts',
} as const;

// UI Constants
export const UI_CONSTANTS = {
    ANIMATION_DURATION: 0.3,
    TOAST_DURATION: 3000,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// Form Validation
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 20,
    EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme',
} as const; 