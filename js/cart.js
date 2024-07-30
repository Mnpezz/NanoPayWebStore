let subTotalHolder = $("#subTotalHolder");
let estimatedTotalHolder = $("#estimatedTotalHolder");
let estimatedTaxHolder = $("#estimatedTaxHolder");
let cartBody = $("#cartTableBody");
let totalItemsInCart = $("#totalItemsInCart");
let txtCoupon = $("#txtCoupon");
let appliedDiscount = 0;
let orderHistoryBody = $("#orderHistoryBody");
// Add these global variables at the top of the file
let wishlistBody = $("#wishlistBody");
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];


let taxRate = 0.0945; // 9.45% sales tax

const discountCodes = {
    "sale50": 0.5,  // 50% discount
    "sale10": 0.1,  // 10% discount
    "sale20": 0.2   // 20% discount
};

function reloadOrderTotal() {
    let itemCount = cart.length;
    let itemWord = itemCount > 1 ? "Items" : "Item";
    totalItemsInCart.html(`${itemCount} ${itemWord}`);
    let subTotal = calculateSubTotal();
    subTotalHolder.html(subTotal.toFixed(2));
    let tax = calculateTax(subTotal);
    estimatedTaxHolder.html(tax.toFixed(2));
    let estimatedTotal = calculateEstimatedTotal(subTotal, tax);
    estimatedTotalHolder.html(estimatedTotal.toFixed(2));
}

function calculateSubTotal() {
    let subTotal = 0;
    cart.forEach(item => {
        let prod = getProductById(products, item.productId);
        if (prod.type === 'lease') {
            const days = item.leaseDays || item.quantity;
            subTotal += days * parseFloat(prod.basePrice);
        } else {
            subTotal += parseInt(item.quantity) * parseFloat(prod.price);
        }
    });
    return subTotal;
}

function calculateTax(subTotal) {
    return subTotal * taxRate;
}

function calculateEstimatedTotal(subTotal, tax) {
    let discountedSubTotal = subTotal * (1 - appliedDiscount);
    return discountedSubTotal + tax;
}

function addCoupon() {
    let couponCode = txtCoupon.val();
    if (validateCoupon(couponCode)) {
        txtCoupon.addClass('is-valid').removeClass('is-invalid');
        appliedDiscount = discountCodes[couponCode];
    } else {
        txtCoupon.removeClass('is-valid').addClass('is-invalid');
        appliedDiscount = 0;
    }
    reloadOrderTotal();
}

function validateCoupon(code) {
    return discountCodes.hasOwnProperty(code);
}

// Update the buildCartBody function
function buildCartBody() {
    let str = '';
    let counter = 1;
    let url = './index.html';
    if (cart.length > 0) {
        cart.forEach((item, index) => {
            let prod = getProductById(products, item.productId);
            let totalPrice;
            let itemDetails = '';
            if (prod.type === 'lease') {
                const days = item.leaseDays || item.quantity; // Use leaseDays if available, otherwise fallback to quantity
                totalPrice = prod.basePrice * days;
                itemDetails = `
                    <span class="font-weight-bold">Start Date:</span> <span>${item.leaseStartDate}</span> | 
                    <span class="font-weight-bold">End Date:</span> <span>${item.leaseEndDate}</span> | 
                    <span class="font-weight-bold">Duration:</span> <span>${days} days</span> | 
                `;
            } else {
                totalPrice = parseInt(item.quantity) * parseFloat(prod.price);
                let selectedColor = prod.colors ? prod.colors.find(color => color.id === item.colorId) : null;
                let selectedSize = prod.sizes ? prod.sizes.find(size => size.id === item.sizeId) : null;
                itemDetails = `
                    ${selectedColor ? `<span class="font-weight-bold">Color:</span> <span>${selectedColor.name}</span> | ` : ''}
                    ${selectedSize ? `<span class="font-weight-bold">Size: </span><span>${selectedSize.name}</span> | ` : ''}
                    ${item.appointmentDate ? `<span class="font-weight-bold">Date:</span> <span>${item.appointmentDate}</span> | ` : ''}
                    ${item.appointmentTime ? `<span class="font-weight-bold">Time: </span><span>${item.appointmentTime}</span> | ` : ''}
                `;
            }

            str += `
                <tr>
                    <th scope="row">${counter}</th>
                    <td><img width="60px" class="img-thumbnail" src="${prod.images[0]}" alt="${prod.name}"></td>
                    <td>
                        <p class="font-weight-bold"><a href="${generateProductUrl(prod)}">${prod.name}</a></p>
                        <p>${itemDetails}<button onclick="removeItemFromCart(${index})" type="button" class="btn btn-link">remove</button></p>
                    </td>
                    <td>
                    ${prod.type === 'lease' || prod.type === 'appointment' ?
                        `<p class="font-weight-bold">${prod.type === 'lease' ? 
                            `$${prod.basePrice.toFixed(2)} per day` : 
                            `$${prod.price.toFixed(2)} for appointment`}</p>` :
                        `<div class="form-inline">
                            <button class="btn btn-sm" onclick="changeParticularCartQuantity(${index}, ${item.quantity + 1}, ${prod.minQuantity}, ${prod.maxQuantity})">&uArr;</button>
                            <input onchange="changeParticularCartQuantity(${index}, this.value, ${prod.minQuantity}, ${prod.maxQuantity})" min="${prod.minQuantity}" max="${prod.maxQuantity}" type="number" class="form-control-sm form-control" style="width: 50px" value="${item.quantity}">
                            <button class="btn btn-sm" onclick="changeParticularCartQuantity(${index}, ${item.quantity - 1}, ${prod.minQuantity}, ${prod.maxQuantity})">&dArr;</button>
                        </div>
                        <p class="font-weight-bold">@ $${prod.price.toFixed(2)} each</p>`
                    }
                </td>
                    <td><span class="font-weight-bold">$${totalPrice.toFixed(2)}</span></td>
                </tr>
            `;
            counter++;
        });
    } else {
        str += `
            <tr>
                <td colspan="5">
                    <h4>Your Cart is empty <a href="${url}">Find products here</a></h4>
                </td>
            </tr>
        `;
    }
    cartBody.html(str);
    reloadOrderTotal();
    updateCartCount();
}

function changeParticularCartQuantity(index, amount, minQuantity, maxQuantity) {
    amount = parseInt(amount);
    if (amount < minQuantity) {
        amount = minQuantity;
    } else if (amount > maxQuantity) {
        amount = maxQuantity;
    }
    cart[index].quantity = amount;
    saveCart();
    buildCartBody();
}

function initiatePayment() {
    let subTotal = calculateSubTotal();
    let discountedSubTotal = subTotal * (1 - appliedDiscount);
    let tax = calculateTax(discountedSubTotal);
    let total = discountedSubTotal + tax;

    const cartItems = cart.map(item => {
        let prod = getProductById(products, item.productId);
        let itemPrice, itemTotal, itemQuantity;
        
        if (prod.type === 'lease') {
            itemPrice = parseFloat(prod.basePrice);
            itemQuantity = item.leaseDays || item.quantity;
            itemTotal = itemPrice * itemQuantity;
            itemDetails = `Start Date: ${item.leaseStartDate}, End Date: ${item.leaseEndDate}, Duration: ${itemQuantity} days`;
        } else {
            itemPrice = parseFloat(prod.price);
            itemTotal = itemPrice * item.quantity;

            let selectedColor = prod.colors ? prod.colors.find(color => color.id === item.colorId) : null;
            let selectedSize = prod.sizes ? prod.sizes.find(size => size.id === item.sizeId) : null;
            itemDetails = `${selectedColor ? `Color: ${selectedColor.name}, ` : ''}${selectedSize ? `Size: ${selectedSize.name}` : ''}`;
            
            if (prod.availableDates && item.appointmentDate && item.appointmentTime) {
                itemDetails += `${itemDetails ? ', ' : ''}Date: ${item.appointmentDate}, Time: ${item.appointmentTime}`;
            }
        }
        
        return {
            name: `${prod.name}: ${itemQuantity} ${prod.type === 'lease' ? 'days' : ''} <br> ${itemDetails} <br>`,
            quantity: itemQuantity,
            price: itemPrice.toFixed(2)
        };
    });

    // Add discount and tax as separate line items
    if (appliedDiscount > 0) {
        cartItems.push({
            name: `Discount: $${(-subTotal * appliedDiscount).toFixed(2)}`,
            quantity: 1,
            price: (-subTotal * appliedDiscount).toFixed(2)
        });
    }

    cartItems.push({
        name: `Tax: $${tax.toFixed(2)}`,
        quantity: 1,
        price: tax.toFixed(2)
    });

    let itemCount = cart.length;
    let titleSummary = cartItems.map(item => item.name).join('<br>');
    if (total <= 0) {
        alert("Cannot process a payment of $0 or less.");
        return;
    }

    NanoPay.open({
        address: '@mnpezz',
        notify: 'mnpezz@gmail.com',
        contact: false,
        shipping: false,
        currency: 'USD',
        line_items: cartItems,
        note: titleSummary,
        success: (block) => {
            alert("Payment successful!");
            saveOrderHistory(cartItems);
            clearCart();
        },
        cancel: () => {
            alert("Payment cancelled");
        }
    });
}

function clearCart() {
    cart = [];
    saveCart();
    buildCartBody();
    reloadOrderTotal();
    updateCartCount();
}

function saveOrderHistory(cartItems) {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const newOrder = {
        id: orderHistory.length + 1,
        date: new Date().toLocaleString(),
        items: cartItems,
        total: cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2)
    };
    orderHistory.push(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    loadOrderHistory();
}

function loadOrderHistory() {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    let str = '';
    orderHistory.forEach(order => {
        str += `
            <tr>
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.items.map(item => `
                    <p>${item.name} - ${item.quantity} x $${item.price}</p>
                `).join('')}</td>
                <td>$${order.total}</td>
            </tr>
        `;
    });
    orderHistoryBody.html(str);
}

function removeItemFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    buildCartBody();
    updateCartCount();
}

// Add this function to load and display the wishlist
function loadWishlist() {
    let str = '';
    if (wishlist.length > 0) {
        wishlist.forEach((productId, index) => {
            let prod = getProductById(products, parseInt(productId));
            if (!prod) {
                console.error(`Product with id ${productId} not found`);
                return;
            }
            const isExclusive = prod.type === 'exclusive' || (prod.type === 'lease' && prod.exclusive);
            const isUnlocked = sessionStorage.getItem(`unlocked_${prod.id}`) === 'true';
            const addToCartButton = isExclusive && !isUnlocked ?
                `<button class="btn btn-secondary btn-sm" disabled>Unlock Required</button>` :
                `<button onclick="addToCartFromWishlist(${index})" class="btn btn-primary btn-sm">View Product</button>`;
            
            let priceDisplay;
            if (prod.type === 'lease') {
                priceDisplay = isUnlocked ? `$${prod.basePrice.toFixed(2)} per day` : `$${prod.basePrice.toFixed(2)} per day`;
            } else {
                priceDisplay = isUnlocked ? `$${prod.price.toFixed(2)}` : `$${prod.price.toFixed(2)}`;
            }
            
            str += `
                <tr>
                    <td><img width="60px" class="img-thumbnail" src="${prod.images[0]}" alt="${prod.name}"></td>
                    <td>
                        <p class="font-weight-bold"><a href="${generateProductUrl(prod)}">${prod.name}</a></p>
                        
                    </td>
                    <td>${priceDisplay}</td>
                    <td>
                        ${addToCartButton}
                        <button onclick="removeFromWishlist(${index})" class="btn btn-danger btn-sm">Remove</button>
                    </td>
                </tr>
            `;
        });
    } else {
        str = `
            <tr>
                <td colspan="4">
                    <h4>Your Wishlist is empty <a href="index.html">Find products here</a></h4>
                </td>
            </tr>
        `;
    }
    wishlistBody.html(str);
}

// Function to add an item from wishlist to cart
function addToCartFromWishlist(index) {
    const productId = wishlist[index];
    const product = getProductById(products, productId);
    
    if (product.type === 'exclusive' && sessionStorage.getItem(`unlocked_${product.id}`) !== 'true') {
        alert("This exclusive item needs to be unlocked before adding to cart.");
        return;
    }
    
    // Create a new cart item
    const newCartItem = {
        productId: productId,
        quantity: 1,
        colorId: product.colors ? product.colors[0].id : null,
        sizeId: product.sizes ? product.sizes[0].id : null,
        appointmentDate: product.appointmentOptions ? null : undefined,
        appointmentTime: product.appointmentOptions ? null : undefined
    };

    // For lease items, redirect to the product page for date selection
    if (product.type === 'lease') {
        window.location.href = `product.html?id=${productId}`;
        return;
    }

    // Add to cart
    pushItemToCart(newCartItem);
    
    // Remove from wishlist
    removeFromWishlist(index);
    
    // Update UI
    buildCartBody();
    loadWishlist();
    alert("Item added to cart!");
}

// Function to remove an item from wishlist
function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
}

// Update the document ready function to include loadWishlist
$(function () {
    buildCartBody();
    reloadOrderTotal();
    loadOrderHistory();
    loadWishlist();  // Add this line
    loadCartCount();
});
