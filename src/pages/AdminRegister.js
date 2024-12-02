import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

function AdminRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Register the admin user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add the admin role to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        role: 'admin',  // Assign the role of 'admin'
      });

      setSuccess('Admin registered successfully!');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Failed to register admin. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow">
      <h2 className="text-center mb-4">Admin Registration</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            isInvalid={!!error} // Highlight field if there's an error
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            isInvalid={!!error} // Highlight field if there's an error
          />
          <Form.Control.Feedback type="invalid">
            Please provide a password.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Register as Admin'}
        </Button>
      </Form>
    </Container>
  );
}

export default AdminRegister;