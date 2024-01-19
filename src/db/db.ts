import {blogType} from "../repositories/blog-repository";


type bdType = {
    blogs:blogType[]
}

export const db:bdType = {
    blogs:[]
}