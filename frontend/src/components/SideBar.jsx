import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSocket } from '../contexts/SocketContext';
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { CiMenuKebab } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";

const SideBar = ({ setTargetUser }) => {
    const { user, setUser } = useUser();
    const { onlineUsers } = useSocket();
    const malePic = 'https://www.w3schools.com/w3images/avatar2.png';
    const femalePic = 'https://www.w3schools.com/w3images/avatar4.png';
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        console.log('Current online users:', onlineUsers);
    }, [onlineUsers]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleUserClick = (clickedUser) => {
        if (user._id === clickedUser._id) {
            console.log('Cannot chat with yourself');
            alert('Cannot chat with yourself');
            return;
        }
        setTargetUser(clickedUser);
    };

    const handleFriendRequest = (userId) => {
        console.log('Sending friend request to user:', userId);

    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3030/api/auth/logout', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                
                setUser(null);

                console.log('User logged out');
                console.log('Redirecting to login page');
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return (
        <div className="h-full p-4 bg-[#000e14] text-white">
            <div className="flex items-center justify-between mb-4">
                <Link to="/profile" className="flex items-center justify-center p-2 hover:bg-[#003D5C] rounded text-white transform hover:scale-105 transition duration-300 ease-in-out">
                    <img
                        src={user.gender === "Male" ? malePic : femalePic}
                        alt="profile"
                        className="w-10 h-10 rounded-full mr-2"
                    />
                    {user.username || 'User'}
                </Link>
                <button
                    className="text-white hover:text-red-500 transition duration-300 ease-in-out"
                    onClick={handleLogout}
                >
                    <IoIosLogOut className="w-8 h-8" />
                </button>
            </div>
            <h1 className="flex flex-col items-center justify-center text-2xl font-bold m-4 text-center">Online Users</h1>
            <ul>
                {onlineUsers.length > 1 ? (
                    onlineUsers
                        .filter((userInfo) => userInfo.userId !== user._id)
                        .map((userInfo) => (
                            <li
                                key={userInfo.userId}
                                className="relative cursor-pointer flex text-xl m-2 items-center justify-between p-2 hover:bg-[#003D5C] rounded text-white transform hover:scale-105 transition duration-300 ease-in-out"
                                onClick={() => handleUserClick({
                                    _id: userInfo.userId,
                                    username: userInfo.username,
                                    gender: userInfo.gender
                                })}
                            >
                                <div className="flex items-center">
                                    <img
                                        src={userInfo.gender === "Male" ? malePic : femalePic}
                                        alt="user-profile"
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <span className="flex-1 text-center">{userInfo.username}</span>
                                </div>
                                <div ref={dropdownRef}>
                                    <button
                                        className="focus:outline-none hover:bg-[#00141F] p-2 rounded-full transform hover:scale-110 transition duration-300 ease-in-out"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDropdown(userInfo.userId);
                                        }}
                                    >
                                        <CiMenuKebab />
                                    </button>
                                    {showDropdown === userInfo.userId && (
                                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-300 hover:bg-slate-400 rounded-md shadow-lg z-10">
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleFriendRequest(userInfo.userId)}
                                            >
                                                Add as Friend
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))
                ) : (
                    <li className="text-gray-200 text-center text-xl">No other users online</li>
                )}
            </ul>
        </div>
    );
};

export default SideBar;
