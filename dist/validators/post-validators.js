"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidation = void 0;
const express_validator_1 = require("express-validator");
const blog_repository_1 = require("../repositories/blog-repository");
const input_validation_middleware_1 = require("../middlewares/inputValidation/input-validation-middleware");
const titleValidator = (0, express_validator_1.body)('title')
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Incorrect title');
const shortDescriptionValidator = (0, express_validator_1.body)('shortDescription')
    .isString().withMessage('ShortDescription must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Incorrect shortDescription');
const contentValidator = (0, express_validator_1.body)('content')
    .isString().withMessage('WebsiteUrl must be a string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Incorrect content');
const blogIdValidator = (0, express_validator_1.body)('blogId')
    .isString().withMessage('websiteUrl must be a string')
    .custom((value) => {
    const blog = blog_repository_1.BlogRepository.getById(value);
    if (!blog) {
        // throw Error('Incorrect blogId')
        return false;
    }
    return true;
})
    .withMessage('Incorrect blogId');
const postValidation = () => [
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.postValidation = postValidation;
