import { randomUUID }  from 'node:crypto';

class ProductManager {
    constructor(){
        this.products = [];
    }

    async getProducts() {
        return this.products;
    }

    async getProductsById(productId) {
        const foundProduct = this.products.find(product => product.id === productId);

        if(foundProduct) {
            return foundProduct;
        } else {
            return null;
        }
    }

    async addProduct(product) {
        try{
            if(this.products.some(existingProduct => existingProduct.code === product.code)) {
                throw new Error ("A product already exists with that code.");
            }

            if(!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
                throw new Error ("All fields must be completed.");
            }

            const newProduct = {
                id: randomUUID(),
                ...product
            };

            this.products.push(newProduct);
            return "The product was added correctly."
        } catch (err) {
            throw new Error("There was an error when trying to add the product to the cart.");
        }
    }

    async updateProduct(productId, updatedFields){
        const indexToUpdate = this.products.findIndex(product => product.id === productId);

        if(indexToUpdate !== -1) {
            Object.assign(this.products[indexToUpdate], updatedFields);
            console.log("Product updated correctly.")
        } else {
            throw new Error("A product with the specified ID was not found.")
        }
    }

    async deleteProduct(productId) {
        try{
            const indexToDelete = this.products.findIndex(product => product.id === productId);

            if(indexToDelete !== -1) {
                this.products.splice(indexToDelete, 1);
                console.log("Product deleted correctly.");
            } else {
                console.error("Could not delete because a product with that ID was not found.");
            } 
        } catch (err) {
            console.error("Error when trying to delete the product:", err.message);
        }
    }
}

export default ProductManager;