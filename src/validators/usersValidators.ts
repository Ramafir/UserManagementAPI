import { body } from 'express-validator';

export const storeUserValidation = [
    body('firstName')
        .optional()
        .isString()
        .withMessage('First name must be a string')
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters'),

    body('lastName')
        .optional()
        .isString()
        .withMessage('Last name must be a string')
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters'),

    body('email')
        .exists({ checkFalsy: true })
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    body('role')
        .exists({ checkFalsy: true })
        .withMessage('Role is required')
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"'),
];

export const updateUserValidation = [
    body('firstName')
        .optional()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),

    body('lastName')
        .optional()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),

    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"'),
];
