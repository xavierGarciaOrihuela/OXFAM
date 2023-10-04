import './App.css';
import {BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import DocumentsSection from './components/DocumentsSection';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navbar />}>
          <Route path='documents' element={<DocumentsSection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
