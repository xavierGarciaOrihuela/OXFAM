// src/Register.js
import './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Aquí puedes agregar la lógica de autenticación
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
      });
    
      if (response.data === 'OK') {
        navigate('/home');
      } else {
        // Handle other cases, maybe show an error message to the user
        console.error('Registration failed:', response.data);
      }
    } catch (error) {
      // Handle the error, log it, or show an error message to the user
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className='login-container'>
      <h2 className='login-title'>Registrarse</h2>
      <input className='login-input'
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input className='login-input'
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='login-button' onClick={handleRegister}>Registrarse</button>
    </div>
  );
};

export default Register