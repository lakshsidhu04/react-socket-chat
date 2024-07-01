import './App.css';
import ButtonInterface from './components/ButtonInterface';
import MessageContainer from './components/MessageContainer';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import SideBar from './components/SideBar';
import LoginForm from './components/LoginForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Container from './components/Container';
function App() {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [name,setName] = useState('');

  // useEffect(() => {
  //   const newSocket = io('http://localhost:3030', { transports: ['websocket'] });
  //   setSocket(newSocket);
    
  //   newSocket.on('user-joined', (id) => {
  //     console.log('User joined with ID ' + id);
  //     setUsers((prevUsers) => [...prevUsers, id]);
  //   });

  //   newSocket.on('user-left', (id) => {
  //     console.log('User left with ID ' + id);
  //     setUsers((prevUsers) => prevUsers.filter((user) => user !== id));
  //   });

  //   const handleContextMenu = (event) => {
  //     event.preventDefault();
  //     console.log('Right-click detected');
  //     // Add any custom logic you need to handle right-click here
  //   };

  //   window.addEventListener('contextmenu', handleContextMenu);
    
  //   return () => {
  //     newSocket.disconnect();
  //     window.removeEventListener('contextmenu', handleContextMenu);
  //   };
  // }, []);
  
  // return (
  //   <div className="container">
  //         <MessageContainer socket={socket} users={users} />
  //         <ButtonInterface socket={socket} />
  //   </div>
  // );
  
  return (
    <>
      <BrowserRouter>
        <Routes>  
          <Route path="/" element={<LoginForm />} />
          <Route path="/chat" element={
            <Container />
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
