export const UI_CONSTANTS = {
    BUTTON_COLORS: {
        BLUE: '#507fa1',
        BLUE_HOVER: '#426989',
    },
    ANIMATION_DELAYS: {
        SHORT: 200,
        MEDIUM: 500,
        LONG: 800,
    },
    BREAKPOINTS: {
        MOBILE: 'sm',
        TABLET: 'md',
        DESKTOP: 'lg',
        LARGE: 'xl',
    },
};

export const UI_MESSAGES = {
    LOADING: 'Loading...',
    SUBMIT: 'Submit',
    CANCEL: 'Cancel',
    SAVE: 'Save',
    DELETE: 'Delete',
    EDIT: 'Edit',
    CLOSE: 'Close',
};

export const UI_CLASSES = {
    BUTTON: {
        BASE: 'btn w-full rounded-full border-none text-white font-semibold tracking-wide transition-transform duration-200',
        DISABLED: 'opacity-50 cursor-not-allowed',
    },
    FORM: {
        FIELD: 'input input-bordered w-full',
        ERROR: 'input-error',
        SUCCESS: 'input-success',
    },
    LAYOUT: {
        CONTAINER: 'container mx-auto px-4',
        CENTER: 'flex items-center justify-center',
        FULL_HEIGHT: 'min-h-screen',
    },
}; 