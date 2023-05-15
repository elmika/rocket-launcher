const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://mikaelbaron:LDq6NuXdYk3h3XEk@nasacluster.aezajiy.mongodb.net/nasa?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});


async function connectMongo() {
    await mongoose.connect(MONGO_URL);
}

module.exports = { connectMongo };