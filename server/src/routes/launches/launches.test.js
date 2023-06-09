const request = require('supertest');
const app= require('../../app');
const { 
    mongoConnect, 
    mongoDisconnect 
} = require('../../services/mongo');
const { response } = require('../../app');
const { 
    loadPlanetsData,
} = require('../../models/planets.model');

describe('Launches API v1', () => {

    beforeAll( async () => {
        await mongoConnect();
        await loadPlanetsData();
    });

    afterAll( async () => {
        await mongoDisconnect();        
    });

    describe('Test GET /v1/launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    
    describe('Test POST /v1/launch', () => {
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'January 4, 2034'
        }

        const launchDataWithIncorrectPlanet = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-186-f',
            launchDate: 'January 4, 2034'
        }
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
        }
    
        launchDataWithoutMission = {        
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'January 4, 2034'
        }
    
        launchDataWithIncorrectDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'Hi there'
        }
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
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
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
    
            const response2 = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutMission)
                .expect('Content-Type', /json/)
                .expect(400)
    
                expect(response.body).toStrictEqual({
                    error: 'Missing required launch property',
                });
        });
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithIncorrectDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });

        test('It should catch invalid planets', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithIncorrectPlanet)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Error: Cannot launch to unknown planet Kepler-186-f',
            });
        });
        
    });
    
});