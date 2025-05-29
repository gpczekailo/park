'use-strict'

const { join } = require('node:path');
const http = require('node:http');
const express = require('express');
const OpenApiValidator = require('express-openapi-validator');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const Server = require('./server.js');

const standardCnfDefaults = {
    port: 3000,
    timeout: 120000
}

class RestApiIfc extends Server {
    constructor (options) {
        super(options, standardCnfDefaults);

        this._app = express();
        const apiSpec = join(__dirname, '../swagger/api.yaml');
        // 1. Install bodyParsers for the request types your API will support
        this._app.use(express.urlencoded({ extended: false }));
        this._app.use(express.text());
        this._app.use(express.json());
        this._app.disable('x-powered-by');
        this._app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(YAML.load(apiSpec)));
        this._app.get('/', async (req, res, next) => {
            res.redirect('/app');
        })

        // 2. Add the OpenApiValidator middleware
        this._app.use(
            OpenApiValidator.middleware({
                apiSpec,
                validateRequests: true,
                validateResponses: {
                    onError: (error, body) => {
                        console.debug(error);
                        console.debug(body);
                    }
                },
                operationHandlers: join(__dirname, '../swagger/handler')
            })
        );

        // 4. Add an error handler
        this._app.use((err, req, res, next) => {
            // format errors
            res.status(err.status || 500).json({
                message: err.message,
                errors: err.errors
            });
        });

        // 5. Create webserver
        this._server = http.createServer(this._app);
        this.configureServer();
    }
}

module.exports = {
    RestApiIfc
};
