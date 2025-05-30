'use strict';

const { ResponseCode } = require("../../utils/utils");
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // In real apps, use env vars

async function login (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if(username === 'admin2' && password === 'change_me') {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('parkToken', token, {
            httpOnly: true,
            secure: false,      // Set true in production (HTTPS)
            sameSite: 'lax',    // Or 'strict'
            maxAge: 3600000     // 1 hour
        });
        return res.json({ token, user: { id: 123, username, name: 'Reinaldo', roles: ['admin'] } });
    }
    return res.status(ResponseCode.Unauthorized);
}

async function logout (req, res) {
    res.clearCookie('parkToken');
    return res.json({ message: 'Logged out' });
}

async function token (req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ user: decoded });
    } catch {
        return res.sendStatus(ResponseCode.AccessForbiden);
    }
}

module.exports = {
    login,
    logout,
    token
}
