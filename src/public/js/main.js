const socket = io();

socket.emit('message', 'Connected to websocket');

// document.addEventListener('DOMContentLoaded', () => {
//     const socket = io();
//     console.log("Client side connected!");

//     socket.on('connect', () => {
//         socket.emit('getProducts');
//     });
    
//     socket.on('products', (productsData) => {
//         console.log("Products data:", productsData);

//         const realTimeProducts = document.getElementById("realTimeProducts");
//         if(!realTimeProducts) {
//             console.error("Element with ID 'realTimeProducts' not found");
//             return;
//         }
        
//         const newDataHtml = productsData.map((product) => {
//             return  `<li>
//                 ${product.title} - 
//                 ${product.description} - 
//                 ${product.code} - 
//                 ${product.price} - 
//                 ${product.stock} - 
//                 ${product.category}
//             </li>`;
//         });
    
//         console.log("New data HTML:", newDataHtml);
    
//         realTimeProducts.innerHTML = newDataHtml.join('');
//     })
// });

