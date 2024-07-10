import React, { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSocket } from '../contexts/SocketContext';
import { FaRegUser } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
const SideBar = ({ setTargetUser }) => {
    const { user } = useUser();
    const { onlineUsers } = useSocket();

    useEffect(() => {
        console.log('Current online users:', onlineUsers);
    }, [onlineUsers]);

    const handleUserClick = (clickedUser) => {
        if (user._id === clickedUser._id) {
            console.log('Cannot chat with yourself');
            alert('Cannot chat with yourself');
            return;
        }
        setTargetUser(clickedUser);
    };

    return (
        <div className="h-full p-4 bg-[#000e14] text-white">
            
            <Link to="/profile" className="flex items-center justify-center p-2 hover:bg-[#003D5C] rounded text-white"> 
                <FaRegUser className="inline-block m-2" />
                Profile
            </Link>
            <h1 className="flex flex-col items-center justify-center text-2xl font-bold m-4 text-center">Online Users</h1>
            <ul>
                {onlineUsers.length > 1 ? (
                    onlineUsers
                        .filter((userInfo) => userInfo.userId !== user._id) // Filter out the current user
                        .map((userInfo) => (
                            <li
                                key={userInfo.userId}
                                onClick={() =>
                                    handleUserClick({
                                        _id: userInfo.userId,
                                        username: userInfo.username,
                                    })
                                }
                                className="cursor-pointer flex text-xl  items-center justify-center p-2 hover:bg-[#003D5C] rounded text-white"
                            >
                                <FaUserCircle className="inline-block mr-2" />
                                {userInfo.username}
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
