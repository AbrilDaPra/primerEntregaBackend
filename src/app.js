import express from 'express';

const app = express();
const port = 8080;

app.listen(port, console.log("El servidor esta corriendo en el puerto:", port));

//Middleware
app.use(express.json());

//Routes
app.get('/api/products/', () => {
    //(GET) Mostrar todos los productos
});

app.get('/api/products/:pid/', () => {
    //(GET) Mostrar producto que coincida con :pid
});

//Agregar nuevo producto
app.post('/api/products/', () => {
    //(POST) Crear producto nuevo
});

//Para poder editar
app.put('/api/products/:pid/', () => {
    //(PUT) Editar producto que coincida con :pid
});

app.delete('/api/products/:pid/', () => {
    //(DELETE) Eliminar producto que coincida con :pid
});

app.post('/api/carts/', () => {
    //(POST) 
});

app.get('/api/carts/:cid/', () => {
    //(GET) 
});

app.post('/api/carts/:cid/product/:pid', () => {
    //(POST) 
});