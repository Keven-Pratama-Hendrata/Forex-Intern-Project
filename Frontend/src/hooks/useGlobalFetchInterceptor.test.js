import { renderHook, act } from '@testing-library/react';
import { useGlobalFetchInterceptor, _resetRateLimitToastFlag } from './useGlobalFetchInterceptor';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

jest.mock('react-hot-toast', () => ({ error: jest.fn() }));
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));

describe('useGlobalFetchInterceptor', () => {
    let originalFetch;
    let navigateMock;

    beforeEach(() => {
        jest.clearAllMocks();
        originalFetch = window.fetch;
        navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);
        jest.useFakeTimers();
        _resetRateLimitToastFlag();
    });

    afterEach(() => {
        window.fetch = originalFetch;
        jest.useRealTimers();
    });

    it('overrides and restores fetch', () => {
        const { unmount } = renderHook(() => useGlobalFetchInterceptor());

        expect(window.fetch).not.toBe(originalFetch);
        unmount();
        expect(window.fetch).toBe(originalFetch);
    });

    it('shows toast and redirects on 429 response', async () => {
        const response = { status: 429 };
        window.fetch = jest.fn().mockResolvedValue(response);
        renderHook(() => useGlobalFetchInterceptor());

        await act(async () => {
            await window.fetch('test');
        });

        expect(toast.error).toHaveBeenCalledWith('Too many requests. Please try again later.');
        expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });

    it('does not show toast or redirect on non-429 response', async () => {
        const response = { status: 200 };
        window.fetch = jest.fn().mockResolvedValue(response);
        renderHook(() => useGlobalFetchInterceptor());

        await act(async () => {
            await window.fetch('test');
        });

        expect(toast.error).not.toHaveBeenCalled();
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it('shows only one toast per 429 event', async () => {
        const response = { status: 429 };
        window.fetch = jest.fn().mockResolvedValue(response);
        renderHook(() => useGlobalFetchInterceptor());

        await act(async () => {
            await window.fetch('test');
            await window.fetch('test');
        });
        jest.runAllTimers();

        expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it('resets toast flag after timeout', async () => {
        const response = { status: 429 };
        window.fetch = jest.fn().mockResolvedValue(response);
        renderHook(() => useGlobalFetchInterceptor());

        await act(async () => {
            await window.fetch('test');
        });
        act(() => {
            jest.runAllTimers();
        });
        await act(async () => {
            await window.fetch('test');
        });

        expect(toast.error).toHaveBeenCalledTimes(2);
    });
}); 