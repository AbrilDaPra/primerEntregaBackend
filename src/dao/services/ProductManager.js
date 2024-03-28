import productsModel from '../models/products.model.js';

//agregar try catch
// usar const y retornar las variables
class ProductManager {
    constructor(){}

    async getProducts(limit) {
        let result = await productsModel.find().limit(limit);
        return result;
    }

    async getProductsById(id) {
        let result = await productsModel.findById(id);
        return result;
    }

    async getByBrand(brand) {
        let result = await productsModel.find({brand: brand});
        return result;
    }

    async addProduct(product) {
        let result = await productsModel.create(product);
        return result;
    }

    async updateProduct(id, product) {
        let result = await productsModel.updateOne({_id: id}, {$set: product});
        return result;
    }

    async deleteProduct(id) {
        let result = await productsModel.deleteOne({_id: id});
        return result;
    }  
}

export default ProductManager;