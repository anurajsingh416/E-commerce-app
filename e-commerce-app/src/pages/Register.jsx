import React, {useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {validate} from '../utils/validate';
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa6";
import {Link, useNavigate} from 'react-router-dom';
function Register(){
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:""
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    function handleChange(event){
        const {name, value} = event.target;
        setFormData((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        });
    }

    async function handleSubmit(event){
        event.preventDefault();
        const {name,email,password} = formData;
        if(!name) {
            setError("Please enter Name!");
            return ;
        }
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
            const response = await axiosInstance.post('/register',{
                name,
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
                navigate("/");
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    }
    function togglePassword(){
        setShowPassword(!showPassword);
    }
    return (
        <>
            <div className='mx-auto w-full max-w-md shadow-md bg-white rounded-lg justify-center'>
                <form
                    className='space-y-6 p-4 border-2'
                    onSubmit={handleSubmit}
                >
                    <h1 className='text-2xl font-semibold text-center text-gray-700'>Sign Up with Sole Studio</h1>
                    
                <div>
                        <label className="flex px-2 text-sm font-semibold text-gray-600" htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            value={formData.name}
                            placeholder="Albert"
                            className="w-full mt-1 text-md font-semibold p-2 border rounded-md focus:outline outline-1 "
                        />
                    </div>
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
                            placeholder="abc@1234"
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
                        value="Register"
                    />
                    {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                    <p className="text-center text-gray-600">
                        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                    </p>
                </form>
            
        </div>
        </>
    );
}
export default Register;