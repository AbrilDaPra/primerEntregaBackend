import { Router } from 'express';
import ProductManager from '../dao/services/ProductManager.js';
import { io } from '../app.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    //(GET) Mostrar todos los productos
    try {
        const products = await productManager.getProducts();
        let limit = req.query.limit;
        limit = parseInt(limit);

        if (isNaN(limit)) {
            limit = null;
        }

        if (limit !== null) {
            const limitedProducts = products.slice(0, limit);
            res.send(limitedProducts);
        } else {
            res.send(products);
        }
    } catch (error) {
        console.error("Error loading products:", error);
        res.status(500).send({ error: 'Internal Server Error.' });
    }
});

router.get('/:pid/', async (req, res) => {
    //(GET) Mostrar producto que coincida con :pid
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductsById(productId);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ error: 'Product not found.' });
        }
    } catch (error) {
        console.error("Error loading product:", error);
        res.status(500).send({ error: 'Internal Server Error.' });
    }
});

router.post('/', async (req, res) => {
    //(POST) Crear producto nuevo
    try {
        const newProduct = req.body;
        const product = await productManager.addProduct(newProduct);
        io.emit("productCreated", product);
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).send({ error: error.message });
    }
});

router.put('/:pid/', async (req, res) => {
    //(PUT) Editar producto que coincida con :pid
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        res.send(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(400).send({ error: error.message });
    }
});

router.delete('/:pid/', async (req, res) => {
    //(DELETE) Eliminar producto que coincida con :pid
    try {
        const productId = req.params.pid;
        await productManager.deleteProduct(productId);
        io.emit('productDeleted', productId);
        res.send({ message: 'Product deleted.' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(400).send({ error: error.message });
    }
});

export default router;