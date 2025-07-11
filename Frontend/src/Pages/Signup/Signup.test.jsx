import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";

jest.mock('../../components/Background/AuthBackground.jsx', () => {
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
}));

jest.mock('./signupHandler.jsx', () => ({
    __esModule: true,
    default: () => ({
        formData: { username: '', password: '', confirmPassword: '' },
        loading: false,
        handleChange: () => () => { },
        handleSubmit: () => () => { },
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
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

describe("Signup.jsx", () => {
    it("matches the snapshot", () => {
        const { container } = render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        );
        expect(container.firstChild).toMatchSnapshot();
    });

    it("renders loading state in the submit button", () => {
        render(
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        );

        const button = screen.getByTestId('signup-button');
        expect(button).toHaveTextContent('Create Account');
        expect(button).not.toBeDisabled();
    });

    it("renders loading spinner in the submit button when loading", () => {
        jest.resetModules();
        // Re-mock useSignupHandler to return loading: true
        jest.doMock('./signupHandler.jsx', () => ({
            __esModule: true,
            default: () => ({
                formData: { username: '', password: '', confirmPassword: '' },
                loading: true,
                handleChange: () => () => { },
                handleSubmit: () => () => { },
            }),
        }));
        // Re-import Signup after mocking
        const SignupWithLoading = require('./Signup').default;
        render(
            <MemoryRouter>
                <SignupWithLoading />
            </MemoryRouter>
        );
        const button = screen.getByTestId('signup-button');
        expect(button).toBeDisabled();
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
}); 