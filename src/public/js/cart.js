const socket = io.connect('http://localhost:8080');

//Función para vaciar el carrito
function clearCart() {
    //Realizo una solicitud DELETE al servidor para vaciar el carrito
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Cart cleared successfully');
        } else {
            console.error('Failed to clear cart');
        }
    })
    .catch(error => {
        console.error('Error clearing cart:', error);
    });
}

//Función para eliminar un producto del carrito
function deleteProductFromCart(pid) {
    //Realizo una solicitud DELETE al servidor para eliminar un producto del carrito
    fetch(`/api/carts/${cartId}/products/${pid}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Product deleted from cart successfully');
        } else {
            console.error('Failed to delete product from cart');
        }
    })
    .catch(error => {
        console.error('Error deleting product from cart:', error);
    });
}

//Escucho el evento websocket cuando se agrega un producto al carrito
socket.on("productAddedToCart", (productId) => {
    //Actualizo la interfaz de usuario para reflejar el cambio
    console.log(`Product ${productId} added to cart`);
});

//Escucho el evento websocket cuando se elimina un producto del carrito
socket.on("productDeletedFromCart", (productId) => {
    //Actualizo la interfaz de usuario para reflejar el cambio
    console.log(`Product ${productId} deleted from cart`);
});

//Exporto las funciones necesarias para su uso en otros archivos
export { clearCart, deleteProductFromCart };