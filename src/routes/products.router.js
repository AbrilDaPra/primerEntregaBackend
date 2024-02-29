import { Router } from 'express';
import fs from 'fs/promises';
import { randomUUID }  from 'node:crypto';
import { fileURLToPath } from 'url';
import path from 'path';
import ProductManager from '../../ProductManager.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathProducts = path.join(__dirname, '../database/products.json');

const router = Router();;
let products = [];

//Cargo los datos del JSON al comienzo
async function loadProductsData(){
    try {
        const productsData = await fs.readFile(pathProducts, "utf-8");
        products = JSON.parse(productsData);
    } catch (error) {
        console.error("Error loading products data:", error);
    }
}

//Llamo a la función para cargar los datos
loadProductsData();

//Routes
router.get('/api/products/', async (req, res) => {
    //(GET) Mostrar todos los productos
    let limit = req.query.limit;
    limit = parseInt(limit);

    if (isNaN(limit)) {
        limit = null;
    }

    try{
        if (limit !== null) {
            const limitedProducts = products.slice(0, limit);
            res.send(limitedProducts);
        } else {
            res.send(products);
        }
    }catch (error){
        console.error("Error loading products:", error);
        res.status(500).send({ error: 'Internal Server Error.' });
    }
});

router.get('/api/products/:pid/', (req, res) => {
    //(GET) Mostrar producto que coincida con :pid
    const productID = req.params.pid;
    const product = products.find(p => p.id === productID);
    if(product){
        res.send(product);
    }else{
        res.status(404).send({ error: 'Product not found.'})
    }
});

router.post('/api/products/', (req, res) => {
    //(POST) Crear producto nuevo
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if(!title || !description || !code || !price || status === undefined || !stock || !category){
        return res.status(400).send({ error: 'All fields are required.'})
    }
    const newProduct = {
        id: randomUUID(),
        title: title,
        description: description, 
        code: code,
        price: price,
        status: statusBoolean,
        stock: stock,
        category: category,
        thumbnails: thumbnails || []
    };
    products.push(newProduct);
    fs.writeFile(pathProducts, JSON.stringify(products));
    res.status(201).send(newProduct);
});

router.put('/api/products/:pid/', (req, res) => {
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
        fs.writeFileSync(pathProducts, JSON.stringify(products));
        res.send(products[productIndex]);
    }else{
        res.status(404).send({ error: 'Product not found.'})
    }
});

router.delete('/api/products/:pid/', (req, res) => {
    //(DELETE) Eliminar producto que coincida con :pid
    const productID = req.params.pid;
    const productIndex = products.findIndex(p => p.id === productID);
    if(productIndex !== -1){
        products.splice(productIndex, 1);
        fs.writeFileSync(pathProducts, JSON.stringify(products));
        res.send({ message: 'Product deleted.' });
    }else{
        res.status(404).send({ error: 'Product not found.' });
    }
});

export default router;