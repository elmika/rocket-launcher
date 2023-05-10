const {
    getAllLaunches,
    getLaunchById,
    addNewLaunch,
    abortLaunchById,
    isIncompleteLaunchCreation,
    isInvalidLaunchDate, 
    isExistingLaunch,
    isPlannedLaunch,
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if(isIncompleteLaunchCreation(launch)) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }
    if(isInvalidLaunchDate(launch)) {
        return res.status(400).json({
            error: 'Invalid launch date.',
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    /* id = */ addNewLaunch(launch);
    return res.status(201).json(launch); // Pending: add Location header            
}

function httpAbortLaunch(req, res) {        
    const launchId = Number(req.params.launchId);
    if(!isExistingLaunch(launchId)) {
        return res.status(404).json({
            error: `Unknown launch ${launchId}`
        });
    }
    if(!isPlannedLaunch(launchId)) {
        return res.status(400).json({
            error: `Not a planned launch ${launchId}`
        });
    }
    launch = getLaunchById(launchId);
    abortLaunchById(launchId);
    return res.status(200).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};