import { STORAGE_KEYS } from '@/constants';

class StorageManager {
    static set<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error(`Error saving to localStorage:`, error);
        }
    }

    static get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage:`, error);
            return null;
        }
    }

    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage:`, error);
        }
    }

    static clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error(`Error clearing localStorage:`, error);
        }
    }
}

// Auth-specific storage operations
export const AuthStorage = {
    setToken(token: string): void {
        StorageManager.set(STORAGE_KEYS.AUTH_TOKEN, token);
    },

    getToken(): string | null {
        return StorageManager.get(STORAGE_KEYS.AUTH_TOKEN);
    },

    removeToken(): void {
        StorageManager.remove(STORAGE_KEYS.AUTH_TOKEN);
    },
};

// User preferences storage operations
export const PreferencesStorage = {
    setPreferences<T>(preferences: T): void {
        StorageManager.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
    },

    getPreferences<T>(): T | null {
        return StorageManager.get(STORAGE_KEYS.USER_PREFERENCES);
    },

    updatePreferences<T>(updates: Partial<T>): void {
        const currentPreferences = this.getPreferences<T>();
        this.setPreferences({
            ...currentPreferences,
            ...updates,
        });
    },
};

// Theme storage operations
export const ThemeStorage = {
    setTheme(theme: 'light' | 'dark'): void {
        StorageManager.set(STORAGE_KEYS.THEME, theme);
    },

    getTheme(): 'light' | 'dark' | null {
        return StorageManager.get(STORAGE_KEYS.THEME);
    },
}; 