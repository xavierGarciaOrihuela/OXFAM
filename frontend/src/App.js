import './App.css';
import {BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import DocumentsSection from './components/DocumentsSection';
import DocumentPage from './components/DocumentPage';
import ChatPage from './components/ChatPage';
import Login from './Login';
import Register from './Register'
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home' element={<Navbar/>}>
        <Route path='/home/documents' element={<DocumentsSection />} />
        <Route path='/home/documents/:name' element={<DocumentPage />}/>
        <Route path='/home/chat' element={<ChatPage />} />
      </Route>
      </Routes>

    </BrowserRouter>
  );
}


export default App;
