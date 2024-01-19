import express, {Request} from 'express'
import {blogRoute} from "./routes/blog-route";


export const app = express()

app.use(express.json())


app.use('/blogs', blogRoute)


const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]

export type VideoDbType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null,
    createdAt?: string,
    publicationDate?: string,
    availableResolutions?: typeof AvailableResolutions
}

const videos: VideoDbType[] = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2024-01-02T21:03:04.165Z",
        publicationDate: "2024-01-02T21:03:04.165Z",
        availableResolutions: [
            "P144"
        ]
    }
]


type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>

export type CreateVideoType = {
    title: string,
    author: string,
    availableResolutions?: typeof AvailableResolutions
}

type updateVideoType = {
    title: string,
    author: string,
    availableResolutions?: typeof AvailableResolutions,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number,
    publicationDate?: string
}

type ErrorMessage = {
    message: string,
    field: string
}
type ErrorType = {
    errorsMessages: ErrorMessage[]
}


app.get('/', (req, res) => {
    const createdAt = new Date()
    const publicationDate = new Date()
    const newVideo: VideoDbType = {
        id: +(new Date()),
        title: "test",
        author: "test",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: ['144']
    }
    const test = {123: '123'}

    res.send(newVideo)
})

app.get('/videos', (req, res) => {
    res.send(videos)
})

app.get('/videos/:id', (req: RequestWithParams<{ id: string }>, res) => {
    const id = +req.params.id
    const video = videos.filter(item => item.id === id)

    if (isNaN(+req.params.id)) {
        res.sendStatus(400)
        return
    }
    if (!video.length) {
        res.sendStatus(404)
        return
    }
    res.send(...video)
})

const validate = (
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number,
    publicationDate?: string
) => {

    let errors: ErrorType = {
        errorsMessages: []
    }
    console.log(publicationDate)
    if (publicationDate && typeof publicationDate !== 'string') {
        errors.errorsMessages.push({message: "invalid publicationDate!", field: 'publicationDate'})
    }
    // @ts-ignore
    if (minAgeRestriction && minAgeRestriction > 18 || minAgeRestriction < 1) {
        errors.errorsMessages.push({message: "invalid minAgeRestriction!", field: 'minAgeRestriction'})
    }
    if (canBeDownloaded && typeof canBeDownloaded !== "boolean") {
        errors.errorsMessages.push({message: "invalid canBeDownloaded!", field: 'canBeDownloaded'})
    }
    if (!title || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({message: "invalid title!", field: 'title'})
    }
    if (!author || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({message: "invalid author!", field: 'author'})
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach(item => {
            !AvailableResolutions.includes(item) && errors.errorsMessages.push({
                message: "Invalid availableResolutions!",
                field: "availableResolutions"
            })
        })
    }
    return errors
}


app.post('/videos', (req: RequestWithBody<CreateVideoType>, res) => {
    let {title, author, availableResolutions = []} = req.body
    const errors = validate(title, author, availableResolutions)
    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()
    publicationDate.setDate(createdAt.getDate() + 1)

    const newVideo: VideoDbType = {

        id: +(new Date()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions
    }

    videos.push(newVideo)

    res.status(201).send(newVideo)
})


app.put('/videos/:id', (req: RequestWithParamsAndBody<{ id: string }, updateVideoType>, res) => {
    let video = videos.filter(i => i.id === +req.params.id)

    if (!video.length) {
        res.sendStatus(404)
        return
    }

    let {title, author, availableResolutions = [], canBeDownloaded, minAgeRestriction,publicationDate} = req.body
    const errors = validate(title, author, availableResolutions, canBeDownloaded, minAgeRestriction,publicationDate)

    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const index = videos.findIndex(i => i.id === +req.params.id)

    videos[index] = {...video[0], ...req.body, id: +req.params.id}
    res.sendStatus(204)
})


app.delete('/videos/:id', (req: RequestWithParams<{ id: string }>, res) => {
    const video = videos.filter(i => i.id === +req.params.id)

    if (typeof +req.params.id !== 'number') {
        res.sendStatus(400)
        return
    }

    if (!video.length) {
        res.sendStatus(404)
        return
    }
    const index = videos.findIndex(v => v.id === +req.params.id)
    videos.splice(index, 1)
    res.sendStatus(204)
})

app.delete('/testing/all-data', (req, res) => {
    videos.length = 0
    res.sendStatus(204)
})
