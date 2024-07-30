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
    const isExclusive = product.type === 'exclusive';
    const isUnlocked = sessionStorage.getItem(`unlocked_${product.id}`) === 'true';

    if (isExclusive && !isUnlocked) {
        elements.thumbnailHolder.empty().hide(); // Clear and hide the thumbnail holder
        return;
    }

    const thumbnails = product.images.map((image, index) => `
        <img src="${image}" onclick="changeActiveImage(${index})"
             class="img-thumbnail page-link p-1 m-1 ${activeCart.caroImgActive === index ? 'border border-primary' : ''}"
             alt="${product.name}" />
    `).join('');
    elements.thumbnailHolder.html(thumbnails).show(); // Show the thumbnail holder
}

function buildCaro(activeCart) {
    const product = getProductById(products, activeCart.productId);
    const isExclusive = product.type === 'exclusive' || (product.type === 'lease' && product.exclusive);
    const isUnlocked = sessionStorage.getItem(`unlocked_${product.id}`) === 'true';

    let imagesToShow = isExclusive && !isUnlocked ? product.images.slice(0, 1) : product.images;

    const carouselItems = imagesToShow.map((image, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${image}" class="d-block w-100 ${isExclusive && !isUnlocked && index === 0 ? 'blurred' : ''}" alt="${product.name}">
        </div>
    `).join('');

    elements.caroHolder.html(carouselItems);

    // Reinitialize the carousel after updating it
    if ($('.carousel').length) {
        $('.carousel').carousel('dispose');
        $('.carousel').carousel();
    }
}

function buildLeaseSelector(product, activeCart) {
    const startDateInput = `
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">Start Date:</span>
            </div>
            <input type="text" id="leaseStartDate" class="custom-select form-control date-input" placeholder="Select Start Date">
        </div>
    `;
    const endDateInput = `
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">End Date:</span>
            </div>
            <input type="text" id="leaseEndDate" class="custom-select form-control date-input" placeholder="Select End Date">
        </div>
    `;

    elements.productColors.html(startDateInput);
    elements.productSizes.html(endDateInput);

    // Initialize Flatpickr for both start and end dates
    flatpickr("#leaseStartDate", {
        minDate: "today",
        onChange: function(selectedDates, dateStr) {
            updateLeaseStartDate(dateStr);
            updateLeasePrice();
        }
    });

    flatpickr("#leaseEndDate", {
        minDate: "today",
        onChange: function(selectedDates, dateStr) {
            updateLeaseEndDate(dateStr);
            updateLeasePrice();
        }
    });
}

function updateLeaseStartDate(date) {
    activeCart.leaseStartDate = date;
}

function updateLeaseEndDate(date) {
    activeCart.leaseEndDate = date;
}

function updateLeasePrice() {
    const product = getProductById(products, activeCart.productId);
    if (activeCart.leaseStartDate && activeCart.leaseEndDate) {
        const start = new Date(activeCart.leaseStartDate);
        const end = new Date(activeCart.leaseEndDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = product.basePrice * days;
        activeCart.leaseDays = days; // Store the number of days
        
        if (days >= product.minDays && days <= product.maxDays) {
            elements.itemPrice.html(`$${totalPrice.toFixed(2)} for ${days} days`);
            elements.addToCartBtn.prop('disabled', false);
        } else {
            elements.itemPrice.html(`Please select between ${product.minDays} and ${product.maxDays} days`);
            elements.addToCartBtn.prop('disabled', true);
        }
    } else {
        elements.itemPrice.html(`Select start and end dates`);
        elements.addToCartBtn.prop('disabled', true);
    }
}

function buildDetail(activeCart) {
    const product = getProductById(products, activeCart.productId);
    const isUnlocked = sessionStorage.getItem(`unlocked_${product.id}`) === 'true';

    elements.itemName.html(product.name);
    elements.itemDescription.html(isUnlocked ? (product.fullDescription || product.description) : product.description);

    if (product.type === 'lease') {
        elements.itemPrice.html(isUnlocked || !product.exclusive ? `$${product.basePrice.toFixed(2)} per day` : `$${product.basePrice.toFixed(2)} per day`);
    } else {
        elements.itemPrice.html(isUnlocked || !product.exclusive ? `$${product.price.toFixed(2)}` : `$${product.price.toFixed(2)}`);
    }

    if (product.exclusive && !isUnlocked) {
        activeCart.caroImgActive = 0;
        buildCaro(activeCart);
        elements.thumbnailHolder.empty().hide();

        NanoPay.wall({ 
            element: '.premium',
            title: 'Unlock Exclusive Products',
            button: 'Unlock All Exclusive Products', 
            amount: unlockPrice,
            address: '@mnpezz',
            success: (block) => {
                sessionStorage.setItem(`unlocked_${product.id}`, 'true');
                localStorage.setItem('allExclusiveUnlocked', 'true');
        
                window.dispatchEvent(new CustomEvent('allExclusiveUnlocked'));

                revealProduct(product, activeCart);
                updateMainPage(product.id);
                location.reload();
            }
        });
    } else if (product.type === 'appointment') {
        revealProduct(product, activeCart);
        buildAppointmentSelector(product, activeCart);
    } else if (product.type === 'lease') {
        revealProduct(product, activeCart);
        buildLeaseSelector(product, activeCart);
        elements.qtyHolder.hide();
    } else {
        revealProduct(product, activeCart);
    }
}

function updateMainPage(productId) {
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'productUnlocked', productId: productId }, '*');
    }
}

function buildAppointmentSelector(product, activeCart) {
    const dateInput = `
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Date:</span>
            </div>
            <input type="text" id="appointmentDate" class="custom-select form-control date-input" placeholder="Select Date">
        </div>
    `;
    const timeSelect = `
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <label class="input-group-text" for="appointmentTime">Time:</label>
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
    if (!product) {
        console.error('Product not found:', activeCart.productId);
        return;
    }
    const minQuantity = product.minQuantity || 1;
    const maxQuantity = product.maxQuantity || 1000;

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

    $('#productImagesCarousel').carousel(index); // Update the carousel to the clicked thumbnail
}

function addToCart(e) {
    const product = getProductById(products, activeCart.productId);
    const isExclusive = product.type === 'exclusive' || (product.type === 'lease' && product.exclusive);
    const isUnlocked = sessionStorage.getItem(`unlocked_${product.id}`) === 'true';

    if (isExclusive && !isUnlocked) {
        showTooltip(elements.addToCartBtn, "Unlock this item first!");
        e.preventDefault();
        return;
    }

    if (product.type === 'lease') {
        if (!activeCart.leaseStartDate || !activeCart.leaseEndDate) {
            showTooltip(elements.productColors, "Select Start and End Dates!");
            e.preventDefault();
            return;
        }

        const start = new Date(activeCart.leaseStartDate);
        const end = new Date(activeCart.leaseEndDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (days < product.minDays || days > product.maxDays) {
            showTooltip(elements.productColors, `Lease duration must be between ${product.minDays} and ${product.maxDays} days!`);
            e.preventDefault();
            return;
        }

        activeCart.leaseDays = days;
    } else if (product.colors && activeCart.colorId === null) {
        showTooltip(elements.productColors, "Select Color!");
        e.preventDefault();
        return;
    }

    if (product.sizes && activeCart.sizeId === null) {
        showTooltip(elements.productSizes, "Select Size!");
        e.preventDefault();
        return;
    }

    if (product.availableDates && (!activeCart.appointmentDate || !activeCart.appointmentTime)) {
        showTooltip(elements.productColors, "Select Date and Time!");
        e.preventDefault();
        return;
    }

    // Create a new cart item
    const newCartItem = {
        productId: activeCart.productId,
        quantity: activeCart.quantity,
        colorId: activeCart.colorId,
        sizeId: activeCart.sizeId,
        appointmentDate: activeCart.appointmentDate,
        appointmentTime: activeCart.appointmentTime,
        leaseStartDate: activeCart.leaseStartDate,
        leaseEndDate: activeCart.leaseEndDate,
        leaseDays: activeCart.leaseDays
    };

    // Add the new item to the cart
    cart.push(newCartItem);
    saveCart();
    updateCartCount();

    // Reset activeCart for the next item
    resetActiveCart();

    alert("Item added to cart!");
    location.reload();
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
// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Review functions
function loadReviews(productId) {
    // Mock data for reviews
    const mockReviews = [
        { id: 1, rating: 5, comment: "Great product!", author: "John Doe" },
        { id: 2, rating: 4, comment: "Good value for money", author: "Jane Smith" },
        { id: 3, rating: 3, comment: "It's okay.", author: "Alice Brown" },
        { id: 4, rating: 5, comment: "I love them!", author: "Bob Johnson" },
        { id: 5, rating: 5, comment: "Very pleased.", author: "Charlie Lee" }
    ];

    // Shuffle the reviews and select a subset (e.g., 3 reviews)
    const selectedReviews = shuffleArray(mockReviews).slice(0, 3);

    const reviewsHtml = selectedReviews.map(review => `
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
    const product = getProductById(products, productId);
    
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

function revealProduct(product, activeCart) {
    elements.itemDescription.html(product.fullDescription || product.description);

    // Show all images
    buildCaro(activeCart);
    buildThumbNail(activeCart);

    // Reinitialize the carousel
    if ($('.carousel').length) {
        $('.carousel').carousel('dispose');
        $('.carousel').carousel();
    }

    if (product.type === 'lease') {
        elements.itemPrice.html(`$${product.basePrice.toFixed(2)} per day`);
        buildLeaseSelector(product, activeCart);
        elements.qtyHolder.hide();
    } else {
        elements.itemPrice.html(`$${product.price.toFixed(2)}`);
        if (product.colors) buildColors(product, activeCart);
        if (product.sizes) buildSizes(product, activeCart);
        buildQuantity(activeCart);
    }

    // Update the button
    elements.addToCartBtn.text('Add To Cart').off('click').on('click', addToCart).show();

    // Show the premium content
    $('.premium').show();

    // Remove blur from images
    $('.carousel-item img').removeClass('blurred');
}

// Initialization on page load
$(function() {
    const productId = getDataFromUrl("id");

    activeCart = {
        productId,
        quantity: 1,
        colorId: null,
        sizeId: null,
        caroImgActive: 0,
    };

    const product = getProductById(products, productId);
    if (product.type === 'exclusive') {
        if (sessionStorage.getItem(`unlocked_${product.id}`) === 'true') {
            revealProduct(product, activeCart);
        } else {
            buildDetail(activeCart);
        }
    } else {
        buildDetail(activeCart);
    }
    
    // Load reviews for the current product
    loadReviews(activeCart.productId);

    // Load related products
    loadRelatedProducts(productId);
});
