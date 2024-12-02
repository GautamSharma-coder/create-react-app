import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., send email, save to DB)
    alert('Message sent!');
  };

  return (
    <Container className="mt-5">
      <h2>Contact Us</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter your name" 
            required 
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter your email" 
            required 
          />
        </Form.Group>
        <Form.Group controlId="formMessage" className="mt-3">
          <Form.Label>Message</Form.Label>
          <Form.Control 
            as="textarea" 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            rows={4} 
            required 
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Send</Button>
      </Form>
    </Container>
  );
}

export default ContactPage;