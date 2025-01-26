import { Container } from 'typedi';
import { body } from 'express-validator';

import { UserRepository } from '@/repositories/UserRepository';

import type { Sequelize } from 'sequelize-typescript';

const sequelize = Container.get<Sequelize>('sequelize');

export const emailRules = (unique = false, isRequired = true, key = 'email') => {
    const validationChain = body(key);

    if (isRequired) {
        validationChain
            .trim()
            .notEmpty()
            .withMessage((value, { req }) => req.__('validation.required'))
            .bail();
    } else {
        validationChain.optional();
    }

    return validationChain
        .isLength({ min: 5, max: 100 })
        .withMessage((value, { req }) => req.__('validation.invalidLength', 5, 100))
        .bail()
        .isEmail()
        .withMessage((value, { req }) => req.__('validation.emailFormat'))
        .bail()
        .custom(async (val: string, { req }) => {
            if (!unique) {
                return Promise.resolve();
            }

            const userRepository = new UserRepository(sequelize);

            const user = await userRepository.findByEmail(val, { useMaster: true });

            if (user && user.email !== req.loggedUser.email) {
                return Promise.reject(req.__('validation.emailExists'));
            }
        });
};
