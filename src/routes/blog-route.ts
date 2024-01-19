import {Router,Request,Response} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validators";
import {BlogRepository} from "../repositories/blog-repository";

export const blogRoute = Router({})

blogRoute.get('/',blogValidation(), (req:Request,res:Response)=>{
    const blogs = BlogRepository.getAll()
    res.send(blogs)
})

blogRoute.post('/',authMiddleware,blogValidation(), (req:Request,res:Response)=>{
    const {name,description,websiteUrl } = req.body

    const newBlog = {
        id:+(new Date()),
        name,
        description,
        websiteUrl
    }
    const createBlog = BlogRepository.createBlog(newBlog)
res.send(createBlog)
})
