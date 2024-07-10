import { HiOutlineSearch } from "react-icons/hi";
import { IoCartOutline } from "react-icons/io5";
import { useState, useEffect } from 'react';
import Message from "./Message";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/authContext";
export default function NavBar() {
    const [pageType, setPageType] = useState("");
    const location = useLocation();
    const { isLoggedIn, logout, openCart, cartItems,isAccountOpen,openAccount,closeAccount,setCloseFunc } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/register") {
            setPageType("register");
        } else if (location.pathname === "/login") {
            setPageType("login");
        } else {
            setPageType("home");
        }
    }, [location.pathname]);

    function handleLogout(){
        localStorage.clear();
        logout();
        window.location.reload();
        navigate("/");
    }
    return (
        <>
        <nav className="px-0 flex w-full  justify-between items-center font text-sm font-semibold text-gray-600">
            <img className="w-48" src="/SoleStudioLogo2.png" alt="" srcset="" />
            
            {/* <div className="flex flex-grow space-x-4 items-center py-2 px-3 border-2 border-gray-300">
                <HiOutlineSearch className="" />
                <input type="search" className="outline-none  lg:flex" name="" id="" placeholder="Search Product..." />
            </div> */}
            <ul className="mr-8 flex space-x-4 items-center">
                <li>
                    <button onClick={()=>{
                        !isLoggedIn && setCloseFunc();
                        isLoggedIn? openCart():<Message />
                    }} className="relative">
                        <IoCartOutline size={32} />
                        {(cartItems.length>0) &&
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-600 rounded-full">{cartItems.length}</span>
                        }
                        <Message />
                    </button>
                </li>
                {!isLoggedIn ?
                    <li className="space-x-2  text-xs flex  lg:block">
                        {pageType !== "register" && (
                            <Link to="/register" className="p-3  bg-black text-white"><button className="">Register</button></Link>
                        )}
                        {pageType !== "login" && (
                            <Link to="/login" className="p-3  border-2 bg-gray-200 hover:bg-white"><button className="">Login</button></Link>
                        )}
                    </li>
                :<li className=" text-xs lg:block">
                    <button  className="p-3 border bg-red-200 text-gray-600 hover:bg-white ease-in-out transition duration-300" onClick={handleLogout}>Logout</button>
                </li>
            }
            </ul>
        </nav>
        <nav className="my-4 hidden md:block lg:block ">
            <ul className="flex justify-center space-x-6 text-gray-600 ">
                <li>
                    <Link to="/" className={`${(location.pathname==="/")?"text-black border-b-2 ":"text-gray-600"}  hover:text-black border-black duration-300 transition-colors ease-in-out font-semibold`}>Home</Link>
                </li>
                <li>
                    <Link to="/products" className={`${(location.pathname==="/products")?"text-black border-b-2 ":"text-gray-600"}hover:text-black border-black duration-300 transition-colors ease-in-out font-semibold`}>Shop</Link>
                </li>
                <li>
                    <Link to="" className="hover:text-black duration-300 transition-colors ease-in-out font-semibold">Featured</Link>
                </li>
                <li>
                    <Link to="" className="hover:text-black duration-300 transition-colors ease-in-out font-semibold" onClick={()=>{isAccountOpen?closeAccount():openAccount()}}>My Account</Link>
                </li>
            </ul>
        </nav>
        <nav className="mt-6 md:hidden lg:hidden p-4 z-50 space-x-6 fixed bottom-0 left-0 w-full bg-white shadow-lg">
            <ul className="flex justify-center space-x-6 text-gray-600 ">
                <li>
                    <Link to="/" className="hover:text-black duration-300 transition-colors ease-in-out font-semibold">Home</Link>
                </li>
                <li>
                    <Link to="/products" className="hover:text-black duration-300 transition-colors ease-in-out font-semibold">Shop</Link>
                </li>
                <li>
                    <Link to="" className="hover:text-black duration-300 transition-colors ease-in-out font-semibold">Featured</Link>
                </li>
                <li>
                    <Link to="" className="hover:text-black duration-300 transition-colors ease-in-out font-semibold" onClick={()=>{isAccountOpen?closeAccount():openAccount()}}>My Account</Link>
                </li>
            </ul>
        </nav>
        </>
    );
};
