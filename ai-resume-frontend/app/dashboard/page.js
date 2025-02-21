'use client';

import { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';

export default function DashboardPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a resume file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8000/analyze-resume/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    } else {
      const error = await res.json();
      alert('Upload failed: ' + error.detail);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        Upload Your Resume (PDF)
      </Typography>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} style={{ marginTop: '1rem' }}>
        Analyze
      </Button>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h5">Resume Summary</Typography>
          <Typography>{result.resume_summary}</Typography>
          <Typography variant="h5" style={{ marginTop: '1rem' }}>
            Generated Cover Letter
          </Typography>
          <Typography>{result.cover_letter}</Typography>
        </div>
      )}
    </Container>
  );
}
