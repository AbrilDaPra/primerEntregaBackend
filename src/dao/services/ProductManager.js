import productsModel from '../models/products.model.js';

class ProductManager {
    constructor(){}

    async getProducts(limit) {
        try{
            let result = await productsModel.find().limit(limit);
            return result;
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }

    async getProductsById(id) {
        try {
            let result = await productsModel.findById(id);
            return result;
        } catch (error) {
            throw new Error('Error fetching product by ID: ' + error.message);
        }
    }

    async getByBrand(brand) {
        try {
            let result = await productsModel.find({brand: brand});
            return result;
        } catch (error) {
            throw new Error('Error fetching products by brand: ' + error.message);
        }
    }

    async addProduct(product) {
        try {
            let result = await productsModel.create(product);
            return result;
        } catch (error) {
            throw new Error('Error adding product: ' + error.message);
        }
    }

    async updateProduct(id, product) {
        try {
            let result = await productsModel.updateOne({_id: id}, {$set: product});
            return result;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            let result = await productsModel.deleteOne({_id: id});
            return result;
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }  
}

export default ProductManager;