"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const formattedError = (0, express_validator_1.validationResult)(req).formatWith((error) => ({
        message: error.msg,
        field: error.type === "field" ? error.path : 'unknown'
    }));
    if (!formattedError.isEmpty()) {
        const errorMessages = formattedError.array({ onlyFirstError: true });
        res.status(400).send({ errorMessages: errorMessages });
        return;
    }
    return next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
