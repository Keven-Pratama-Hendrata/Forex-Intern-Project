import { describe, it, expect, jest } from '@jest/globals';
import {
  handleFormChange,
  validateRequiredFields,
  handleApiError,
  setUserData,
  clearUserData,
} from './formfieldHandler';

describe('handleFormChange', () => {
  it.each([
    [
      'updates empty form',
      { username: '', password: '' },
      { name: 'username', value: 'john_doe' },
      { username: 'john_doe', password: '' },
    ],
    [
      'preserves other keys',
      { username: 'john', password: 'secret' },
      { name: 'password', value: 'newpass' },
      { username: 'john', password: 'newpass' },
    ],
    [
      'handles empty string value',
      { username: 'john', password: 'secret' },
      { name: 'username', value: '' },
      { username: '', password: 'secret' },
    ],
  ])('%s', (title, initial, evtTarget, expected) => {
    const setForm = jest.fn();

    handleFormChange(initial, setForm)({ target: evtTarget });

    expect(setForm).toHaveBeenCalledWith(expected);
  });
});

describe('validateRequiredFields', () => {
  it('returns valid when all required are present', () => {
    const form = { u: 'x', p: 'y' };
    const requiredFields = ['u', 'p'];
    const messages = {};

    const res = validateRequiredFields(form, requiredFields, messages);

    expect(res).toEqual({ isValid: true });
  });

  const invalidCases = [
    [
      'missing (empty string)',
      { u: '', p: 'y' },
      ['u', 'p'],
      'u is required',
    ],
    [
      'missing (undefined)',
      { u: 'x' },
      ['u', 'p'],
      'p is required',
    ],
    [
      'null value',
      { a: null },
      ['a'],
      'a is required',
    ],
    [
      '0 / false',
      { a: 0, b: false },
      ['a', 'b'],
      'a is required',
    ],
  ];

  it.each(invalidCases)('invalid when %s', (lbl, form, req, msg) => {
    const messages = {};

    const res = validateRequiredFields(form, req, messages);

    expect(res).toEqual({ isValid: false, message: msg });
  });

  it('uses custom message when supplied', () => {
    const form = { name: '' };
    const requiredFields = ['name'];
    const messages = { name: 'Name needed' };

    const res = validateRequiredFields(form, requiredFields, messages);

    expect(res).toEqual({ isValid: false, message: 'Name needed' });
  });
});

describe('handleApiError', () => {
  it.each([
    [{ message: 'net-err' }, undefined, 'net-err'],
    [{}, undefined, 'Operation failed'],
    [null, undefined, 'Operation failed'],
    [undefined, undefined, 'Operation failed'],
    ['plain string', undefined, 'Operation failed'],
    [{}, 'Custom default', 'Custom default'],
  ])('returns "%s"', (err, defMsg, expected) => {
    const result = handleApiError(err, defMsg);

    expect(result).toBe(expected);
  });
});

describe('user-data helpers', () => {
  it('setUserData dispatches loginSuccess(token)', () => {
    const dispatch = jest.fn();
    const loginSuccess = jest.fn((payload) => ({ type: 'LOGIN', payload }));
    const token = 'tok123';
    const userData = {};

    setUserData(dispatch, loginSuccess, token, userData);

    expect(loginSuccess).toHaveBeenCalledWith({ token: 'tok123' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'LOGIN', payload: { token: 'tok123' } });
  });

  it('clearUserData dispatches logout()', () => {
    const dispatch = jest.fn();
    const logout = jest.fn(() => ({ type: 'LOGOUT' }));

    clearUserData(dispatch, logout);

    expect(logout).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });
  });
});
