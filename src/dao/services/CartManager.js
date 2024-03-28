import cartsModel from '../models/carts.model.js';

class CartManager {
    constructor(){}

    async createCart() {
        try {
            let result = await cartsModel.create({});
            return result;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async getCartById(cid) {
        try {
            let result = await cartsModel.findById(cid);
            return result;
        } catch (error) {
            throw new Error('Error fetching cart by ID: ' + error.message);
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
            let cart = await cartsModel.findById(cid);
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
            let cart = await cartsModel.findById(cid);
            let productIndex = cart.products.findIndex((product) => product.product.toString() === pid);
        
            if(productIndex === -1) {
                console.log("Product not found");
            } else {
                cart.products.splice(productIndex, 1);
            }
    
            return await cart.save();
        } catch (error) {
            throw new Error('Error deleting product from cart: ' + error.message);
        }
    }
}

export default CartManager;