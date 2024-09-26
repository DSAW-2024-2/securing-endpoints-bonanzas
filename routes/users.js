const express = require('express');
const router = express.Router();

let users = [];
let possibleIdus = 1;

const { authenticateToken } = require('./auth');
router.use(authenticateToken);

const numericRegex = /^\d+$/;

router.get('/', (req, res) => {
    res.json(users);
});

router.post('/', (req, res) => {
    const user = req.body;
    if (!user.name || !user.email || !user.age) {
        res.status(400).json({ error: 'User must have a name, email, and age' });
        return;
    }
    if (typeof user.name !== 'string') {
        res.status(400).json({ error: 'Name must be a string' });
        return;
    }
    if (typeof user.age !== 'string' || !numericRegex.test(user.age)) {
        res.status(400).json({ error: 'Age must be a valid numeric string' });
        return;
    }
    if (typeof user.email !== 'string') {
        res.status(400).json({ error: 'Email must be a string' });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }
    if (!user.id) {
        user.id = possibleIdus.toString();
        possibleIdus++;
    } else if (typeof user.id !== 'string' || !numericRegex.test(user.id) || parseInt(user.id) < 1) {
        res.status(400).json({ error: 'Invalid ID, it must be a numeric string and greater than 0' });
        return;
    }
    const existingUser = users.find(u => u.id === user.id);
    if (existingUser) {
        res.status(400).json({ error: 'User ID already exists' });
        return;
    }
    users.push(user);
    res.status(201).json(user);
});

router.get('/:id', (req, res) => {
    if (!numericRegex.test(req.params.id)) {
        res.status(400).json({ error: 'Invalid ID, it must be a numeric string' });
        return;
    }
    const id = req.params.id;
    const user = users.find(user => user.id === id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    res.json(user);
});

router.put('/:id', (req, res) => {
    if (!numericRegex.test(req.params.id)) {
        res.status(400).json({ error: 'Invalid ID, it must be a numeric string' });
        return;
    }
    const id = req.params.id;
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const user = req.body;
    if (!user.name) user.name = users[userIndex].name;
    if (!user.email) user.email = users[userIndex].email;
    if (!user.age) user.age = users[userIndex].age;
    else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }
    }
    if (!user.id) user.id = users[userIndex].id;
    users[userIndex] = user;
    res.json(user);
});

router.delete('/:id', (req, res) => {
    if (!numericRegex.test(req.params.id)) {
        res.status(400).json({ error: 'Invalid ID, it must be a numeric string' });
        return;
    }
    const id = req.params.id;
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    users = users.filter(user => user.id !== id);
    possibleIdus--;
    res.json({ message: 'User deleted successfully' });
});

module.exports = { router, users };
