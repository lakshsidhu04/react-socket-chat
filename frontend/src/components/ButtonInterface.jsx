import React from 'react';

const ButtonInterface = ({ socket }) => {
    const handleButtonClick = (message) => {
        socket.emit('chat-message', message);
    };

    return (
        <div className="flex space-x-4 mt-4">
            <button onClick={() => handleButtonClick('Hello!')} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                Send Hello
            </button>
            <button onClick={() => handleButtonClick('Goodbye!')} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                Send Goodbye
            </button>
        </div>
    );
};

export default ButtonInterface;
