# NanoPayWebStore

[Live Demo](https://mnpezz.github.io/NanoPayWebStore/)

# WebStore with Nano Payment Integration

This project is a web-based e-commerce platform with integrated Nano cryptocurrency payments. It features a product catalog, shopping cart functionality, and premium content unlockable through Nano payments.

## Features

- Product catalog with customizable items (regular, exclusive, appointment, and lease products)
- Shopping cart with tax and discount functionality
- Nano cryptocurrency payment integration
- Premium content unlockable through micropayments
- Wishlist functionality
- Related products display

## Setup and Configuration

To set up and customize this WebStore for your use, follow these steps:

### 1. NanoPay Configuration

In `cart.js` function initiatePayment you need to modify the following:

- **Nano Payment Address**: In the `nanopay.open` function, change the XNO address to your own Nano wallet address.
- **Contact Email**: Update the email address in the `nanopay.open`.

Example:
```javascript
nanopay.open({
    address: '@nano_1youraddressa1b2c3d4e5f6g7h8i9j0',
    notify: 'your@email.com',
    contact: true, 
    shipping: 10, //for free shipping 'true' and no shipping 'false'
});
```

In `product.js` function buildDetail you need to modify the following:
 - **Nano Payment Address**: In the `nanopay.wall` function, change the XNO address to your own Nano wallet address for exclusive item unlock payments.

Example:
```javascript
NanoPay.wall({
    address: '@nano_1youraddressa1b2c3d4e5f6g7h8i9j0',
});
```

### 2. Product Catalog (main.js)

- **unlockPrice**: The price to unlock all exclusive items.
- **Tax Percentage**: Adjust the tax rate to match your requirements.
- **Discount Codes**: Update or add discount codes as needed.

Example:
```javascript
let unlockPrice = 1.33; // Price is denominated in xno

const TAX_RATE = 0.08; // 8% tax

const DISCOUNT_CODES = {
    'SUMMER10': 0.1,
    'WELCOME20': 0.2
};
```

In `main.js`, starting from line 60, you should modify the product items to reflect your inventory.

## Product Types and Item Details

Our WebStore supports two main product types, each with its own set of attributes and options:

### 2.1. Regular Items

Regular items represent physical products or digital goods. They have the following attributes:

- `id`: Unique identifier for the product
- `type`: Set to 'regular' for these items
- `name`: The product name
- `description`: A detailed description of the product
- `price`: The base price of the product
- `images`: An array of image URLs for the product
- `minQuantity`: Minimum quantity that can be ordered (default: 1)
- `maxQuantity`: Maximum quantity that can be ordered

Optional attributes:
- `colors`: An array of color options, each with:
  - `id`: Unique identifier for the color
  - `name`: Color name
  - `hash`: Color hex code
- `sizes`: An array of size options, each with:
  - `id`: Unique identifier for the size
  - `name`: Size name (e.g., 'S', 'M', 'L')

Example of a regular item:
```javascript
{
    id: 1,
    type: 'regular',
    name: "Colorful T-Shirt",
    description: "A comfortable, high-quality t-shirt available in multiple colors and sizes.",
    price: 19.99,
    colors: [
        { id: 1, name: "Red", hash: "#FF0000" },
        { id: 2, name: "Blue", hash: "#0000FF" }
    ],
    sizes: [
        { id: 1, name: 'S' },
        { id: 2, name: 'M' },
        { id: 3, name: 'L' }
    ],
    minQuantity: 1,
    maxQuantity: 10,
    images: ['url_to_image_1.jpg', 'url_to_image_2.jpg']
}
```

### 2.2. Consulting Items

Consulting items represent service-based products, typically used for booking consultation sessions. They have the following attributes:

- `id`: Unique identifier for the service
- `type`: Set to 'appointment' for these items
- `name`: The name of the consultation service
- `description`: A detailed description of the service
- `price`: The price per consultation session
- `availableDates`: An array of available dates for booking
- `availableTimes`: An array of available time slots
- `minQuantity`: Always set to 1 for appointment items
- `maxQuantity`: Always set to 1 for appointment items
- `images`: An array of image URLs related to the service

Example of a consulting item:
```javascript
{
    id: 2,
    type: 'appointment',
    name: "Personal Styling Consultation",
    description: "A one-on-one session with our expert stylist to help you refine your personal style.",
    price: 49.99,
    availableDates: ["2024-07-16", "2024-07-17", "2024-07-18"],
    availableTimes: ["09:00", "11:00", "14:00", "16:00"],
    minQuantity: 1,
    maxQuantity: 1,
    images: ['url_to_stylist_image.jpg']
}
```

### 2.3. Lease Items
Lease items are products available for short-term rental. They have the following unique attributes:

type: 'lease'
basePrice: The daily rental price
minDays: Minimum rental period
maxDays: Maximum rental period

Example of a lease item:
javascriptCopy{
    id: ++prodIds,
    type: 'lease',
    name: "Short-term Rental Item",
    fullDescription: "Enjoy our premium short-term rental item for your desired period.",
    basePrice: 0.02, // Price per day
    minDays: 3,
    maxDays: 60,
    images: [
        'image1.jpg',
        'image2.jpg'
    ],
    exclusive: false, // Can be true for exclusive lease items
}

### 2.4. Exclusive Items
Exclusive items represent products or special offers that are only fully accessible after a payment has been made. They have additional handling for unlocking content and displaying it securely. The following attributes define an exclusive item:

id: Unique identifier for the product
type: Set to 'regular', 'appointment', or 'lease' type (exclusive is handled as a boolean flag)
name: The product name
description: A sample description shown before the product is unlocked
fullDescription: The full detailed description shown after the product is unlocked
price: The base price of the product
images: An array of image URLs for the product
minQuantity: Minimum quantity that can be ordered (default: 1)
maxQuantity: Maximum quantity that can be ordered
exclusive: Set to true to mark the item as exclusive

Example of an regular type exclusive item:
``` javascript
{
    id: ++prodIds,
    type: 'regular',
    name: "Premium Photo Album",
    description: "A brief summary of the premium photos. Unlock to see more!",
    fullDescription: "The complete content of the premium photo album, packed with stunning visuals and detailed descriptions of each photograph.",
    price: 19.99,
    minQuantity: 1,
    maxQuantity: 1,
    images: [
        'https://example.com/blurred_cover_image.jpg',
        'https://example.com/premium_photo1.jpg',
        'https://example.com/premium_photo2.jpg'
    ],
    exclusive: true
}
```

Handling Exclusive Items in Code
The first image (index 0) in the images array is displayed with a blur effect by default. The blur effect can be adjusted in the index.html for the front page and in product.html for the product view:

```htmlCopy<style>
.blurred {
    filter: blur(5px);
}
</style>
```

Key Points for Exclusive Items:

Initial State: Before the product is unlocked, only the description and the first image (blurred) are shown.
Unlocking: After the payment, the full description and all images (unblurred) are shown.
Blurred Effect: CSS is used to blur the initial image, giving a preview without revealing the full content, but can easily be bypassed so be aware that the first image should be censured independently if desired.
Unlock Price: The price to unlock exclusive items is set globally in main.js as unlockPrice.

When adding or modifying exclusive products in main.js, ensure you provide all the necessary attributes. The structure handles the locking and unlocking mechanism, displaying the sample description and blurred image before the purchase, and the full content after the purchase.

### 3. Paid Blog Configuration

For each paid blog post or premium content page, update the Nano address and price in the NanoPay.wall configuration:

```javascript
NanoPay.wall({ 
    element: '.premium',
    title: 'Read Full Article',
    button: 'Unlock Full Story', 
    amount: 0.00001, // Adjust price as needed
    address: '@yourNanoAddress', // Your Nano Address or Username
    success: (block) => {
        alert("Thanks for reading! Enjoy the full article.", block.username || block.address)
    }
})
```

Additional Features
Wishlist
Users can add products to their wishlist, which is stored in the browser's local storage.
Related Products
On the product page, related products are displayed to encourage additional purchases.
Reviews
A mock review system is implemented to showcase product feedback.
Exclusive Content Unlocking
Users can unlock all exclusive content with a one-time payment, enhancing the shopping experience.
Installation

Clone this repository to your local machine or server.
Make the necessary configurations as described above.
Deploy the files to your web server.

Notes

Ensure all image URLs in the product configurations are correct and accessible.
The WebStore uses local storage for cart and wishlist functionality. Ensure your users' browsers support local storage.
For exclusive items, remember to provide both blurred and unblurred images as needed.
When testing payments, use small amounts of Nano to avoid unnecessary expenses.
The lease system allows for flexible rental periods within the specified min and max days.
Appointment bookings are limited to available dates and times specified in the product configuration.

For any additional customization or feature requests, please refer to the source code or contact the developer.
