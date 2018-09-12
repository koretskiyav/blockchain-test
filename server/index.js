const app = require('./app');
const { port } = require('./config');

app().listen(port);
console.log(`APP STARTING AT PORT ${port}`);
