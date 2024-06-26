let prodIds = 1;
let sizeIds = 1;
let colsIds = 1;

let imageUrls = [
    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw2dfb39fb/images/2020/3O001051_410_LD_F.jpg?sw=344&sh=529&sm=cut',
    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwfcb9afa1/images/2020/3W001233_5418_LD_F.jpg?sw=344&sh=529&sm=cut',
    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw6af841b5/images/2020/3W001117_5489_LD_F.jpg?sw=344&sh=529&sm=cut',
    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw1bb6cb20/images/2020/3L001038_5732_LD_F.jpg?sw=344&sh=529&sm=cut',
    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwca256b24/images/2020/3O001056_056_LD_F.jpg?sw=344&sh=529&sm=cut',
    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwfa98ed65/images/2020/3K1138_410_LD_F.jpg?sw=344&sh=529&sm=cut',
    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw6d575bac/images/2020/3P001038_250_LD_F.jpg?sw=344&sh=529&sm=cut',
    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw8baf31e8/images/2020/3V011415_459_LD_B.jpg?sw=344&sh=529&sm=cut',
]

let products = []
let cart = []
let colour = {
    id: 0,
    hash: "",
    name: ""
}
let product = {
    name: "",
    price: "",
    description: "",
    colors: [],
    sizes: [],
    images: []
}

let cartCount = $("#cartCount")

function getItemFromStore(key) {
    return JSON.parse(localStorage.getItem(key));
}


function saveItemToStore(item, key) {
    localStorage.setItem(key, JSON.stringify(item));
}

function hasStoredData() {
    return !!localStorage.getItem('loaded')
}

function loadProducts() {

    if (hasStoredData()) {

        //Load all the products from the local storage
        products = getItemFromStore('products')
    } else {
        let sizes = [
            {
                id: ++sizeIds,
                name: 'XS'
            },
            {
                id: ++sizeIds,
                name: '9'
            },
            {
                id: ++sizeIds,
                name: '11'
            },
            {
                id: ++sizeIds,
                name: 'L'
            },
            {
                id: ++sizeIds,
                name: 'XL'
            },
            {
                id: ++sizeIds,
                name: 'XXL'
            },
        ];
        let colors =  [
            {
                id: ++colsIds,
                hash: "#D50000",
                name: "Red",
            },
            {
                id: ++colsIds,
                hash: "#F50057",
                name: "Pink",
            },
            {
                id: ++colsIds,
                hash: "#CDDC39",
                name: "Lime",
            },
            {
                id: ++colsIds,
                hash: "#4CAF50",
                name: "Green",
            },
            {
                id: ++colsIds,
                hash: "#FF9800",
                name: "Orange",
            },
            {
                id: ++colsIds,
                hash: "#795548",
                name: "Brown",
            },
        ];
        let pds = [
            {
                id: ++prodIds,
                name: "Nor'easter Puffer Vest",
                description: "There's warm, and then there's vineyard vines warm. We use the highest-quality, responsibly sourced, traceable and sustainable goose and duck down that is breathable, wicks moisture and holds up season after season.",
                price:0.18,
                sizes,
                colors,
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
                name: "Men's Blank Winstead Stripe Sankaty Performance Polo",
                description: "Moisture-wicking, quick-drying fabric that's wrinkle resistant with UV protection. Performance fit for full range of motion. Short sleeves with a self-collar, open sleeves, and a split hem",
                price:1.25,
                sizes,
                colors,
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
                name: "Performance On-The-Go 5-Pocket Pants",
                description: "Shep & Ian were sitting around one day and Ian was wearing performance pants. Shep started chirping Ian, telling him that he looked like he was about to slide out of his chair and he could hear him swishing around from a mile away. Ian shot back, barking at Shep that he was wearing the same khaki pants he wore to his eighth grade graduation. ",
                price:1.55,
                sizes,
                colors,
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
                name: "Burgee Whale Hoodie Long-Sleeve Pocket Tee",
                description: "If you're looking for a great, lightweight fall layer, look no further. Our long-sleeve hoodie tees combine the signature soft cotton fabrication of our classic tees with a fun hoodie style.",
                price:0.01,
                sizes,
                colors,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw0563da3a/images/2020/1V013893_893_LD_B.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw24fbddf1/images/2020/1V013893_025_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw68ad9ff1/images/2020/1V013893_964_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw09ee4d53/images/2020/1V013893_456_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw7204be03/images/2020/1V013893_100_LD_B.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw09a49167/images/2020/1V013893_964_LD_F.jpg?sw=1184&sh=1410&sm=cut'
                ]

            },
            {
                id: ++prodIds,
                name: "Classic Fit Blackwatch Poplin Tucker Shirt",
                description: "We have a button-down shirt for every occasion. Whether you're heading to the office or to a wedding, chilling in a tiki bar on the beach or just getting dressed for a date night on the town. Our button-downs strike the perfect balance of fit and style, with just the right amount of built-in stretch.",
                price:0.02,
                sizes,
                colors,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwea216f90/images/2020/1W010788_6415_LD_F.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw96994bcb/images/2020/1W010788_6415_LD_D.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwdba31cd5/images/2020/1W010788_6415_OF_ED.jpg?sw=1184&sh=1410&sm=cut',

                ]

            },
            {
                id: ++prodIds,
                name: "Baby Ruffle Back One-Piece",
                description: "Babies ready to make a BIG splash in this adore-ruffle one-piece.",
                price:17.99,
                sizes,
                colors,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw1e12804d/images/2020/8M001020_3784_LD_F.jpg?sw=1680&sh=2000&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw290a170e/images/2020/8M001020_3784_LD_B.jpg?sw=1184&sh=1410&sm=cut',
                ]

            },
            {
                id: ++prodIds,
                name: "Watercolor Wildflowers Tassel Trim Scarf",
                description: "Wrap yourself up in our warm wool tassel trim scarf–it's the chicest way to stay cozy all day long.",
                price:0.03,
                sizes,
                colors,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw474ed974/images/2020/2X001101_5759_LD_F.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw62164b03/images/2020/2X001101_5759_LD_D.jpg?sw=1184&sh=1410&sm=cut',

                ]

            },
            {
                id: ++prodIds,
                name: "Scarf Tied Fringe Sunhat",
                description: "Sheild yourself from the sun in our chic scarf tied sunhat.",
                price:0.05,
                sizes,
                colors,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwcf07cdfa/images/2020/2F001162_976_LD_F.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw22bf6f95/images/2020/2F001162_976_LD_D.jpg?sw=1184&sh=1410&sm=cut',
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dwc1b36c7d/images/2020/2F001162_976_LD_D2.jpg?sw=1184&sh=1410&sm=cut'
                ]

            },
            {
                id: ++prodIds,
                name: "Whale Dot Camo Popsocket",
                description: "It's so sleek, you might forget it's there! Pop this on and go.",
                price:0.10,
                sizes,
                colors,
                images: [
                    'https://www.vineyardvines.com/dw/image/v2/AAHW_PRD/on/demandware.static/-/Sites-vineyardvines-master/default/dw4a6582cf/images/2020/5A001842_034_LD_F.jpg?sw=1184&sh=1410&sm=cut'
                ]

            },

        ]
        saveItemToStore(pds, "products")
    }
}

function loadCart() {
    if (hasStoredData()) {
        //Load all the carts from the local storage
        cart = getItemFromStore('cart')
    } else {
        saveItemToStore(cart, 'cart')
    }
}

function init() {
    let fresh = hasStoredData()
    loadProducts();
    loadCart();
    saveItemToStore(true, "loaded")
    if (!fresh){
        init()
    }

}

function generateProductUrl(product) {
    let append = `?name=${product.name.replaceAll(' ', '-')}&id=${product.id}`
    return "product.html" + append;
}

function getDataFromUrl(name) {
    let params = (new URL(document.location)).searchParams;
    return params.get(name);
}

function getProductById(pdsG, id) {
    return pdsG.find(prod => {
        return prod.id === parseInt(id);
    })
}
function updateCartCount(){
    cartCount.html(cart.length)
}

function saveCart(){
    saveItemToStore(cart, 'cart')
}

function pushItemToCart(item){

    // check if there is item with the same product, size and color increase the quantity instead
    let cItem = cart.find(cItem=>{
        return item.productId === cItem.productId && item.colorId === cItem.colorId && item.sizeId === cItem.sizeId
    });
    if(!!cItem){
        let index = cart.indexOf(cItem)
        cart[index].quantity += item.quantity
    }else {
        cart.push(item)
    }
    saveCart();
    updateCartCount()
}

function removeItemFromCart(index) {
    cart.splice(index, 1)
    saveCart();
    buildCartBody()
    reloadOrderTotal()
    updateCartCount()
}

$(() => {

    init();

    updateCartCount()
})

