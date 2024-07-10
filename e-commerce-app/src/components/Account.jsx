import { useAuth } from "../context/authContext";
import { useState } from "react";

export default function Account() {
    const { user, isAccountOpen, closeAccount } = useAuth(); // Assuming closeAccount function exists
    const [profile, setProfile] = useState(user);

    if (!isAccountOpen) {
        return null; // Don't render anything if account section is closed
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">My Account</h2>
                        <button
                            onClick={closeAccount}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3.707 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="mb-6 text-left">
                        <h1 className="text-xl font-semibold text-gray-800">Name: {profile.name}</h1>
                        <h1 className="text-xl font-semibold text-gray-800">Email: {profile.email}</h1>
                    </div>
                    {/* Example of updating profile or other actions */}
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
