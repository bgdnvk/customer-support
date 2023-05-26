'use client'
import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
      });

      if (response.ok) {
        console.log('User registered successfully');
      } else {
        const data = await response.json();
        console.log('Registration failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Register as any role (you need to have an agent to add a case)</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br></br>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br></br>
      <input
        type="text"
        placeholder="agent"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <br></br>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
