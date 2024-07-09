function buildProductCols(products = []) {
    let str = '';
    products.forEach(prod => {
        str += `
            <div class="col-sm-6 col-md-3 mb-4">
                <div class="product-item">
                    <a href="${generateProductUrl(prod)}" class="product-link">
                        <img src="${prod.images[0]}" alt="" class="img-fluid rounded-lg product-image mb-2">
                        <p class="text-center product-price">$${prod.price.toFixed(2)}</p>
                        <p class="text-center product-name">${prod.name}</p>
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
            $(this).find('.product-image').css('transform', 'scale(1.05)');
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
