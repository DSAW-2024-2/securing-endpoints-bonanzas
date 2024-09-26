const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registeredUsers = [{
    email: "admin@admin.com",
    password: "admin"
}];

router.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const { email, password } = req.body;
    const user = registeredUsers.find(user => user.email === email && user.password === password);
    if (user) { 
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2m' }); 
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
} 
module.exports = {router,authenticateToken};