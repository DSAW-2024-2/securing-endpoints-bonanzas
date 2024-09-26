const express = require('express');
const app = express();
app.use(express.json());

// Importa los routers
const { router: usersRouter } = require('./routes/users');
const { router: productsRouter } = require('./routes/products');
const ordersRouter = require('./routes/orders');

// Usa los routers
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});