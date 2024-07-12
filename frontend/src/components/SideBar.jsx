import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSocket } from '../contexts/SocketContext';
import { CiMenuKebab } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom

const SideBar = ({ setTargetUser }) => {
    const { user, setUser } = useUser();
    const { onlineUsers } = useSocket();
    const malePic = 'https://www.w3schools.com/w3images/avatar2.png';
    const femalePic = 'https://www.w3schools.com/w3images/avatar4.png';
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch('http://localhost:3030/api/users/friends', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setFriends(data);
                } else {
                    console.error('Failed to fetch friends');
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3030/api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

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

    const handleFriendRequest = async (userId) => {
        console.log('Sending friend request to user:', userId);

        try {
            const response = await fetch('http://localhost:3030/api/users/friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                console.log('Friend request sent');
            } else {
                console.error('Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
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

    const filteredOnlineUsers = onlineUsers.filter(userInfo => userInfo.userId !== user._id && !friends.some(friend => friend._id === userInfo.userId));

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
            <h1 className="flex flex-col items-center justify-center text-2xl font-bold m-4 text-center">Friends</h1>
            <ul>
                {friends.length > 0 ? (
                    friends.map((friend) => (
                        <li
                            key={friend._id}
                            className="relative cursor-pointer flex text-xl m-2 items-center justify-between p-2 hover:bg-[#003D5C] rounded text-white transform hover:scale-105 transition duration-300 ease-in-out"
                            onClick={() => handleUserClick(friend)}
                        >
                            <div className="flex items-center">
                                <img
                                    src={friend.gender === "Male" ? malePic : femalePic}
                                    alt="user-profile"
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                                <span>{friend.username}</span>
                                {onlineUsers.some(onlineUser => onlineUser.userId === friend._id) ? (
                                    <span className="ml-2 text-green-500">●</span>
                                ) : (
                                    <span className="ml-2 text-red-500">●</span>
                                )}
                            </div>
                            <div className="relative">
                                <CiMenuKebab
                                    className="w-6 h-6 p-2 cursor-pointer rounded-full hover:bg-[#001824] transform scale-105 transition duration-300 ease-in-out"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setShowDropdown(showDropdown === friend._id ? null : friend._id);
                                    }}
                                />
                                {showDropdown === friend._id && (
                                    <div
                                        className="absolute right-0 top-8 bg-blue-600 text-black rounded p-2"
                                        ref={dropdownRef}
                                    >
                                        <button
                                            className="block w-full text-left hover:bg-gray-200 p-1"
                                            onClick={() => {
                                                handleFriendRequest(friend._id);
                                                setShowDropdown(null);
                                            }}
                                        >
                                            Send Friend Request
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-center">No friends found</li>
                )}
            </ul>

            <h1 className="flex flex-col items-center justify-center text-2xl font-bold m-4 text-center">Online Users</h1>
            <ul>
                {filteredOnlineUsers.length > 0 ? (
                    filteredOnlineUsers.map((onlineUser) => (
                        <li
                            key={onlineUser.userId}
                            className="relative cursor-pointer flex text-xl m-2 items-center justify-between p-2 hover:bg-[#003D5C] rounded text-white transform hover:scale-105 transition duration-300 ease-in-out"
                            onClick={() => handleUserClick(
                                {
                                    _id: onlineUser.userId,
                                    username: onlineUser.username,
                                    gender: onlineUser.gender
                                }

                            )}
                        >
                            <div className="flex items-center">
                                <img
                                    src={onlineUser.gender === "Male" ? malePic : femalePic}
                                    alt="user-profile"
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                                <span>{onlineUser.username}</span>
                                <span className="ml-2 text-green-500">●</span>
                            </div>
                            <div className="relative">
                                <CiMenuKebab
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setShowDropdown(showDropdown === onlineUser.userId ? null : onlineUser.userId);
                                    }}
                                />
                                {showDropdown === onlineUser.userId && (
                                    <div
                                        className="absolute right-0 top-8 bg-white text-black rounded p-2"
                                        ref={dropdownRef}
                                    >
                                        <button
                                            className="block w-full text-left hover:bg-gray-200 p-1"
                                            onClick={() => {
                                                handleFriendRequest(onlineUser.userId);
                                                setShowDropdown(null);
                                            }}
                                        >
                                            Send Friend Request
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-center">No online users found</li>
                )}
            </ul>
            
            <Link to="/requests" className="block mt-4 p-2 text-center hover:bg-[#003D5C] rounded text-white transform hover:scale-105 transition duration-300 ease-in-out">
                Pending Friend Requests
            </Link>
        </div>
    );
};

export default SideBar;
