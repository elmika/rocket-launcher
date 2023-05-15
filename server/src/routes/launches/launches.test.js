const request = require('supertest');
const app= require('../../app');
const { connectMongo } = require('../../services/mongo');
const { response } = require('../../app');


describe('Launches API', () => {

    beforeAll( async () => {
        await connectMongo();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /launch', () => {
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186-f',
            launchDate: 'January 4, 2034'
        }
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186-f',
        }
    
        launchDataWithoutMission = {        
            rocket: 'NCC 1701-D',
            target: 'Kepler-186-f',
            launchDate: 'January 4, 2034'
        }
    
        launchDataWithIncorrectDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186-f',
            launchDate: 'Hi there'
        }
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
            expect(requestDate).toBe(responseDate);
        });
        
    
        test('It should catch missing required properties', async () => {
           const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
    
            const response2 = await request(app)
                .post('/launches')
                .send(launchDataWithoutMission)
                .expect('Content-Type', /json/)
                .expect(400)
    
                expect(response.body).toStrictEqual({
                    error: 'Missing required launch property',
                });
        });
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithIncorrectDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });
        
    });
    
});