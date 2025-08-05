export const AUTH_ENDPOINTS = {
    LOGIN: 'http://localhost:5001/api/users/login',
    SIGNUP: 'http://localhost:5001/api/users/signup',
};

export const AUTH_MESSAGES = {
    SUCCESS: {
        LOGIN: 'Welcome back 👋',
        LOGOUT: 'Logged out successfully',
    },
    ERROR: {
        LOGIN_FAILED: 'Login failed',
        INVALID_CREDENTIALS: 'Invalid username or password',
        USER_NOT_FOUND: 'User not found',
        PASSWORD_INCORRECT: 'Password is incorrect',
        NETWORK_ERROR: 'Network error. Please try again.',
        SESSION_EXPIRED: 'Session expired. Please login again',
        LOGIN_REQUIRED: 'Please login first',
    },
    VALIDATION: {
        USERNAME_REQUIRED: 'Username is required',
        PASSWORD_REQUIRED: 'Password is required',
        EMAIL_REQUIRED: 'Email is required',
        EMAIL_INVALID: 'Please enter a valid email address',
    },
};

export const AUTH_FORMS = {
    LOGIN: {
        FIELDS: ['username', 'password'],
        PLACEHOLDERS: {
            USERNAME: 'John Doe',
            PASSWORD: '••••••••',
        },
        AUTOCOMPLETE: {
            USERNAME: 'username',
            PASSWORD: 'current-password',
        },
    },
    SIGNUP: {
        FIELDS: ['username', 'email', 'password', 'confirm_password'],
        PLACEHOLDERS: {
            USERNAME: 'John Doe',
            EMAIL: 'john@example.com',
            PASSWORD: '••••••••',
            CONFIRM_PASSWORD: '••••••••',
        },
        AUTOCOMPLETE: {
            USERNAME: 'username',
            EMAIL: 'email',
            PASSWORD: 'new-password',
            CONFIRM_PASSWORD: 'new-password',
        },
    },
}; 