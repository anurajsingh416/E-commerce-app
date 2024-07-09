import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from 'react';
import { useAuth } from "../context/authContext";
export default function Cart() {
    // const [cartItems, setCartItems] = useState([]);
    // const [totalPrice, setTotalPrice] = useState(0);
    const { isCartOpen, closeCart, fetchCartItems,cartItems,totalPrice } = useAuth();


    // const fetchCartItems = async () => {
    //     try {

    //         const response = await axiosInstance.get('/getCart');
    //         if (response.data && response.data.items) {
    //             setCartItems(response.data.items);
    //             setTotalPrice(response.data.totalPrice);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching cart items:', error);
    //     }
    // }
    useEffect(() => {
        fetchCartItems();
    }, []);

    

    const removeFromCart = async (productId) => {
        try{
            const response = await axiosInstance.delete(`/product/removeFromCart/${productId}`)
            if (response.data && response.data.message) {
                console.log(response.data.message);
                // After successful removal, fetch updated cart items
                fetchCartItems();
            }
        } catch (error) {
            console.error('Error removing item from cart:', error.response);
        }
    }
    const clearCart = async () => {
        try{
            const response = await axiosInstance.delete(`/product/clearCart`)
            if (response.data && response.data.message) {
                console.log(response.data.message);
                // After successful removal, fetch updated cart items
                fetchCartItems();
            }
        } catch (error) {
            console.error('Error removing item from cart:', error.response);
        }
    }

    return (
        <>
            <div className={`${!isCartOpen ? "hidden" : "block"} z-30 overflow-x-hidden p-6 fixed top-0 right-0 h-screen w-full md:w-2/4 lg:w-2/4 bg-gray-100`}>

                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-gray-700">Shopping Cart</h2>
                    <div className="flex justify-between space-x-2">
                        <button className="border p-2 text-sm font-semibold text-gray-700" onClick={() => {
                            clearCart();
                        }}>Clear Cart</button>
                        <button className="border p-2 text-sm font-semibold text-gray-700" onClick={() => {
                            closeCart();
                        }}>Close</button>
                    </div>
                </div>

                <ul className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {cartItems.map(item => (
                        <li key={item.productId} className="flex items-center p-4 shadow-md">
                            <div className="w-24 h-24 flex-shrink-0">
                                <img src={item.image} alt="image" className="w-full max-h-24 object-cover rounded" />
                            </div>
                            <div className="ml-4 flex-grow">
                                <h3 className="text-gray-800 mb-2">{item.name}</h3>
                                <div className="flex justify-between w-full">
                                    <p className="text-gray-600 text-sm"><p>Quantity</p> {item.quantity}</p>
                                    <p className="text-gray-600 text-sm"><p>Price</p>&#8377; {item.price}</p>
                                    <button className="bg-red-100 p-2 hover:bg-red-300 transition duration-200" onClick={() => removeFromCart(item.productId)}>Remove</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex absolute  justify-between bottom-16 md:bottom-0 lg:bottom-0 left-0 right-0 items-center p-4 bg-gray-100 border-t border-gray-300 shadow-md">
                    <p className="text-sm px-4">Total Price: <br /> <span className="text-xl font-semibold">&#8377; {totalPrice}.00</span></p>
                    <button className="px-4 py-2 font-semibold hover:bg-gray-700 transition duration-200 bg-gray-900 text-white">Check Out</button>
                </div>
            </div>

        </>
    );
};
