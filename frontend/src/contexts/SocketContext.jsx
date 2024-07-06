import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]); 

    const connectSocket = (userId) => {
        if (!socket) {
            const newSocket = io('http://localhost:3030', {
                query: { userId }
            });

            newSocket.on('connect', () => {
                console.log('New socket connected with id:', newSocket.id);
                setSocket(newSocket);
                console.log('User', userId, 'connected with socketid', newSocket.id);
            });
            
            newSocket.on('onlineUsers', (users) => {
                console.log('Online users:', users);
                setOnlineUsers(users);
            })
            return newSocket;
        }
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };
    
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
