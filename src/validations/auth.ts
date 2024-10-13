import Joi from 'joi';
import { RegisterData, LoginData, ResetData } from '../types/Auth';

export const signupValidation = (data: RegisterData) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required().messages({
      'string.min': 'Username must be at least 6 characters long.',
      'any.required': 'Username is required.',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be numeric.',
        'any.required': 'Phone number is required.',
      }),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/) // At least one lowercase, one uppercase, one digit, and one symbol
      .messages({
        'string.min': 'Password must be at least 6 characters long.',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'any.required': 'Password is required.',
      }),
  });

  return schema.validate(data);
};

export const loginValidation = (data: LoginData) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
    }),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/) // At least one lowercase, one uppercase, one digit, and one symbol
      .messages({
        'string.min': 'Password must be at least 6 characters long.',
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'any.required': 'Password is required.',
      }),
  });

  return schema.validate(data);
};

export const resetPasswordValidation = (data: ResetData) => {
  const schema = Joi.object({
    oldPassword: Joi.string()
      .min(6)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .messages({
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'Old password must be at least 6 characters long.',
        'any.required': 'Old password is required.',
      }),
    newPassword: Joi.string()
      .min(6)
      .required()
      .not(Joi.ref('oldPassword'))
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .messages({
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'New password must be at least 6 characters long.',
        'any.required': 'New password is required.',
        'any.unsafe': 'New password cannot be the same as old password.',
      }),
    confirmPassword: Joi.any()
      .equal(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Confirm password does not match new password.',
        'any.required': 'Confirm password is required.',
      }),
  });

  return schema.validate(data);
};
