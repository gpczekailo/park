'use strict';

const ResponseCode = Object.freeze({
    OK: 200,
    Unauthorized: 401,
    AccessForbiden: 403,
    NotFound: 404,
    NotAcceptable: 406,
    InternalServerError: 500
});

module.exports = {
    ResponseCode
}
