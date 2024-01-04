"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const AvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
const videos = [
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
];
exports.app.get('/videos', (req, res) => {
    res.send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.filter(item => item.id === id);
    if (isNaN(+req.params.id)) {
        res.sendStatus(400);
        return;
    }
    if (!video.length) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
const validate = (title, author, availableResolutions) => {
    let errors = {
        errorsMessages: []
    };
    if (!title || !title.trim() || title.trim().length > 40) {
        errors.errorsMessages.push({ message: "invalid title!", field: 'title' });
    }
    if (!author || !author.trim() || author.trim().length > 20) {
        errors.errorsMessages.push({ message: "invalid author!", field: 'author' });
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach(item => {
            !AvailableResolutions.includes(item) && errors.errorsMessages.push({
                message: "Invalid availableResolutions!",
                field: "availableResolutions"
            });
        });
    }
    return errors;
};
exports.app.post('/videos', (req, res) => {
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
    let { title, author, availableResolutions = [] } = req.body;
    const errors = validate(title, author, availableResolutions);
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    let video = videos.filter(i => i.id === +req.params.id);
    if (!video.length) {
        res.sendStatus(404);
        return;
    }
    let { title, author, availableResolutions = [] } = req.body;
    const errors = validate(title, author, availableResolutions);
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const index = videos.findIndex(i => i.id === +req.params.id);
    videos[index] = Object.assign(Object.assign(Object.assign({}, video[0]), req.body), { id: +req.params.id });
    res.sendStatus(204);
});
exports.app.delete('/videos/:id', (req, res) => {
    const video = videos.filter(i => i.id === +req.params.id);
    if (typeof +req.params.id !== 'number') {
        res.sendStatus(400);
        return;
    }
    if (!video.length) {
        res.sendStatus(404);
        return;
    }
    const index = videos.findIndex(v => v.id === +req.params.id);
    videos.splice(index, 1);
    res.sendStatus(204);
});
exports.app.delete('/testing/all-data', (req, res) => {
    videos.splice(0, videos.length);
    res.sendStatus(204);
});
