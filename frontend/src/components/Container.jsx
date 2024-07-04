import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';
import { useUser } from '../contexts/UserContext';

const Container = () => {
  const { currentUser } = useUser();
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    console.log('Current User at container:', currentUser);
  }, [currentUser]);

  return (
    <div className="flex h-screen">
      <SideBar setTargetUser={setTargetUser} />
      {currentUser && targetUser && <ChatWindow targetUser={targetUser} />}
    </div>
  );
};

export default Container;
