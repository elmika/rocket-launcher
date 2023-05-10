const {
    getAllLaunches,
    addNewLaunch,
    missingPropertyForLaunchCreation,
    isInvalidLaunchDate
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if(missingPropertyForLaunchCreation(launch)) {
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

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
};