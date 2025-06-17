import { describe, it, expect, jest } from '@jest/globals';
import {
  handleFormChange,
  validateRequiredFields,
  handleApiError,
  setUserData,
  clearUserData
} from './formfieldUtils';

describe('formfieldUtils', () => {
  describe('handleFormChange', () => {
    it('should update form state with new field value', () => {
      const mockSetForm = jest.fn();
      const form = { username: '', password: '' };
      const event = {
        target: { name: 'username', value: 'john_doe' }
      };

      const handler = handleFormChange(form, mockSetForm);
      handler(event);

      expect(mockSetForm).toHaveBeenCalledWith({
        username: 'john_doe',
        password: ''
      });
    });

    it('should preserve other form fields when updating one field', () => {
      const mockSetForm = jest.fn();
      const form = { username: 'john', password: 'secret' };
      const event = {
        target: { name: 'password', value: 'newpassword' }
      };

      const handler = handleFormChange(form, mockSetForm);
      handler(event);

      expect(mockSetForm).toHaveBeenCalledWith({
        username: 'john',
        password: 'newpassword'
      });
    });

    it('should handle empty string values', () => {
      const mockSetForm = jest.fn();
      const form = { username: 'john_doe', password: 'secret' };
      const event = {
        target: { name: 'username', value: '' }
      };

      const handler = handleFormChange(form, mockSetForm);
      handler(event);

      expect(mockSetForm).toHaveBeenCalledWith({
        username: '',
        password: 'secret'
      });
    });
  });

  describe('validateRequiredFields', () => {
    it('should return valid when all required fields are present', () => {
      const form = { username: 'john', password: 'secret', email: 'test@test.com' };
      const requiredFields = ['username', 'password'];
      const errorMessages = {};

      const result = validateRequiredFields(form, requiredFields, errorMessages);

      expect(result).toEqual({ isValid: true });
    });

    it('should return invalid when a required field is missing', () => {
      const form = { username: 'john', password: '' };
      const requiredFields = ['username', 'password'];
      const errorMessages = {};

      const result = validateRequiredFields(form, requiredFields, errorMessages);

      expect(result).toEqual({
        isValid: false,
        message: 'password is required'
      });
    });

    it('should return invalid when a required field is undefined', () => {
      const form = { username: 'john' };
      const requiredFields = ['username', 'password'];
      const errorMessages = {};

      const result = validateRequiredFields(form, requiredFields, errorMessages);

      expect(result).toEqual({
        isValid: false,
        message: 'password is required'
      });
    });

    it('should use custom error message when provided', () => {
      const form = { username: '' };
      const requiredFields = ['username'];
      const errorMessages = { username: 'Username is mandatory' };

      const result = validateRequiredFields(form, requiredFields, errorMessages);

      expect(result).toEqual({
        isValid: false,
        message: 'Username is mandatory'
      });
    });

    it('should return invalid for falsy values (null, undefined, empty string)', () => {
      const form = { field1: '', field2: null, field3: undefined };
      const requiredFields = ['field1', 'field2', 'field3'];
      const errorMessages = {};

      const result = validateRequiredFields(form, requiredFields, errorMessages);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('field1 is required');
    });

    it('should return invalid for falsy values (0, false)', () => {
      const form = { field1: 0, field2: false };
      const requiredFields = ['field1', 'field2'];
      const errorMessages = {};

      const result = validateRequiredFields(form, requiredFields, errorMessages);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('field1 is required');
    });
  });

  describe('handleApiError', () => {
    it('should return error message when error object has message property', () => {
      const error = { message: 'Network error occurred' };
      const result = handleApiError(error);

      expect(result).toBe('Network error occurred');
    });

    it('should return default message when error object has no message property', () => {
      const error = { status: 500 };
      const result = handleApiError(error);

      expect(result).toBe('Operation failed');
    });

    it('should return custom default message when provided', () => {
      const error = { status: 404 };
      const result = handleApiError(error, 'Custom error message');

      expect(result).toBe('Custom error message');
    });

    it('should handle null error object', () => {
      const result = handleApiError(null);

      expect(result).toBe('Operation failed');
    });

    it('should handle undefined error object', () => {
      const result = handleApiError(undefined);

      expect(result).toBe('Operation failed');
    });

    it('should handle string error', () => {
      const result = handleApiError('String error message');

      expect(result).toBe('Operation failed');
    });
  });

  describe('setUserData', () => {
    it('should dispatch loginSuccess action with token', () => {
      const mockDispatch = jest.fn();
      const mockLoginSuccess = jest.fn();
      const token = 'test-token-123';
      const userData = { id: 1, username: 'john' };

      setUserData(mockDispatch, mockLoginSuccess, token, userData);

      expect(mockLoginSuccess).toHaveBeenCalledWith({ token });
      expect(mockDispatch).toHaveBeenCalledWith(mockLoginSuccess({ token }));
    });
  });

  describe('clearUserData', () => {
    it('should dispatch logout action', () => {
      const mockDispatch = jest.fn();
      const mockLogout = jest.fn();

      clearUserData(mockDispatch, mockLogout);

      expect(mockLogout).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(mockLogout());
    });
  });
}); 