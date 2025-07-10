import { validateForm, handleChange, useLoginState } from './loginHandler.jsx';
import * as formfieldUtils from '../../components/common/FormField/formfieldHandler';
import toast from 'react-hot-toast';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice.js';
import { MemoryRouter } from 'react-router';

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

describe('loginUtils', () => {
    describe('validateForm', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('returns true if all required fields are present', () => {
            jest.spyOn(formfieldUtils, 'validateRequiredFields').mockReturnValue({ isValid: true });
            const form = { username: 'user', password: 'pass' };

            const result = validateForm(form);

            expect(result).toBe(true);
            expect(toast.error).not.toHaveBeenCalled();
        });
        it('returns false and shows toast if required fields are missing', () => {
            jest.spyOn(formfieldUtils, 'validateRequiredFields').mockReturnValue({ isValid: false, message: 'Username is required' });
            const form = { username: '', password: 'pass' };

            const result = validateForm(form);

            expect(result).toBe(false);
            expect(toast.error).toHaveBeenCalledWith('Username is required');
        });
    });

    describe('handleLogin', () => {
        let setLoading, navigate, dispatch, form;
        beforeEach(() => {
            jest.clearAllMocks();
            setLoading = jest.fn();
            navigate = jest.fn();
            dispatch = jest.fn();
            form = { username: 'user', password: 'pass' };
        });

        it('handles successful login with all fields', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    token: 'abc',
                    userid: 'id',
                    username: 'user',
                    balances: { usd: 100 }
                }),
            });
            jest.spyOn(formfieldUtils, 'setUserData').mockImplementation(() => { });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(setLoading).toHaveBeenCalledWith(true);
            expect(setLoading).toHaveBeenCalledWith(false);
            expect(formfieldUtils.setUserData).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalled();
            expect(navigate).toHaveBeenCalledWith('/dashboard');
        });

        it('handles failed login with error message', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ message: 'Invalid credentials' }),
            });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
        });

        it('handles failed login with no error message', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                json: async () => ({}),
            });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(toast.error).toHaveBeenCalledWith('Login failed');
        });

        it('handles network error', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(toast.error).toHaveBeenCalledWith('Network error');
        });

        it('handles successful login with missing balances', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ token: 'abc', userid: 'id', username: 'user' }),
            });
            jest.spyOn(formfieldUtils, 'setUserData').mockImplementation(() => { });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(formfieldUtils.setUserData).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalled();
            expect(navigate).toHaveBeenCalledWith('/dashboard');
        });

        it('handles successful login with missing userid/username', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ token: 'abc', balances: { usd: 100 } }),
            });
            jest.spyOn(formfieldUtils, 'setUserData').mockImplementation(() => { });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(formfieldUtils.setUserData).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalled();
            expect(navigate).toHaveBeenCalledWith('/dashboard');
        });

        it('handles error if setUserData throws', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ token: 'abc', userid: 'id', username: 'user', balances: {} }),
            });
            jest.spyOn(formfieldUtils, 'setUserData').mockImplementation(() => { throw new Error('setUserData error'); });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(setLoading).toHaveBeenCalledWith(false);
        });

        it('handles error if toast.success throws', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ token: 'abc', userid: 'id', username: 'user', balances: {} }),
            });
            jest.spyOn(formfieldUtils, 'setUserData').mockImplementation(() => { });
            toast.success.mockImplementationOnce(() => { throw new Error('toast error'); });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(setLoading).toHaveBeenCalledWith(false);
        });

        it('handles error with no message and shows default login failed message', async () => {
            global.fetch = jest.fn().mockRejectedValue({});
            const { handleLogin } = require('./loginHandler.jsx');
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const dispatch = jest.fn();
            const form = { username: 'user', password: 'pass' };

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(toast.error).toHaveBeenCalledWith('Login failed');
        });

        it('handles user not found error', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ error: 'USER_NOT_FOUND' }),
            });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(toast.error).toHaveBeenCalledWith('User not found');
        });

        it('handles password incorrect error', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ error: 'INVALID_PASSWORD' }),
            });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(toast.error).toHaveBeenCalledWith('Password is incorrect');
        });

        it('handles network error from backend', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ error: 'NETWORK_ERROR' }),
            });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(toast.error).toHaveBeenCalledWith('Network error. Please try again.');
        });

        it('handles unknown error with no message and shows default login failed message', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ error: 'UNKNOWN_ERROR' }),
            });
            const { handleLogin } = require('./loginHandler.jsx');

            await handleLogin(form, setLoading, navigate, dispatch);

            expect(toast.error).toHaveBeenCalledWith('Login failed');
        });
    });

    describe('handleSubmit', () => {
        it('calls preventDefault and does not call handleLogin if form is invalid', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const dispatch = jest.fn();
            const form = { username: '', password: '' };
            const mockEvent = { preventDefault: jest.fn() };
            jest.spyOn(formfieldUtils, 'validateRequiredFields').mockReturnValue({ isValid: false, message: 'Username is required' });
            const { handleSubmit } = require('./loginHandler.jsx');
            const loginSpy = jest.fn();

            await handleSubmit(form, setLoading, navigate, dispatch, loginSpy)(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(loginSpy).not.toHaveBeenCalled();
        });

        it('calls preventDefault and handleLogin if form is valid', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const dispatch = jest.fn();
            const form = { username: 'user', password: 'pass' };
            const mockEvent = { preventDefault: jest.fn() };
            jest.spyOn(formfieldUtils, 'validateRequiredFields').mockReturnValue({ isValid: true });
            const { handleSubmit } = require('./loginHandler.jsx');
            const handleLoginMock = jest.fn().mockResolvedValue();

            await handleSubmit(form, setLoading, navigate, dispatch, handleLoginMock)(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(handleLoginMock).toHaveBeenCalledWith(form, setLoading, navigate, dispatch);
        });

        it('does not throw if event is missing', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const dispatch = jest.fn();
            const form = { username: 'user', password: 'pass' };
            jest.spyOn(formfieldUtils, 'validateRequiredFields').mockReturnValue({ isValid: true });
            const { handleSubmit } = require('./loginHandler.jsx');
            const handleLoginMock = jest.fn().mockResolvedValue();

            await expect(handleSubmit(form, setLoading, navigate, dispatch, handleLoginMock)()).resolves.toBeUndefined();
            expect(handleLoginMock).toHaveBeenCalledWith(form, setLoading, navigate, dispatch);
        });

        it('uses default handleLogin if not provided', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const dispatch = jest.fn();
            const form = { username: 'user', password: 'pass' };
            jest.spyOn(formfieldUtils, 'validateRequiredFields').mockReturnValue({ isValid: true });
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ message: 'Invalid credentials' }),
            });
            const { handleSubmit } = require('./loginHandler.jsx');

            await expect(handleSubmit(form, setLoading, navigate, dispatch)({ preventDefault: () => { } })).resolves.toBeUndefined();
        });
    });

    describe('handleChange', () => {
        it('is handleFormChange from formfieldUtils', () => {
            expect(handleChange).toBe(formfieldUtils.handleFormChange);
        });
    });

    describe('useLoginState', () => {
        it('returns the expected state shape', () => {
            const store = configureStore({ reducer: { auth: authReducer } });
            const wrapper = ({ children }) => (
                <Provider store={store}>
                    <MemoryRouter>{children}</MemoryRouter>
                </Provider>
            );

            const { result } = renderHook(() => useLoginState(), { wrapper });

            expect(result.current).toHaveProperty('navigate');
            expect(result.current).toHaveProperty('dispatch');
            expect(result.current).toHaveProperty('loading');
            expect(result.current).toHaveProperty('setLoading');
            expect(result.current).toHaveProperty('form');
            expect(result.current).toHaveProperty('setForm');
        });
    });
});
