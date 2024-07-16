// Global variables
let prodIds = 1;
let sizeIds = 1;
let colsIds = 1;
let products = [];
let cart = [];
let cartCount = $("#cartCount");

// Navbar loading
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            loadCartCount(); // Add this line
        })
        .catch(error => console.error('Error loading navbar:', error));
}

document.addEventListener('DOMContentLoaded', loadNavbar);

// Local storage functions
function getItemFromStore(key) {
    return JSON.parse(localStorage.getItem(key));
}

function saveItemToStore(item, key) {
    localStorage.setItem(key, JSON.stringify(item));
}

function hasStoredData() {
    return !!localStorage.getItem('loaded');
}

// Product loading
function loadProducts() {
    if (hasStoredData()) {
        products = getItemFromStore('products');
    } else {
        // Add product data here (removed for brevity)
        let pds = [
            {
                id: ++prodIds,
                type: 'regular',
                name: "Size only item",
                description: "This item has no color option with a 5 minimum and 10 max..",
                price: 0.02,
                sizes: [
                    { id: ++sizeIds, name: 'S' },
                    { id: ++sizeIds, name: 'M' },
                    { id: ++sizeIds, name: 'L' },
                ],
                minQuantity: 5,
                maxQuantity: 10,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw9a56142b/images/2020/1P001052_034_LD_D.jpg?sw=1680&sh=2000&sm=cut',
                    // ... other images ...
                ]
            },
            {
                id: ++prodIds,
                type: 'regular',
                name: "Color only item",
                description: "This item has no size option with a 2 minimum and 10 max..",
                price: 0.02,
                colors: [
                    { id: ++colsIds, hash: "#D50000", name: "Red" },
                    { id: ++colsIds, hash: "#4CAF50", name: "Green" },
                ],
                minQuantity: 2,
                maxQuantity: 10,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw9a56142b/images/2020/1P001052_034_LD_D.jpg?sw=1680&sh=2000&sm=cut',
                    // ... other images ...
                ]
            },
            {
                id: ++prodIds,
                type: 'regular',
                name: "Both Color and Size",
                description: "There's warm, and then there's vineyard vines warm...",
                price: 0.02,
                colors: [
                    { id: ++colsIds, hash: "#D50000", name: "Red" },
                    { id: ++colsIds, hash: "#4CAF50", name: "Green" },
                ],
                sizes: [
                    { id: ++sizeIds, name: 'S' },
                    { id: ++sizeIds, name: 'M' },
                    { id: ++sizeIds, name: 'L' },
                ],
                minQuantity: 1,
                maxQuantity: 50,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwaba684ad/images/2020/1O001126_406_LD_F.jpg?sw=1680&sh=2000&sm=cut',
                    // ... other images ...
                ]
            },
            
            {
                id: ++prodIds,
                type: 'appointment',
                name: "Consultation Session",
                description: "Book a consultation session with our experts.",
                price: 0.01,
                availableDates: ["2024-07-16", "2024-07-17", "2024-07-18"],
                availableTimes: ["09:00", "11:00", "14:00", "16:00"],
                minQuantity: 1,
                maxQuantity: 1,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw649937ba/images/2020/6K1381_484_LD_F.jpg?sw=1680&sh=2000&sm=cut',
                ]
            },
        ];
        
        saveItemToStore(pds, "products");
    }
}

// Cart functions
function loadCart() {
    cart = hasStoredData() ? getItemFromStore('cart') : [];
    saveItemToStore(cart, 'cart');
}

function loadCartCount() {
    let itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.html(itemCount);
    $('#navbarTotalItemsInCart').text(itemCount);
}

function updateCartCount() {
    let itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.html(itemCount);
    // Update the navbar cart count
    $('#navbarTotalItemsInCart').text(itemCount);
    localStorage.setItem('cartCount', itemCount);

}

function saveCart() {
    saveItemToStore(cart, 'cart');
    updateCartCount();
}

function pushItemToCart(item) {
    let existingItem = cart.find(cItem => 
        item.productId === cItem.productId && 
        item.colorId === cItem.colorId && 
        item.sizeId === cItem.sizeId
    );

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }

    saveCart();
    updateCartCount();
}

function removeItemFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    buildCartBody();
    reloadOrderTotal();
    updateCartCount();
}

// Utility functions
function generateProductUrl(product) {
    return `product.html?name=${product.name.replaceAll(' ', '-')}&id=${product.id}`;
}

function getDataFromUrl(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function getProductById(pdsG, id) {
    return pdsG.find(prod => prod.id === parseInt(id));
}

function init() {
    let fresh = hasStoredData();
    loadProducts();
    loadCart();
    loadCartCount();
    saveItemToStore(true, "loaded");
    if (!fresh) {
        init();
    }
}

// Document ready function
$(function() {
    init();
});
