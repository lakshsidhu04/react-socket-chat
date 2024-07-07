import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '../contexts/UserContext';

const ChatWindow = ({ targetUser }) => {
    const { socket } = useSocket();
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (socket) {
            socket.on('receiveMessage', (msg) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
            });
        }

        return () => {
            if (socket) {
                socket.off('receiveMessage');
            }
        };
    }, [socket]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || user._id === targetUser._id) {
            return;
        }

        const msg = {
            fromUserId: user._id,
            toUserId: targetUser._id,
            text: newMessage,
        };
        socket.emit('sendMessage', msg, (response) => {
            if (response.status === 'ok') {
                setMessages((prevMessages) => [...prevMessages, msg]);
                setNewMessage('');
            }
        });
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex-grow overflow-y-auto bg-gray-200 p-4 rounded mb-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 mb-2 rounded ${msg.fromUserId === user._id ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded mr-2"
                />
                <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
