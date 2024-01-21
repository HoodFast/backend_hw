"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const nameValidator = (0, express_validator_1.body)('name')
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 15 }).withMessage('Incorrect Name');
const descriptionValidator = (0, express_validator_1.body)('description')
    .isString().withMessage('description must be a string')
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('Incorrect description');
const websiteUrlValidator = (0, express_validator_1.body)('websiteUrl')
    .isString().withMessage('websiteUrl must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
    .withMessage('Incorrect websiteUrl');
const blogValidation = () => [nameValidator, descriptionValidator, websiteUrlValidator, input_validation_middleware_1.inputValidationMiddleware];
exports.blogValidation = blogValidation;
