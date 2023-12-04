// src/Login.js
import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    // Aquí puedes agregar la lógica de autenticación
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      }, {
        withCredentials: true,
      });

        if (response.data.status === 'error') {
          const errorMessage = response.data.message;
          setErrorMessage(errorMessage)
        }

        if (response.data === 'OK') {
          localStorage.setItem('currentUser', JSON.stringify(username));
          navigate('/home/')
        }
      }
      catch(error) {
          if (error.response) {
            const errorMessage = error.response.data.message;
            setErrorMessage(errorMessage);
          } else {
            console.error(error);
            setErrorMessage('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
          }
        }
      }
    

  return (
    
    <div className="login-container">
      <h2 className="login-title">Iniciar sesión</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        type="text"
        className="login-input"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="login-input"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={handleLogin}>
        Iniciar sesión
      </button>
    </div>
  );
};

export default Login;