import { handleChange, useSignupState } from './signupHandler.jsx';
import toast from 'react-hot-toast';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import React from 'react';

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

describe('signupHandler', () => {
    describe('handleSubmit', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            global.fetch = undefined;
        });

        it("shows error when passwords don't match", async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const form = { username: 'u', password: 'a', confirmPassword: 'b' };
            const { handleSubmit: hs } = require('./signupHandler.jsx');

            await hs(form, setLoading, navigate)({ preventDefault: jest.fn() });

            expect(toast.error).toHaveBeenCalledWith("Passwords don't match!");
            expect(global.fetch).toBeUndefined();
        });

        it('shows error when password is too short', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const form = { username: 'u', password: '12345', confirmPassword: '12345' };
            const { handleSubmit: hs } = require('./signupHandler.jsx');

            await hs(form, setLoading, navigate)({ preventDefault: jest.fn() });

            expect(toast.error).toHaveBeenCalledWith('Password must be at least 6 characters');
        });

        it('handles successful signup and navigates', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const form = { username: 'u', password: '123456', confirmPassword: '123456' };
            global.fetch = jest.fn().mockResolvedValue({ ok: true });

            const { handleSubmit: hs } = require('./signupHandler.jsx');

            await hs(form, setLoading, navigate)({ preventDefault: jest.fn() });

            expect(setLoading).toHaveBeenCalledWith(true);
            expect(toast.success).toHaveBeenCalledWith('Account created successfully');
            expect(navigate).toHaveBeenCalledWith('/');
        });

        it('shows server message on failed signup (message field)', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const form = { username: 'u', password: '123456', confirmPassword: '123456' };
            global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ message: 'Bad request' }) });

            const { handleSubmit: hs } = require('./signupHandler.jsx');

            await hs(form, setLoading, navigate)({ preventDefault: jest.fn() });

            expect(toast.error).toHaveBeenCalledWith('Bad request');
            expect(setLoading).toHaveBeenCalledWith(false);
        });

        it('shows server nested error message when present', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const form = { username: 'u', password: '123456', confirmPassword: '123456' };
            global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: { message: 'Nested error' } }) });

            const { handleSubmit: hs } = require('./signupHandler.jsx');

            await hs(form, setLoading, navigate)({ preventDefault: jest.fn() });

            expect(toast.error).toHaveBeenCalledWith('Nested error');
            expect(setLoading).toHaveBeenCalledWith(false);
        });

        it('shows default message when server returns empty body', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const form = { username: 'u', password: '123456', confirmPassword: '123456' };
            global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) });

            const { handleSubmit: hs } = require('./signupHandler.jsx');

            await hs(form, setLoading, navigate)({ preventDefault: jest.fn() });

            expect(toast.error).toHaveBeenCalledWith('Signup failed');
            expect(setLoading).toHaveBeenCalledWith(false);
        });

        it('handles network error and shows message', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const form = { username: 'u', password: '123456', confirmPassword: '123456' };
            global.fetch = jest.fn().mockRejectedValue(new Error('Network failure'));

            const { handleSubmit: hs } = require('./signupHandler.jsx');

            await hs(form, setLoading, navigate)({ preventDefault: jest.fn() });

            expect(toast.error).toHaveBeenCalledWith('Network failure');
            expect(setLoading).toHaveBeenCalledWith(false);
        });

        it('handles thrown error with no message and shows default signup failed', async () => {
            const setLoading = jest.fn();
            const navigate = jest.fn();
            const form = { username: 'u', password: '123456', confirmPassword: '123456' };
            global.fetch = jest.fn().mockRejectedValue({});

            const { handleSubmit: hs } = require('./signupHandler.jsx');

            await hs(form, setLoading, navigate)({ preventDefault: jest.fn() });

            expect(toast.error).toHaveBeenCalledWith('Signup failed');
            expect(setLoading).toHaveBeenCalledWith(false);
        });

    });

    describe('handleChange', () => {
        it('returns an onChange that calls setForm with updater function', () => {
            const setForm = jest.fn();
            const form = { username: '', password: '', confirmPassword: '' };

            const onChange = handleChange(form, setForm);
            const event = { target: { name: 'username', value: 'bob' } };

            onChange(event);

            expect(setForm).toHaveBeenCalledTimes(1);

            const updater = setForm.mock.calls[0][0];
            const result = updater(form);

            expect(result.username).toBe('bob');
        });
    });

    describe('useSignupState', () => {
        it('returns expected state shape', () => {
            const wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
            const { result } = renderHook(() => useSignupState(), { wrapper });

            expect(result.current).toHaveProperty('navigate');
            expect(result.current).toHaveProperty('loading');
            expect(result.current).toHaveProperty('setLoading');
            expect(result.current).toHaveProperty('form');
            expect(result.current).toHaveProperty('setForm');
        });
    });
});
