import React, { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { MdEmojiEmotions } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";
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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const addEmoji = (emoji) => {
        setNewMessage(newMessage + emoji.native);
    };

    return (
        <div className="send-message-container flex items-center">
            <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="emoji-button p-2 bg-[#00111A] border-white border-2 text-white rounded-md mr-2 text-2xl"
            >
                <MdOutlineEmojiEmotions />
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
                onKeyDown={handleKeyDown}
                className="flex-grow p-2 border border-gray-300 rounded mr-2 text-black outline-none focus:border-blue-500"
            />
            <button
                onClick={handleSendMessage}
                className="p-3 bg-blue-500 text-white rounded"
            >
                <AiOutlineSend />
            </button>
        </div>
    );
};

export default SendMessage;
