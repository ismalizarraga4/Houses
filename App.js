import express from 'express';
import {v4} from 'uuid'

const app = express();

app.use(express.json());

//se agrega comentario 
//se agrega comentario 2

const houses = [
    {id: 'cab30eb8-c24a-4b8f-9b60-eaab3589a297', address: 'Pedro', zip_code: '20', lat: 1234, long: 56789},
    {id: '50a7da42-f041-4233-9ded-84db658fc447', address: 'Maria', zip_code: '30', lat: 1235, long: 56780},
    {id: 'feca19da-d793-4ae4-9391-8de8c519acf3', address: 'Martin', zip_code: '25', lat: 1235, long: 56781},
    {id: '2e001148-49e5-4247-9552-fedba7b2c3ad', address: 'Juan', zip_code: '20', lat: 1237, long: 56782},
    {id: '41ad8854-c9f5-4529-b082-8634303d9f35', address: 'Martha', zip_code: '25', lat: 1238, long: 56783},
];

 /**
  * server root
  */
app.get('/', (req, res) => {
    res.send('Start server');
});

/**
 * get all houses registered
 */
app.get('/api/houses', (req, res) => {
    res.json(houses);
});

/**
 * get a houses registered by ID
 */
app.get('/api/house/:id', (req, res) => {
    const house = houses.find(c => c.id == req.params.id);
    if(!house) return res.status(404).json({error: 'house not found'});
    else res.json(house);
});

/**
 * add a house
 */
app.post('/api/addHouse', (req, res) => {
    const {address, zip_code, lat, long} = req.body;

    if(!address || !zip_code || !lat || !long) return res.status(401).json({error: 'Bad Request'})

    const house = {
        id: v4(),
        address,
        zip_code,
        lat,
        long
    };

    houses.push(house);
    res.json(house);
});

/**
 * update data of a house by ID
 */
app.put('/api/updateHouse/:id', (req, res) => {
    const {address, zip_code, lat, long} = req.body;

    const house = houses.find(c => c.id == req.params.id);
    if(!house) return res.status(404).json({error: 'house not found'});

    if(!address || !zip_code || !lat || !long) return res.status(401).json({error: 'Bad Request'});
    const houseInput = {
        id: house.id,
        address: house.address != address ? address : house.address,
        zip_code: house.zip_code != zip_code ? zip_code : house.zip_code,
        lat: house.lat != lat ? lat : house.lat,
        long: house.long != long ? long : house.long,
    }

    const index = houses.indexOf(house);
    houses[index] = houseInput;
    res.json(houseInput)

});

/**
 * delete a house by ID
 */
app.delete('/api/deleteHouse/:id', (req, res) => {
    if(!req.params.id) return res.status(401).json({error: 'Bad Request'}); 

    const house = houses.find(c => c.id == req.params.id);
    if(!house) return res.status(404).json({error: 'house not found'});

    const index = houses.indexOf(house);
    houses.splice(index, 1);
    res.json(house);
});

export default app;