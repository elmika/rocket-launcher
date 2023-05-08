const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');




const habitablePlanets = [];
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

/*
const promise = new Promise((resolve, reject) => {
    resolve(42);
});
promise.then((result) => {

});
const result = await promise;
console.log(result);
*/

function loadPlanetsData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(filename)
        .pipe(parse(csv_configuration))
        .on('data', (data) => {
            if(isHabitablePlanet(data)){
                habitablePlanets.push(data);
            }
        })
        .on('error', (err) => {
            console.log(`An error occured while reading the file ${filename}: ${err}`);
            reject(err);
        })
        .on('end', () => {            
            console.log(`${habitablePlanets.length} habitable planets found!`);
            resolve();
        });
    });
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};

function getAllPlanets() {
    return habitablePlanets;
}