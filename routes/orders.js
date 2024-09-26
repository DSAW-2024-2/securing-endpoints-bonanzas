const express = require('express');
const router = express.Router();

const { users } = require('./users');
const { products } = require('./products');

let possibleIdord = 1;
let orders = [];

const { authenticateToken } = require('./auth');
router.use(authenticateToken);

const numericRegex = /^\d+$/;

router.get('/', (req, res) => {
    res.json(orders);
});

router.get('/:id', (req, res) => {
    if (!numericRegex.test(req.params.id)) {
        res.status(400).json({ error: 'Invalid ID, it must be a numeric string' });
        return;
    }
    const id = req.params.id;
    const order = orders.find(order => order.id === id);
    if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
    }
    res.json(order);
});

router.post('/', (req, res) => {
    const order = req.body;
    
    if (!order.userId || !order.productId || !order.quantity || !order.status) {
        res.status(400).json({ error: 'Order must have userId, productId, quantity, and status' });
        return;
    }
    
    if (typeof order.userId !== 'string' || !numericRegex.test(order.userId)) {
        res.status(400).json({ error: 'Invalid userId, it must be a numeric string' });
        return;
    }
    if (typeof order.productId !== 'string' || !numericRegex.test(order.productId)) {
        res.status(400).json({ error: 'Invalid productId, it must be a numeric string' });
        return;
    }
    if (typeof order.quantity !== 'string' || !numericRegex.test(order.quantity) || parseInt(order.quantity) < 1) {
        res.status(400).json({ error: 'Quantity must be a valid numeric string greater than 0' });
        return;
    }
    
    const user = users.find(user => user.id === order.userId);
    if (!user) {
        res.status(400).json({ error: 'Invalid userId' });
        return;
    }

    const product = products.find(product => product.id === order.productId);
    if (!product) {
        res.status(400).json({ error: 'Invalid productId' });
        return;
    }
        if (!order.id) {
            order.id = possibleIdord.toString();
            possibleIdord++;
        } else if (typeof order.id !== 'string' || !numericRegex.test(order.id) || parseInt(order.id) < 1) {
            res.status(400).json({ error: 'Invalid ID, it must be a numeric string and greater than 0' });
            return;
        }

    orders.push(order);
    res.status(201).json(order);
});

module.exports = router;
