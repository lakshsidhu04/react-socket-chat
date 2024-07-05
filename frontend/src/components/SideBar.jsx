import React, { useEffect, useState } from 'react';
import { startChat } from '../services/ChatService';
import { useUser } from '../contexts/UserContext';

const SideBar = ({ setTargetUser }) => {
    const [users, setUsers] = useState([]);
    const { user } = useUser();
    
    useEffect(() => {
        fetchUsers();
        console.log('Current User at sidebar:', user);
    }, [user]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3030/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUserClick = (user) => {
        if (user && user._id !== user._id) {
            setTargetUser(user);
            startChat({ fromUserId: user._id, toUserId: user._id });
        } else if (user && user._id === user._id) {
            console.log('Cannot chat with yourself');
        }
    };

    return (
        <div className="bg-gray-800 text-white h-full p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <ul>
                {users.map((user) => (
                    <li
                        key={user._id}
                        onClick={() => handleUserClick(user)}
                        className="cursor-pointer p-2 hover:bg-gray-600 rounded"
                    >
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar;
