import './App.css';
import {BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import DocumentsSection from './components/DocumentsSection';
import DocumentPage from './components/DocumentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navbar />}>
          <Route path='documents' element={<DocumentsSection />} />
          <Route path='documents/:name' element={<DocumentPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
