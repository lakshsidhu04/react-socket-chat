// components/Container.jsx

import React, { useState } from 'react';
import SideBar from './SideBar';
import Chat from './Chat';

const Container = () => {
  const [targetUser, setTargetUser] = useState(null);

  return (
    <div className="flex h-screen">
      <SideBar setTargetUser={setTargetUser} />
      {targetUser && <Chat targetUser={targetUser} />}
    </div>
  );
};

export default Container;
