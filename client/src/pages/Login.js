import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await axios.post('/auth/login', { email, password });
  
      console.log('Login Response:', res.data);
  
      if (res.data.user?.token) {
        // Store token and user details in localStorage
        localStorage.setItem('token', res.data.user.token); // Save token separately
        localStorage.setItem('user', JSON.stringify(res.data.user)); // Save user info
        navigate('/home');
      } else {
        setError('Login failed. No token received.');
      }
    } catch (err) {
      console.error('Error during login:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <i className="fas fa-user-circle"></i> {/* Replace with your logo if available */}
        </div>
        <h1>Iniciar sesión</h1>
        <p>
          ¿No tienes una cuenta?{' '}
          <span className="create-account"><a href='/register'>Empieza hoy!</a></span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <div className="password-field">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                required
              />
              <i className="fas fa-eye-slash"></i> {/* Optional password toggle */}
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <p className="forgot-password">¿Olvidaste tu contraseña?</p>
          <button type="submit" className="login-button">Continua</button>
        </form>
        <div className="divider">
          <span>Ingenieros</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
