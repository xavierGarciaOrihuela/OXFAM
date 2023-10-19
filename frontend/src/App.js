import './App.css';

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DocumentsSection from './components/DocumentsSection';
import DocumentPage from './components/DocumentPage';
import ChatPage from './components/ChatPage';
import Login from './components/Login'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setLoggedIn(true);
    setUsername(user);
  };

  return (
    <BrowserRouter>
      <Routes>
        {loggedIn ? (
          <>
            <Route path='/' element={<Navbar />}>
              <Route path='documents' element={<DocumentsSection />} />
              <Route path='documents/:name' element={<DocumentPage />} />
              <Route path='chat' element={<ChatPage />} />
            </Route>
            <Route path='*' element={<Navigate to="/documents" />} />
          </>
        ) : (
          <Route path='/' element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

