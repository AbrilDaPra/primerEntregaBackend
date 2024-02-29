import path from 'path';
import { randomUUID }  from 'node:crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager{
    constructor(){
        this.carts = [];
    }

    async createCart(){
        let newCart =  {
            id: randomUUID(),
            products: [],
        };
        this.carts.push(newCart);
        return newCart;
    }

    async getCartById(cid){
        const finalCart = this.carts.find(cart => cart.id === cid);

        if(finalCart) {
            return finalCart.products;
        } else {
            throw new Error("Cart not found.");
        }
    }

    async addProductToCart(cid, pid){
        const cart = this.carts.find(cart => cart.id === cid);

        if(!cart) {
            throw new Error('Cart not found.')
        }

        //Verifico si el producto ya existe en el carrito
        const existingProduct = cart.products.find(product => product.id === pid);
        if (existingProduct) {
            //Si ya existe, incremento la cantidad
            existingProduct.quantity++;
        } else {
            //Si no existe, agrego cantidad 1
            cart.products.push({
                id: pid,
                quantity: 1
            });
        }

        return "Product added to cart."
    }
}

export default CartManager;