import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../store/slices/authSlice', () => ({
  loginSuccess: jest.fn((p) => ({ type: 'LOGIN', payload: p })),
}));

jest.mock('../../components/common', () => {
  const original = jest.requireActual('../../components/common');
  return {
    ...original,
    validateRequiredFields: jest.fn(original.validateRequiredFields),
    setUserData: jest.fn(),
    LoadingSpinner: () => null,
    FormField: () => null,
    Button: () => null,
  };
});

import * as loginUtils from './loginUtils.jsx';

const { error: toastError, success: toastSuccess } = require('react-hot-toast');
const { loginSuccess } = require('../../store/slices/authSlice');
const { setUserData } = require('../../components/common');

let setLoading, navigate, dispatch;

const mockFormData = { username: 'testuser', password: 'testpass' };
const mockSuccessResponse = {
  ok: true,
  json: async () => ({
    token: 'mock-token',
    userId: 1,
    userName: 'TestUser',
    balances: [],
  }),
};

beforeEach(() => {
  setLoading = jest.fn();
  navigate = jest.fn();
  dispatch = jest.fn();
  global.fetch = undefined;
});
afterEach(() => jest.clearAllMocks());

describe('validateForm', () => {
  it('returns true for valid form data', () => {
    const result = loginUtils.validateForm({ username: 'test', password: 'test' });
    expect(result).toBe(true);
    expect(toastError).not.toHaveBeenCalled();
  });

  it('returns false for missing username', () => {
    const result = loginUtils.validateForm({ username: '', password: 'test' });
    expect(result).toBe(false);
    expect(toastError).toHaveBeenCalledWith('Username is required');
  });

  it('returns false for missing password', () => {
    const result = loginUtils.validateForm({ username: 'test', password: '' });
    expect(result).toBe(false);
    expect(toastError).toHaveBeenCalledWith('Password is required');
  });
});

describe('handleLogin', () => {
  it('handles successful login', async () => {
    global.fetch = jest.fn(() => Promise.resolve(mockSuccessResponse));

    await loginUtils.handleLogin(mockFormData, setLoading, navigate, dispatch);

    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
    expect(setUserData).toHaveBeenCalledWith(
      dispatch,
      loginSuccess,
      'mock-token',
      { id: 1, username: 'TestUser', balances: [] },
    );
    expect(navigate).toHaveBeenCalledWith('/dashboard');
    expect(toastSuccess).toHaveBeenCalledWith('Welcome back 👋');
  });

  it('handles API error with custom message', async () => {
    const errorResponse = {
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    };
    global.fetch = jest.fn(() => Promise.resolve(errorResponse));

    await loginUtils.handleLogin(mockFormData, setLoading, navigate, dispatch);

    expect(toastError).toHaveBeenCalledWith('Invalid credentials');
    expect(setLoading).toHaveBeenLastCalledWith(false);
    expect(setUserData).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('handles API error with default message', async () => {
    const errorResponse = {
      ok: false,
      json: async () => ({}),
    };
    global.fetch = jest.fn(() => Promise.resolve(errorResponse));

    await loginUtils.handleLogin(mockFormData, setLoading, navigate, dispatch);

    expect(toastError).toHaveBeenCalledWith('Login failed');
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  it('handles network errors', async () => {
    const networkError = new Error('Network error');
    global.fetch = jest.fn(() => Promise.reject(networkError));

    await loginUtils.handleLogin(mockFormData, setLoading, navigate, dispatch);

    expect(toastError).toHaveBeenCalledWith('Network error');
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  it('handles JSON parsing errors', async () => {
    const jsonErrorResponse = {
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    };
    global.fetch = jest.fn(() => Promise.resolve(jsonErrorResponse));

    await loginUtils.handleLogin(mockFormData, setLoading, navigate, dispatch);

    expect(toastError).toHaveBeenCalledWith('Invalid JSON');
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  it('handles error with no message (uses fallback)', async () => {
    const errorWithoutMessage = new Error();
    delete errorWithoutMessage.message;
    global.fetch = jest.fn(() => Promise.reject(errorWithoutMessage));

    await loginUtils.handleLogin(mockFormData, setLoading, navigate, dispatch);

    expect(toastError).toHaveBeenCalledWith('Login failed');
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  it('ensures loading state is reset in finally block', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Test error')));

    await loginUtils.handleLogin(mockFormData, setLoading, navigate, dispatch);

    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
    expect(setLoading).toHaveBeenCalledTimes(2);
  });
});

describe('handleSubmit', () => {
  it('skips login when form validation fails', async () => {
    const { validateRequiredFields } = require('../../components/common');
    validateRequiredFields.mockReturnValue({ isValid: false, message: 'Validation failed' });
    
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    const handler = loginUtils.handleSubmit(
      mockFormData,
      setLoading,
      navigate,
      dispatch,
    );
    await handler({ preventDefault: jest.fn() });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(setLoading).not.toHaveBeenCalled();
  });

  it('proceeds with login when form validation passes', async () => {
    const { validateRequiredFields } = require('../../components/common');
    validateRequiredFields.mockReturnValue({ isValid: true });
    
    global.fetch = jest.fn(() => Promise.resolve(mockSuccessResponse));

    const handler = loginUtils.handleSubmit(
      mockFormData,
      setLoading,
      navigate,
      dispatch,
    );
    await handler({ preventDefault: jest.fn() });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(setLoading).toHaveBeenCalledWith(true);
  });
});
