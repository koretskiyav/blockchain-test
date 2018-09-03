const app = require('./app');
const config = require('../config');

app().listen(config.port);
console.log(`APP STARTING AT PORT ${config.port}`);
