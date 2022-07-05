import app from '../App';
import request from 'supertest';

let houseId = ''

describe(`GET /api/houses`, () => {
    test(`should respond with a 200 status code`, async () => {
        const response = await request(app).get('/api/houses').send();
        expect(response.statusCode).toBe(200);
    });

    test(`should respond with an array`, async () => {
        const response = await request(app).get('/api/houses').send();
        expect(response.body).toBeInstanceOf(Array);
    })
});

describe(`GET /api/house/:id`, () => {
    test(`should respond with a 404 status code (not found)`, async () => {
        const response = await request(app).get('/api/house/').send();
        expect(response.statusCode).toBe(404);
    });

    test(`should respond with 'house not found' message`, async () => {
        const response = await request(app).get('/api/house/test').send();
        expect(response.body.error).toBe('house not found');
    });

    test(`should respond with a 200 status code`, async () => {
        const response = await request(app).get('/api/house/cab30eb8-c24a-4b8f-9b60-eaab3589a297').send();
        expect(response.statusCode).toBe(200);
    });

    test(`should respond with a json object`, async () => {
        const response = await request(app).get('/api/house/cab30eb8-c24a-4b8f-9b60-eaab3589a297').send();
        expect(response.body).toBeInstanceOf(Object);
    });

    // this is a test for all attributes
    test(`response should contain the id, name, age, enroll attributes`, async () => {
        const attributes = ['id','address', 'zip_code', 'lat', 'long'];

        for (const attribute of attributes){
            const response = await request(app).get('/api/house/cab30eb8-c24a-4b8f-9b60-eaab3589a297').send();
            expect(response.body[attribute]).toBeDefined();
        }
    });
});

describe(`POST /api/addHouse`, () => {
    describe(`when input data is missing`, () => {
        test(`should respond with a 401 status code (bad request)`, async () => {
            const response = await request(app).post('/api/addHouse').send({});
            expect(response.statusCode).toBe(401);
        });

        test(`should respond with 'Bad Request' message`, async () => {
            const response = await request(app).post('/api/addHouse').send({});
            expect(response.body.error).toBe('Bad Request');
        });

        test(`should respond with 'Bad Request' message`, async () => {
            const fields  = [
                {zip_code: '25', lat: 4321, long: 9876},
                {address: 'test',  lat: 4321, long: 9876},
                {address: 'test', zip_code: '25', long: 9876},
                {address: 'test', zip_code: '25', lat: 4321}
            ];

            for (const field of fields){
                const response = await request(app).post('/api/addHouse').send(field);
                expect(response.body.error).toBe('Bad Request');
            }
        });

    });

    describe(`when send input data`, () => {
        const data = {
            address: 'test',
            zip_code: '35',
            lat: 4321, 
            long: 56783
        };

        test(`should respond with a 200 status code`, async () => {
            const response = await request(app).post('/api/addHouse').send(data);
            expect(response.statusCode).toBe(200);
        });

        test(`should respond with a json object`, async () => {
            const response = await request(app).post('/api/addHouse').send(data);
            houseId = response.body.id
            expect(response.body).toBeInstanceOf(Object);
        });

        test(`response should contain the id, address, zip_code, lat, long attributes`, async () => {
            const attributes = ['id', 'address', 'zip_code', 'lat', 'long'];

            for (const attribute of attributes){
                const response = await request(app).post('/api/addHouse').send(data);
                expect(response.body[attribute]).toBeDefined();
            }
        });
    });
});

describe(`PUT /api/updateHouse`, () => {
    describe(`when input data is missing`, () => {
        test(`should respond with a 404 status code (not found)`, async () => {
            const response = await request(app).put('/api/updateHouse/').send({});
            expect(response.statusCode).toBe(404);
        });

        test(`should respond with a 404 status code (not found)`, async () => {
            const response = await request(app).put('/api/updateHouse/test').send({});
            expect(response.statusCode).toBe(404);
        });

        test(`should respond with 'house not found' message`, async () => {
            const response = await request(app).put('/api/updateHouse/test').send({});
            expect(response.body.error).toBe('house not found');
        });

        test(`should respond with 'Bad Request' message`, async () => {
            const fields  = [
                {zip_code: '25', lat: 4321, long: 9876},
                {address: 'test',  lat: 4321, long: 9876},
                {address: 'test', zip_code: '25', long: 9876},
                {address: 'test', zip_code: '25', lat: 4321}
            ];

            for (const field of fields){
                const response = await request(app).put(`/api/updateHouse/${houseId}`).send(field);
                expect(response.body.error).toBe('Bad Request');
            }
        });
    });

    describe(`when send input data`, () => {
        const data = {
            address: 'test',
            zip_code: '30',
            lat: 3456, 
            long: 7892
        };

        test(`should respond with a 200 status code`, async () => {
            const response = await request(app).put(`/api/updateHouse/${houseId}`).send(data);
            expect(response.statusCode).toBe(200);
        });

        test(`should respond with a json object`, async () => {
            const response = await request(app).put(`/api/updateHouse/${houseId}`).send(data);
            expect(response.body).toBeInstanceOf(Object);
        });

        test(`response should contain the id, address, zip_code, lat, long attributes`, async () => {
            const attributes = ['id', 'address', 'zip_code', 'lat', 'long'];

            for (const attribute of attributes){
                const response = await request(app).put(`/api/updateHouse/${houseId}`).send(data);
                expect(response.body[attribute]).toBeDefined();
            }
        });
    });

});

describe(`DELETE /api/deleteHouse/:id`, () => {
    let data = {};

    test(`should respond with a 404 status code (not found)`, async () => {
        const response = await request(app).delete('/api/deleteHouse').send();
        expect(response.statusCode).toBe(404);
    });

    test(`should respond with a 404 status code (not found)`, async () => {
        const response = await request(app).delete('/api/deleteHouse/test').send();
        expect(response.statusCode).toBe(404);
    });

    test(`should respond with 'house not found' message`, async () => {
        const response = await request(app).delete('/api/deleteHouse/test').send();
        expect(response.body.error).toBe('house not found');
    });

    test(`should respond with a json object`, async () => {
        const response = await request(app).delete(`/api/deleteHouse/${houseId}`).send();
        data = response.body;
        expect(response.body).toBeInstanceOf(Object);
    });

    test(`response should contain the id, address, zip_code, lat, long attributes`, () => {
        const attributes = ['id', 'address', 'zip_code', 'lat', 'long'];

        for (const attribute of attributes){
            expect(data[attribute]).toBeDefined();
        }
    });
});
