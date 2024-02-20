import { Router } from 'express';
import fs from 'fs';
import { randomUUID }  from 'node:crypto';

const router = Router();
const pathProducts = "./database/products.json";
const products = [];

//Cargo los datos del JSON al comienzo
try {
    const productsData = fs.readFileSync(pathProducts, "utf-8");
    products = JSON.parse(productsData);
} catch (error) {
    console.error("Error loading products data:", error);
}

//Routes
router.get('/api/products/', (req, res) => {
    //(GET) Mostrar todos los productos
    res.send(products);
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
    fs.writeFileSync(pathProducts, JSON.stringify(products));
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