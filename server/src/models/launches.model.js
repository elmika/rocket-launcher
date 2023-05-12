const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

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

async function getAllLaunches() {
    return await launches.find({}, {__v: 0, _id: 0});
}

async function saveLaunch(launch) {

    planet = await planets.findOne({ keplerName: launch.target });
    if(!planet) {
        throw new Error(`Cannot launch to unknown planet ${launch.target}`);
    }

    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber');
    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getLaunchById(launchId) {
    return await launches.findOne({flightNumber: launchId});
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
    await saveLaunch(launch);

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
    getAllLaunches,
    scheduleNewLaunch,
    getLaunchById,
    abortLaunchById,
    isIncompleteLaunchCreation,
    isInvalidLaunchDate,
}