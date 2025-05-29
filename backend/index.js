const { RestApiIfc } = require('./server/restApi');


function startBackend () {
    // Start the Node.js backend server
    const restapiServer = new RestApiIfc();

    restapiServer.running() === false && restapiServer.start();
}

startBackend()
