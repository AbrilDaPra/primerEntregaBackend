import cartsModel from '../models/carts.model.js';

class CartManager {
    constructor(){

    }

    createCart = async() => {
        let result = await cartsModel.create({});
        return result;
    }

    getCartById = async(id) => {
        let result = await cartsModel.findById(id);
        return result;
    }

    addProductToCart = async(cid, pid, quantity) => {
        let cart = await cartsModel.findById(cid);
        let product = cart.products.find((product) => product.product.toString() === pid);

        if(product) {
            product.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity})
        }
        
        return await cart.save();
    }

    deleteProduct = async(cid, pid) => {
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



// MANAGER DE FS

// import { randomUUID }  from 'node:crypto';

// class CartManager{
//     constructor(){
//         this.carts = [];
//     }

//     async createCart(){
//         let newCart =  {
//             id: randomUUID(),
//             products: [],
//         };
//         this.carts.push(newCart);
//         return newCart;
//     }

//     async getCartById(cid){
//         const finalCart = this.carts.find(cart => cart.id === cid);

//         if(finalCart) {
//             return finalCart.products;
//         } else {
//             throw new Error("Cart not found.");
//         }
//     }

//     async addProductToCart(cid, pid){
//         const cart = this.carts.find(cart => cart.id === cid);

//         if(!cart) {
//             throw new Error('Cart not found.')
//         }

//         //Verifico si el producto ya existe en el carrito
//         const existingProduct = cart.products.find(product => product.id === pid);
//         if (existingProduct) {
//             //Si ya existe, incremento la cantidad
//             existingProduct.quantity++;
//         } else {
//             //Si no existe, agrego cantidad 1
//             cart.products.push({
//                 id: pid,
//                 quantity: 1
//             });
//         }

//         return "Product added to cart.";
//     }
// }

// export default CartManager;