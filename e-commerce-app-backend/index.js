const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/db');
const jwt = require("jsonwebtoken");
const User = require("./model/User");
const Product = require("./model/Product");
const Cart = require("./model/Cart");
const bcrypt = require("bcrypt");
const { authenticationToken, isAdmin } = require("./utilities/authenticationToken");
require("dotenv").config();
const cors = require('cors');
const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "*"
}))

app.get("/", (req, res) => {
    res.send("Hello, world!");
})
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(401).json({ error: true, message: "Name Required" });
    }
    if (!password) {
        return res.status(401).json({ error: true, message: "Password Required" });
    }
    if (!email) {
        return res.status(401).json({ error: true, message: "Email Required" });
    }

    const ExistingUser = await User.findOne({ email });

    if (ExistingUser) {
        return res.status(401).json({ error: true, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();

    const accessToken = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
        expiresIn: "36000m"
    });

    return res.status(200).json({
        error: false,
        newUser,
        accessToken,
        message: "Registration Successful",
    })
});

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        return res.status(401).json({ error: true, message: "Email Required" });
    }
    if (!password) {
        return res.status(401).json({ error: true, message: "Password Required" });
    }
    try {

        const ExistingUser = await User.findOne({ email });

        if (!ExistingUser) {
            return res.status(400).json({ message: "User not found" })
        }
        const userPassword = ExistingUser.password;
        const isValidPassword = await bcrypt.compare(password, userPassword);

        if (!isValidPassword) {
            return res.status(401).json({
                error: true,
                message: "Invalid Password"
            })
        }
        const accessToken = jwt.sign({ user: ExistingUser }, process.env.SECRET_KEY, {
            expiresIn: "36000m"
        });
        return res.status(200).json({
            error: false,
            ExistingUser,
            accessToken,
            message: "Login successful"
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }

});

app.get('/admin', authenticationToken, isAdmin, (req, res) => {
    res.json({ message: 'Welcome Admin' });
});

app.get("/getProducts", async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            return res.json({ error: true, message: 'Product not found' });
        }
        res.json({
            products,
            message: "Products Found"
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
})


app.get("/getProduct/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.json({ error: true, message: 'Product not found' });
        }
        res.json({
            product,
            message: "Product Found"
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
})

app.post('/product/addToCart', authenticationToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'ProductId is required' });
        }
        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a positive number' });
        }
        const product = await Product.findById(productId);
        const name = product.name;
        const price = product.price;
        const image = product.image;
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const cartItem = cart.items.find(item => item.productId.equals(productId));
        if (cartItem) {
            cartItem.quantity += quantity;
        }
        else {
            cart.items.push({ productId, quantity, name, price, image });
        }

        cart.totalPrice += product.price * quantity;

        await cart.save();
        console.log(cart)

        res.json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }

});

app.delete('/product/removeFromCart/:productId', authenticationToken, async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: true, message: 'Cart not found' });
        }

        const itemToRemove = cart.items.find(item => item.productId.toString() === productId.toString());
        console.log(itemToRemove);

        if (!itemToRemove) {
            return res.status(404).json({ error: true, message: 'Item not found in cart' });
        }

        if (itemToRemove.quantity > 1) {
            itemToRemove.quantity -= 1;
        } else {
            cart.items = cart.items.filter((item) => {
                return item.productId.toString() !== productId.toString()
            })
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        console.log(cart)
        res.json({
            cart,
            error: false,
            message: 'Cart found and Deleted Item'
        })
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: 'Failed to remove product from cart' });
    }
})

app.delete('/product/clearCart', authenticationToken, async (req, res) => {
    const userId = req.user._id;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: true, message: 'Cart not found' });
        }

        cart.items = [];

        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        res.json({
            error: false,
            message: 'Cart found and Cleared successfully'
        })
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to Clear Cart' });
    }
})

app.get('/getCart', authenticationToken, async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const items = cart.items;
        const totalPrice = cart.totalPrice;
        res.status(200).json({ message: 'Cart Found', items, totalPrice });
    } catch (error) {

    }
})
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});