'use strict'

const { inspect } = require('node:util');
const EventEmitter = require('node:events');

class Server extends EventEmitter {
    constructor (options, standardCnfDefaults, standardTlsDefaults) {
        super();
        // options
        this._opt = {};
        this._opt.cnf = Object.assign({}, standardCnfDefaults, options && options.cnf);
        this._opt.tls = Object.assign({}, standardTlsDefaults, options && options.tls);
    }

    configureServer () {
        this._server.on('error', (err) => {
            err.code !== 'ECONNRESET' && console.error('error', inspect(err, { showHidden: false, depth: null, breakLength: 'Infinity' }))
        })
        this._server.on('connection', (socket) => {
            const remoteConnectionInfo = `${socket.remoteAddress.replace(/::ffff:/g, '')}:${socket.remotePort}`;
            const localConnectionInfo = `${socket.address().address.replace(/::ffff:/g, '')}:${socket.address().port}`;
            console.debug(`Connection established [${remoteConnectionInfo}]->[${localConnectionInfo}]`);
        });
        this._server.on('listening', () => {
            console.log(`${this.constructor.name} listening IP[${this._server.address().address}] Port[${this._server.address().port}]`);
        });
        this._server.on('close', () => {
            console.log(`${this.constructor.name} stopped listening`);
        });
        this._server.setTimeout(this._opt.cnf.timeout);
        this._server.keepAliveTimeout = this._opt.cnf.timeout;
    }

    start () {
        this._server.listen(this._opt.cnf.port);
    }

    stop () {
        this._server.closeAllConnections();
        this._server.close();
    }

    running () {
        return this._server.listening === true;
    }
}

module.exports = Server;
