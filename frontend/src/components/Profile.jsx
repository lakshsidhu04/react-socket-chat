import React from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useUser();

    return (
        <div className="profile-container w-screen h-screen bg-[#000e14] flex flex-col items-center justify-center">
            <div className="profile-header w-full flex justify-between items-center p-4 bg-[#001824] text-white shadow-lg">
                <h1 className="text-3xl font-bold">Profile</h1>
                <Link to="/" className="home-link p-2 bg-[#00293D] hover:bg-[#004466] rounded text-white transition duration-300">
                    Home
                </Link>
            </div>
            <div className="profile-content flex flex-col items-center justify-center bg-[#001824] text-white p-8 rounded-lg shadow-lg mt-8">
                <h2 className="text-2xl font-bold mb-4">User Information</h2>
                <p className="text-xl">Username: {user.username}</p>
            </div>
        </div>
    );
}

export default Profile;
