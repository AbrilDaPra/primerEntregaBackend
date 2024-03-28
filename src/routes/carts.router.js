import { Router } from 'express';
import CartManager from '../dao/services/CartManager.js';
import CartsModel from '../dao/models/carts.model.js';

const router = Router();
const cartManager = new CartManager();

//(POST) Crear un nuevo carrito
router.post('/', async (req, res) => {
    try{
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
});

//(GET) Listar los productos del carrito que corresponda a su id de carrito
router.get('/:cid/', async (req, res) => {
    try{
        const { cid } = req.params;
        const cart = await CartsModel.findById(cid).populate('products');
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json(cart);
    } catch(error){
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//(POST) Agregar un producto nuevo al carrito seleccionado
router.post('/:cid/product/:pid', async (req, res) => {
    try{
        const pid = req.params.pid;
        const cid = req.params.cid;
        const result = await cartManager.addProductToCart(cid, pid);
        res.json(result);
    } catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
});

//(DELETE) Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try{
        const pid = req.params.pid;
        const cid = req.params.cid;

        //Busco el carrito por su id
        const cart = await CartsModel.findById(cid);
        //Si no encuentro el carrito
        if(!cart) {
            return res.status(404).json({ error: ' Cart not found' });
        }
        //Encuentro el index del producto en productos
        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);
        
        //Si no encuentro el producto dentro del carrito
        if(productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        //Elimino el producto del carrito
        cart.products.splice(productIndex, 1);
        
        //Guardo los cambios en la DB
        await cart.save();
        
        //Respondo con exito
        res.status(204).send();
    } catch(error){
        console.error('Error deleting product from cart:', error)
        res.status(500).json({ error: 'Internal server error while trying to delete a product from cart' });
    }
});

//(PUT) Actualizo carrito con arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await CartsModel.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json(cart);
      } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal server error while trying to update cart with products' });
      }
});

//(PUT) Actualizo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await CartsModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const productIndex = cart.products.findIndex(p => p._id.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error updating product quantity in cart:', error);
        res.status(500).json({ error: 'Internal server error while trying to update product in quantity' });
    }
});

//(DELETE) Elimina todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartsModel.findByIdAndDelete(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json({ message: 'Cart deleted successfully' });
  } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ error: 'Internal server error while trying to delete cart' });
  }
});

// router.post('/', async (req, res) => {
//     //(POST) Crear un nuevo carrito
//     try{
//         const newCart = await cartManager.createCart();
//         res.status(201).send(newCart);
//     } catch (err) {
//         console.error("Error creating cart:", err);
//         res.status(500).send({ error: "Internal Server Error." });
//     }
// });

// router.get('/:cid/', async (req, res) => {
//     //(GET) Listar los productos del carrito que corresponda a su id de carrito
//     try{
//         const cid = req.params.cid;
//         const cartProducts = await cartManager.getCartById(cid);
//         res.send(cartProducts);
//     } catch (err) {
//         console.error("Error loading cart products:", err);
//         res.status(404).send({ error: err.message });
//     }
// });

// router.post('/:cid/product/:pid', async (req, res) => {
//     //(POST) Agregar un producto nuevo al carrito seleccionado
//     try{
//         //Obtengo el id de producto y carrito
//         const pid = req.params.pid;
//         const cid = req.params.cid;

//         const message = await cartManager.addProductToCart(cid, pid);
//         // io.emit('productAddedToCart', { cartId: cid, productId: pid });
//         res.send({ message });
//     } catch (err) {
//         console.error("Error adding product to cart:", err);
//         res.status(404).send({ error: err.message });
//     }
// });

export default router;