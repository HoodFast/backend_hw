"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const loginCurrent = 'admin';
const passwordCurrent = 'qwerty';
const authMiddleware = (req, res, next) => {
    if (req.headers['authorization'] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
        return;
    }
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(401);
        return;
    }
    const [basic, token] = auth.split(' ');
    if (basic !== 'Basic') {
        res.sendStatus(401);
        return;
    }
    const decodedToken = Buffer.from(token, 'base64').toString();
    const [login, password] = decodedToken.split(':');
    if (login !== loginCurrent || password !== passwordCurrent) {
        res.sendStatus(401);
        return;
    }
    return next();
};
exports.authMiddleware = authMiddleware;
