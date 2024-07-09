import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '../contexts/UserContext';
import { AiOutlineSend } from 'react-icons/ai';

const ChatWindow = ({ targetUser }) => {
    const { socket, allMessages, setAllMessages } = useSocket();
    const { user } = useUser();
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || user._id === targetUser._id) {
            return;
        }

        const msg = {
            fromUserId: user._id,
            toUserId: targetUser._id,
            text: newMessage,
            fromUsername: user.username,
        };
        socket.emit('sendMessage', msg, (response) => {
            if (response.status === 'ok') {
                setAllMessages((prevMessages) => [...prevMessages, msg]);
                setNewMessage('');
            }
        });
    };

    const filteredMessages = allMessages.filter(
        (msg) => (msg.fromUserId === user._id && msg.toUserId === targetUser._id) ||
            (msg.fromUserId === targetUser._id && msg.toUserId === user._id)
    );

    return (
        <div className="chat-window-container flex flex-col h-full p-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
            <div className="text-xl font-bold mb-4 text-center">
                <div className="inline-block py-1 px-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    {targetUser.username}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                {filteredMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex mb-4 ${msg.fromUserId === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs rounded-lg p-3 ${msg.fromUserId === user._id
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-gray-300 text-black self-start'
                                }`}
                        >
                            <strong>{msg.fromUsername}</strong>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded mr-2 text-black"
                />
                <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded"
                >
                    <AiOutlineSend />
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
