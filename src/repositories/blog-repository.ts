import {db} from "../db/db";

export type blogType = {
    id: number,
    name: string
    description: string
    websiteUrl: string
}


export class BlogRepository {
    static getAll(){
        return db.blogs
    }

    static createBlog(createData:blogType){
        db.blogs.push(createData)
        return createData
    }
    static getById(id: number) {
        const findBlog = db.blogs.find(b=> b.id===id)
        return findBlog
    }
}