/*
*
* @return sti
* */
function buildProductCols(products = []) {

    let str = '';
    products.forEach(prod => {
        str += `
            <div class="col col-sm-6 col-md-3">
            <a href="${generateProductUrl(prod)}" class="btn">
                <img src="${prod.images[0]}" alt="" class="img-fluid rounded-lg">
                <p class="text-center">${prod.price}</p>
                <p class="text-center">${prod.name}</p>
            </a>
        </div>
        `;
    })
    return str;
}

$(() => {
    let productContainer = $("#productsContainer");
    let cols = buildProductCols(products)

    productContainer.html(cols)
});
