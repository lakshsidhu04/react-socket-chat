import React from 'react';

const MessageTemplate = ({ user, message, isSelf }) => {
    return (
        <div className={`flex items-center space-x-2 ${isSelf ? 'justify-end' : ''}`}>
            <div className={`p-2 rounded ${isSelf ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <span className="font-semibold">{user}:</span>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default MessageTemplate;
