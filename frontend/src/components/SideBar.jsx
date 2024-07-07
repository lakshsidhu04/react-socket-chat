import React, { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSocket } from '../contexts/SocketContext';

const SideBar = ({ setTargetUser }) => {
    const { user } = useUser();
    const { onlineUsers } = useSocket();

    useEffect(() => {
        console.log('Current online users:', onlineUsers);
    }, [onlineUsers]);

    const handleUserClick = (clickedUser) => {
        if (user._id === clickedUser._id) {
            console.log('Cannot chat with yourself');
            return;
        }
        setTargetUser(clickedUser);
    };

    return (
        <div className="bg-gray-800 text-white h-full p-4">
            <h1 className="text-2xl font-bold mb-4">Online Users</h1>
            <ul>
                {onlineUsers.length > 0 ? (
                    onlineUsers.map((userInfo) => (
                        <li
                            key={userInfo.userId} // Changed key to userId
                            onClick={() => handleUserClick({ _id: userInfo.userId, username: userInfo.username })} // Changed socketId to userId
                            className="cursor-pointer p-2 hover:bg-gray-600 rounded"
                        >
                            {userInfo.username}
                        </li>
                    ))
                ) : (
                    <li>No users online</li>
                )}
            </ul>
        </div>
    );
};

export default SideBar;
