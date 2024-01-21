"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blog_validators_1 = require("../validators/blog-validators");
const blog_repository_1 = require("../repositories/blog-repository");
exports.blogRoute = (0, express_1.Router)({});
exports.blogRoute.get('/', (req, res) => {
    const blogs = blog_repository_1.BlogRepository.getAll();
    res.send(blogs);
});
exports.blogRoute.get('/:id', (req, res) => {
    const blog = blog_repository_1.BlogRepository.getById(+req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    res.send(blog);
});
exports.blogRoute.post('/', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => {
    const { name, description, websiteUrl } = req.body;
    const newBlog = {
        id: +(new Date()),
        name,
        description,
        websiteUrl
    };
    const createBlog = blog_repository_1.BlogRepository.createBlog(newBlog);
    res.send(createBlog);
});
exports.blogRoute.put('/:id', auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => {
    const findUpdateBlog = blog_repository_1.BlogRepository.getById(+req.params.id);
    if (!findUpdateBlog) {
        res.sendStatus(404);
        return;
    }
    const putBlog = Object.assign({ id: +req.params.id }, req.body);
    blog_repository_1.BlogRepository.updateBlog(putBlog);
    res.sendStatus(204);
});
exports.blogRoute.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => {
    const findBlog = blog_repository_1.BlogRepository.getById(+req.params.id);
    if (!findBlog) {
        res.sendStatus(404);
        return;
    }
    blog_repository_1.BlogRepository.deleteById(+req.params.id);
    res.sendStatus(204);
});
