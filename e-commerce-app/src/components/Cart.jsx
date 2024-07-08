import axiosInstance from "../utils/axiosInstance";
import {useState, useEffect} from 'react';
export default function Cart(){
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() =>{
        const fetchCartItems = async () =>{
            try{

                const response = await axiosInstance.get('/getCart');
                if(response.data && response.data.items){
                    setCartItems(response.data.items);
                    setTotalPrice(response.data.totalPrice);
                }
            }catch(error){
                console.error('Error fetching cart items:', error);
            }
        }
        fetchCartItems();
    },[]);

    return (
        <div>
            <h2>Shopping Cart</h2>
            <ul>
                {cartItems.map(item => (
                    <li key={item.productId}>
                        <div>
                            <img src={item.image} alt="" />
                        </div>
                        <div>
                            <h3>{item.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price}</p>
                            <button onClick={() => removeFromCart(item.productId)}>Remove</button>
                        </div>
                    </li>
                ))}
            </ul>
            <p>Total Price: ${totalPrice}</p>
        </div>
    );
};
