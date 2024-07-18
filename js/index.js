function buildProductCols(products = []) {
    let str = '';
    products.forEach(prod => {
        const productUrl = prod.type === 'exclusive' ? `product.html?id=${prod.id}&exclusive=true` : generateProductUrl(prod);
        const productImage = prod.type === 'exclusive' ? prod.images[0] : prod.images[0]; // Use blurred image for exclusive products
        const productPrice = prod.type === 'exclusive' ? `Unlock for $${prod.unlockPrice.toFixed(2)}` : `$${prod.price.toFixed(2)}`;
        
        str += `
            <div class="col-sm-6 col-md-3 mb-4">
                <div class="product-item ${prod.type === 'exclusive' ? 'exclusive-product' : ''}">
                    <a href="${productUrl}" class="product-link">
                        <img src="${productImage}" alt="" class="img-fluid rounded-lg product-image mb-2 ${prod.type === 'exclusive' ? 'blurred' : ''}">
                        <p class="text-center product-price">${productPrice}</p>
                        <p class="text-center product-name">${prod.name}</p>
                        ${prod.type === 'exclusive' ? '<span class="exclusive-badge">Exclusive</span>' : ''}
                    </a>
                </div>
            </div>
        `;
    });
    return str;
}

$(() => {
    let productContainer = $("#productsContainer");
    let cols = buildProductCols(products);
    productContainer.html(cols);

    // Add hover effects
    $('.product-item').hover(
        // Mouse enter
        function() {
            $(this).css({
                'box-shadow': '0 4px 8px rgba(0,0,0,0.1)',
                'transform': 'translateY(-5px)'
            });
            $(this).find('.product-image').css('transform', 'scale(1.15)');
            $(this).find('.product-name').css('color', '#007bff');
        },
        // Mouse leave
        function() {
            $(this).css({
                'box-shadow': 'none',
                'transform': 'translateY(0)'
            });
            $(this).find('.product-image').css('transform', 'scale(1)');
            $(this).find('.product-name').css('color', '');
        }
    );
});
