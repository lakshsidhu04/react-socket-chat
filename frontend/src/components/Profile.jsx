import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = useUser();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('profilePic', selectedFile);

        try {
            const response = await axios.post('/api/user/profile-pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 'Profile picture updated') {
                setUser({ ...user, profilePic: response.data.profilePic });
            }
        } catch (error) {
            console.error("Error uploading profile picture: ", error.message);
        }
    };

    return (
        <div className="profile-container w-screen h-screen bg-[#000e14] flex flex-col items-center ">
            <div className="profile-header w-full flex justify-between items-center p-4 bg-[#001824] text-white shadow-lg">
                <h1 className="text-3xl font-bold">Profile</h1>
                <Link to="/" className="home-link p-2 bg-[#00293D] hover:bg-[#004466] rounded text-white transition duration-300">
                    Home
                </Link>
            </div>
            <div className="profile-content flex flex-col items-center justify-center bg-[#001824] text-white p-8 rounded-lg shadow-lg mt-8">
                <h2 className="text-2xl font-bold mb-4">User Information</h2>
                <p className="text-xl">Username: {user.username}</p>
                <div className="profile-pic-upload mt-4">
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload} className="upload-button p-2 bg-[#004466] hover:bg-[#005577] rounded text-white transition duration-300 mt-2">
                        Upload Profile Picture
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
