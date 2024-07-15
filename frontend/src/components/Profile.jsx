import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

const Profile = () => {
    const { user, setUser } = useUser();
    const [selectedFile, setSelectedFile] = useState(null);
    const defaultProfilePic = 'https://www.w3schools.com/w3images/avatar2.png';
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('profilePic', selectedFile);

        try {
            const response = await axios.post('/api/users/profile-pic', formData, {
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
        <div className="profile-container bg-gray-900 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            
            <div className="mb-4">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow"
                >
                    Choose Profile Picture
                </label>
                {selectedFile && (
                    <span className="ml-2">{selectedFile.name}</span>
                )}
            </div>
            
            <button
                onClick={handleUpload}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow"
            >
                Upload Profile Picture
            </button>
            
            <div className="mt-4">
                {user.profilePic && user.profilePic.data ? (
                    <img
                        src={`data:${user.profilePic.contentType};base64,${Buffer.from(user.profilePic.data).toString('base64')}`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                ) : (
                    <img
                        src={defaultProfilePic}
                        alt="Default Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;
