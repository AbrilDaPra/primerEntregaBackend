import { Router } from 'express';
import productsModel from '../dao/models/products.model.js';

const router = Router();
//Este archivo es para manejar las solicitudes de las vistas y redireccionarlas
//SIN LOGICA DE APLICACION O MANIPULACIÓN DE DATOS

router.get('/', (req, res) => {
    //Aca lo renderizo en home
    res.render('home');
});

//Ruta para mostrar todos los productos con paginacion
router.get('/products', async (req, res) => {
    try{
        //Pagina por defecto
        let page = parseInt(req.query.page) || 1;
        //Cantidad de productos por pagina
        const limit = 10;
        
        //Consulto productos desde la DB con paginacion
        const result = await productsModel.paginate({}, { page, limit, lean: true });
        
        //Determino si hay una pagina siguiente y su enlace correspondiente
        const nextPage = result.hasNextPage ? `/products?page=${result.nextPage}` : null;

        //Renderizo la vista 'products' y paso los datos de los productos
        res.render('products', {products: result.docs, nextPage});
    } catch(error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error while trying to show products' });
    }
});

//Ruta para mostrar detalles completos del producto
router.get('/products/:productId', async (req, res) => {
    try{
        const productId = req.params.productId;
        //Consulto el producto desde la DB por su ID
        const product = await productsModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        //Renderizo la vista 'productDetails' y paso los detalles del producto
        res.render('productDetails', { product });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Internal server error while trying to show product details' });
    }
});

//Ruta para agregar un producto al carrito directamente
router.post('/products/:productId/add-to-cart', async (req, res) => {
    try {
        const productId = req.params.productId;
        //Verifico si existe un carrito activo, sino lo creo
        let userCart = await CartModel.findOne({ active: true });
        if (!userCart) {
            userCart = new CartModel({ products: [] });
        }

        //Agrego el producto al carrito
        userCart.products.push({ product: productId, quantity: 1 });

        //Guardo el carrito actualizado en la base de datos
        await userCart.save();

        //Mensaje de exito
        res.json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/realtimeproducts', (req, res) => {
    //Aca lo renderizo en home
    res.render('realTimeProducts');
});

router.get('/chat', (req, res) => {
    res.render('chat');
})

export default router;