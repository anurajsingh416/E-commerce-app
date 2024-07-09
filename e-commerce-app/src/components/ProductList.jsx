import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useLocation} from "react-router-dom";
import { useAuth } from "../context/authContext";
import Cart from "./Cart";
export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [productPage,setProductPage] = useState(false);
    const location = useLocation();
    const {isCartOpen, openCart,fetchCartItems, cartItems,setAddedProductIds,setAddedProducts, addedProductIds,addToCart} = useAuth();
    // const [addedProducts, setAddedProducts] = useState([]);
    // const [addedProductIds, setAddedProductIds] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});

    useEffect(()=>{
        console.log("cart items",cartItems.map((item)=>{return item.productId}))
        setAddedProducts(cartItems);
        setAddedProductIds(cartItems.map((item)=>{return item.productId})); 
    },[cartItems])
    useEffect(() =>{
        if(location.pathname==='/products'){
            setProductPage(true);
        }else{
            setProductPage(false);

        }
        const getProducts = async () =>{
            try{
                const response = await axiosInstance.get("/getProducts"); 
                if(response.data && response.data.products){
                    setProducts(response.data.products)
                    console.log(response.data.message);
                }
            }catch(error){
                if(error.response && error.response.data && error.response.data.message){
                    console.error(error.response.data.message);
                }
            }
        } 
        getProducts();
    },[]);

    // async function addToCart(productId){
    //     try{
    //         const response = await axiosInstance.post('/product/addToCart',{productId, quantity:1});
    //         if(response.data && response.data.message){
    //             setAddedProducts(response.data.cart);
    //             console.log(response.data.message);
    //             console.log(response.data.cart);
    //             setAddedProductIds(response.data.cart.items.map((item)=>{return item.productId}));
    //             fetchCartItems();
    //         }
    //     }catch(error){
    //         console.error('Error adding product to cart:', error.response.data)
    //     }
    // }

    async function handleAddToCart(productId){
        setLoadingStates((prev) => ({ ...prev, [productId]: true }));
        await addToCart(productId,1);
        setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }

    return (
        <div className={`w-screen mt-10 ${isCartOpen && "fixed"}`}>
            <div className={`mx-auto w-full lg:w-full px-4 grid   ${productPage ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-3"} gap-6 place-items-center `}>
                {products.map((product, index) => (
                    
                    <div key={index} className='w-44 lg:w-48 p-1 bg-gray-200 flex flex-col shadow-md justify-between group transition-all'>
                        <Link to={`/product/${product._id}`}>
                        <img src={product.image} className='h-36 w-full object-contain hover:scale-95 transition-all duration-300'/>
                        <h2 className='text-gray-800 font-bold text-center hover:underline'>{product.name}</h2>
                        <p className='text-800 mt-2 font-semibold'> Rs. {product.price}</p>
                        </Link>
                        {(!addedProductIds.includes(product._id)) ?
                        <button onClick={()=>{
                            handleAddToCart(product._id); 
                        }} className='mt-4 transform font-semibold bg-gray-900 text-white py-2 px-4 opacity-85 group-hover:opacity-100 transition-all duration-200'>{loadingStates[product._id] ? 'Adding...' : 'Add To Cart'}</button>
                        :<button onClick={()=>{
                            openCart();
                        }} className='mt-4 transform font-semibold bg-white  text-gray-800 py-2 px-4 opacity-85 group-hover:opacity-100 hover:underline transition-all duration-200'>Go To Cart</button>
                        }
                    </div>
                    
                ))}
            </div>
            <Cart />
        </div>
    );
};
