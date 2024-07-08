import React, { useState } from 'react';
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';

const Container = () => {
  const [targetUser, setTargetUser] = useState(null);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-screen max-w-screen-xl min-h-96 max-h-screen h-screen bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden flex">
        <div className="w-1/4 bg-gray-800 text-white">
          <SideBar setTargetUser={setTargetUser} />
        </div>
        <div className="w-3/4 bg-white">
          {targetUser ? (
            <ChatWindow targetUser={targetUser} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Container;
