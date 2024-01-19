import {NextFunction, Request, Response} from "express";


const loginCurrent = 'admin'
const passwordCurrent = 'qwerty'
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['authorization'] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401)
        return
    }
    const auth = req.headers['authorization']
    if (!auth) {
        res.sendStatus(401)
        return
    }
    const [basic, token] = auth.split(' ')

    if (basic !== 'Basic') {
        res.sendStatus(401)
        return
    }

    const decodedToken = Buffer.from(token, 'base64').toString()

    const [login, password] = decodedToken.split(':')
    if (login !== loginCurrent || password !== passwordCurrent) {
        res.sendStatus(401)
        return
    }
    return next()
}