import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import Conversation from './pages/Conversation';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Timeline from './pages/Timeline';
import { socket } from './socket';

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);


  return (
    <AuthProvider>
    <Router>
      <Header />
      {/* <ConnectionState isConnected={ isConnected } /> */}
      {/* <ConnectionManager /> */}
      <Routes>
        <Route path="/" element={<Timeline />} />
        <Route path="/chat" element={<Conversation socket={socket} />} />
        <Route path="/profile" element={<Profile />} />
{/*         
        <Route path="/create" element={<CreateBlogPage />} />  */}
        <Route path="/auth" >
          <Route path="login" element={<Login />} /> 
          <Route path="register" element={<Register />} /> 
        </Route>
        {/* <Route path="/not-authorized" element={<NotAuthorized />} /> */}
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
