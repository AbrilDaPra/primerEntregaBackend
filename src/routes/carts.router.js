import { Router } from 'express';
import fs from 'fs';
import { randomUUID }  from 'node:crypto';
import { fileURLToPath } from 'url';
import path from 'path';
import CartManager from '../../CartManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathCart = path.join(__dirname, '../database/cart.json');

const router = Router();
let carts = [];

//Cargo los datos del JSON al comienzo
fs.readFile(pathCart, 'utf-8', (error, cartData) => {
    if(error){
        console.error("Error loading carts data:", error);
        return;
    }
    carts = JSON.parse(cartData);
})

//Routes
router.post('/api/carts/', (req, res) => {
    //(POST) Crear un nuevo carrito
    let newCart =  {
        id: randomUUID(),
        products: [],
    }
    carts.push(newCart);
    fs.writeFile(pathCart, JSON.stringify(carts), (error) => {
        if(error){
            console.error("Error writing cart data:", error);
            return res.status(500).send("Error creating cart.");
        }
        res.send("Cart created");
    });
});

router.get('/api/carts/:cid/', (req, res) => {
    //(GET) Listar los productos del carrito
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
    fs.writeFileSync(pathCart, JSON.stringify(carts), (error) => {
        if(error){
            console.error("Error writing cart data:", error);
            return res.status(500).send("Error adding product to cart.");
        }
        res.send({ message: 'Product added to cart.' });
    });
});

export default router;