// app/page.js
'use client';

import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to AI Resume SaaS
      </Typography>
      <Typography variant="h6" gutterBottom>
        Optimize your resume and generate tailored cover letters using AI.
      </Typography>
      <div style={{ marginTop: '2rem' }}>
        <Button variant="contained" color="primary" style={{ marginRight: '1rem' }}>
          <Link href="/register" style={{ color: '#fff', textDecoration: 'none' }}>
            Register
          </Link>
        </Button>
        <Button variant="contained" color="secondary">
          <Link href="/login" style={{ color: '#fff', textDecoration: 'none' }}>
            Login
          </Link>
        </Button>
      </div>
    </Container>
  );
}
