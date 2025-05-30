const { RestApiIfc } = require('./server/restApi');


function startBackend () {
    global.projectRoot = __dirname.substring(0, __dirname.lastIndexOf('backend'));
    // Start the Node.js backend server
    const restapiServer = new RestApiIfc();

    restapiServer.running() === false && restapiServer.start();
}

startBackend()
