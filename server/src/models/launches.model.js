const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/";
const SPACEX_ROUTE_GET_LAUNCHES = "launches/query";
const SPACEX_LAUNCH_FILTER = {
    query: {},
    options: {
        pagination: false,
        populate: [
            {
                path: 'rocket',
                select: {
                    name: 1
                }
            },
            {
                path: 'payloads',
                select: {
                    customers: 1
                }
            }
        ]
    }
};

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZtM', 'NASA'],
    upcoming: true,
    success: true,
}

saveLaunch(launch);

async function isSpaceXLaunchesDataDownloaded() {
    const spaceXLaunch = await launchesDatabase.findOne({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if(spaceXLaunch !== null){
        return true;
    } else {
        return false;
    }
}

async function loadSpaceXLaunchesData() {

    if(await isSpaceXLaunchesDataDownloaded()) {
        console.log("Launch data already downloaded.");
        return;
    }

    console.log("Downloading spaceX launch data");
    const getEndpointUrl = SPACEX_API_URL + SPACEX_ROUTE_GET_LAUNCHES    
    const body = SPACEX_LAUNCH_FILTER;

    const response = await axios.post(getEndpointUrl, body);

    if(response.status !== 200) {
        console.log('Problem downloading spaceX launch data.');
        throw new Error('SpaceX launch data download failed.');
    }
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs) {
        const launch = createLaunch(launchDoc);
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch);
    }
}

/**
 * 
 * @param {*} launchDoc A launch as received fom SpaceX API v4
 * @returns {*} launch A launch as we use in our MongoDB
 */
function createLaunch(launchDoc) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap( (payload) => {
        payload['customers'];
    });
    const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],            
        rocket: launchDoc['rocket']['name'],
        // launchDate:  new Date(launchDoc['date_local']),
        launchDate: launchDoc['date_local'],
        customers,
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
    }
    return launch;
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, {__v: 0, _id: 0});
}

async function saveLaunch(launch) {

    if(launch.target) {
        planet = await planets.findOne({ keplerName: launch.target });
        if(!planet) {
            throw new Error(`Cannot launch to unknown planet ${launch.target}`);
        }
    }

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function updateLaunch(launch) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launch.flightNumber,
    }, launch);

    // return says if operation was successful. Will return false if nothing has been modified.
    return aborted.acknowledged && aborted.modifiedCount ===1 && aborted.matchedCount===1;
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber');
    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getLaunchById(launchId) {
    return await launchesDatabase.findOne({flightNumber: launchId}, {__v: 0, _id: 0});
}

async function scheduleNewLaunch(launch) {

    const newFlightNumber = await getLatestFlightNumber() + 1;
    await saveLaunch(Object.assign(launch, {
        customers: ["Zero to Mastery", "NASA"],
        flightNumber: newFlightNumber,
        upcoming: true,
        success: true,
    }));            
}

/**
 * 
 * @param Launch Our launch domain object
 * @returns Launch The aborted launch
 * @throws error if inconsistent order
 */
function abortLaunch(launch) {
    
    if(!launch.upcoming) {
        throw new Error('Cannot abort a launch that is not scheduled!');
    }
    
    launch.upcoming = false;
    launch.success = false;
    
    return launch;
}

/**
 * 
 * @param integer launchId 
 * @returns nil
 *  
 */
async function abortLaunchById(launchId) {
    
    let launch = await getLaunchById(launchId);
    launch = abortLaunch(launch);
    const isSuccessful = await updateLaunch(launch);

    if(!isSuccessful) {
        throw new Error("Error when persisting aborted launch (database error)");
    }

    return launch;
}

function isIncompleteLaunchCreation(launch) {
    if(!launch.mission) { return true; }
    if(!launch.rocket) { return true; }
    if(!launch.launchDate) { return true; }
    if(!launch.target) { return true; }

    return false;
}

function isInvalidLaunchDate(launch) {
    ld = new Date(launch.launchDate);
    if(isNaN(ld)) {
        return true;
    }
    return false;
}

module.exports = {
    loadSpaceXLaunchesData,
    getAllLaunches,
    scheduleNewLaunch,
    getLaunchById,
    abortLaunchById,
    isIncompleteLaunchCreation,
    isInvalidLaunchDate,
}