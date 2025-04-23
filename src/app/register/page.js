'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }

    // Replace this with actual registration API logic
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      if (response.ok) {
        // On successful registration, redirect to login page
        router.push('/login');
      } else {
        setRegisterError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setRegisterError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="login-hero">
      <h1>Create a New Account</h1>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {registerError && <p className="error">{registerError}</p>}
      <p className="signup-link">
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
