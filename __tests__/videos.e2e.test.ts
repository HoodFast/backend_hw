import {app, CreateVideoType} from '../src/settings'
const request = require('supertest');


const path = {
    videos: '/videos'
}



const errorMessages = {
    errorsMessages: [
        {message: 'invalid title!', field: 'title'},
        {message: 'invalid author!', field: 'author'},
    ],
}
describe('/videos', () => {
    let newVideo: CreateVideoType = {
        title: "string",
        author: "string",
        availableResolutions: [
            "P144"
        ]
    }

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)

    })
    beforeEach(async ()=>{
        await request(app).post(path.videos).send(newVideo)
    })
    afterEach(async ()=>{
        await request(app).delete('/testing/all-data').expect(204)
    })


    it('+GET products ', async () => {
        const res = await request(app).get('/videos/')
        expect(res.body.length).toBe(1)
    })

    it('-GET product by ID with incorrect id', async () => {
        await request(app).get('/videos/helloWorld').expect(400)
    })
    it('+GET product by ID with correct id', async () => {
        const createResponse = await request(app)
            .post(path.videos)
            .send(newVideo)
            .expect(201)
        expect({
            id: createResponse.body.id,
            title: createResponse.body.title,
            author: createResponse.body.author,
            availableResolutions: createResponse.body.availableResolutions
        }).toEqual({
            id: expect.any(Number),
            title: newVideo.title,
            author: newVideo.author,
            availableResolutions: newVideo.availableResolutions
        })
    })

    it('-POST does not create the video with incorrect data (no title, no author)', async function () {
        await request(app)
            .post('/videos/')
            .send({title: '', author: ''})
            .expect(400, errorMessages)

        const res = await request(app).get('/videos/')
        expect(res.body.length).toBe(1)
    })

    it('+POST create video with correct data', async () => {
        const createNewVideo = await request(app)
            .post(path.videos)
            .send(newVideo)
            .expect(201)

        expect({title: createNewVideo.body.title, author: createNewVideo.body.author})
            .toEqual({title: newVideo.title, author: newVideo.author})
        const data = await request(app).get(path.videos)
        expect(data.body.length).toBe(2)
    })

    it('+PUT product by ID with correct data', async () => {

        const createNewVideo = await request(app)
            .post(path.videos)
            .send(newVideo)
            .expect(201)

        const updateData = {title: 'title', author: 'title'}
        await request(app)
            .put(`${path.videos}/${createNewVideo.body.id}`)
            .send(updateData)
            .expect(204)

        const updateVideo = await request(app)
            .get(`${path.videos}/${createNewVideo.body.id}`)
            .expect(200)
        expect({title:updateVideo.body[0].title,author:updateVideo.body[0].author})
            .toEqual(updateData)
    })

    it('-PUT product by ID with incorrect data', async () => {

        const createNewVideo = await request(app)
            .post(path.videos)
            .send(newVideo)
            .expect(201)

        const updateData = {title: '', author: ''}
        const res = await request(app)
            .put(`${path.videos}/${createNewVideo.body.id}`)
            .send(updateData)
            .expect(400, errorMessages)
    })

    it('- DELETE product by incorrect ID', async () => {
        await request(app)
            .delete('/videos/876328')
            .expect(404)

        const res = await request(app).get('/videos/')
        expect(res.body.length).toBe(1)
    })
    it('+ DELETE product by correct ID', async () => {

        const res = await request(app).get(path.videos)

        await request(app)
            .delete(`${path.videos}/${res.body[0].id}`)
            .expect(204)

        const data = await request(app).get(path.videos)
        expect(data.body.length).toBe(0)
    })
})
