import express from 'express';
import handlebars from 'express-handlebars';
import { Server as WebsocketServer} from 'socket.io';
import path from 'path';
import __dirname from './utils.js';
import { connectDB } from './db.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import sessionsRouter from "./routes/sessions.router.js";

const app = express();
const port = process.env.PORT || 8080;
const fileStorage = FileStore(session);

const DB_URL = "mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority";

//Middlewares
//Para poder levantar la data del body
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(__dirname + "/public"));
//Configuración de handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set("views", __dirname + "/views");
app.use(
    session({
      //store: new fileStorage({ path: "./sessions", ttl: 10, retries: 0 }),
      store: MongoStore.create({
        mongoUrl: DB_URL,
        ttl: 3600,
      }),
      secret: "hola",
      resave: false,
      saveUninitialized: false,
    })
);

//Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use('/', viewsRouter);

//Arranco servidor HTTP utilizando Express y listener
const server = app.listen(port, () => {
    console.log("Server listening on port:", port);
});

//Conexión a base de datos MongoDB (archivo db.js)
connectDB();

//Instanciando socket.io
const io = new WebsocketServer(server);

//Manejo de eventos WebSocket
io.on('connection', async (socket) => {
    console.log("Client connected!");
    
    //Agregar un producto
    socket.on("addProduct", (addProduct) => {
        console.log("Product added:", addProduct);
        io.emit("addProduct", addProduct);
    });

    //Eliminar un producto
    socket.on("deleteProduct", (deleteProductID) => {
        console.log("Product deleted:", deleteProductID);
        io.emit("deleteProduct", deleteProductID);
    });

    //Vaciar carrito
    socket.on("clearCart", (clearCart) => {
        console.log("Empty cart:", clearCart);
        io.emit("clearCart", clearCart);
    });

    //Eliminar un producto del carrito
    socket.on("deleteProductFromCart", (deleteProductFromCartID) => {
        console.log("Product deleted from cart:", deleteProductFromCartID);
        io.emit("deleteProductFromCart", deleteProductFromCartID);
    });

    //Se agregó un producto al carrito
    socket.on("productAddedToCart", (productId) => {
        io.emit("productAddedToCart", productId);
    });

    //Se eliminó un producto del carrito
    socket.on("productDeletedFromCart", (productId) => {
        io.emit("productDeletedFromCart", productId);
    });

    //Manejo de errores
    io.on('error', (error) => {
        console.error('Socket.IO error:', error);
    })
})

export { io };

export default app;