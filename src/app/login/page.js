'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Replace this with actual login API logic
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      if (response.ok) {
        // On successful login, redirect
        router.push('/dashboard');
      } else {
        setLoginError(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setLoginError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="login-hero">
      <h1>Login to Your Account</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {loginError && <p className="error">{loginError}</p>}
      <p className="signup-link">
        Don't have an account? <Link href="/register">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
