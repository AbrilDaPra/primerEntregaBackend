const realTimeProducts = document.getElementById("realTimeProducts");

socket.on('products', (productsData) => {
    const newDataHtml = productsData.map((product) => {
        return  `<li>
            ${product.title} - 
            ${product.description} - 
            ${product.code} - 
            ${product.price} - 
            ${product.stock} - 
            ${product.category}
        </li>`;
    });

    realTimeProducts.innerHTML = newDataHtml;
})