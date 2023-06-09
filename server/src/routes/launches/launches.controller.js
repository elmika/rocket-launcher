const {
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    isIncompleteLaunchCreation,
    isInvalidLaunchDate, 
    getLaunchById, 
} = require('../../models/launches.model');

const { 
    getPagination
} = require('../../services/query');

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query)    
    launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if(isIncompleteLaunchCreation(launch)) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }
    if(isInvalidLaunchDate(launch)) {
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    try {
        await scheduleNewLaunch(launch);
    } catch(err) {
        console.log(`Could not schedule new launch: ${err}`);
        return res.status(400).json({
            error: `${err}`
        }); // Pending: add Location header            
    }

    return res.status(201).json(launch); // Pending: add Location header            
}

async function httpAbortLaunch(req, res) {        
    const launchId = Number(req.params.launchId);
    let launch = await getLaunchById(launchId);
    if(!launch) {
        return res.status(404).json({
            error: `Unknown launch ${launchId}`
        });
    }
    // if(!launch.upcoming) {
    //     return res.status(400).json({
    //         error: `Not a planned launch ${launchId}`
    //     });
    // }
    try {
        launch = await abortLaunchById(launchId);
    }catch(err){
        return res.status(400).json({
            error: `${err}`
        });    
    }
    
    return res.status(200).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,    
    httpAbortLaunch,
};