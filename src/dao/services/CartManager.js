import cartsModel from '../models/carts.model.js';

//agregar try catch
class CartManager {
    constructor(){}

    async createCart() {
        let result = await cartsModel.create({});
        return result;
    }

    async getCartById(cid) {
        let result = await cartsModel.findById(cid);
        return result;
    }

    async addProductToCart(cid, pid, quantity) {
        let cart = await cartsModel.findById(cid);
        let product = cart.products.find(product => product.product.toString() === pid);

        if(product) {
            product.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity})
        }
        
        return await cart.save();
    }

    async deleteProduct(cid, pid) {
        let cart = await cartsModel.findById(cid);
        let product = cart.products.findIndex((product) => product.product.toString() === pid);
    
        if(product === 0) {
            console.log("Product not founded")
        } else {
            cart.products.splice(product, 1);
        }

        return await cart.save();
    }
}

export default CartManager;