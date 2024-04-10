import ProductManager from '../dao/services/ProductManager.js';
import express from 'express';

const router = express.Router();
const productManager = new ProductManager();

//(GET) Mostrar todos los productos
router.get('/', async (req, res) => {
    try{
        const options = {
            limit: req.query.limit,
            page: req.query.page,
            sort: req.query.sort,
            query: req.query.query
        };  
        const products = await productManager.getProducts(options);
        res.json(products);
    } catch(error){
        console.error('Error trying to get products:', error);
        res.status(500).json({ error: 'Internal server error occurred while fetching products.' });
    }
});

//(GET) Mostrar producto que coincida con :id
router.get('/:id', async (req, res) => {
    try{
        const productId = req.params.id;
        const product = await productManager.getProductsById(productId);
        res.json(product);
    } catch(error){
        if (error.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Internal server error while trying to show product' });
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
        const newProduct = req.body;
        const product = await productManager.createProduct(newProduct);
        res.status(201).json(product);
    } catch(error){
        if(error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error while creating new product' });
        }
    }
});

//(PUT) Editar producto que coincida con :id
router.put('/:id/', async (req, res) => {
    try{
        const productId = req.params.id;
        const updatedFields = req.body;
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        res.json(updatedProduct);
    } catch(error){
        if (error instanceof Error) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error while updating product' });
        }
    } 
});

//(DELETE) Eliminar producto que coincida con :pid
router.delete('/:id/', async (req, res) => {
    try{
        const productId = req.params.id;
        const result = await productManager.deleteProduct(productId);
        res.json(result);
    } catch(error){
        if (error instanceof Error) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error while trying to delete product' });
        }
    } 
});

export default router;