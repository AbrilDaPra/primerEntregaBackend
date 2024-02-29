import { Router } from 'express';
import CartManager from '../../CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.post('/api/carts/', async (req, res) => {
    //(POST) Crear un nuevo carrito
    try{
        const newCart = await cartManager.createCart();
        res.status(201).send(newCart);
    } catch (err) {
        console.error("Error creating cart:", err);
        res.status(500).send({ error: "Internal Server Error." });
    }
});

router.get('/api/carts/:cid/', async (req, res) => {
    //(GET) Listar los productos del carrito que corresponda a su id de carrito
    try{
        const cid = req.params.cid;
        const cartProducts = await cartManager.getCartById(cid);
        res.send(cartProducts);
    } catch (err) {
        console.error("Error loading cart products:", err);
        res.status(404).send({ error: err.message });
    }
});

router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    //(POST) Agregar un producto nuevo al carrito seleccionado
    try{
        //Obtengo el id de producto y carrito
        const pid = req.params.pid;
        const cid = req.params.cid;

        const message = await cartManager.addProductToCart(cid, pid);
        res.send({ message });
    } catch (err) {
        console.error("Error adding product to cart:", err);
        res.status(404).send({ error: err.message });
    }
});

export default router;