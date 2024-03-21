import express from 'express';
import handlebars from 'express-handlebars';
import { Server as WebsocketServer} from 'socket.io';
import path from 'path';
import __dirname from './utils.js';
import { connectDB } from './db.js';
import ProductManager from '../src/dao/services/ProductManager.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import Message from './dao/models/messages.model.js';

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

//Arranco servidor HTTP utilizando Express
const server = app.listen(port, () => {
    console.log("Server listening on port:", port)
});

//Instanciando socket.io
const io = new WebsocketServer(server);

//Defino arreglo msg vacío
const msg = []

const productManager = new ProductManager();

//Manejo de eventos WebSocket
io.on('connection', async (socket) => {
    console.log("Connected!");

    //Manejador de eventos para mensajes
    socket.on('generalMessage', (data) => {
        console.log("General Message:", data);
    });

    //Obtener productos y enviarlos al cliente
    const products = await productManager.getProducts();
    socket.emit('products', products);

    //Manejador de eventos para el chat
    socket.on("message", async (data)=> {
        const newMessage = new Message({ user: data.user, message: data.message });
        await newMessage.save();

        const messages = await Message.find();
        io.emit('messageLogs', messages);
    })
})

export { io };

export default app;