import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation, Link} from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/adminDashboard';
  //const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in the admin user with Firebase Authentication
     const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //  navigate(from, { replace: true });
      // Redirect or show success message
      // Example: window.location.href = "/admin/dashboard";
      // Check if the user has the 'admin' role in Firestore
      const user = userCredential.user;
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        // Redirect to admin dashboard
        navigate('/adminDashboard');
      } else {
        setError('Access denied. You are not an admin.');
      }
   
      
      
    } catch (err) {
      setError('Failed to log in. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Handle password reset logic
    if (email) {
      auth.sendPasswordResetEmail(email)
        .then(() => {
          setError('Password reset email sent. Please check your inbox.');
        })
        .catch(err => {
          setError('Failed to send password reset email. ' + err.message);
        });
    } else {
      setError('Please enter your email address to reset your password.');
    }
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow">
      <h2 className="text-center mb-4">Admin Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
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
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Remember Me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Login as Admin'}
        </Button>
      </Form>

      <div className="text-center mt-3">
        <Button variant="link" onClick={handleForgotPassword}>
          Forgot Password?
        </Button>
      </div>
    </Container>
  );
}

export default AdminLogin;