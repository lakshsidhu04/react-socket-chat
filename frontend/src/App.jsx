import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Container from './components/Container';
import { UserProvider } from './contexts/UserContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/chat" element={<Container />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
