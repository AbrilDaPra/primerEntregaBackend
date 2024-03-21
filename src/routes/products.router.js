import ProductManager from '../dao/services/ProductManager.js';
import express from 'express';
// import { io } from '../app.js';

const router = express.Router();
const productManager = new ProductManager();

//(GET) Mostrar todos los productos
router.get('/', async (req, res) => {
    try{
        const limit = req.query.limit;
        const data = await productManager.getProducts(limit);
        res.json(data);
    } catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
});

//(GET) Mostrar producto que coincida con :pid
router.get('/:id', async (req, res) => {
    try{
        const productId = req.params.id;
        const result = await productManager.getProductsById(productId);
        res.json(result);
    } catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
});

//(GET) Mostrar producto que coincida con la marca
router.get('/brand', async (req, res) => {
    try{
        const productBrand = req.query.brand;
        const result = await productManager.getByBrand(productBrand);
        res.json(result);
    } catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
});

//(POST) Crear producto nuevo
router.post('/', async (req, res) => {
    try{
        // const {title, description, code, category, brand, price, stock, status, thumnails} = req.body;
        const newProduct = req.body;
        const result = await productManager.addProduct(newProduct);
        res.json(result);
    } catch(error){
        if(error.name === 'ValidationError') {
            const missingFields = Object.keys(error.errors).join(', ');
            const errorMessage = `Missing required fields: ${missingFields}`;
            res.status(400).json({ error: errorMessage });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

//(PUT) Editar producto que coincida con :pid
router.put('/:pid/', async (req, res) => {
    try{
        const productId = req.params.pid;
        const updatedFields = req.body;
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        res.json(updatedProduct);
    } catch(error){
        res.status(500).json({ error: 'Internal server error' });
    } 
});

//(DELETE) Eliminar producto que coincida con :pid
router.delete('/:pid/', async (req, res) => {
    try{
        const productId = req.params.pid;
        let result = await productManager.deleteProduct(productId);
        res.json(result);
    } catch(error){
        res.status(500).json({ error: 'Internal server error' });
    } 
});



// router.get('/', async (req, res) => {
//     //(GET) Mostrar todos los productos
//     try {
//         const products = await productManager.getProducts();
//         let limit = req.query.limit;
//         limit = parseInt(limit);

//         if (isNaN(limit)) {
//             limit = null;
//         }

//         if (limit !== null) {
//             const limitedProducts = products.slice(0, limit);
//             res.send(limitedProducts);
//         } else {
//             res.send(products);
//         }
//     } catch (error) {
//         console.error("Error loading products:", error);
//         res.status(500).send({ error: 'Internal Server Error.' });
//     }
// });

// router.get('/:pid/', async (req, res) => {
//     //(GET) Mostrar producto que coincida con :pid
//     try {
//         const productId = req.params.pid;
//         const product = await productManager.getProductsById(productId);
//         if (product) {
//             res.send(product);
//         } else {
//             res.status(404).send({ error: 'Product not found.' });
//         }
//     } catch (error) {
//         console.error("Error loading product:", error);
//         res.status(500).send({ error: 'Internal Server Error.' });
//     }
// });

// router.post('/', async (req, res) => {
//     //(POST) Crear producto nuevo
//     try {
//         const newProduct = req.body;
//         const product = await productManager.addProduct(newProduct);
//         io.emit("productCreated", product);
//         res.status(201).json(product);
//     } catch (error) {
//         console.error("Error creating product:", error);
//         res.status(400).send({ error: error.message });
//     }
// });

// router.put('/:pid/', async (req, res) => {
//     //(PUT) Editar producto que coincida con :pid
//     try {
//         const productId = req.params.pid;
//         const updatedFields = req.body;
//         const updatedProduct = await productManager.updateProduct(productId, updatedFields);
//         res.send(updatedProduct);
//     } catch (error) {
//         console.error("Error updating product:", error);
//         res.status(400).send({ error: error.message });
//     }
// });

// router.delete('/:pid/', async (req, res) => {
//     //(DELETE) Eliminar producto que coincida con :pid
//     try {
//         const productId = req.params.pid;
//         await productManager.deleteProduct(productId);
//         io.emit('productDeleted', productId);
//         res.send({ message: 'Product deleted.' });
//     } catch (error) {
//         console.error("Error deleting product:", error);
//         res.status(400).send({ error: error.message });
//     }
// });

export default router;