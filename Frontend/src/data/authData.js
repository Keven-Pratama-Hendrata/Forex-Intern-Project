export const AUTH_ENDPOINTS = {
    LOGIN: 'http://localhost:5001/api/users/login',
    SIGNUP: 'http://localhost:5001/api/users/signup',
    PROFILE: 'http://localhost:5001/api/users/users/self',
};

export const AUTH_MESSAGES = {
    SUCCESS: {
        LOGIN: 'Welcome back 👋',
        LOGOUT: 'Logged out successfully',
        SIGNUP: 'Account created successfully!',
    },
    ERROR: {
        LOGIN_FAILED: 'Login failed',
        SIGNUP_FAILED: 'Signup failed',
        INVALID_CREDENTIALS: 'Invalid username or password',
        USER_NOT_FOUND: 'User not found',
        PASSWORD_INCORRECT: 'Password is incorrect',
        USERNAME_EXISTS: 'Username already exists',
        NETWORK_ERROR: 'Network error. Please try again.',
        SESSION_EXPIRED: 'Session expired. Please login again',
        LOGIN_REQUIRED: 'Please login first',
    },
    VALIDATION: {
        USERNAME_REQUIRED: 'Username is required',
        PASSWORD_REQUIRED: 'Password is required',
        CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
        PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
        PASSWORDS_DONT_MATCH: 'Passwords do not match',
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
        FIELDS: ['username', 'password', 'confirmPassword'],
        PLACEHOLDERS: {
            USERNAME: 'John Doe',
            PASSWORD: '••••••••',
            CONFIRM_PASSWORD: '••••••••',
        },
        AUTOCOMPLETE: {
            USERNAME: 'username',
            PASSWORD: 'new-password',
            CONFIRM_PASSWORD: 'new-password',
        },
        VALIDATION: {
            MIN_PASSWORD_LENGTH: 6,
        },
    },
};

export const AUTH_HEADERS = {
    SIGNUP: {
        TITLE: 'Create an Account',
        SUBTITLE: 'Join us to start trading!',
    },
    LOGIN: {
        TITLE: 'Sign in to Trade FX',
        SUBTITLE: 'Ready to conquer the markets?',
    },
}; 