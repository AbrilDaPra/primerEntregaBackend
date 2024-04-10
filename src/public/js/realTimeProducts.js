const socket = io.connect('http://localhost:8080');

//Función para agregar un producto al carrito
function addProductToCart(pid){
    //Realizo una solicitud POST al servidor para agregarlo al cart
    fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 1 })
    })
    .then(response => {
        if (response.ok) {
            console.log('Product added to cart successfully');
            socket.emit("addProductToCart", pid);
        } else {
            console.error('Failed to add product to cart');
        }
    })
    .catch(error => {
        console.error('Error adding product to cart:', error);
    });
}

//Función para eliminar un producto del carrito
function deleteProductFromCart(pid) {
    //Realizo una solicitud DELETE al servidor para eliminarlo del cart
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

//Función para manejar el envío del formulario para agregar un nuevo producto
function handleAddProductFormSubmit(event) {
    event.preventDefault();

    //Obtengo los datos del formulario
    const formData = new FormData(event.target);

    //Creo un objeto con los datos del formulario
    const newProduct = {};
    formData.forEach((value, key) => {
        newProduct[key] = value;
    });

    //Realizo una solicitud POST al servidor para agregar el nuevo producto
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => {
        if (response.ok) {
            console.log('New product added successfully');
        } else {
            console.error('Failed to add new product');
        }
    })
    .catch(error => {
        console.error('Error adding new product:', error);
    });
}

//Función para aplicar el filtro por categoría
function applyCategoryFilter() {
    const category = document.getElementById("categoryFilter").value;
    //Realizo una solicitud al servidor para obtener los productos filtrados por categoría
    fetch(`/api/products?category=${category}`)
        .then(response => response.json())
        .then(data => {
            //Actualizo la lista de productos en la interfaz de usuario
            updateProductList(data);
        })
        .catch(error => {
            console.error('Error applying category filter:', error);
        });
}

//Función para ordenar por precio
function applyPriceSort() {
    const sort = document.getElementById("priceSort").value;
    //Realizo una solicitud al servidor para obtener los productos ordenados por precio
    fetch(`/api/products?sort=${sort}`)
        .then(response => response.json())
        .then(data => {
            //Actualizo la lista de productos en la interfaz de usuario
            updateProductList(data);
        })
        .catch(error => {
            console.error('Error applying price sort:', error);
        });
}

//Función para ver los detalles de un producto
function viewDetails(productId) {
    //Redirijo a la página de detalles del producto con el ID proporcionado
    window.location.href = `/products/${productId}`;
}

//Función para eliminar un producto
function deleteProduct(productId) {
    //Realizo una solicitud al servidor para eliminar el producto con el ID proporcionado
    fetch(`/api/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Product deleted successfully');
            //Actualizo la lista de productos después de eliminar
            applyCategoryFilter();
        } else {
            console.error('Failed to delete product');
        }
    })
    .catch(error => {
        console.error('Error deleting product:', error);
    });
}

//Función para actualizar la lista de productos en la interfaz de usuario
function updateProductList(products) {
    const productList = document.getElementById("productList");
    //Limpio la lista de productos
    productList.innerHTML = "";
    //Itero sobre cada producto y agregarlo a la lista
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-details">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Category: ${product.category}</p>
                <button onclick="viewDetails('${product._id}')">View Details</button>
                <button onclick="deleteProduct('${product._id}')">Delete Product</button>
                <button onclick="addToCart('${product._id}')">Add to Cart</button>
            </div>
        `;
        productList.appendChild(productElement);
    });
}

//Llamo a la función applyCategoryFilter() cuando se carga la página
window.onload = function() {
    applyCategoryFilter();
};

//Escucho el evento submit del formulario de agregar producto
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
    addProductForm.addEventListener('submit', handleAddProductFormSubmit);
}

//Escucho el evento websocket cuando se agrega un producto al cart
socket.on("productAddedToCart", (productId) => {
    //Actualizo la interfaz de usuario para reflejar el cambio
    console.log(`Product ${productId} added to cart`);
})

//Escucho el evento de socket cuando se elimina un producto del carrito
socket.on("productDeletedFromCart", (productId) => {
    //Actualizo la interfaz de usuario para reflejar el cambio
    console.log(`Product ${productId} deleted from cart`);
});

//Exporto las funciones necesarias para su uso en otros archivos
export { addProductToCart, deleteProductFromCart };