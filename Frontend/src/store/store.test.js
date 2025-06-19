import { store } from './store';
import { loginStart, loginSuccess, loginFailure, logout, clearError } from './slices/authSlice';

describe('Redux store integration', () => {
    afterEach(() => {
        store.dispatch(logout());
        store.dispatch(clearError());
    });

    it('should have the correct initial state', () => {
        const state = store.getState().auth;
        expect(state).toEqual({
            isAuthenticated: false,
            token: null,
            loading: false,
            error: null,
        });
    });

    it('should handle loginStart and loginSuccess', () => {
        store.dispatch(loginStart());
        let state = store.getState().auth;
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();

        store.dispatch(loginSuccess({ token: 'abc123' }));
        state = store.getState().auth;
        expect(state.isAuthenticated).toBe(true);
        expect(state.token).toBe('abc123');
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    it('should handle loginFailure', () => {
        store.dispatch(loginFailure('Invalid credentials'));
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Invalid credentials');
        expect(state.isAuthenticated).toBe(false);
        expect(state.token).toBeNull();
    });

    it('should handle logout', () => {
        store.dispatch(loginSuccess({ token: 'abc123' }));
        store.dispatch(logout());
        const state = store.getState().auth;
        expect(state).toEqual({
            isAuthenticated: false,
            token: null,
            loading: false,
            error: null,
        });
    });

    it('should handle clearError', () => {
        store.dispatch(loginFailure('Some error'));
        store.dispatch(clearError());
        const state = store.getState().auth;
        expect(state.error).toBeNull();
    });
}); 