import express from 'express';
import handlebars from 'express-handlebars';
import { Server as WebsocketServer} from 'socket.io';
import http from 'http';
import path from 'path';
import __dirname from './utils.js';
import Sockets from './socketServer.js';
import { connectDB } from './db.js';
import ProductManager from '../src/dao/services/ProductManager.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import studentsRouter from './routes/students.router.js';

//Conexión a base de datos MongoDB (archivo db.js)
connectDB();

const app = express();
const port = process.env.PORT || 8080;

//Middlewares
//Para poder levantar la data del body
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, '/public')));
//Carpeta de vistas
app.set('views', `${__dirname}/views`);
//Motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

//Routes
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/', viewsRouter);
app.use(studentsRouter);

//Creo servidor HTTP utilizando Express
//Instancio el server para poder pasarle app a IO indirectamente
const server = http.createServer(app);
const httpServer = server.listen(port);

//Instanciando socket.io
const io = new WebsocketServer(httpServer);
Sockets(io);

// const productManager = new ProductManager();
//Manejo de eventos WebSocket
// io.on('connection', async (socket) => {
//     console.log("Connected!");
//     socket.on('message', (data) => {
//         console.log(data);
//     });
//     const products = await productManager.getProducts();
//     socket.emit('products', products);
// })

export { io };

//Arranco el servidor HTTP
// server.listen(port, () => {
//     console.log("Server listening on port:", port);
// });

export default app;