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
        <div className="chat-window-container flex flex-col h-full p-4 bg-[#001824] text-white">
            <div className="text-xl font-bold mb-4 text-center">
                <div className="flex items-center justify-start m-2 h-16 py-1 px-2 rounded-lg bg-[#00293D] text-white">
                    <FaRegUser className="mr-8 ml-2" />
                    {targetUser.username}
                </div>
            </div>
            
            <div className="flex-grow overflow-hidden">
                {filteredMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex mb-4 overflow-hidden ${msg.fromUserId === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-lg min-h-5 p-3  ${msg.fromUserId === user._id
                                ? 'bg-gradient-to-tr from-cyan-600 to-violet-800 text-white self-end rounded-br-xl rounded-tl-xl rounded-bl-xl'
                                : 'bg-gradient-to-br from-red-800 to-pink-400 text-white self-start rounded-bl-xl rounded-tr-xl rounded-br-xl'
                                }`}
                        >
                            <strong>{msg.fromUsername === user.username ? 'you' : msg.fromUsername}</strong>
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
