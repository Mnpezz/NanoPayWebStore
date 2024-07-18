# NanoPayWebStore

[Live Demo](https://mnpezz.github.io/NanoPayWebStore/)

# WebStore with Nano Payment Integration

This project is a web-based e-commerce platform with integrated Nano cryptocurrency payments. It features a product catalog, shopping cart functionality, and premium content unlockable through Nano payments.

## Features

- Product catalog with customizable items
- Shopping cart with tax and discount functionality
- Nano cryptocurrency payment integration
- Premium content unlockable through micropayments

## Setup and Configuration

To set up and customize this WebStore for your use, follow these steps:

### 1. Cart Configuration (cart.js)

In `cart.js`, you need to modify the following:

- **Tax Percentage**: Adjust the tax rate to match your requirements.
- **Discount Codes**: Update or add discount codes as needed.
- **Nano Payment Address**: In the `nanopay.open` function, change the XNO address to your own Nano wallet address.
- **Contact Email**: Update the email address in the `nanopay.open`.

Example:
```javascript
const TAX_RATE = 0.08; // 8% tax

const DISCOUNT_CODES = {
    'SUMMER10': 0.1,
    'WELCOME20': 0.2
};

nanopay.open({
    address: '@nano_1youraddressa1b2c3d4e5f6g7h8i9j0',
    notify: 'your@email.com',
    contact: true, 
    shipping: 10,
});
```

### 2. Product Catalog (main.js)

In `main.js`, starting from line 58, you should modify the product items to reflect your inventory.

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

When adding or modifying products in `main.js`, ensure that you provide all the necessary attributes for each product type. This structure allows for flexible product configurations while maintaining consistency across the store.

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

## Installation

1. Clone this repository to your local machine or server.
2. Make the necessary configurations as described above.
3. Deploy the files to your web server.
