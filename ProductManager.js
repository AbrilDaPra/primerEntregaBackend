import path from 'path';
import { randomUUID }  from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const pathProducts = path.join(__dirname, './src/database/products.json');

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
                throw new Error ("Ya existe un producto con ese código.");
            }

            if(!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
                throw new Error ("Todos los campos deben ser completados.");
            }

            const newProduct = {
                id: randomUUID(),
                ...product
            };

            this.products.push(newProduct);
            return "El producto fue agregado correctamente."
        } catch (err) {
            throw new Error("Hubo un error al intentar agregar el producto.");
        }
    }

    async updateProduct(productId, updatedFields){
        const indexToUpdate = this.products.findIndex(product => product.id === productId);

        if(indexToUpdate !== -1) {
            Object.assign(this.products[indexToUpdate], updatedFields);
            console.log("Producto actualizado correctamente.")
        } else {
            throw new Error("No se encontró un producto con el ID especificado.")
        }
    }

    async deleteProduct(productId) {
        try{
            const indexToDelete = this.products.findIndex(product => product.id === productId);

            if(indexToDelete !== -1) {
                this.products.splice(indexToDelete, 1);
                console.log("Producto eliminado correctamente");
            } else {
                console.error("No se pudo eliminar porque no se encontró un producto con ese ID");
            } 
        } catch (err) {
            console.error("Error al intentar eliminar el producto:", err.message);
        }
    }
}

export default ProductManager;