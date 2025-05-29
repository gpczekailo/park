'use strict';

const { ResponseCode } = require("../../utils/utils");

async function sayHello (req, res) {
    return res.status(ResponseCode.OK).send('Hi!')
}

module.exports = {
    sayHello
}
