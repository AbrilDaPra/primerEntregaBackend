import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewRouter from './routes/view.router.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';

const app = express();
const port = 8080;

//MANEJO LA LOGICA PARA ESCUCHAR Y EMITIR EVENTOS WEBSOCKET
//NOTIFICA A LOS CLIENTES SOBRE CAMBIOS EN PROD O CARR

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
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewRouter);

//Creo servidor HTTP utilizando Express
const server = http.createServer(app);

//Instanciando socket.io
const io = new Server(server);

//Manejo de eventos WebSocket
io.on('connection', socket => {
    console.log("Connected!");
    socket.on('message', (data) => {
        console.log(data);
    })
})

export { io };

//Arranco el servidor HTTP
server.listen(port, () => {
    console.log("Server listening on port:", port);
});
