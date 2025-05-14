import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Throw an error that will be caught below
        throw new Error(data.message || 'Login failed');
      }

      // Save the token and user info in localStorage
      localStorage.setItem('token', data.token);
      // Save only the necessary user data, not the entire object
      localStorage.setItem(
        'user',
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
        })
      );
      
      // Navigate to the add question page (Ext) after a successful login
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='bg-gradient-to-br from-mint-300 to-blue-200 min-h-screen py-10 px-4'>
    <div className="auth-container ">
      <h2>🔐 Login to Your Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="📧 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
        <button
          type="button"
          className="signup-btn"
          onClick={() => navigate('/signup')}
        >
          Don't have an account? Sign Up
        </button>
      </form>
    </div>
    </div>
  );
}

export default Login;
