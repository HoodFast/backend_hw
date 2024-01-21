import {blogType} from "../repositories/blog-repository";


type bdType = {
    blogs:blogType[]
}

export const db:bdType = {
    blogs:[{id:1,description:'йа описание',name:'Best name', websiteUrl:'web Url'},{id:2,description:'йа описание',name:'Best name', websiteUrl:'web Url'}]
}