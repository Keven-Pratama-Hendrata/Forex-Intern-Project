import { validateSignupForm, handleSignupChange, handleSignupSubmit } from './signupHandler.jsx';
import useSignupHandler from './signupHandler.jsx';
import toast from 'react-hot-toast';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act, waitFor } from '@testing-library/react';
import { validatePasswordLength } from './signupHandler.jsx';

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

describe('signupHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    describe('validateSignupForm', () => {
        const validFormData = {
            username: 'testuser',
            password: 'password123',
            confirmPassword: 'password123'
        };

        it('returns true for valid form data', () => {
            const result = validateSignupForm(validFormData);
            expect(result).toBe(true);
            expect(toast.error).not.toHaveBeenCalled();
        });

        it('returns false and shows toast when username is empty', () => {
            const formData = { ...validFormData, username: '' };
            const result = validateSignupForm(formData);
            expect(result).toBe(false);
            expect(toast.error).toHaveBeenCalledWith('Username is required');
        });

        it('returns false and shows toast when password is empty', () => {
            const formData = { ...validFormData, password: '' };
            const result = validateSignupForm(formData);
            expect(result).toBe(false);
            expect(toast.error).toHaveBeenCalledWith('Password is required');
        });

        it('returns false and shows toast when password is too short', () => {
            const formData = { ...validFormData, password: '123' };
            const result = validateSignupForm(formData);
            expect(result).toBe(false);
            expect(toast.error).toHaveBeenCalledWith('Password must be at least 6 characters');
        });

        it('returns false and shows toast when confirmPassword is empty', () => {
            const formData = { ...validFormData, confirmPassword: '' };
            const result = validateSignupForm(formData);
            expect(result).toBe(false);
            expect(toast.error).toHaveBeenCalledWith('Please confirm your password');
        });

        it('returns false and shows toast when passwords do not match', () => {
            const formData = { ...validFormData, confirmPassword: 'differentpassword' };
            const result = validateSignupForm(formData);
            expect(result).toBe(false);
            expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
        });

        it('shows only the first error in toast when multiple errors exist', () => {
            const formData = {
                username: '',
                password: '',
                confirmPassword: ''
            };
            const result = validateSignupForm(formData);
            expect(result).toBe(false);
            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith('Username is required');
        });
    });

    describe('validatePasswordLength', () => {
        it('returns true if password meets default min length', () => {
            const password = '123456';
            const shortPassword = '12345';
            const resultValid = validatePasswordLength(password);
            const resultInvalid = validatePasswordLength(shortPassword);
            expect(resultValid).toBe(true);
            expect(resultInvalid).toBe(false);
        });
        it('returns true if password meets custom min length', () => {
            const password = '1234';
            const shortPassword = '123';
            const minLength = 4;
            const resultValid = validatePasswordLength(password, minLength);
            const resultInvalid = validatePasswordLength(shortPassword, minLength);
            expect(resultValid).toBe(true);
            expect(resultInvalid).toBe(false);
        });
    });

    describe('handleSignupChange', () => {
        it('updates form data with new field value', () => {
            const setFormData = jest.fn();
            const handleChange = handleSignupChange({ formData: {}, setFormData });
            const mockEvent = {
                target: {
                    name: 'username',
                    value: 'newusername'
                }
            };
            handleChange(mockEvent);
            expect(setFormData).toHaveBeenCalledWith({ username: 'newusername' });
        });
        it('preserves existing form data when updating single field', () => {
            const setFormData = jest.fn();
            const handleChange = handleSignupChange({ formData: { username: 'old', password: 'oldpass' }, setFormData });
            const mockEvent = {
                target: {
                    name: 'password',
                    value: 'newpass'
                }
            };
            handleChange(mockEvent);
            expect(setFormData).toHaveBeenCalledWith({ username: 'old', password: 'newpass' });
        });
    });

    describe('handleSignupSubmit', () => {
        let setLoading, navigate, formData, mockEvent;

        beforeEach(() => {
            setLoading = jest.fn();
            navigate = jest.fn();
            formData = {
                username: 'testuser',
                password: 'password123',
                confirmPassword: 'password123'
            };
            mockEvent = { preventDefault: jest.fn() };
        });

        it('prevents default form submission', async () => {
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ message: 'User created successfully' })
            });

            const handleSubmit = handleSignupSubmit({ formData, setLoading, navigate });
            await handleSubmit(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('shows toast when form is invalid and does not call API', async () => {
            const invalidFormData = { ...formData, username: '' };
            const handleSubmit = handleSignupSubmit({ formData: invalidFormData, setLoading, navigate });

            await handleSubmit(mockEvent);

            expect(toast.error).toHaveBeenCalledWith('Username is required');
            expect(setLoading).not.toHaveBeenCalled();
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('calls API and handles successful signup', async () => {
            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ message: 'User created successfully' })
            });
            const handleSubmit = handleSignupSubmit({ formData, setLoading, navigate });

            await handleSubmit(mockEvent);

            expect(setLoading).toHaveBeenCalledWith(true);
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:5001/api/users/signup',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: 'testuser',
                        password: 'password123'
                    })
                })
            );
            expect(toast.success).toHaveBeenCalledWith('Account created successfully!');
            expect(navigate).toHaveBeenCalledWith('/');
            expect(setLoading).toHaveBeenCalledWith(false);
        });

        it('handles API error response', async () => {
            global.fetch.mockResolvedValue({
                ok: false,
                json: async () => ({ error: 'USERNAME_EXISTS', message: 'Username already exists' })
            });
            const handleSubmit = handleSignupSubmit({ formData, setLoading, navigate });

            await handleSubmit(mockEvent);

            expect(setLoading).toHaveBeenCalledWith(true);
            expect(toast.error).toHaveBeenCalledWith('Username already exists');
            expect(setLoading).toHaveBeenCalledWith(false);
            expect(navigate).not.toHaveBeenCalled();
        });

        it('handles network error', async () => {
            global.fetch.mockRejectedValue(new Error('Network error'));
            const handleSubmit = handleSignupSubmit({ formData, setLoading, navigate });

            await handleSubmit(mockEvent);

            expect(setLoading).toHaveBeenCalledWith(true);
            expect(toast.error).toHaveBeenCalledWith('Network error');
            expect(setLoading).toHaveBeenCalledWith(false);
            expect(navigate).not.toHaveBeenCalled();
        });

        it('handles generic API error', async () => {
            global.fetch.mockResolvedValue({
                ok: false,
                json: async () => ({ message: 'Generic error' })
            });
            const handleSubmit = handleSignupSubmit({ formData, setLoading, navigate });

            await handleSubmit(mockEvent);

            expect(toast.error).toHaveBeenCalledWith('Generic error');
        });

        it('handles API error without message', async () => {
            global.fetch.mockResolvedValue({
                ok: false,
                json: async () => ({})
            });
            const handleSubmit = handleSignupSubmit({ formData, setLoading, navigate });

            await handleSubmit(mockEvent);

            expect(toast.error).toHaveBeenCalledWith('Signup failed');
        });

        it('handles network error without message', async () => {
            global.fetch.mockRejectedValue({});
            const handleSubmit = handleSignupSubmit({ formData, setLoading, navigate });

            await handleSubmit(mockEvent);

            expect(toast.error).toHaveBeenCalledWith('Network error. Please try again.');
        });
    });

    describe('useSignupHandler', () => {
        it('returns initial state with empty form data', () => {
            const wrapper = ({ children }) => (
                <MemoryRouter>
                    {children}
                </MemoryRouter>
            );

            const { result } = renderHook(() => useSignupHandler(), { wrapper });

            expect(result.current.formData).toEqual({
                username: '',
                password: '',
                confirmPassword: ''
            });
            expect(result.current.loading).toBe(false);
            expect(typeof result.current.handleChange).toBe('function');
            expect(typeof result.current.handleSubmit).toBe('function');
        });

        it('does not include errors in returned state', () => {
            const wrapper = ({ children }) => (
                <MemoryRouter>
                    {children}
                </MemoryRouter>
            );

            const { result } = renderHook(() => useSignupHandler(), { wrapper });

            expect(result.current.errors).toBeUndefined();
        });

        it('provides working handleChange function', async () => {
            const wrapper = ({ children }) => (
                <MemoryRouter>
                    {children}
                </MemoryRouter>
            );

            const { result } = renderHook(() => useSignupHandler(), { wrapper });

            const mockEvent = {
                target: {
                    name: 'username',
                    value: 'testuser'
                }
            };

            act(() => {
                result.current.handleChange(mockEvent);
            });

            await waitFor(() => {
                expect(result.current.formData.username).toBe('testuser');
            });
        });

        it('provides working handleSubmit function', () => {
            const wrapper = ({ children }) => (
                <MemoryRouter>
                    {children}
                </MemoryRouter>
            );

            const { result } = renderHook(() => useSignupHandler(), { wrapper });

            expect(typeof result.current.handleSubmit).toBe('function');
        });

        it('initializes with correct default values', () => {
            const wrapper = ({ children }) => (
                <MemoryRouter>
                    {children}
                </MemoryRouter>
            );

            const { result } = renderHook(() => useSignupHandler(), { wrapper });

            expect(result.current.formData.username).toBe('');
            expect(result.current.formData.password).toBe('');
            expect(result.current.formData.confirmPassword).toBe('');
            expect(result.current.loading).toBe(false);
        });

        it('provides functions that can be called without errors', () => {
            const wrapper = ({ children }) => (
                <MemoryRouter>
                    {children}
                </MemoryRouter>
            );

            const { result } = renderHook(() => useSignupHandler(), { wrapper });

            expect(() => {
                act(() => {
                    result.current.handleChange({ target: { name: 'test', value: 'value' } });
                });
            }).not.toThrow();

            expect(() => {
                act(() => {
                    result.current.handleSubmit({ preventDefault: jest.fn() });
                });
            }).not.toThrow();
        });
    });
}); 