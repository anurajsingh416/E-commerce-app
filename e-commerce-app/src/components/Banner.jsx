import { FaArrowRight } from "react-icons/fa6";
export default function Banner() {
    return (
        <div className="my-12 p-10 w-full md:w-4/5 lg:w-4/5 mx-auto h-full flex flex-col md:flex-row lg:flex-row items-center border-2 text-center font justify-center bg-gray-200">
            <div className="w-full md:w-4/6 lg:w-4/6 text-gray-800 flex-grow px-12">
                <h1 className="w-full md:w-2/3 lg:w-2/3 my-14 text-4xl font-serif">Your Perfect Fit, Every Time</h1>
                <p className="w-full md:w-3/4 lg:w-3/4 mb-4 text-left">Buying shoes should leave you happy and stylish, with money in your pocket. Sneakers, boots, and sandals—we’ve got your feet covered.</p>
                <button className="space-x-2 m-2 bg-gray-900 text-white p-3 flex"><a className="" href="/">Shop Now </a><FaArrowRight size={24} /></button>
            </div>
            <div className="">
                <img className="w-4/5 md:w-4/5 lg:w-full  bg-gray-200" src="./banner2.png" alt="" />
            </div>
        </div>
    );
};
