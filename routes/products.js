const express = require('express');
const router = express.Router();

let products = [];
let possibleIdpr = 1;

const numericRegex = /^\d+$/;

router.get('/', (req, res) => {
    res.json(products);
});

router.post('/', (req, res) => {
    const product = req.body;
    if (!product.name || !product.price || !product.category) {
        res.status(400).json({ error: 'Product must have a name, price, and category' });
        return;
    }
    if (typeof product.name !== 'string') {
        res.status(400).json({ error: 'Name must be a string' });
        return;
    }
    if (typeof product.price !== 'string' || !numericRegex.test(product.price)) {
        res.status(400).json({ error: 'Price must be a valid numeric string' });
        return;
    }
    if (typeof product.category !== 'string') {
        res.status(400).json({ error: 'Category must be a string' });
        return;
    }
    if (!product.id) {
        product.id = possibleIdpr.toString();
        possibleIdpr++;
    } else if (typeof product.id !== 'string' || !numericRegex.test(product.id) || parseInt(product.id) < 1) {
        res.status(400).json({ error: 'Invalid ID, it must be a numeric string and greater than 0' });
        return;
    }
    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
        res.status(400).json({ error: 'Product ID already exists' });
        return;
    }
    products.push(product);
    res.status(201).json(product);
});

router.get('/:id', (req, res) => {
    if (!numericRegex.test(req.params.id)) {
        res.status(400).json({ error: 'Invalid ID, it must be a numeric string' });
        return;
    }
    const id = req.params.id;
    const product = products.find(product => product.id === id);
    if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
    }
    res.json(product);
});

router.put('/:id', (req, res) => {
    if (!numericRegex.test(req.params.id)) {
        res.status(400).json({ error: 'Invalid ID, it must be a numeric string' });
        return;
    }
    const id = req.params.id;
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) {
        res.status(404).json({ error: 'Product not found' });
        return;
    }
    const product = req.body;
    if (!product.name) product.name = products[productIndex].name;
    if (!product.category) product.category = products[productIndex].category;
    if (!product.price) product.price = products[productIndex].price;
    if (!product.id) product.id = products[productIndex].id;
    products[productIndex] = product;
    res.json(product);
});

router.delete('/:id', (req, res) => {
    if (!numericRegex.test(req.params.id)) {
        res.status(400).json({ error: 'Invalid ID, it must be a numeric string' });
        return;
    }
    const id = req.params.id;
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) {
        res.status(404).json({ error: 'Product not found' });
        return;
    }
    products = products.filter(product => product.id !== id);
    possibleIdpr--;
    res.json({ message: 'Product deleted successfully' });
});

module.exports = { router, products };
