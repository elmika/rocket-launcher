const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZtM', 'NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function getLaunchById(launchId) {
    return launches.get(launchId);
}

function addNewLaunch(launch){
    latestFlightNumber += 1;
    launches.set(
        latestFlightNumber, 
        Object.assign(launch, {
            customer: ["Zero to Mastery", "NASA"],
            flightNumber: latestFlightNumber,
            upcoming: true,
            success: true,
        })
    );
}

function abortLaunchById(launchId) {
    launches.forEach( (value, key, map) => {
        if(value.flightNumber === launchId) {
            if( value.upcoming === true) {
                value.upcoming = false;
                value.success = false;
                return true;
            }
        }
    });
    return false;
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

function isExistingLaunch(launchId) {
    return launches.has(launchId);    
}

function isPlannedLaunch(launchId) {
    return true;
    launches.forEach( (value, key, map ) => {
        if(value.flightNumber === launchId) {            
            return value.isPlannedLaunch;
        }
    });
    return false;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    getLaunchById,
    abortLaunchById,
    isIncompleteLaunchCreation,
    isInvalidLaunchDate,
    isExistingLaunch,
    isPlannedLaunch,
}