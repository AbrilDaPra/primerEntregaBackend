import { Router } from 'express';
import CartManager from '../dao/services/CartManager.js';
import CartsModel from '../dao/models/carts.model.js';

const router = Router();
const cartManager = new CartManager();

//(POST) Crear un nuevo carrito
router.post('/', async (req, res) => {
    try{
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch(error){
        res.status(500).json({ error: 'Internal server error while trying to create a new cart' });
    }
});

//(GET) Listar los productos del carrito que corresponda a su id de carrito
router.get('/:cid/', async (req, res) => {
    try{
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json(cart);
    } catch(error){
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error while trying to show products in cart' });
    }
})

//(POST) Agregar un producto nuevo al carrito seleccionado
router.post('/:cid/product/:pid', async (req, res) => {
    try{
        const { pid, cid } = req.params;
        const { quantity } = req.body;

        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity || 1);
        res.json({ message: 'Product added to cart successfully', updatedCart });
    } catch(error){
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error while trying to add product to cart' });
    }
});

//(DELETE) Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try{
        const { pid, cid } = req.params;
        const updatedCart = await cartManager.deleteProduct(cid, pid);

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
        
        //Verifico si el cart existe
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        //Actualizo los productos del carrito
        cart.products = products;
        const updatedCart = await cartManager.updateCart(cid, cart);

        res.json(updatedCart);
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

        //Verifico si el cart existe
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        
        //Encuentro el index del producto en el cart
        const productIndex = cart.products.findIndex(product => product._id.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        //Actualizo la cantidad del producto en el cart
        cart.products[productIndex].quantity = quantity;

        //Guardo el cart actualizado en la DB
        await cartManager.updateCart(cid, cart);

        //Respondo con el cart actualizado
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

        //Busco y elimino el cart por su ID
        const deletedCart = await cartManager.deleteCart(cid);
        if (!deletedCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        //Respondo con mensaje de exito
        res.json({ message: 'Cart deleted successfully' });
  } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ error: 'Internal server error while trying to delete cart' });
  }
});

export default router;