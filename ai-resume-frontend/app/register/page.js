'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, TextField, Button } from '@mui/material';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const res = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    if (res.ok) {
      alert('Registration successful! Please login.');
      router.push('/login');
    } else {
      const error = await res.json();
      alert('Error: ' + error.detail);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Register
        </Button>
      </form>
    </Container>
  );
}