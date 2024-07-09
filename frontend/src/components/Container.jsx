// Container.jsx
import React, { useState } from 'react';
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';

const Container = () => {
  const [targetUser, setTargetUser] = useState(null);

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100">
      <div className="h-screen bg-white shadow-xl w-screen  overflow-hidden flex">
        <div className="w-1/5 bg-gray-800 text-white">
          <SideBar setTargetUser={setTargetUser} />
        </div>
        <div className="w-4/5 flex flex-col ">
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
