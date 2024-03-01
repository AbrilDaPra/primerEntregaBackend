import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewRouter from './routes/view.router.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const port = 8080;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, '/public')));

//Carpeta de vistas
app.set('views', `${__dirname}/views`);

//Motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

//Routes
app.use(productsRouter);
app.use(cartsRouter);
app.use(viewRouter);

const server = app.listen(port, console.log("Server listening on port:", port));
//Instanciando socket.io
const io = new Server(server);

io.on('connection', socket => {
    console.log("Connected!");
    socket.on('message', (data) => {
        console.log(data);
        // io.emit('log', data);
    })
})