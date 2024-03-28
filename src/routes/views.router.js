import { Router } from 'express';
import productsModel from '../dao/models/products.model.js';

const router = Router();
//Este archivo es para manejar las solicitudes de las vistas y redireccionarlas
//SIN LOGICA DE APLICACION O MANIPULACIÓN DE DATOS

router.get('/', (req, res) => {
    //Aca lo renderizo en home
    res.render('home');
});

router.get('/products', async (req, res) => {
    //El query porque va cambiando en el link ?limit=4
    let page = parseInt(req.query.page);
    //Si no hay página, trae la primera
    if(!page) page = 1;
    const result = await productsModel.paginate({}, {page, limit: 4, lean: true});
    console.log(result);

    //Variable boolean (true or false)
    result.isValid = page >= 1 && page <= result.totalPages;
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : "";

    res.render('products', {result});
})

router.get('/realtimeproducts', (req, res) => {
    //Aca lo renderizo en home
    res.render('realTimeProducts');
});

router.get('/chat', (req, res) => {
    res.render('chat');
})

export default router;