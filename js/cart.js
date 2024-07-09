let subTotalHolder = $("#subTotalHolder");
let estimatedTotalHolder = $("#estimatedTotalHolder");
let estimatedTaxHolder = $("#estimatedTaxHolder");
let cartBody = $("#cartTableBody");
let totalItemsInCart = $("#totalItemsInCart");
let txtCoupon = $("#txtCoupon");
let appliedDiscount = 0;
let orderHistoryBody = $("#orderHistoryBody");

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
        subTotal += parseInt(item.quantity) * parseFloat(prod.price);
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

function buildCartBody() {
    let str = '';
    let counter = 1;
    let url = './index.html';
    if (cart.length > 0) {
        cart.forEach((item, index) => {
            let prod = getProductById(products, item.productId);
            let selectedColor = prod.colors.find(color => color.id === item.colorId);
            let selectedSize = prod.sizes.find(size => size.id === item.sizeId);
            let totalPrice = parseInt(item.quantity) * parseFloat(prod.price);
            let minQuantity = prod.minQuantity || 1; // Default to 1 if not set
            let maxQuantity = prod.maxQuantity || 100; // Default to 100 if not set

            // Ensure initial quantity is at least the minimum quantity
            if (item.quantity < minQuantity) {
                item.quantity = minQuantity;
            }

            str += `
                <tr>
                    <th scope="row">${counter}</th>
                    <td><img width="60px" class="img-thumbnail" src="${prod.images[0]}" alt=""></td>
                    <td>
                        <p class="font-weight-bold"><a href="${generateProductUrl(prod)}">${prod.name}</a></p>
                        <p>
                            <span class="font-weight-bold">Color:</span> 
                            <span>${selectedColor.name}</span> | 
                            <span class="font-weight-bold">Size: </span>
                            <span>${selectedSize.name}</span> | 
                            <button onclick="removeItemFromCart(${index})" type="button" class="btn btn-link">remove</button>
                        </p>
                    </td>
                    <td>
                        <div class="form-inline">
                            <button class="btn btn-sm" onclick="changeParticularCartQuantity(${index}, ${item.quantity - 1}, ${minQuantity}, ${maxQuantity})">&dArr;</button>
                            <input onchange="changeParticularCartQuantity(${index}, this.value, ${minQuantity}, ${maxQuantity})" min="${minQuantity}" max="${maxQuantity}" type="number" class="form-control-sm form-control" style="width: 50px" value="${item.quantity}">
                            <button class="btn btn-sm" onclick="changeParticularCartQuantity(${index}, ${item.quantity + 1}, ${minQuantity}, ${maxQuantity})">&uArr;</button>
                        </div>
                        <p class="font-weight-bold">@ $${prod.price.toFixed(2)} each</p>
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
}

function changeParticularCartQuantity(index, amount, minQuantity, maxQuantity) {
    amount = parseInt(amount);
    if (amount < minQuantity) {
        amount = minQuantity;
    } else if (amount > maxQuantity) {
        amount = maxQuantity;
    }
    cart[index].quantity = amount;
    buildCartBody();
    reloadOrderTotal(); // Add this line to update the totals
}

function initiatePayment() {
    let subTotal = calculateSubTotal();
    let discountedSubTotal = subTotal * (1 - appliedDiscount);
    let tax = calculateTax(discountedSubTotal);
    let total = discountedSubTotal + tax;

    const cartItems = cart.map(item => {
        let prod = getProductById(products, item.productId);
        let selectedColor = prod.colors.find(color => color.id === item.colorId);
        let selectedSize = prod.sizes.find(size => size.id === item.sizeId);
        let itemPrice = parseFloat(prod.price);
        let itemTotal = itemPrice * item.quantity;

        return {
            name: `${prod.name} (Price: $${itemPrice.toFixed(2)} each, Quanity: ${item.quantity}, Color: ${selectedColor.name}, Size: ${selectedSize.name})`,
            quantity: item.quantity,
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

    NanoPay.open({
        title: "Payment",
        address: '@mnpezz',
        notify: 'epxksjki@sharklasers.com',
        contact: false,
        shipping: 1,
        currency: 'USD',
        line_items: cartItems,
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
    cart = []; // Clear the cart array
    saveCart(); // Save the empty cart state
    buildCartBody(); // Rebuild the cart body to reflect the empty state
    reloadOrderTotal(); // Reload the order total to reflect the empty cart
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

$(function () {
    reloadOrderTotal();
    buildCartBody();
    loadOrderHistory(); // Load order history on page load
});
