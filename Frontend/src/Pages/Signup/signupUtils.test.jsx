import { validateForm, handleSignup, handleSignupResponse } from './signupUtils.jsx';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import { useSignupForm } from './signupUtils.jsx';

jest.mock('react-hot-toast', () => ({ error: jest.fn(), success: jest.fn() }));
jest.mock('../../components/common', () => ({
    validateRequiredFields: jest.fn(),
    setUserData: jest.fn(),
}));
jest.mock('../../store/slices/authSlice', () => ({
    loginStart: jest.fn(() => ({ type: 'loginStart' })),
    loginSuccess: jest.fn(() => ({ type: 'loginSuccess' })),
    loginFailure: jest.fn(() => ({ type: 'loginFailure' })),
}));

describe('validateForm', () => {
    const toast = require('react-hot-toast');
    const { validateRequiredFields } = require('../../components/common');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns true if form is valid', () => {
        validateRequiredFields.mockReturnValue({ isValid: true });
        const form = { username: 'a', password: 'b', confirmPassword: 'b' };
        expect(validateForm(form)).toBe(true);
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('returns false and calls toast.error if required fields are missing', () => {
        validateRequiredFields.mockReturnValue({ isValid: false, message: 'Missing' });
        const form = { username: '', password: '', confirmPassword: '' };
        expect(validateForm(form)).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Missing');
    });

    it('returns false and calls toast.error if passwords do not match', () => {
        validateRequiredFields.mockReturnValue({ isValid: true });
        const form = { username: 'a', password: 'b', confirmPassword: 'c' };
        expect(validateForm(form)).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
    });
});

describe('handleSignup', () => {
    const toast = require('react-hot-toast');
    const { setUserData } = require('../../components/common');
    const { loginStart, loginSuccess, loginFailure } = require('../../store/slices/authSlice');

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('dispatches loginStart, calls setUserData, toast.success, and navigates on success', async () => {
        const form = { username: 'a', password: 'b' };
        const setLoading = jest.fn();
        const navigate = jest.fn();
        const dispatch = jest.fn();
        const fakeData = { token: 'tok', _id: 'id', user_name: 'a', balances: 1 };
        global.fetch.mockResolvedValue({ ok: true, json: async () => fakeData });

        await handleSignup(form, setLoading, navigate, dispatch);
        expect(setLoading).toHaveBeenCalledWith(true);
        expect(dispatch).toHaveBeenCalledWith(loginStart());
        expect(setUserData).toHaveBeenCalledWith(dispatch, loginSuccess, 'tok', {
            id: 'id', username: 'a', balances: 1,
        });
        expect(toast.success).toHaveBeenCalledWith('Account created successfully! 👋');
        expect(navigate).toHaveBeenCalledWith('/');
        expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('dispatches loginFailure and shows error toast on API error', async () => {
        const form = { username: 'a', password: 'b' };
        const setLoading = jest.fn();
        const navigate = jest.fn();
        const dispatch = jest.fn();
        global.fetch.mockResolvedValue({ ok: false, json: async () => ({ message: 'fail' }) });

        await handleSignup(form, setLoading, navigate, dispatch);
        expect(dispatch).toHaveBeenCalledWith(loginFailure('fail'));
        expect(toast.error).toHaveBeenCalledWith('fail');
        expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('dispatches loginFailure and shows default error toast on fetch throw', async () => {
        const form = { username: 'a', password: 'b' };
        const setLoading = jest.fn();
        const navigate = jest.fn();
        const dispatch = jest.fn();
        global.fetch.mockRejectedValue(new Error('network'));

        await handleSignup(form, setLoading, navigate, dispatch);
        expect(dispatch).toHaveBeenCalledWith(loginFailure('network'));
        expect(toast.error).toHaveBeenCalledWith('network');
        expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('dispatches loginFailure and shows password length error toast', async () => {
        const form = { username: 'a', password: 'short', confirmPassword: 'short' };
        const setLoading = jest.fn();
        const navigate = jest.fn();
        const dispatch = jest.fn();
        global.fetch.mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Password must be at least 6 characters long' }),
        });

        await handleSignup(form, setLoading, navigate, dispatch);
        expect(dispatch).toHaveBeenCalledWith(
            loginFailure('Password must be at least 6 characters long'),
        );
        expect(require('react-hot-toast').error).toHaveBeenCalledWith(
            'Password must be at least 6 characters long',
        );
        expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('dispatches loginFailure and shows generic error toast when error has no message', async () => {
        const form = { username: 'a', password: 'b' };
        const setLoading = jest.fn();
        const navigate = jest.fn();
        const dispatch = jest.fn();

        global.fetch.mockRejectedValue({});

        await handleSignup(form, setLoading, navigate, dispatch);
        expect(dispatch).toHaveBeenCalledWith(expect.any(Object)); // loginFailure
        expect(require('react-hot-toast').error).toHaveBeenCalledWith('Signup failed');
        expect(setLoading).toHaveBeenCalledWith(false);
    });
});

describe('handleSubmit', () => {
    it('returns early if validateForm is false (handleSignup not called)', async () => {
        jest.resetModules();
        jest.doMock('../../components/common', () => ({
            validateRequiredFields: jest.fn(() => ({ isValid: false, message: 'Missing' })),
            setUserData: jest.fn(),
        }));
        const signupUtils = require('./signupUtils.jsx');
        const form = { username: '', password: '', confirmPassword: '' };
        const setLoading = jest.fn();
        const navigate = jest.fn();
        const dispatch = jest.fn();
        const e = { preventDefault: jest.fn() };

        const handleSignupSpy = jest.spyOn(signupUtils, 'handleSignup');

        await signupUtils.handleSubmit(form, setLoading, navigate, dispatch)(e);

        expect(e.preventDefault).toHaveBeenCalled();
        expect(handleSignupSpy).not.toHaveBeenCalled();
    });

    it('calls preventDefault and sets loading if validateForm passes', async () => {
        jest.resetModules();
        jest.doMock('../../components/common', () => ({
            validateRequiredFields: jest.fn(() => ({ isValid: true })),
            setUserData: jest.fn(),
        }));
        const signupUtils = require('./signupUtils.jsx');
        const form = { username: 'a', password: 'b', confirmPassword: 'b' };
        const setLoading = jest.fn();
        const navigate = jest.fn();
        const dispatch = jest.fn();
        const e = { preventDefault: jest.fn() };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'tok', _id: 'id', user_name: 'a', balances: 1 }),
        });

        await signupUtils.handleSubmit(form, setLoading, navigate, dispatch)(e);

        expect(e.preventDefault).toHaveBeenCalled();
        expect(setLoading).toHaveBeenCalledWith(true);
        expect(setLoading).toHaveBeenCalledWith(false);
        expect(navigate).toHaveBeenCalledWith('/');
        expect(dispatch).toHaveBeenCalled();
    });

    it('calls preventDefault and sets loading if validateForm passes (password length error)', async () => {
        jest.resetModules();
        jest.doMock('../../components/common', () => ({
            validateRequiredFields: jest.fn(() => ({ isValid: true })),
            setUserData: jest.fn(),
        }));
        const signupUtils = require('./signupUtils.jsx');
        const form = { username: 'a', password: 'short', confirmPassword: 'short' };
        const setLoading = jest.fn();
        const navigate = jest.fn();
        const dispatch = jest.fn();
        const e = { preventDefault: jest.fn() };
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Password must be at least 6 characters long' }),
        });

        await signupUtils.handleSubmit(form, setLoading, navigate, dispatch)(e);

        expect(e.preventDefault).toHaveBeenCalled();
        expect(setLoading).toHaveBeenCalledWith(true);
        expect(setLoading).toHaveBeenCalledWith(false);
        expect(dispatch).toHaveBeenCalledWith(
            require('../../store/slices/authSlice').loginFailure('Password must be at least 6 characters long'),
        );
        expect(require('react-hot-toast').error).toHaveBeenCalledWith('Password must be at least 6 characters long');
    });
});

describe('useSignupForm', () => {
    const makeStore = () => configureStore({ reducer: () => ({}) });
    const wrapper = ({ children }) => (
        <Provider store={makeStore()}>
            <MemoryRouter>{children}</MemoryRouter>
        </Provider>
    );

    it('returns default state and helpers', () => {
        const { result } = renderHook(() => useSignupForm(), { wrapper });
        expect(result.current.form).toEqual({ username: '', password: '', confirmPassword: '' });
        expect(result.current.loading).toBe(false);
        expect(typeof result.current.setForm).toBe('function');
        expect(typeof result.current.setLoading).toBe('function');
        expect(typeof result.current.navigate).toBe('function');
        expect(typeof result.current.dispatch).toBe('function');
    });

    it('updates form and loading state', () => {
        const { result } = renderHook(() => useSignupForm(), { wrapper });
        act(() => result.current.setForm({ username: 'test', password: 'pw', confirmPassword: 'pw' }));
        expect(result.current.form).toEqual({ username: 'test', password: 'pw', confirmPassword: 'pw' });
        act(() => result.current.setLoading(true));
        expect(result.current.loading).toBe(true);
    });
});

describe('handleSignupResponse', () => {
    it('throws with custom message if response.ok is false and data.message exists', async () => {
        const response = {
            ok: false,
            json: async () => ({ message: 'Custom error' }),
        };
        await expect(handleSignupResponse(response)).rejects.toThrow('Custom error');
    });
    it('throws with default message if response.ok is false and no message', async () => {
        const response = {
            ok: false,
            json: async () => ({}),
        };
        await expect(handleSignupResponse(response)).rejects.toThrow('Signup failed');
    });
    it('returns data if response.ok is true', async () => {
        const data = { token: 'abc' };
        const response = {
            ok: true,
            json: async () => data,
        };
        await expect(handleSignupResponse(response)).resolves.toEqual(data);
    });
});