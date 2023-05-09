const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    destination: 'Kepler-442 b',
    customer: ['ZtM', 'NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
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

module.exports = {
    getAllLaunches,
    addNewLaunch,
}