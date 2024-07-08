import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useLocation} from "react-router-dom";
export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [productPage,setProductPage] = useState(false);
    const location = useLocation();
    const [addedProducts, setAddedProducts] = useState([]);
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
    async function addToCart(productId,index){
        try{
            const response = await axiosInstance.post('/product/addToCart',{productId, quantity:1});
            if(response.data && response.data.message){
                console.log(response.data.message);
            }
        }catch(error){
            console.error('Error adding product to cart:', error.response.data)
        }
        const updateAddedProducts = [...addedProducts];
        updateAddedProducts[index] = true;
        setAddedProducts(updateAddedProducts);
    }
    return (
        <div className='w-screen mt-10'>
            <div className={`mx-auto w-full lg:w-full px-8 grid   ${productPage ? "grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-3"} gap-6 place-items-center `}>
                {products.map((product, index) => (
                    
                    <div key={index} className='max-w-68 p-4 bg-gray-200 flex flex-col justify-between group transition-all'>
                        <Link to={`/product/${product._id}`}>
                        <img src={product.image} className='h-52 w-full object-contain hover:scale-95 transition-all duration-300'/>
                        <h2 className='text-gray-800 font-bold text-center'>{product.name}</h2>
                        <p className='text-800 mt-2 font-semibold'> Rs. {product.price}</p>
                        </Link>
                        {!addedProducts[index] ?
                        <button onClick={()=>{addToCart(product._id,index); }} className='mt-4 transform bg-gray-900 text-white py-2 px-4 opacity-85 group-hover:opacity-100 transition-all duration-500'>Add To Cart</button>
                        :<button className='mt-4 transform bg-white text-gray-800 py-2 px-4 opacity-85 group-hover:opacity-100 transition-all duration-500'><Link to="/cart">Go To Cart</Link></button>
                        }
                    </div>
                    
                ))}
            </div>
        </div>
    );
};
