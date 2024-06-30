import React, { useState, useEffect } from 'react';
import MessageTemplate from './MessageTemplate';

const MessageContainer = ({ socket, users }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (socket) {
            socket.on('chat-message', (message, user) => {
                setMessages((prevMessages) => [...prevMessages, { user, message }]);
                console.log(message);
            });
        }

        return () => {
            if (socket) {
                socket.off('chat-message');
            }
        };
    }, [socket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            socket.emit('chat-message', input, socket.id); 
            setInput('');
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow-lg w-full max-w-md mx-auto mt-4">
            <div className="mb-4">
                <h4 className="text-xl font-semibold mb-2">Messages:</h4>
                <ul className="space-y-2">
                    {messages.map((message, index) => (
                        <li key={index}>
                            <MessageTemplate user={message.user} message={message.message} isSelf={message.user === socket.id} />
                        </li>
                    ))}
                </ul>
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Send</button>
            </form>
        </div>
    );
};

export default MessageContainer;
