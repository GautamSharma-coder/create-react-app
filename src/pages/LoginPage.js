import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Tabs, Tab, Toast, ToastContainer } from 'react-bootstrap';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default country code
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [loginMethod, setLoginMethod] = useState('email');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const setupRecaptcha = () => {
    const config = {
      size: 'normal',
      callback: (response) => {
        // reCAPTCHA solved, allow the user to proceed
      },
    };

    if (process.env.NODE_ENV === 'development') {
      config['appVerificationDisabledForTesting'] = true; // Only for development
    }

    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', config, auth);
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setToastMessage('Login successful!');
      setToastVariant('success');
      setShowToast(true);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      setToastMessage(err.message);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setupRecaptcha();
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setToastMessage('OTP sent to your phone.');
      setToastVariant('info');
      setShowToast(true);
    } catch (err) {
      setError(err.message);
      setToastMessage(err.message);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(otp);
      setToastMessage('Phone login successful!');
      setToastVariant('success');
      setShowToast(true);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      setToastMessage('Invalid OTP');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  // Input validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Password reset functionality
  const handlePasswordReset = async () => {
    try {
      await auth.sendPasswordResetEmail(email);
      setToastMessage('Password reset email sent!');
      setToastVariant('info');
      setShowToast(true);
    } catch (err) {
      setError(err.message);
      setToastMessage(err.message);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h4 className="text-center">Login</h4>
            </Card.Header>
            <Card.Body>
              <Tabs
                id="login-method"
                activeKey={loginMethod}
                onSelect={(k) => setLoginMethod(k)}
                className="mb-3"
                justify
              >
                <Tab eventKey="email" title="Login with Email">
                  <Form onSubmit={handleLoginWithEmail}>
                    <Form.Group controlId="formBasicEmail" className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                        required
                        isValid={validateEmail(email)}
                        isInvalid={!validateEmail(email)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
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
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                      Login with Email
                    </Button>
                    <Button variant="link" onClick={handlePasswordReset} className="w-100 mt-2">
                      Forgot Password?
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="phone" title="Login with Phone">
                  <Form onSubmit={handleSendOtp}>
                    <Form.Group controlId="formBasicCountryCode" className="mb-3">
                      <Form.Label>Country Code</Form.Label>
                      <Form.Control
                        as="select"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        required
                      >
                        <option value="+1">+1 (USA)</option>
                        <option value="+91">+91 (India)</option>
                        <option value="+44">+44 (UK)</option>
                        {/* Add more country codes as needed */}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicPhone" className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        isValid={validatePhoneNumber(phoneNumber)}
                        isInvalid={!validatePhoneNumber(phoneNumber)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid phone number.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div id="recaptcha-container"></div>
                    <Button variant="primary" type="submit" className="w-100">
                      Send OTP
                    </Button>
                  </Form>

                  {confirmationResult && (
                    <Form onSubmit={handleVerifyOtp} className="mt-3">
                      <Form.Group controlId="formBasicOtp">
                        <Form.Label>Enter OTP</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit" className="w-100">
                        Verify OTP
                      </Button>
                    </Form>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/signup">Sign Up</Link> {/* Link to SignupPage */}
          </p>
        </Col>
      </Row>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg={toastVariant}>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default LoginPage;