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
    let str = product.images.map((image, index) => `
        <img src="${image}" onclick="changeActiveImage(${index})" 
             class="img-thumbnail page-link p-1 m-1 ${activeCart.caroImgActive === index ? 'border border-primary' : ''}" 
             alt="${product.name}"/>
    `).join('');
    elements.thumbnailHolder.html(str);
}

function buildCaro(activeCart) {
    const product = getProductById(products, activeCart.productId);
    let str = product.images.map((image, index) => `
        <div class="carousel-item ${index === activeCart.caroImgActive ? 'active' : ''}">
            <img src="${image}" class="d-block w-100" alt="${product.name}">
        </div>
    `).join('');
    elements.caroHolder.html(str);
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
    let dateInput = `<input type="text" id="appointmentDate" placeholder="Select Date">`;
    let timeSelect = `<select id="appointmentTime" onchange="updateAppointmentTime(this.value)">
        <option value="">Select Time</option>
        ${product.availableTimes.map(time => `<option value="${time}">${time}</option>`).join('')}
    </select>`;

    elements.productColors.html(dateInput);
    elements.productSizes.html(timeSelect);

    // Initialize Flatpickr
    flatpickr("#appointmentDate", {
        enable: product.availableDates,
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr, instance) {
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

    let colors = product.colors.map(color => `
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

    let sizes = product.sizes.map(size => `
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

    let qty = `
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
    let productId = getDataFromUrl("id");

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
