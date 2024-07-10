import React, { createContext, useState, useContext } from 'react';
const AuthContext = createContext();
import axiosInstance from '../utils/axiosInstance';

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [user, setUser] = useState({
        name:localStorage.getItem('name'),
        email:localStorage.getItem('email')
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [addedProductIds, setAddedProductIds] = useState([]);
    const [addedProducts, setAddedProducts] = useState([]);
    const [isClose,setClose] = useState(true);

    const setCloseFunc = () =>{
        setClose(!isClose);
    }

    const login = () => {
        setUser({
            name:localStorage.getItem('name'),
            email:localStorage.getItem('email')
        });
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', true);
    }
    const logout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', false);
    }

    const openCart = () => {
        setIsCartOpen(true);
    }
    const closeCart = () => {
        setIsCartOpen(false);
    }
    const openAccount = () => {
        setIsAccountOpen(true);
    }
    const closeAccount = () => {
        setIsAccountOpen(false);
    }

    const fetchCartItems = async () => {
        try {

            const response = await axiosInstance.get('/getCart');
            if (response.data && response.data.items) {
                setCartItems(response.data.items);
                setTotalPrice(response.data.totalPrice);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    async function addToCart(productId,quantity){
        try{
            const response = await axiosInstance.post('/product/addToCart',{productId, quantity});
            if(response.data && response.data.message){
                setAddedProducts(response.data.cart);
                console.log(response.data.message);
                console.log(response.data.cart);
                setAddedProductIds(response.data.cart.items.map((item)=>{return item.productId}));
                fetchCartItems();
            }
        }catch(error){
            console.error('Error adding product to cart:', error)
        }
    }

    const removeFromCart = async (productId) => {
        try{
            const response = await axiosInstance.delete(`/product/removeFromCart/${productId}`)
            if (response.data && response.data.message) {
                console.log(response.data.message);
                console.log(response.data.cart);
                setAddedProducts(response.data.cart);
                setAddedProductIds(response.data.cart.items.map((item)=>{return item.productId}));
                // After successful removal, fetch updated cart items
                // fetchCartItems();
            }
        } catch (error) {
            console.error('Error removing item from cart:', error.response);
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout ,isCartOpen,openCart,closeCart,fetchCartItems,cartItems,totalPrice,addToCart,addedProductIds,setAddedProductIds,setAddedProducts,removeFromCart,user,openAccount,closeAccount, isAccountOpen,isClose,setCloseFunc  }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext) 