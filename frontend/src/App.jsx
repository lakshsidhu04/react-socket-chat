import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Container from './components/Container';
import { SocketProvider } from './contexts/SocketContext';
import { UserProvider } from './contexts/UserContext';
import Profile from './components/Profile';
import SignUpForm from './components/SignUpForm';
const App = () => {
  return (
    <UserProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/chat" element={<Container />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="/signup" element={<SignUpForm />} />
          </Routes>
        </Router>
      </SocketProvider>
    </UserProvider>
  );
};
export default App;
