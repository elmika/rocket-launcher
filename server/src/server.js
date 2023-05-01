const http = require('http');
const app = require('./app');

const PORT= process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});


//app.listen(PORT, () => {
//    console.log(`NASA API server launched. Listening on port ${PORT}`);
//});