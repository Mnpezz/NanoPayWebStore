let activeCart = {}

let itemName = $("#itemName");
let itemDescription = $("#itemDescription");
let itemPrice = $("#itemPrice");
let thumbnailHolder = $("#thumbnailHolder");
let caroHolder = $("#caroInner");
let productColors = $("#itemColors");
let selectedColor = $("#selectedColor");
let productSizes = $("#productSizes");
let selectedSize= $("#selectedSize");
let qtyHolder = $("#qtyHolder")
let addToCartBtn = $("#AddToCartBtn")


function buildThumbNail(activeCar_t) {
    let product = getProductById(products, activeCar_t.productId)
    let str = '';
    let index = 0;
    product.images.forEach(image => {

        str += `
        <img  src="${image}" onclick="changeActiveImage(${index})" class="img-thumbnail page-link p-1 m-1 ${activeCar_t.caroImgActive === index ? 'border border-primary':''}" alt="${product.name}"/>
        `;
        index++;
    })
    thumbnailHolder.html(str)
}

function buildCaro(activeCar_t) {
    let product = getProductById(products, activeCar_t.productId)
    let str = '';
    let index = 0;
    product.images.forEach(image => {

        str +=
            `
            <div class="carousel-item ${index === activeCar_t.caroImgActive ? 'active' : ''}">
                <img src="${image}" class="d-block w-100" alt="${product.name}">
            </div>
            
            `
        index++;
    })
    caroHolder.html(str)
}

function buildDetail(activeCar_t) {
//    Name Title description
    let product = getProductById(products, activeCar_t.productId)
    itemName.html(product.name)
    itemDescription.html(product.description)
    itemPrice.html(product.price)

//    build colors
    let colors = "";

    product.colors.forEach(color =>{
        if (color.id === activeCar_t.colorId){
            selectedColor.html(color.name)
        }
        else if (!!!activeCar_t.colorId){
            selectedColor.html("Select Color")
        }

        colors += `
         <button class="btn rounded-circle  ${color.id === activeCar_t.colorId ? 'border border-primary':''}" onclick="changeSelectedColor(${color.id})"
               style="background-color: ${color.hash}; width: 40px; height: 40px">
         </button>
        
        `
    })
    productColors.html(colors)

    // Build Sizes
    let str = '';
    product.sizes.forEach(size=>{
        if (size.id === activeCar_t.sizeId){
            selectedSize.html(size.name)
        }
        if (activeCar_t.sizeId === null){
            selectedSize.html("Select Size")
        }

        str+= `
            <button class="btn btn-info ${size.id === activeCar_t.sizeId ? 'active':''}"
                    onclick="changeSelectedSize(${size.id})"
             >${size.name}</button>
                               
        `
    });
    productSizes.html(str)



}

function buildQuantity(activeCart) {
    let product = getProductById(products, activeCart.productId);
    let minQuantity = product.minQuantity || 1; // Default to 1 if not set
    let maxQuantity = product.maxQuantity || 100; // Default to 100 if not set

    // Ensure initial quantity is at least the minimum quantity
    if (activeCart.quantity < minQuantity) {
        activeCart.quantity = minQuantity;
    }

    let qty = "";
    qty += `
        <button class="btn" onclick="changeQuantity(${activeCart.quantity - 1}, ${minQuantity}, ${maxQuantity})">&dArr;</button>
        <input id="quantitySelector" onchange="changeQuantity(this.value, ${minQuantity}, ${maxQuantity})" value="${activeCart.quantity}" type="number" class="disabled form-control w-25" width="20px" min="${minQuantity}" max="${maxQuantity}">
        <button class="btn" onclick="changeQuantity(${activeCart.quantity + 1}, ${minQuantity}, ${maxQuantity})">&uArr;</button>
    `;
    qtyHolder.html(qty);
}

function changeQuantity(amount, minQuantity, maxQuantity) {
    amount = parseInt(amount);
    if (amount < minQuantity) {
        amount = minQuantity;
    } else if (amount > maxQuantity) {
        amount = maxQuantity;
    }
    activeCart.quantity = amount;
    buildQuantity(activeCart);
}


function changeSelectedColor(id){
    productColors.tooltip('hide');
    activeCart.colorId = id;
    buildDetail(activeCart);
}

function changeSelectedSize(id){
    productSizes.tooltip('hide');
    activeCart.sizeId = id;
    buildDetail(activeCart);
}

function refreshProductPage() {
    if (activeCart.productId) {
        buildThumbNail(activeCart)
        buildCaro(activeCart)
        buildDetail(activeCart)
        buildQuantity(activeCart)
    }
}

function changeActiveImage(index){
    activeCart.caroImgActive = index;
    buildCaro(activeCart);
    buildThumbNail(activeCart)
}

function addToCart(e){

    // Check if color is selected
    if (activeCart.colorId === null){
        productColors.tooltip({
            title:"Select Color!",
            trigger:'manual',
        });
        productColors.tooltip('show');
        e.preventDefault();
        return
    }

    // Check if size is not null
    if (activeCart.sizeId === null){
        productSizes.tooltip({
            title:"Select Size!",
            trigger:'manual',
        });
        productSizes.tooltip('show');
        e.preventDefault();
        return
    }


    pushItemToCart(activeCart)
}

$(() => {
    let productId = getDataFromUrl("id");

//    build active cart
    activeCart = {
        productId,
        quantity: 1,
        colorId: null,
        sizeId: null,
        caroImgActive:0,
    }

//    build the page base on active cart data
    refreshProductPage()

    $('#productImagesCarousel').on('slid.bs.carousel',function (data){
        changeActiveImage(data.to)
    })


    addToCartBtn.click(addToCart)
});
