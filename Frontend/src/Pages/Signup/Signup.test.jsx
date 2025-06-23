import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import authReducer from '../../store/slices/authSlice';
import Signup from './Signup';

jest.mock('../../components/Background/AuthBackground.jsx', () => ({ children }) => (
    <div data-testid="auth-background">{children}</div>
));

jest.mock('../../components/common', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>,
    LoadingSpinner: ({ variant }) => (
        <div data-testid="loading-spinner" data-variant={variant}>
            Loading…
        </div>
    ),
    FormField: ({ label, name, value, onChange, ...props }) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} value={value} onChange={onChange} {...props} />
        </div>
    ),
}));

jest.mock('./signupUtils.jsx', () => {
    const actual = jest.requireActual('./signupUtils.jsx');
    return {
        ...actual,
        useSignupForm: jest.fn(),
        handleSubmit: jest.fn(() => jest.fn((e) => e.preventDefault())),
    };
});

const makeStore = () =>
    configureStore({
        reducer: { auth: authReducer },
    });

const defaultForm = { username: '', password: '', confirmPassword: '' };

const buildRender = (overrides = {}) => {
    const setForm = jest.fn();
    const setLoading = jest.fn();
    require('./signupUtils.jsx').useSignupForm.mockReturnValue({
        form: defaultForm,
        setForm,
        loading: false,
        setLoading,
        ...overrides,
    });

    const utils = render(
        <Provider store={makeStore()}>
            <MemoryRouter>
                <Signup />
            </MemoryRouter>
        </Provider>,
    );

    return { setForm, setLoading, ...utils };
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('<Signup />', () => {
    it('renders correctly (snapshot)', () => {
        const { container } = buildRender();
        expect(container.firstChild).toMatchSnapshot();
    });

    it('shows loading spinner when loading=true', () => {
        buildRender({ loading: true });
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it.each`
    label                 | fieldName            | newValue
    ${'Username'}         | ${'username'}        | ${'newuser'}
    ${'Password'}         | ${'password'}        | ${'newpass'}
    ${'Confirm Password'} | ${'confirmPassword'} | ${'newconfirm'}
  `('updates form state when $label changes', ({ label, fieldName, newValue }) => {
        const { setForm } = buildRender();
        fireEvent.change(screen.getByLabelText(label), { target: { value: newValue } });

        expect(setForm).toHaveBeenCalledWith({
            ...defaultForm,
            [fieldName]: newValue,
        });
    });

    describe('autoComplete attributes', () => {
        it.each`
      label                 | expected
      ${'Username'}         | ${'username'}
      ${'Password'}         | ${'new-password'}
      ${'Confirm Password'} | ${'new-password'}
    `('$label input has autoComplete="$expected"', ({ label, expected }) => {
            buildRender();
            expect(screen.getByLabelText(label)).toHaveAttribute('autocomplete', expected);
        });
    });
});
