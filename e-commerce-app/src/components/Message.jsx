import { useState } from "react";
import { useAuth } from "../context/authContext";
export default function Message(){
    const { isClose, setCloseFunc} = useAuth();
    return (
        <>
        {!isClose?
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                    <div className="flex flex-col place-items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Login Required To Access Cart</h2>
                        <button
                            onClick={()=>{setCloseFunc();}}
                            className="mt-10 p-2 w-12 text-white justify-center  bg-gray-600 hover:text-gray-700 focus:outline-none"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
        :null}
        </>
    );
};
