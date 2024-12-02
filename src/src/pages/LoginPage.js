import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Form, 
  Button, 
  Container, 
  Row, 
  Col, 
  Card, 
  Tabs, 
  Tab, 
  Toast, 
  ToastContainer, 
  InputGroup 
} from 'react-bootstrap';
import { Inbox, Lock, Phone } from 'lucide-react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [loginMethod, setLoginMethod] = useState('email');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('weak');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, you can proceed with phone number verification
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
          showToastMessage('reCAPTCHA expired. Please try again.', 'warning');
        }
      });
    }
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToastMessage('Login successful!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Email login error:", err);
      showToastMessage(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validatePhoneNumber(phoneNumber)) {
      showToastMessage("Please enter a valid phone number.", 'danger');
      return;
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      showToastMessage('OTP sent to your phone.', 'info');
    } catch (err) {
      console.error("Error sending OTP:", err);
      showToastMessage(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!confirmationResult) {
      showToastMessage('No OTP sent. Please try again.', 'danger');
      return;
    }
    try {
      await confirmationResult.confirm(otp);
      showToastMessage('Phone login successful!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      console.error("OTP verification error:", err);
      showToastMessage('Invalid OTP. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      showToastMessage('Please enter a valid email address.', 'warning');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showToastMessage('Password reset email sent!', 'info');
    } catch (err) {
      console.error("Password reset error:", err);
      showToastMessage(err.message, 'danger');
    }
  };
  const showToastMessage = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
    if (password.length < 8) {
      setPasswordStrength('weak');
    } else if (password.length < 12) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col 
          xs={12} 
          sm={10} 
          md={8} 
          lg={6} 
          xl={5} 
          className="mx-auto"
        >
          <Card className="shadow-lg">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">Welcome Back</h2>
              <Tabs
                id="login-method"
                activeKey={loginMethod}
                onSelect={(k) => setLoginMethod(k)}
                className="mb-4 justify-content-center"
              >
                <Tab eventKey="email" title="Email">
                  <Form onSubmit={handleLoginWithEmail}>
                    <Form.Group controlId="formBasicEmail" className="mb-3">
                      <InputGroup>
                        <InputGroup.Text>
                          <Inbox size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          isValid={validateEmail(email)}
                          isInvalid={email && !validateEmail(email)}
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" className="mb-3">
                      <InputGroup>
                        <InputGroup.Text>
                          <Lock size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid password.
                      </Form.Control.Feedback>
                      <div className="password-strength">
                        <span className={`password-strength-${passwordStrength}`}>{passwordStrength}</span>
                      </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                      {loading ? 'Loading...' : 'Login'}
                    </Button>
                    <div className="text-center">
                      <Button variant="link" onClick={handlePasswordReset} className="px-0">
                        Forgot Password?
                      </Button>
                    </div>
                  </Form>
                </Tab>

                <Tab eventKey="phone" title="Phone">
                  <Form onSubmit={handleSendOtp}>
                    <Form.Group controlId="formBasicPhone" className="mb-3">
                      <InputGroup>
                        <InputGroup.Text>
                          <Phone size={18} />
                        </InputGroup.Text>
                        <Form.Control
                          as="select"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          required
                          className="w-15"
                        >
                          <option value="+1">+1</option>
                          <option value="+91">+91</option>
                          <option value="+44">+44</option>
                        </Form.Control>
                        <Form.Control
                          type="text"
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          isValid={validatePhoneNumber(phoneNumber)}
                          isInvalid={phoneNumber && !validatePhoneNumber(phoneNumber)}
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid phone number.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div id="recaptcha-container"></div>
                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                      {loading ? 'Loading...' : 'Send OTP'}
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
                                            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                        {loading ? 'Loading...' : 'Verify OTP'}
                      </Button>
                    </Form>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg={toastVariant}
          autohide
          delay={3000}
        >
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
  