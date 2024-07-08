import React, { createContext, useState, useContext } from 'react';
const AuthContext = createContext();
import axiosInstance from '../utils/axiosInstance';

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const login = () => {
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

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout ,isCartOpen,openCart,closeCart,fetchCartItems,cartItems,totalPrice  }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext) 