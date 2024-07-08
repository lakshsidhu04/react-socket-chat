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
            alert('Cannot chat with yourself');
            return;
        }
        setTargetUser(clickedUser);
    };

    return (
        <div className="h-full p-4 bg-gradient-to-b from-purple-600 to-indigo-600 text-white">
            <h1 className="text-2xl font-bold mb-4 text-center">Online Users</h1>
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
                                className="cursor-pointer p-2 hover:bg-indigo-700 rounded text-white"
                            >
                                {userInfo.username}
                            </li>
                        ))
                ) : (
                    <li className="text-white">No other users online</li>
                )}
            </ul>
        </div>
    );
};

export default SideBar;
