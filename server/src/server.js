const http = require('http');
require('dotenv').config();

const app = require('./app');

const { mongoDisconnect, mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadSpaceXLaunchesData } = require('./models/launches.model');

const PORT= process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    
    await mongoConnect();
    await loadPlanetsData();
    await loadSpaceXLaunchesData();

    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}

startServer();




//app.listen(PORT, () => {
//    console.log(`NASA API server launched. Listening on port ${PORT}`);
//});