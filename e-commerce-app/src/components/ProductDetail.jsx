import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Cart from "./Cart";
import { useAuth } from "../context/authContext";
export default function ProductDetail() {
    const { id } = useParams();
    const { openCart, addToCart, addedProductIds } = useAuth();
    const [product, setProduct] = useState(null);
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axiosInstance.get(`getProduct/${id}`);
                if (response.data && response.data.product) {
                    setProduct(response.data.product);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }

        }
        getProduct();
    }, [id]);

    async function handleCart(productId, quantity) {
        setLoading(true);
        await addToCart(productId, quantity);
        setAdded(true);
        setLoading(false);
    }

    return (
        <>
            {!product ? <div className="h-full grid place-items-center"><p className="text-xl font-semibold text-gray-600 animate-pulse">Loading Product...</p></div> :
                <div className=" mt-8">
                    <Link to="/products" className="pl-10 my-8 md:pl-16 lg:pl-16 flex items-center justify-start">
                        <FaArrowLeft size={24} />
                        <span>Back to Shop</span>
                    </Link>
                    <div className='mx-auto mt-4 flex flex-col md:flex-row lg:flex-row justify-evenly max-w-6xl p-8'>
                        <div className="max-w-xl">
                            <img src={product.image} className=' w-full object-contain mb-4' alt={product.name} />
                        </div>
                        <div className="text-left md:pl-10 lg:pl-10 p-2">
                            <h2 className='text-3xl font-semibold'>{product.name}</h2>
                            <p className='text-gray-700 mt-4'>{product.description}</p>
                            <p className='text-2xl font-semibold text-gray-800 mt-8'> Rs. {product.price}</p>
                            Quantity <div className="text-lg mt-2 flex border-2 w-16 justify-evenly space-x-2 items-center"> <button className="" onClick={() => { count < 1 ? setCount(0) : setCount(count - 1) }}>-</button><span>{count}</span><button onClick={() => { setCount(count + 1) }}>+</button></div>
                            {!addedProductIds.includes(id) ?
                                <button onClick={() => { handleCart(id, count) }} className='mt-8 transform bg-gray-900 text-white py-2 px-4 opacity-85 group-hover:opacity-100 transition-all duration-500'>{loading ? 'Adding...' : 'Add To Cart'}</button>
                                :
                                <button onClick={() => { openCart() }} className='mt-8 transform bg-gray-900 text-white py-2 px-4 opacity-85 group-hover:opacity-100 transition-all duration-500'>Go to Cart</button>
                            }
                        </div>
                        {/* Additional product details */}
                    </div>
                </div>
            }
            <Cart />
        </>
    );
};
