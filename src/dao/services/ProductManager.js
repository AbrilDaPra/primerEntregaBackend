import mongoose from 'mongoose';
import productsModel from '../models/products.model.js';

class ProductManager {
    constructor(){

    }

    getProducts = async(limit) => {
        let result = await productsModel.find().limit(limit);
        return result;
    }

    getProductsById = async(id) => {
        let result = await productsModel.findById(id);
        return result;
    }

    getByBrand = async() => {
        let result = await productsModel.find({brand: brand});
        return result;
    }

    addProduct = async(product) => {
        let result = await productsModel.create(product);
        return result;
    }

    updateProduct = async(id, product) => {
        let result = await productsModel.updateOne({_id: id}, {$set: productData});
        return result;
    }

    deleteProduct = async(id) => {
        let result = await productsModel.deleteOne({_id: id});
        return result;
    }  
}

export default ProductManager;



// MANAGER DE FS

// import { randomUUID }  from 'node:crypto';
// import fs from 'fs/promises';

// let products = [];
// class ProductManager {
//     constructor(){
//         this.products = [];
//         this.productsFilePath = 'database/products.json';
//     }

//     async loadProductsFromFile() {
//         try{
//             const productsData = await fs.readFile(this.productsFilePath, 'utf-8');
//             this.products = JSON.parse(productsData);
//         } catch (err) {
//             console.error('Error loading products from file:', err);
//         }
//     }

//     async saveProductsToFile() {
//         try{
//             await fs.writeFile(this.productsFilePath, JSON.stringify(this.products, null, 2));
//         } catch (err) {
//             console.error('Error saving products to file:', err);
//         }
//     }

//     async getProducts() {
//         return this.loadProductsFromFile();
//         return this.products;
//     }

//     async getProductsById(productId) {
//         const foundProduct = this.products.find(product => product.id === productId);

//         if(foundProduct) {
//             return foundProduct;
//         } else {
//             return null;
//         }
//     }

//     async addProduct(product) {
//         try{
//             await this.loadProductsFromFile();
//             if(
//                 this.products.some(
//                     (existingProduct) => existingProduct.code === product.code
//                 )
//             ) {
//                 throw new Error ("A product already exists with that code.");
//             }

//             if(
//                 !product.title || 
//                 !product.description || 
//                 !product.code || 
//                 !product.price || 
//                 !product.status || 
//                 !product.stock || 
//                 !product.category
//             ) {
//                 throw new Error ("All fields must be completed.");
//             }

//             const newProduct = {
//                 id: randomUUID(),
//                 ...product
//             };

//             this.products.push(newProduct);

//             await this.saveProductsToFile();

//             return "The product was added correctly."
//         } catch (err) {
//             throw new Error("There was an error when trying to add the product to the cart.");
//         }
//     }

//     async updateProduct(productId, updatedFields){
//         const indexToUpdate = this.products.findIndex(product => product.id === productId);

//         if(indexToUpdate !== -1) {
//             Object.assign(this.products[indexToUpdate], updatedFields);
//             await this.saveProductsToFile();
//             console.log("Product updated correctly.")
//         } else {
//             throw new Error("A product with the specified ID was not found.")
//         }
//     }

//     async deleteProduct(productId) {
//         try{
//             const indexToDelete = this.products.findIndex(product => product.id === productId);

//             if(indexToDelete !== -1) {
//                 this.products.splice(indexToDelete, 1);
//                 await this.saveProductsToFile();
//                 console.log("Product deleted correctly.");
//             } else {
//                 console.error("Could not delete because a product with that ID was not found.");
//             } 
//         } catch (err) {
//             console.error("Error when trying to delete the product:", err.message);
//         }
//     }
// }

// export const addProduct = (newProduct) => {
//     products.push(newProduct);
// }

// export const getAllProducts = () => {
//     return products;
// }

// export default ProductManager;