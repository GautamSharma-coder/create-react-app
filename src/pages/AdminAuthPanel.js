import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminRegister from './AdminRegister';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

function AdminAuthPanel() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register

  const toggleForm = () => {
    setIsLogin((prev) => !prev); // Toggle between login and registration forms
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow-sm w-100" style={{ maxWidth: '400px', borderRadius: '10px' }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{ fontWeight: 'bold' }}>
            {isLogin ? 'Admin Login' : 'Admin Registration'}
          </h2>
          {isLogin ? <AdminLogin /> : <AdminRegister />}
          <Row className="mt-3">
            <Col className="text-center">
              <Button variant="link" onClick={toggleForm} style={{ textDecoration: 'none', color: '#007bff' }}>
                {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminAuthPanel;