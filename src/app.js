import express from 'express';
import fs from 'fs';
import { randomUUID }  from 'node:crypto';

const pathCart = "./database/cart.json";
const app = express();
const port = 8080;

app.listen(port, console.log("El servidor esta corriendo en el puerto:", port));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const products = [];
let carts = [];

//Routes para productos
app.get('/api/products/', (req, res) => {
    //(GET) Mostrar todos los productos
    res.send(products);
});

app.get('/api/products/:pid/', (req, res) => {
    //(GET) Mostrar producto que coincida con :pid
    const productID = req.params.pid;
    const product = products.find(p => p.id === productID);
    if(product){
        res.send(product);
    }else{
        res.status(404).send({ error: 'Product not found.'})
    }
});

app.post('/api/products/', (req, res) => {
    //(POST) Crear producto nuevo
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if(!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).send({ error: 'All fields are required.'})
    }
    const newProduct = {
        id: randomUUID(),
        title,
        description, 
        code,
        price,
        status,
        stock,
        category,
        thumbnails: thumbnails || []
    };
    products.push(newProduct);
    res.status(201).send(newProduct);
});

app.put('/api/products/:pid/', (req, res) => {
    //(PUT) Editar producto que coincida con :pid
    const productID = req.params.pid;
    const productIndex = products.findIndex(p => p.id === productID);
    if(productIndex !== -1){
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        products[productIndex] = {
            ...products[productIndex],
            title: title || products[productIndex].title,
            description: description || products[productIndex].description,
            code: code || products[productIndex].code,
            price: price || products[productIndex].price,
            status: status || products[productIndex].status,
            stock: stock || products[productIndex].stock,
            category: category || products[productIndex].category,
            thumbnails: thumbnails || products[productIndex].thumbnails
        };
        res.send(products[productIndex]);
    }else{
        res.status(404).send({ error: 'Product not found.'})
    }
});

app.delete('/api/products/:pid/', (req, res) => {
    //(DELETE) Eliminar producto que coincida con :pid
    const productID = req.params.pid;
    const productIndex = products.findIndex(p => p.id === productID);
    if(productIndex !== -1){
        products.splice(productIndex, 1);
        res.send({ message: 'Product deleted.' });
    }else{
        res.status(404).send({ error: 'Product not found.' });
    }
});

//Routes para los carritos
app.post('/api/carts/', (req, res) => {
    //(POST) Crear un nuevo carrito
    let carrito = fs.readFileSync(pathCart, "utf-8");
    let parsedCart = JSON.parse(carrito);
    const ID = randomUUID();
    let cart =  {
        id: ID,
        products: [],
    }
    parsedCart.push(cart);
    let data = JSON.stringify(parsedCart);
    fs.writeFileSync(pathCart, data);
    res.send("Cart created");
});

app.get('/api/carts/:cid/', (req, res) => {
    //(GET) Listar los productos del carrito

    let id = req.params.cid;
    let carrito = fs.readFileSync(pathCart, "utf-8");
    let parsedCart = JSON.parse(carrito);
    
    let finalCart = parsedCart.find((cart) => cart.id === id);
    let data = JSON.stringify(finalCart);
    
    res.send(data);
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    //(POST) Agregar un producto nuevo al carrito seleccionado

    //Parseo cart.json
    let cart = fs.readFileSync(pathCart, "utf-8");
    let parsedCart = JSON.parse(cart);
    
    //Busco el producto
    let pid = req.params.pid;
    let foundProduct = products.find((p) => p.id === pid);

    //Busco el cart
    let cid = req.params.cid;
    let foundCart = parsedCart.findIndex((c) => c.id === cid);

    //Pusheo producto
    parsedCart[foundCart].products.push(foundProduct);
    let result = parsedCart;

    res.send("OK");
});