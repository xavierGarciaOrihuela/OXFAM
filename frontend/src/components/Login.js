import React, { useState } from 'react';
import './Login.css';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    /*try {
      const response = await fetch('../../../backend/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }
      const data = await response.json();
      onLogin({ username, password });
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
    }*/
    onLogin({ username, password });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <div className="login-input-container">
        <label className="login-label">Usuario:</label>
        <input className="login-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="login-input-container">
        <label className="login-label">Contraseña:</label>
        <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="login-button" onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
};

export default LoginForm;