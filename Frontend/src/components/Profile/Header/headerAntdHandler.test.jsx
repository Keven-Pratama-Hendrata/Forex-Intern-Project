import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import * as router from 'react-router-dom';
import toast from 'react-hot-toast';

import {
    fetchUserProfile,
    useHeaderLogout,
    useLogoutHover,
    getLogoutButtonStyle,
    extractProfile,
} from './headerAntdHandler.jsx';
import * as handler from './headerAntdHandler.jsx';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
}));

global.fetch = jest.fn();

const HEADER_ROUTES = { profile: '/profile' };
const SUPPORTED_CURRENCIES = ['IDR'];
const HEADER_LABELS = { balance: 'Balance', logout: 'Logout' };
const HEADER_STYLES = { logoutLinkStyle: { background: 'none' } };

jest.mock('../../../data', () => ({
    HEADER_ROUTES,
    SUPPORTED_CURRENCIES,
    HEADER_LABELS,
    HEADER_STYLES,
}));

describe('headerAntdHandler', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchUserProfile', () => {
        it('sets profile on success', async () => {
            const mockSetProfile = jest.fn();
            const mockData = {
                username: 'TestUser',
                balances: [{ currency: 'IDR', amount: 100 }],
            };
            global.fetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockData),
            });

            await fetchUserProfile('token', mockSetProfile);

            await waitFor(() => {
                expect(mockSetProfile).toHaveBeenCalledWith({ username: 'TestUser', balance: 100 });
            });
        });
        it('sets default profile on error', async () => {
            const mockSetProfile = jest.fn();
            global.fetch.mockRejectedValueOnce(new Error('fail'));

            await fetchUserProfile('token', mockSetProfile);

            await waitFor(() => {
                expect(mockSetProfile).toHaveBeenCalledWith({ username: '', balance: 0 });
            });
        });
        it('returns early if token is falsy', async () => {
            const mockSetProfile = jest.fn();

            await fetchUserProfile(undefined, mockSetProfile);

            expect(mockSetProfile).not.toHaveBeenCalled();
        });
        it('sets balance to 0 if IDR balance is not found', async () => {
            const mockSetProfile = jest.fn();
            const mockData = {
                username: 'NoIDRUser',
                balances: [{ currency: 'USD', amount: 999 }],
            };
            global.fetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockData),
            });

            await fetchUserProfile('token', mockSetProfile);

            await waitFor(() => {
                expect(mockSetProfile).toHaveBeenCalledWith({ username: 'NoIDRUser', balance: 0 });
            });
        });
    });

    describe('useHeaderProfile', () => {
        it('returns initial profile', async () => {
            redux.useSelector.mockReturnValue('token');
            global.fetch.mockResolvedValue({
                json: () => Promise.resolve({ username: '', balances: [{ currency: 'IDR', amount: 0 }] }),
            });

            const { result } = renderHook(() => handler.useHeaderProfile());

            await waitFor(() => {
                expect(result.current).toMatchObject({ username: '', balance: 0 });
                expect(result.current.loading).toBe(false);
                expect(global.fetch).toHaveBeenCalledWith(HEADER_ROUTES.profile, expect.objectContaining({
                    headers: expect.objectContaining({ Authorization: 'Bearer token' })
                }));
            });
        });

        it('does not update state if unmounted before fetch resolves', async () => {
            redux.useSelector.mockReturnValue('token');
            const deferred = {};
            deferred.promise = new Promise(resolve => { deferred.resolve = resolve; });
            global.fetch.mockResolvedValueOnce({
                json: () => deferred.promise,
            });
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            const { unmount } = renderHook(() => handler.useHeaderProfile());

            unmount();
            await act(async () => {
                deferred.resolve({ username: 'LateUser', balances: [{ currency: 'IDR', amount: 42 }] });
                await Promise.resolve();
            });

            expect(consoleErrorSpy).not.toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });

        it('updates state when still mounted after a delayed fetch', async () => {
            redux.useSelector.mockReturnValue('token');
            const deferred = {};
            deferred.promise = new Promise(resolve => { deferred.resolve = resolve; });
            global.fetch.mockResolvedValueOnce({
                json: () => deferred.promise,
            });

            const { result } = renderHook(() => handler.useHeaderProfile());

            await act(async () => {
                deferred.resolve({ username: 'SlowUser', balances: [{ currency: 'IDR', amount: 777 }] });
            });

            await waitFor(() => {
                expect(result.current).toMatchObject({ username: 'SlowUser', balance: 777 });
            });
        });

    });

    describe('useHeaderLogout', () => {
        it('dispatches logout, shows toast, and navigates', () => {
            const dispatch = jest.fn();
            const navigate = jest.fn();
            redux.useDispatch.mockReturnValue(dispatch);
            router.useNavigate.mockReturnValue(navigate);

            const logoutHandler = useHeaderLogout();
            logoutHandler();

            expect(dispatch).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
            expect(navigate).toHaveBeenCalledWith('/', { state: { fromLogout: true } });
        });
    });

    describe('useLogoutHover', () => {
        it('toggles hover state', () => {
            const { result } = renderHook(() => useLogoutHover());

            act(() => {
                result.current[1]();
            });
            act(() => {
                result.current[2]();
            });

            expect(result.current[0]).toBe(false);
        });
    });

    describe('getLogoutButtonStyle', () => {
        it('returns the full style object for hover true', () => {
            const hover = true;

            const style = getLogoutButtonStyle(hover);

            expect(style).toMatchObject({
                background: '#c7d6ee',
                transition: 'background 0.2s',
                borderRadius: 8,
                padding: '2px 4px',
            });
        });
        it('returns the full style object for hover false', () => {
            const hover = false;

            const style = getLogoutButtonStyle(hover);

            expect(style).toMatchObject({
                background: 'none',
                transition: 'background 0.2s',
                borderRadius: 8,
                padding: '2px 4px',
            });
        });
    });

    describe('extractProfile', () => {
        it('returns correct profile with IDR balance', () => {
            const data = { username: 'User', balances: [{ currency: 'IDR', amount: 50 }] };

            const result = extractProfile(data);

            expect(result).toEqual({ username: 'User', balance: 50 });
        });
        it('returns balance 0 if IDR not found', () => {
            const data = { username: 'User', balances: [{ currency: 'USD', amount: 100 }] };

            const result = extractProfile(data);

            expect(result).toEqual({ username: 'User', balance: 0 });
        });
        it('returns empty username and 0 if missing', () => {
            const data = {};

            const result = extractProfile(data);

            expect(result).toEqual({ username: '', balance: 0 });
        });
    });
});
