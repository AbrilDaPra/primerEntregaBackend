import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';

const router = Router();
const productsPath = path.join(__dirname, 'database', 'products.json');

//Este archivo es para manejar las solicitudes de las vistas y redireccionarlas
//SIN LOGICA DE APLICACION O MANIP D DATOS

router.get('/', (req, res) => {
    //Leo los datos de productos desde el JSON
    // const productsData = fs.readFileSync(productsPath, 'utf-8');
    // const products = JSON.parse(productsData);

    //Aca lo renderizo en home
    res.render('home', { products: products });
});

router.get('/realtimeproducts', (req, res) => {
    //Leo los datos de productos desde el JSON
    // const productsData = fs.readFileSync(productsPath, 'utf-8');
    // const products = JSON.parse(productsData);

    //Aca lo renderizo en home
    res.render('realTimeProducts');
});

export default router;