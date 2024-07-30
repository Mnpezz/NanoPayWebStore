// Global variables
let prodIds = 1;
let sizeIds = 1;
let colsIds = 1;
let products = [];
let cart = [];
let cartCount = $("#cartCount");


let unlockPrice = 0.01; // Adjust the price of exclusive product unlock here

let taxRate = 0.0945; // 9.45% sales tax

const discountCodes = {
    "sale50": 0.5,  // 50% discount
    "sale10": 0.1,  // 10% discount
    "sale20": 0.2   // 20% discount
};



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

// Footer loading
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    loadNavbar(); // If you have this
    loadFooter(); // Add this line
    // ... other initialization code ...
});

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
        let pds = [
            {
                id: ++prodIds,
                type: 'regular',
                name: "Size only item",
                description: "This item has no color option with a 5 minimum and 10 max..",
                price: 0.01,
                sizes: [
                    { id: ++sizeIds, name: 'S' },
                    { id: ++sizeIds, name: 'M' },
                    { id: ++sizeIds, name: 'L' },
                ],
                minQuantity: 5,
                maxQuantity: 10,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw09a49167/images/2020/1V013893_964_LD_F.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw649937ba/images/2020/6K1381_484_LD_F.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwea216f90/images/2020/1W010788_6415_LD_F.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw96994bcb/images/2020/1W010788_6415_LD_D.jpg?sw=1184&sh=1410&sm=cut',
                    
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
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwaba684ad/images/2020/1O001126_406_LD_F.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwf9af7222/images/2020/1O001126_406_OF_ED.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw11cb504b/images/2020/1O001126_406_OF_D.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw97f6e429/images/2020/1O001126_406_OF_D2.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw8c1e979f/images/2020/1O001126_406_LD_B.jpg?sw=1184&sh=1410&sm=cut'
                ]
            },
            {
                id: ++prodIds,
                type: 'regular',
                name: "Both Color and Size",
                description: "There's warm, and then there's vineyard vines warm...",
                price: 0.03,
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
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw649937ba/images/2020/6K1381_484_LD_F.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw65b57cbd/images/2020/6K1381_002_LD_F.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw23ff744c/images/2020/6K1381_976_LD_F.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw6425e659/images/2020/6K1381_634_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw0ca1bb9d/images/2020/6K1381_634_LD_F.jpg?sw=1680&sh=2000&sm=cut'

                    ]
            },
            {
                id: ++prodIds,
                type: 'regular',
                name: "Color and Size Exclusive Product",
                description: "This is a preview of our exclusive product. Additional pictures and ability to add item to cart enabled immediatly after unlock payment is made",
                fullDescription: "This is the full description of our exclusive product, only visible after unlocking.",
                price: 0.04,
                minQuantity: 1,
                maxQuantity: 100,
                // blur or censor your own image and place it first. the image will be blurred out but that can be simply bypassed for the first image. all additional images will be visible only after unlock paymnet is made. 
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw24fbddf1/images/2020/1V013893_025_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw68ad9ff1/images/2020/1V013893_964_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw09ee4d53/images/2020/1V013893_456_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw7204be03/images/2020/1V013893_100_LD_B.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw09a49167/images/2020/1V013893_964_LD_F.jpg?sw=1184&sh=1410&sm=cut'
                ],
                colors: [
                    { id: ++colsIds, hash: "#D50000", name: "Red" },
                    { id: ++colsIds, hash: "#4CAF50", name: "Green" },
                ],
                sizes: [
                    { id: ++sizeIds, name: 'S' },
                    { id: ++sizeIds, name: 'M' },
                    { id: ++sizeIds, name: 'L' },
                ],
                exclusive: true,
            },
            {
                id: ++prodIds,
                type: 'appointment',
                name: "Consultation Session",
                description: "Book a consultation session with our experts.",
                price: 0.04,
                availableDates: [
                    "2024-07-16", "2024-07-18",
                    "2024-07-23", "2024-07-25",
                    "2024-07-30", "2024-08-01",
                    "2024-08-06", "2024-08-08",
                    "2024-08-13", "2024-08-15",
                    "2024-08-20", "2024-08-22",
                    "2024-08-27", "2024-08-29",
                    "2024-09-03", "2024-09-05",
                    "2024-09-10", "2024-09-12",
                    "2024-09-17", "2024-09-19",
                    "2024-09-24", "2024-09-26",
                    "2024-10-01", "2024-10-03",
                    "2024-10-08", "2024-10-10",
                    "2024-10-15", "2024-10-17",
                    "2024-10-22", "2024-10-24",
                    "2024-10-29", "2024-10-31",
                    "2024-11-05", "2024-11-07",
                    "2024-11-12", "2024-11-14",
                    "2024-11-19", "2024-11-21",
                    "2024-11-26", "2024-11-28",
                    "2024-12-03", "2024-12-05",
                    "2024-12-10", "2024-12-12",
                    "2024-12-17", "2024-12-19",
                    "2024-12-24", "2024-12-26",
                    "2024-12-31"
                ],                availableTimes: ["09:00 AM", "11 AM", "1:00 PM", "15:00"],
                minQuantity: 1,
                maxQuantity: 1,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwd3bb0a74/images/2020/1P001052_250_LS_F.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw522f69f3/images/2020/1P001052_061_LD_F.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw9a56142b/images/2020/1P001052_034_LD_D.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwc40b9cbe/images/2020/1P001052_034_OF_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwf6123754/images/2019/1P001052_976_OF_F.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwc5db1759/images/2019/1P001052_976_OF_D2.jpg?sw=1680&sh=2000&sm=cut'
                ]
            },
                       
            {
                id: ++prodIds,
                type: 'appointment',
                name: "Exclusive Consultation Session",
                description: "This is a preview of our exclusive product. Additional pictures and ability to add item to cart enabled immediatly after unlock payment is made",
                fullDescription: "This is the full description of our exclusive product, only visible after unlocking.",
                price: 0.08,
                availableDates: [
                    "2024-07-16", "2024-07-18",
                    "2024-07-23", "2024-07-25",
                    "2024-07-30", "2024-08-01",
                    "2024-08-06", "2024-08-08",
                    "2024-08-13", "2024-08-15",
                    "2024-08-20", "2024-08-22",
                    "2024-08-27", "2024-08-29",
                    "2024-09-03", "2024-09-05",
                    "2024-09-10", "2024-09-12",
                    "2024-09-17", "2024-09-19",
                    "2024-09-24", "2024-09-26",
                    "2024-10-01", "2024-10-03",
                    "2024-10-08", "2024-10-10",
                    "2024-10-15", "2024-10-17",
                    "2024-10-22", "2024-10-24",
                    "2024-10-29", "2024-10-31",
                    "2024-11-05", "2024-11-07",
                    "2024-11-12", "2024-11-14",
                    "2024-11-19", "2024-11-21",
                    "2024-11-26", "2024-11-28",
                    "2024-12-03", "2024-12-05",
                    "2024-12-10", "2024-12-12",
                    "2024-12-17", "2024-12-19",
                    "2024-12-24", "2024-12-26",
                    "2024-12-31"
                ],
                availableTimes: ["09:00 AM", "11 AM", "1:00 PM", "15:00"],
                minQuantity: 1,
                maxQuantity: 1,
                // blur or censor your own image and place it first. the image will be blurred out but that can be simply bypassed for the first image. all additional images will be visible only after unlock paymnet is made. 
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw68ad9ff1/images/2020/1V013893_964_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw09ee4d53/images/2020/1V013893_456_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw7204be03/images/2020/1V013893_100_LD_B.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw09a49167/images/2020/1V013893_964_LD_F.jpg?sw=1184&sh=1410&sm=cut'
                ],
                exclusive: true,
            },
            {
                id: ++prodIds,
                type: 'regular',
                name: "Regular Exclusive Product",
                description: "This is a preview of our regular exclusive product. Additional pictures and ability to add item to cart enabled immediatly after unlock payment is made",
                fullDescription: "This is the full description of our exclusive product, only visible after unlocking.",
                price: 0.04,
                minQuantity: 1,
                maxQuantity: 100,
                // blur or censor your own image and place it first. the image will be blurred out but that can be simply bypassed for the first image. all additional images will be visible only after unlock paymnet is made. 
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw0563da3a/images/2020/1V013893_893_LD_B.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw68ad9ff1/images/2020/1V013893_964_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw09ee4d53/images/2020/1V013893_456_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw09a49167/images/2020/1V013893_964_LD_F.jpg?sw=1184&sh=1410&sm=cut'
                ],
                exclusive: true,
            },
            {
                id: ++prodIds,
                type: 'regular',
                name: "Regular no attribute product",
                description: "This item has no size or color option with a 1 minimum and 100 max..",
                price: 0.02,
                minQuantity: 1,
                maxQuantity: 100,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwf9af7222/images/2020/1O001126_406_OF_ED.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw11cb504b/images/2020/1O001126_406_OF_D.jpg?sw=1184&sh=1410&sm=cut',
                ]
            },
            {
                id: ++prodIds,
                type: 'lease',
                name: "Short-term Rental Item",
                fullDescription: "Enjoy our premium short-term rental item for your desired period. please select between 3 and 60 days.",
                basePrice: 0.02, // Price per day
                minDays: 3,
                maxDays: 60,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw8c1e979f/images/2020/1O001126_406_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw97f6e429/images/2020/1O001126_406_OF_D2.jpg?sw=1184&sh=1410&sm=cut',
                ],
                exclusive: false,
            },
            {
                id: ++prodIds,
                type: 'lease',
                name: "Exclusive Short-term Rental Item",
                description: "This preview description for exclusive rental item. min 1 day max 120 days",
                fullDescription: "Enjoy our premium short-term rental item for your desired period. please select between 3 and 60 days.",
                basePrice: 0.04, // Price per day
                minDays: 1,
                maxDays: 120,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw24fbddf1/images/2020/1V013893_025_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw7204be03/images/2020/1V013893_100_LD_B.jpg?sw=1680&sh=2000&sm=cut',
                ],
                exclusive: true,
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
    const product = getProductById(products, item.productId);
    if (product.type === 'lease') {
        // For lease items, always add as a new item
        cart.push(item);
    } else {
        let existingItem = cart.find(cItem => 
            item.productId === cItem.productId && 
            (item.colorId === cItem.colorId) &&
            (item.sizeId === cItem.sizeId)
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push(item);
        }
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
