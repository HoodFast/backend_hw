import express, {Request, Response} from 'express'

export const app = express()

app.use(express.json())

const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]

type VideoDbType = {
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

type CreateVideoType = {
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


app.get('/videos', (req, res) => {
    res.send(videos)
})

app.get('/videos/:id', (req: RequestWithParams<{ id: string }>, res) => {
    const id = +req.params.id
    const video = videos.filter(item => item.id === id)

    if (!video.length) {
        res.sendStatus(404)
        return
    }
    res.send(video)
})

const validate = (title: string, author: string, availableResolutions: typeof AvailableResolutions) => {

    let errors: ErrorType = {
        errorsMessages: []
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
    // let errors: ErrorType = {
    //     errorsMessages: []
    // }
    //
    // let {title, author, availableResolutions} = req.body
    //
    // if (!title || !title.trim() || title.trim().length > 40) {
    //     errors.errorsMessages.push({message: "invalid title!", field: 'title'})
    // }
    // if (!author || !author.trim() || author.trim().length > 20) {
    //     errors.errorsMessages.push({message: "invalid author!", field: 'author'})
    // }
    // if (availableResolutions && Array.isArray(availableResolutions)) {
    //     availableResolutions.forEach(item => {
    //         !AvailableResolutions.includes(item) && errors.errorsMessages.push({
    //             message: "Invalid availableResolutions!",
    //             field: "availableResolutions"
    //         })
    //     })
    // } else {
    //     availableResolutions = []
    // }
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
    if (!video) {
        res.status(404)
        return
    }

    let {title, author, availableResolutions = []} = req.body
    const errors = validate(title, author, availableResolutions)
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
    if (!video) {
        res.status(404)
        return
    }
    const index = videos.findIndex(v => v.id === +req.params.id)
    videos.splice(index, 1)
    res.sendStatus(204)
})

