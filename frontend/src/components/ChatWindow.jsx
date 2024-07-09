import React, { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '../contexts/UserContext';
import { FaRegUser } from 'react-icons/fa6';
import SendMessage from './SendMessage';

const ChatWindow = ({ targetUser }) => {
    const { socket, allMessages, setAllMessages } = useSocket();
    const { user } = useUser();

    const handleSendMessage = (newMessage) => {
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
                <div className="flex items-center justify-center h-16 py-1 px-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    <FaRegUser className="mr-2" />
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
                            className={`max-w-xs p-3  ${msg.fromUserId === user._id
                                ? 'bg-blue-500 text-white self-end rounded-br-xl rounded-tl-xl rounded-bl-xl'
                                : 'bg-gray-100 text-black self-start rounded-bl-xl rounded-tr-xl rounded-br-xl'
                                }`}
                        >
                            <strong>{msg.fromUsername}</strong>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <SendMessage onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatWindow;
