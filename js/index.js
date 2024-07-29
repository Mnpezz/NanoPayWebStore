function buildProductCols(products = []) {
    const allExclusiveUnlocked = localStorage.getItem('allExclusiveUnlocked') === 'true';
    let str = '';
    products.forEach(prod => {
        const productUrl = `product.html?id=${prod.id}`;
        const productImage = prod.images[0];
        let productPrice;
        if (prod.type === 'lease') {
            productPrice = `$${prod.basePrice.toFixed(2)} per day`;
        } else {
            productPrice = `$${prod.price.toFixed(2)}`;
        }

        str += `
            <div class="col-sm-6 col-md-3 mb-4">
                <div class="product-item ${prod.type === 'exclusive' ? 'exclusive-product' : ''}" data-product-id="${prod.id}">
                    <a href="${productUrl}" class="product-link">
                        <img src="${productImage}" alt="" class="img-fluid rounded-lg product-image mb-2 ${prod.type === 'exclusive' && !allExclusiveUnlocked ? 'blurred' : ''}">
                        <p class="text-center product-price">${productPrice}</p>
                        <p class="text-center product-name">${prod.name}</p>
                        ${prod.type === 'exclusive' ? `<span class="exclusive-badge">${allExclusiveUnlocked ? 'Exclusive!' : 'Exclusive'}</span>` : ''}
                    </a>
                </div>
            </div>
        `;
    });
    return str;
}

function updateUnlockedProducts() {
    const allExclusiveUnlocked = localStorage.getItem('allExclusiveUnlocked') === 'true';
    
    products.forEach(prod => {
        if (prod.type === 'exclusive') {
            const productItem = $(`.product-item[data-product-id="${prod.id}"]`);
            if (allExclusiveUnlocked) {
                productItem.find('.product-image').removeClass('blurred');
                productItem.find('.exclusive-badge').text('Exclusive!');
                
                // Update product details if they exist
                if (prod.colors) {
                    productItem.find('.product-colors').removeClass('d-none');
                }
                if (prod.sizes) {
                    productItem.find('.product-sizes').removeClass('d-none');
                }
                if (prod.availableDates) {
                    productItem.find('.product-dates').removeClass('d-none');
                }
            }
        }
    });
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
    products.forEach(prod => {
        if (prod.type === 'exclusive' && localStorage.getItem(`unlocked_${prod.id}`) === 'true') {
            $(`.product-item[data-product-id="${prod.id}"] .product-image`).removeClass('blurred');
            $(`.product-item[data-product-id="${prod.id}"] .exclusive-badge`).text('Exclusive!');
        }
    });
    if (localStorage.getItem('allExclusiveUnlocked') === 'true') {
        updateUnlockedProducts();
    }
});

window.addEventListener('allExclusiveUnlocked', function() {
    updateUnlockedProducts();
});

// Listen for custom event 'productUnlocked'
window.addEventListener('productUnlocked', function(event) {
    updateUnlockedProducts(event.detail.productId);
});

window.addEventListener('message', function(event) {
    if (event.data.type === 'productUnlocked') {
        updateUnlockedProducts(event.data.productId);
    }
});
