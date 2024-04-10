import Cart from '../models/carts.model.js';

class CartManager {
    constructor(){}

    async createCart() {
        try {
            const newCart = await Cart.create({});
            return newCart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async getCartById(cid) {
        try {
            const cart = await Cart.findById(cid).populate('products');
        return cart;
        } catch (error) {
            throw new Error('Error fetching cart by ID: ' + error.message);
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
            let cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error('Cart not found');
            }

            let product = cart.products.find(product => product.product.toString() === pid);

            if(product) {
                product.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity})
            }
            
            return await cart.save();
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }

    async deleteProduct(cid, pid) {
        try {
            let cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error('Cart not found');
            }

            let productIndex = cart.products.findIndex((product) => product.product.toString() === pid);
        
            if(productIndex === -1) {
                throw new Error('Product not found in cart');
            }

            cart.products.splice(productIndex, 1);
    
            return await cart.save();
        } catch (error) {
            throw new Error('Error deleting product from cart: ' + error.message);
        }
    }

    async updateCart(cid, cart) {
        try{
            const updatedCart = await Cart.findByIdAndUpdate(cid, cart, { new: true });
            return updatedCart;
        } catch (error) {
            throw new Error('Error updating cart: ' + error.message);
        }
    }
}

export default CartManager;