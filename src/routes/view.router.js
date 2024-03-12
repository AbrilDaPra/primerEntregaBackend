import { Router } from 'express';

const router = Router();
//Este archivo es para manejar las solicitudes de las vistas y redireccionarlas
//SIN LOGICA DE APLICACION O MANIP D DATOS

router.get('/', (req, res) => {
    //Aca lo renderizo en home
    res.render('home');
});

router.get('/realtimeproducts', (req, res) => {
    //Aca lo renderizo en home
    res.render('realTimeProducts');
});

export default router;