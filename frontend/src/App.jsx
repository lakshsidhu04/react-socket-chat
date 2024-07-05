import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Container from './components/Container';
import { SocketProvider } from './contexts/SocketContext';
import { UserProvider } from './contexts/UserContext';

const App = () => {
  return (
    <UserProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/chat" element={<Container />} />
          </Routes>
        </Router>
      </SocketProvider>
    </UserProvider>
  );
};
export default App;
