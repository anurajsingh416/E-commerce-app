import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { validate } from '../utils/validate';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
function Login() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    }

    async function handleSubmit(event){
        event.preventDefault();
        const {email,password} = formData;
        
        if(!validate(email)||!email) {
            setError("Please enter valid email!");
            return ;
        }
        if(!password) {
            setError("Please enter valid password!");
            return ;
        }
        setError("");

        try{
            const response = await axiosInstance.post('/login',{
                email,
                password
            });
            console.log(response);
            if(response.data && response.data.error){
                setError(response.data.error);
                return;
            }

            if(response.data && response.data.accessToken){
                localStorage.setItem("token", response.data.accessToken);
                login();
                navigate("/");
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    }
    function togglePassword() {
        setShowPassword(!showPassword);
    }
    return (
        <>
            <div className='mx-auto mt-10 w-full max-w-md shadow-md bg-white rounded-lg justify-center'>
                <form
                    className='space-y-6 p-4 border-2'
                    onSubmit={handleSubmit}
                >
                    <h1 className='text-2xl font-semibold text-center text-gray-700'>Sign In with Sole Studio</h1>
                    
                    <div>
                        <label className="flex px-2 text-sm font-semibold text-gray-600" htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                            placeholder="albert@gmail.com"
                            className="w-full mt-1 text-md font-semibold p-2 border rounded-md focus:outline-none outline-1"
                        />
                    </div>
                    <div className="relative">
                        <label className="flex px-2 text-sm font-semibold text-gray-600" htmlFor="password">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            onChange={handleChange}
                            value={formData.password}
                            placeholder="123456"
                            className="w-full mt-1 text-md font-semibold p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <span
                            className="absolute right-3 top-9 cursor-pointer text-gray-500"
                            onClick={togglePassword}
                        >
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </span>
                    </div>
                    <input
                        type="submit"
                        className=" p-2 bg-gray-800 text-white hover:bg-gray-700 transition duration-200"
                        value="Login"
                    />
                    {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                    <p className="text-center text-gray-600">
                        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                    </p>
                </form>

            </div>
        </>
    );
}
export default Login;