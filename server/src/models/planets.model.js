const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');


const filename = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');
const csv_configuration = {
    comment: '#',
    columns: true
};

const upper_insol = 1.11;
const lower_insol = 0.36;
const upper_prad = 1.6;

function isHabitablePlanet(planet) {
    if(planet['koi_disposition'] !== 'CONFIRMED'){
        return false;
    };
    if(planet['koi_insol'] > upper_insol){
        return false;
    };
    if(planet['koi_insol'] < lower_insol){
        return false;
    };
    if(planet['koi_prad'] > upper_prad){
        return false;
    };

    return true;
}

function loadPlanetsData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(filename)
        .pipe(parse(csv_configuration))
        .on('data', async (data) => {
            if(isHabitablePlanet(data)){
                savePlanet(data);
            }
        })
        .on('error', (err) => {
            console.log(`An error occured while reading the file ${filename}: ${err}`);
            reject(err);
        })
        .on('end', async () => {            
            const countPlanetsFound = (await getAllPlanets()).length;
            console.log(`${countPlanetsFound} habitable planets found!`);
            resolve();
        });
    });
}

async function getAllPlanets() {
    return await planets.find({}, {__v: 0, _id: 0});
}

async function savePlanet(planet) {
    try{
            await planets.updateOne({
                keplerName: planet.kepler_name,
            }, {
                keplerName: planet.kepler_name,
            }, {
                upsert: true,
            }
        );
    } catch(err){
        console.log(`Could not save planet: ${planet}`, err);
    }
    
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};