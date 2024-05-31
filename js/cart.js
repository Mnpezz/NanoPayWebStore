let subTotalHolder = $("#subTotalHolder");
let estimatedTotalHolder = $("#estimatedTotalHolder");
let taxRate = 0.0945; // 9.45% sales tax
let estimatedTaxHolder = $("#estimatedTaxHolder");
let cartBody = $("#cartTableBody");
let totalItemsInCart = $("#totalItemsInCart");
let txtCoupon = $("#txtCoupon");
let appliedDiscount = 0;

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
    let total = subTotal - (subTotal * appliedDiscount) + tax;
    return total;
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
                            <button class="btn btn-sm" onclick="changeParticularCartQuantity(${index},${item.quantity - 1})">&dArr;</button>
                            <input onchange="changeParticularCartQuantity(${index}, this.value)" min="0" type="number" class="form-control-sm form-control" style="width: 50px" value="${item.quantity}">
                            <button class="btn btn-sm" onclick="changeParticularCartQuantity(${index},${item.quantity + 1})">&uArr;</button>
                        </div>
                        <p class="font-weight-bold">@ $${prod.price.toFixed(2)}</p>
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
}

function changeParticularCartQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity) < 0 ? 0 : parseInt(quantity);
    saveCart();
    buildCartBody();
    reloadOrderTotal();
}

$(function () {
    reloadOrderTotal();
    buildCartBody();
});

function initiatePayment() {
    const cartItems = cart.map(item => {
        let prod = getProductById(products, item.productId);
        let selectedColor = prod.colors.find(color => color.id === item.colorId);
        let selectedSize = prod.sizes.find(size => size.id === item.sizeId);
        let itemPrice = parseFloat(prod.price);
        let discountedPrice = itemPrice * (1 - appliedDiscount);
        let itemTotalPrice = discountedPrice * item.quantity;
        let itemTax = itemTotalPrice * taxRate;
        let totalPriceWithTax = itemTotalPrice + itemTax;
        return {
            name: `${prod.name} (Color: ${selectedColor.name}, Size: ${selectedSize.name}, Qty: ${item.quantity})`,
            price: totalPriceWithTax.toFixed(2)
        };
    });

    NanoPay.open({
        title: "Payment",
        address: '@mnpezz', //Recipient Address
        notify: 'epxksjki@sharklasers.com', // Admin's email for notification
        contact: false,
        shipping: false,
        currency: 'USD',
        note: cartItems,
        line_items: cartItems,
       success: (block) => {
            console.log("Payment successful!");
            clearCart();
        },
        cancel: () => {
            console.log("Payment cancelled");
        }
    });
}

function clearCart() {
    cart = []; // Clear the cart array
    saveCart(); // Save the empty cart state
    buildCartBody(); // Rebuild the cart body to reflect the empty state
    reloadOrderTotal(); // Reload the order total to reflect the empty cart
}
