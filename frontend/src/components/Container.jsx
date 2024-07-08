import React, { useState } from 'react';
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';

const Container = () => {
  const [targetUser, setTargetUser] = useState(null);

  return (
    <div className="flex h-screen">
      <div className="w-1/4">
        <SideBar setTargetUser={setTargetUser} />
      </div>
      <div className="w-3/4">
        {targetUser ? (
          <ChatWindow targetUser={targetUser} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Container;
