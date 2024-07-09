import React, { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


const SendMessage = ({ onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    const addEmoji = (emoji) => {
        setNewMessage(newMessage + emoji.native);
    };

    return (
        <div className="send-message-container flex items-center">
            <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="emoji-button p-2 bg-blue-500 text-white rounded mr-2"
            >
                😊
            </button>
            {showEmojiPicker && (
                <div className="emoji-picker">
                    <Picker data={data} onEmojiSelect={addEmoji} />
                </div>
            )}
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
    );
};

export default SendMessage;
