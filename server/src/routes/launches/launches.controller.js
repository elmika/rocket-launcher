const {
    getAllLaunches,
    addNewLaunch 
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;
    launch.launchDate = new Date(launch.launchDate);
    id = addNewLaunch(launch);
    return res.status(201).json(launch); // Pending: add Location header            
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
};