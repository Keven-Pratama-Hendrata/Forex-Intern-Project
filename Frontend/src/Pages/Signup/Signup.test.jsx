import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import Signup from './Signup';
import React from 'react';

jest.mock('../../components/Background', () => {
    return function MockAuthBackground({ children, circlePosition }) {
        return (
            <div data-testid="auth-background" data-circle-position={circlePosition}>
                {children}
            </div>
        );
    };
});

jest.mock('../../components/common', () => ({
    Button: ({ children, type, disabled, ...props }) => (
        <button
            type={type}
            disabled={disabled}
            data-testid="signup-button"
            {...props}
        >
            {children}
        </button>
    ),
    LoadingSpinner: ({ variant }) => (
        <div data-testid="loading-spinner" data-variant={variant}>
            Loading...
        </div>
    ),
    FormField: ({
        label,
        type,
        name,
        placeholder,
        value,
        onChange,
        autoComplete,
        required,
        ...props
    }) => (
        <div data-testid={`form-field-${name}`}>
            <label>{label}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange || (() => { })}
                autoComplete={autoComplete}
                required={required}
                data-testid={`input-${name}`}
                {...props}
            />
        </div>
    ),
    handleFormChange: jest.fn(),
    validateRequiredFields: jest.fn(),
    setUserData: jest.fn(),
}));

jest.mock('./signupHandler.jsx', () => {
    const handleChange = jest.fn(() => () => { });
    const handleSubmit = jest.fn(
        (form, setLoading) =>
            (e) => {
                e?.preventDefault?.();
                setLoading(true);
            },
    );

    const useSignupState = jest.fn(() => ({
        navigate: jest.fn(),
        loading: false,
        setLoading: jest.fn(),
        form: { username: '', password: '', confirmPassword: '' },
        setForm: jest.fn(),
    }));

    const FormField = ({
        label,
        type,
        name,
        placeholder,
        value,
        onChange,
        autoComplete,
        required,
        ...props
    }) => (
        <div data-testid={`form-field-${name}`}>
            <label>{label}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange || (() => { })}
                autoComplete={autoComplete}
                required={required}
                data-testid={`input-${name}`}
                {...props}
            />
        </div>
    );

    return { handleChange, handleSubmit, useSignupState, FormField };
});

jest.mock('react-router', () => ({
    useNavigate: () => jest.fn(),
    Link: ({ children, to, ...props }) => (
        <a href={to} {...props}>
            {children}
        </a>
    ),
}));

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

describe('Signup Component', () => {
    it('renders correctly with default state', () => {
        const { container } = render(<Signup />);

        expect(container.firstChild).toMatchSnapshot();
    });

    it('toggles to loading state after form submit (covers loading path)', async () => {
        let loading = false;
        const setLoading = jest.fn((val) => { loading = val; });

        require('./signupHandler.jsx').useSignupState.mockImplementation(() => ({
            navigate: jest.fn(),
            loading,
            setLoading,
            form: { username: '', password: '', confirmPassword: '' },
            setForm: jest.fn(),
        }));

        const { container, rerender } = render(<Signup />);
        const button = screen.getByTestId('signup-button');

        expect(button).toHaveTextContent('Create Account');
        expect(button).not.toBeDisabled();

        fireEvent.submit(button.closest('form'));
        loading = true;
        rerender(<Signup />);

        expect(button).toHaveTextContent('Loading...');
        expect(button).toBeDisabled();
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        expect(container.firstChild).toMatchSnapshot();
    });

    it('renders inputs and calls handleChange for each field (covers lines 113-161)', () => {
        const setForm = jest.fn();
        const form = { username: '', password: '', confirmPassword: '' };

        const handlerModule = require('./signupHandler.jsx');
        handlerModule.handleChange.mockImplementation(() => jest.fn());
        handlerModule.useSignupState.mockImplementation(() => ({
            navigate: jest.fn(),
            loading: false,
            setLoading: jest.fn(),
            form,
            setForm,
        }));

        render(<Signup />);

        expect(screen.getByTestId('input-username')).toBeInTheDocument();
        expect(screen.getByTestId('input-password')).toBeInTheDocument();
        expect(screen.getByTestId('input-confirmPassword')).toBeInTheDocument();

        expect(handlerModule.handleChange).toHaveBeenCalledTimes(3);
        expect(handlerModule.handleChange.mock.calls[0][1]).toBe(setForm);
    });

    it('uses AUTH_FORMS provided placeholders and autocompletes when available', () => {
        jest.isolateModules(() => {
            jest.doMock('../../data', () => ({
                AUTH_FORMS: {
                    SIGNUP: {
                        PLACEHOLDERS: {
                            USERNAME: 'ProvidedUser',
                            PASSWORD: 'ProvidedPass',
                            CONFIRM_PASSWORD: 'ProvidedConfirm',
                        },
                        AUTOCOMPLETE: {
                            USERNAME: 'provided-username',
                            PASSWORD: 'provided-password',
                            CONFIRM_PASSWORD: 'provided-confirm',
                        },
                    },
                },
            }));

            const { default: SignupIsolated } = require('./Signup');

            render(<SignupIsolated />);

            const u = screen.getByTestId('input-username');
            const p = screen.getByTestId('input-password');
            const c = screen.getByTestId('input-confirmPassword');

            expect(u).toHaveAttribute('placeholder', 'ProvidedUser');
            expect(u).toHaveAttribute('autocomplete', 'provided-username');

            expect(p).toHaveAttribute('placeholder', 'ProvidedPass');
            expect(p).toHaveAttribute('autocomplete', 'provided-password');

            expect(c).toHaveAttribute('placeholder', 'ProvidedConfirm');
            expect(c).toHaveAttribute('autocomplete', 'provided-confirm');
        });
    });

    it('falls back to default placeholders and autocompletes when AUTH_FORMS is absent', () => {
        jest.isolateModules(() => {
            jest.doMock('../../data', () => ({ AUTH_FORMS: undefined }));

            const { default: SignupIsolated } = require('./Signup');
            render(<SignupIsolated />);

            const u = screen.getByTestId('input-username');
            const p = screen.getByTestId('input-password');
            const c = screen.getByTestId('input-confirmPassword');

            expect(u).toHaveAttribute('placeholder', 'John Doe');
            expect(u).toHaveAttribute('autocomplete', 'username');

            expect(p).toHaveAttribute('placeholder', '••••••');
            expect(p).toHaveAttribute('autocomplete', 'new-password');

            expect(c).toHaveAttribute('placeholder', '••••••');
            expect(c).toHaveAttribute('autocomplete', 'new-password');
        });
    });
});
