import React, { useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '../contexts/UserContext';
import SendMessage from './SendMessage';

const ChatWindow = ({ targetUser }) => {
    const { socket, allMessages, setAllMessages } = useSocket();
    const { user } = useUser();
    const chatWindowRef = useRef(null);
    const malePic = 'https://www.w3schools.com/w3images/avatar2.png';
    const femalePic = 'https://www.w3schools.com/w3images/avatar4.png';

    const handleSendMessage = (newMessage) => {
        if (newMessage.trim() === '' || user._id === targetUser._id) {
            return;
        }

        const msg = {
            fromUserId: user._id,
            toUserId: targetUser._id,
            text: newMessage,
            fromUsername: user.username,
            status: 'sent'
        };

        console.log('Sending message:', msg);

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

    useEffect(() => {
        socket.on('receiveMessage', (msg) => {
            console.log('Message received:', msg);
            setAllMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on('messageStatusUpdated', (msg) => {
            console.log('Message status updated:', msg);
            setAllMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message._id === msg._id ? { ...message, status: msg.status } : message
                )
            );
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('messageStatusUpdated');
        };
    }, [socket, setAllMessages]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                chatWindowRef.current.scrollTop + chatWindowRef.current.clientHeight >=
                chatWindowRef.current.scrollHeight
            ) {
                socket.emit('messageSeen', { fromUserId: targetUser._id, toUserId: user._id });
            }
        };

        chatWindowRef.current.addEventListener('scroll', handleScroll);

        return () => {
            chatWindowRef.current.removeEventListener('scroll', handleScroll);
        };
    }, [socket, user._id, targetUser._id]);

    return (
        <div className="chat-window-container flex flex-col h-full p-4 bg-[#001824] text-white relative">
            <div className="flex justify-between items-center mb-4 w-full">
                <div className="flex items-center justify-between w-full p-2 rounded-lg bg-[#00293D] text-white shadow-lg">
                    <div className="flex items-center">
                        <img
                            src={targetUser.gender === 'Male' ? malePic : femalePic}
                            alt="profile"
                            className="w-10 h-10 rounded-full mr-4"
                        />
                        <span className="text-xl font-semibold">{targetUser.username}</span>
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-auto" ref={chatWindowRef}>
                {filteredMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex mb-4 ${msg.fromUserId === user._id ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-lg p-3 ${msg.fromUserId === user._id
                                    ? 'bg-gradient-to-tr from-cyan-600 to-violet-800 text-white self-end rounded-br-xl rounded-tl-xl rounded-bl-xl'
                                    : 'bg-gradient-to-br from-red-800 to-pink-400 text-white self-start rounded-bl-xl rounded-tr-xl rounded-br-xl'
                                }`}
                        >
                            <strong>{msg.fromUserId === user._id ? 'You' : msg.fromUsername}</strong>
                            <p>{msg.text}</p>
                            {msg.fromUserId === user._id && (
                                <div className="flex justify-end items-center mt-1">
                                    {msg.status === 'sent' && (
                                        <span className="text-gray-400 text-xs">Sent</span>
                                    )}
                                    {msg.status === 'received' && (
                                        <span className="text-blue-400 text-xs">Received</span>
                                    )}
                                    {msg.status === 'seen' && (
                                        <span className="text-green-400 text-xs">Seen</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <SendMessage onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatWindow;
