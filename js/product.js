// Global variables
let activeCart = {};
const elements = {
    itemName: $("#itemName"),
    itemDescription: $("#itemDescription"),
    itemPrice: $("#itemPrice"),
    thumbnailHolder: $("#thumbnailHolder"),
    caroHolder: $("#caroInner"),
    productColors: $("#itemColors"),
    selectedColor: $("#selectedColor"),
    productSizes: $("#productSizes"),
    selectedSize: $("#selectedSize"),
    qtyHolder: $("#qtyHolder"),
    addToCartBtn: $("#AddToCartBtn")
};

// Product display functions
function buildThumbNail(activeCart) {
    const product = getProductById(products, activeCart.productId);
    const thumbnails = product.images.map((image, index) => `
        <img src="${image}" onclick="changeActiveImage(${index})" 
             class="img-thumbnail page-link p-1 m-1 ${activeCart.caroImgActive === index ? 'border border-primary' : ''}" 
             alt="${product.name}"/>
    `).join('');
    elements.thumbnailHolder.html(thumbnails);
}

function buildCaro(activeCart) {
    const product = getProductById(products, activeCart.productId);
    const carouselItems = product.images.map((image, index) => `
        <div class="carousel-item ${index === activeCart.caroImgActive ? 'active' : ''}">
            <img src="${image}" class="d-block w-100" alt="${product.name}">
        </div>
    `).join('');
    elements.caroHolder.html(carouselItems);
}

function buildDetail(activeCart) {
    const product = getProductById(products, activeCart.productId);
    elements.itemName.html(product.name);
    elements.itemDescription.html(product.description);
    elements.itemPrice.html(product.price);

    if (product.type === 'regular') {
        if (product.colors) buildColors(product, activeCart);
        if (product.sizes) buildSizes(product, activeCart);
    } else if (product.type === 'appointment') {
        buildAppointmentSelector(product, activeCart);
    }
}

function buildAppointmentSelector(product, activeCart) {
    const dateInput = `
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Select Date</span>
            </div>
            <input type="text" id="appointmentDate" class="custom-select form-control date-input" placeholder="Select Date">
        </div>
    `;
    const timeSelect = `
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <label class="input-group-text" for="appointmentTime">Select Time</label>
            </div>
            <select id="appointmentTime" class="custom-select form-control" onchange="updateAppointmentTime(this.value)">
                <option value="" selected>Select Time</option>
                ${product.availableTimes.map(time => `<option value="${time}">${time}</option>`).join('')}
            </select>
        </div>
    `;

    elements.productColors.html(dateInput);
    elements.productSizes.html(timeSelect);

    // Initialize Flatpickr
    flatpickr("#appointmentDate", {
        enable: product.availableDates,
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr) {
            updateAppointmentDate(dateStr);
        }
    });
}



function updateAppointmentDate(date) {
    activeCart.appointmentDate = date;
}

function updateAppointmentTime(time) {
    activeCart.appointmentTime = time;
}

function buildColors(product, activeCart) {
    elements.selectedColor.html(activeCart.colorId ? 
        product.colors.find(c => c.id === activeCart.colorId).name : 
        "Select Color");

    const colors = product.colors.map(color => `
        <button class="btn rounded-circle ${color.id === activeCart.colorId ? 'border border-primary' : ''}" 
                onclick="changeSelectedColor(${color.id})"
                style="background-color: ${color.hash}; width: 40px; height: 40px">
        </button>
    `).join('');
    elements.productColors.html(colors);
}

function buildSizes(product, activeCart) {
    elements.selectedSize.html(activeCart.sizeId ? 
        product.sizes.find(s => s.id === activeCart.sizeId).name : 
        "Select Size");

    const sizes = product.sizes.map(size => `
        <button class="btn btn-info ${size.id === activeCart.sizeId ? 'active' : ''}"
                onclick="changeSelectedSize(${size.id})">
            ${size.name}
        </button>
    `).join('');
    elements.productSizes.html(sizes);
}

function buildQuantity(activeCart) {
    const product = getProductById(products, activeCart.productId);
    const minQuantity = product.minQuantity || 1;
    const maxQuantity = product.maxQuantity || 100;

    activeCart.quantity = Math.max(minQuantity, activeCart.quantity);

    const qty = `
        <button class="btn" onclick="changeQuantity(${activeCart.quantity - 1}, ${minQuantity}, ${maxQuantity})">&dArr;</button>
        <input id="quantitySelector" onchange="changeQuantity(this.value, ${minQuantity}, ${maxQuantity})" 
               value="${activeCart.quantity}" type="number" class="disabled form-control w-25" 
               min="${minQuantity}" max="${maxQuantity}">
        <button class="btn" onclick="changeQuantity(${activeCart.quantity + 1}, ${minQuantity}, ${maxQuantity})">&uArr;</button>
    `;
    elements.qtyHolder.html(qty);
}

// Event handler functions
function changeQuantity(amount, minQuantity, maxQuantity) {
    activeCart.quantity = Math.min(Math.max(parseInt(amount), minQuantity), maxQuantity);
    buildQuantity(activeCart);
}

function changeSelectedColor(id) {
    elements.productColors.tooltip('hide');
    activeCart.colorId = id;
    buildDetail(activeCart);
}

function changeSelectedSize(id) {
    elements.productSizes.tooltip('hide');
    activeCart.sizeId = id;
    buildDetail(activeCart);
}

function changeActiveImage(index) {
    activeCart.caroImgActive = index;
    buildCaro(activeCart);
    buildThumbNail(activeCart);
}

function addToCart(e) {
    const product = getProductById(products, activeCart.productId);

    if (product.type === 'regular') {
        if (product.colors && activeCart.colorId === null) {
            showTooltip(elements.productColors, "Select Color!");
            e.preventDefault();
            return;
        }

        if (product.sizes && activeCart.sizeId === null) {
            showTooltip(elements.productSizes, "Select Size!");
            e.preventDefault();
            return;
        }
    } else if (product.type === 'appointment') {
        if (!activeCart.appointmentDate || !activeCart.appointmentTime) {
            showTooltip(elements.productColors, "Select Date and Time!");
            e.preventDefault();
            return;
        }
    }

    // Create a new cart item
    const newCartItem = {
        productId: activeCart.productId,
        quantity: activeCart.quantity,
        colorId: activeCart.colorId,
        sizeId: activeCart.sizeId,
        appointmentDate: activeCart.appointmentDate,
        appointmentTime: activeCart.appointmentTime
    };

    // Add the new item to the cart
    cart.push(newCartItem);
    saveCart();
    updateCartCount();

    // Reset activeCart for the next item
    resetActiveCart();

    alert("Item added to cart!");
}

function resetActiveCart() {
    activeCart = {
        productId: null,
        quantity: 1,
        colorId: null,
        sizeId: null,
        appointmentDate: null,
        appointmentTime: null
    };
}

function showTooltip(element, message) {
    element.tooltip({
        title: message,
        trigger: 'manual',
    }).tooltip('show');
}

// Page refresh function
function refreshProductPage() {
    if (activeCart.productId) {
        buildThumbNail(activeCart);
        buildCaro(activeCart);
        buildDetail(activeCart);
        buildQuantity(activeCart);
    }
}

// Document ready function
$(() => {
    const productId = getDataFromUrl("id");

    activeCart = {
        productId,
        quantity: 1,
        colorId: null,
        sizeId: null,
        caroImgActive: 0,
    };

    refreshProductPage();

    $('#productImagesCarousel').on('slid.bs.carousel', function(data) {
        changeActiveImage(data.to);
    });

    elements.addToCartBtn.click(addToCart);
});

// Review functions
function loadReviews(productId) {
    // Mock data for reviews
    const mockReviews = [
        { id: 1, rating: 5, comment: "Great product!", author: "John Doe" },
        { id: 2, rating: 4, comment: "Good value for money", author: "Jane Smith" }
    ];

    const reviewsHtml = mockReviews.map(review => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</h5>
                <p class="card-text">${review.comment}</p>
                <footer class="blockquote-footer">${review.author}</footer>
            </div>
        </div>
    `).join('');

    $('#reviewsContainer').html(reviewsHtml);
}

$('#addReviewBtn').click(function() {
    alert("New product reviews disabled.");
});

// Wishlist functions
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

$('#addToWishlistBtn').click(function() {
    const productId = activeCart.productId;
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert("Product added to wishlist!");
    } else {
        alert("This product is already in your wishlist.");
    }
});

// Related products functions
function loadRelatedProducts(productId) {
    const relatedProducts = products
        .filter(p => p.id !== parseInt(productId))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const productsHtml = relatedProducts.map(product => `
        <div class="col-6 col-md-4">
            <div class="card">
                <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price.toFixed(2)}</p>
                    <a href="product.html?id=${product.id}" class="btn btn-primary">View Product</a>
                </div>
            </div>
        </div>
    `).join('');

    $('#relatedProductsContainer').html(productsHtml);
}

// Initialization on page load
$(function() {
    const productId = getDataFromUrl("id");

    // Load the current product details
    refreshProductPage();

    // Load reviews for the current product
    loadReviews(activeCart.productId);

    // Load related products
    loadRelatedProducts(productId);
});
