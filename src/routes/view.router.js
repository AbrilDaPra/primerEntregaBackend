import { Router } from 'express';
// import { Server } from 'socket.io';

const router = Router();

//Este archivo es para manejar las solicitudes de las vistas y redireccionarlas
//SIN LOGICA DE APLICACION O MANIP D DATOS

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// router.post('/addproduct', (req, res) => {
//     //Lógica para agregar un producto al carrito no va aca

//     //Emito el evento websocket 'productAdded'
//     req.io.emit('productAdded', newProduct);

//     res.redirect('/realtimeproducts');
// });

// router.post('/deleteproduct', (req, res) => {
//     //logica para eliminar no va aca
//     res.io.emit('productDeleted', productId);

//     res.redirect('/realtimeproducts');
// });

export default router;