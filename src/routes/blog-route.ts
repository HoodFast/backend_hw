import {Router, Request, Response} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validators";
import {BlogRepository} from "../repositories/blog-repository";

export const blogRoute = Router({})
type blogType = {
    id: number
    name: string
    description: string
    websiteUrl: string
}

type updateBlogType = {
    name: string
    description: string
    websiteUrl: string
}

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithParamsAndBody<P, T> = Request<P, {}, T, {}>
blogRoute.get('/', (req: Request, res: Response) => {
    const blogs = BlogRepository.getAll()
    res.send(blogs)
})

blogRoute.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blog = BlogRepository.getById(+req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.send(blog)
})
blogRoute.post('/', authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body

    const newBlog = {
        id: +(new Date()),
        name,
        description,
        websiteUrl
    }
    const createBlog = BlogRepository.createBlog(newBlog)
    res.send(createBlog)
})

blogRoute.put('/:id', authMiddleware, blogValidation(), (req: RequestWithParamsAndBody<{
    id: string
}, updateBlogType>, res: Response) => {
    const findUpdateBlog = BlogRepository.getById(+req.params.id)
    if (!findUpdateBlog) {
        res.sendStatus(404)
        return
    }
    const putBlog: blogType = {
        id: +req.params.id, ...req.body
    }
    BlogRepository.updateBlog(putBlog)
    res.sendStatus(204)
})

blogRoute.delete('/:id', authMiddleware, (req: RequestWithParams<{ id: string }>, res: Response) => {
    const findBlog = BlogRepository.getById(+req.params.id)
    if(!findBlog){
        res.sendStatus(404)
        return
    }

    BlogRepository.deleteById(+req.params.id)
    res.sendStatus(204)
})