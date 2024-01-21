"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const db_1 = require("../db/db");
class BlogRepository {
    static getAll() {
        return db_1.db.blogs;
    }
    static createBlog(createData) {
        db_1.db.blogs.push(createData);
        return createData;
    }
    static getById(id) {
        const findBlog = db_1.db.blogs.find(b => b.id === id);
        return findBlog;
    }
    static updateBlog(data) {
        const findBlog = db_1.db.blogs.find(b => b.id === data.id);
        if (findBlog) {
            findBlog.name = data.name;
            findBlog.description = data.description;
            findBlog.websiteUrl = data.websiteUrl;
            return;
        }
        return;
    }
    static deleteById(id) {
        db_1.db.blogs = db_1.db.blogs.filter(b => b.id !== id);
        return;
    }
}
exports.BlogRepository = BlogRepository;
