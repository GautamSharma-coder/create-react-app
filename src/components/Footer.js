import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              We are an online learning platform offering a variety of courses
              to help you upgrade your skills. Join us to start learning today!
            </p>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>Email:  code4u@gmail.com </li>
              <li>Phone: +91 94793 93900 </li>
              <li>Address: 123 Main Street, Bihar , India</li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white">Facebook</a>
              </li>
              <li>
                <a href="/" className="text-white">Twitter</a>
              </li>
              <li>
                <a href="/" className="text-white">Instagram</a>
              </li>
              <li>
                <a href="/" className="text-white">LinkedIn</a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Code Art. All Rights Reserved.</p>
            

          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;