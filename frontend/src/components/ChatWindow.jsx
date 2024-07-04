import React, { useEffect, useState } from 'react';
import { initSocket } from '../services/ChatService';
import { useUser } from '../contexts/UserContext';

const ChatWindow = ({ targetUser }) => {
    const { currentUser } = useUser();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = initSocket();
        setSocket(socketInstance);

        socketInstance.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (currentUser && targetUser && socket) {
            const roomName = [currentUser._id, targetUser._id].sort().join('_');
            socket.emit('joinRoom', { roomName });
        }
    }, [currentUser, targetUser, socket]);

    const handleSendMessage = () => {
        if (message.trim() !== '' && currentUser && targetUser && socket) {
            const roomName = [currentUser._id, targetUser._id].sort().join('_');
            const msg = {
                from: currentUser.name,
                text: message,
                room: roomName,
            };
            socket.emit('sendMessage', msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col p-4 bg-white h-full">
            {targetUser ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">Chat with {targetUser.name}</h2>
                    <div className="flex-grow overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className="mb-4">
                                <div className="font-bold">{msg.from}</div>
                                <div>{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <input
                            type="text"
                            className="border p-2 w-full"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button className="bg-blue-500 text-white p-2 mt-2 w-full" onClick={handleSendMessage}>
                            Send
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center h-full">
                    <p>Select a user to start chatting</p>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
