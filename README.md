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
    address: 'nano_1youraddressa1b2c3d4e5f6g7h8i9j0',
    amount: total,
    email: 'your@email.com'
});
```

### 2. Product Catalog (main.js)

In `main.js`, starting from line 58, you should modify the product items to reflect your inventory:

```javascript
let pds = [
    {
        id: ++prodIds,
        type: 'regular',
        name: "Your Product Name",
        description: "Your product description...",
        price: 0.02,
        // ... other product details ...
    },
    // Add more products as needed
];
```

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
2. Ensure you have a web server set up to serve these files (e.g., Apache, Nginx).
3. Make the necessary configurations as described above.
4. Deploy the files to your web server.
