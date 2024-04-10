import Product from '../models/products.model.js';

class ProductManager {
    constructor(){}

    async getProducts({ limit = 10, page = 1, sort = null, query = null, category, available }) {
        try{
            //Opciones para la consulta a la DB
            const options = {
                limit: parseInt(limit),
                skip: parseInt(page),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null,
                filter: query ? { category: query } : {}
            };

            //Consulta a la DB con paginacion
            const products = await Product.paginate({}, options);

            //Calculo el total de paginas
            const totalPages = Math.ceil(products.total / options.limit);

            //Calculo el total de las paginas
            const response = {
                status: 'success',
                payload: products.docs,
                totalPages: totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
                nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null
            }

            return response;
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }

    async getProductsById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error fetching product by ID: ' + error.message);
        }
    }

    async getByBrand(brand) {
        try {
            const result = await Product.find({ brand });
            return result;
        } catch (error) {
            throw new Error('Error fetching products by brand: ' + error.message);
        }
    }

    async addProduct(newProduct) {
        try {
            const product = await Product.create(newProduct);
        return product;
        } catch (error) {
            if (error.name === 'ValidationError') {
                const missingFields = Object.keys(error.errors).join(', ');
                const errorMessage = `Missing required fields: ${missingFields}`;
                throw new Error(errorMessage);
            }
            throw new Error('Internal server error while creating new product: ' + error.message);
        }
    }

    async updateProduct(id, updateFields) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error('Product not found');
            }
            return { message: 'Product deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }  
}

export default ProductManager;