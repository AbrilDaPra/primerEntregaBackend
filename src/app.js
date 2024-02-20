import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const port = 8080;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//Routes
app.use(productsRouter);
app.use(cartsRouter);

app.listen(port, console.log("El servidor esta corriendo en el puerto:", port));
