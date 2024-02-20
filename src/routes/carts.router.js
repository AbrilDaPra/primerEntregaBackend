import { Router } from 'express';
import fs from 'fs';
import { randomUUID }  from 'node:crypto';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathCart = path.join(__dirname, '../database/cart.json');

const router = Router();
let carts = [];

//Cargo los datos del JSON al comienzo
try {
    const cartData = fs.readFileSync(pathCart, "utf-8");
    carts = JSON.parse(cartData);
} catch (error) {
    console.error("Error loading carts data:", error);
}

//Routes
router.post('/api/carts/', (req, res) => {
    //(POST) Crear un nuevo carrito
    // let carrito = fs.readFileSync(pathCart, "utf-8");
    // let parsedCart = JSON.parse(carrito);
    // const ID = randomUUID();
    let newCart =  {
        id: randomUUID(),
        products: [],
    }
    // parsedCart.push(cart);
    // let data = JSON.stringify(parsedCart);
    carts.push(newCart);
    fs.writeFileSync(pathCart, JSON.stringify(carts));
    res.send("Cart created");
});

router.get('/api/carts/:cid/', (req, res) => {
    //(GET) Listar los productos del carrito

    // let id = req.params.cid;
    // let carrito = fs.readFileSync(pathCart, "utf-8");
    // let parsedCart = JSON.parse(carrito);
    
    // let finalCart = parsedCart.find((cart) => cart.id === id);
    // let data = JSON.stringify(finalCart);
    
    // res.send(data);

    const cid = req.params.cid;
    const finalCart = carts.find(cart => cart.id === cid);
    if (finalCart) {
        res.send(finalCart);
    } else {
        res.status(404).send({ error: 'Cart not found.' });
    }
});

router.post('/api/carts/:cid/product/:pid', (req, res) => {
    //(POST) Agregar un producto nuevo al carrito seleccionado
    //Obtengo el id de producto y carrito
    const pid = req.params.pid;
    const cid = req.params.cid;

    //Verifico si el producto ya existe
    const existingCart = carts.find(cart => cart.id === cid);
    if (!existingCart) {
        return res.status(404).send({ error: 'Cart not found.' });
    }

    //Verifico si el producto ya existe en el carrito
    const existingProduct = existingCart.products.find(p => p.id === pid);
    if (existingProduct) {
        //Si ya existe, incremento la cantidad
        existingProduct.quantity++;
    } else {
        //Si no existe, agrego cantidad 1
        existingCart.products.push({
            id: pid,
            quantity: 1
        });
    }

    //Guardo los cambios en el JSON
    fs.writeFileSync(pathCart, JSON.stringify(carts));

    res.send({ message: 'Product added to cart.' });

    // //Encuentro el producto y carrito correspondiente
    // const product = products.find(p => p.id === pid);
    // const cart = carts.find(c => c.id === cid);

    // //Muestro error en caso de no existir
    // if(!product){
    //     return res.status(404).send({ error: 'Product not found.' });
    // }
    // if(!cart){
    //     return res.status(404).send({ error: 'Cart not found.' });
    // }

    // if(!existingProduct){
    //     //Si ya existe, incremento la cantidad
    //     existingProduct.quantity++;
    // }else{
    //     //Si no existe, agrego cantidad 1
    //     cart.products.push({
    //         id: product.id,
    //         quantity: 1
    //     });
    // }

    // //Verifico que el archivo JSON exista
    // if (!fs.existsSync(pathCart)) {
    //     //Si no existe, lo crea
    //     fs.writeFileSync(pathCart, '[]');
    // }

    //Parseo cart.json
    // let cart = fs.readFileSync(pathCart, "utf-8");
    // let parsedCart = JSON.parse(cart);
    
    // //Busco el producto
    // let pid = req.params.pid;
    // let foundProduct = products.find((p) => p.id === pid);

    // //Busco el cart
    // let cid = req.params.cid;
    // let foundCart = parsedCart.findIndex((c) => c.id === cid);

    // //Pusheo producto
    // parsedCart[foundCart].products.push(foundProduct);
    // let result = parsedCart;

    // res.send("OK");
});

export default router;