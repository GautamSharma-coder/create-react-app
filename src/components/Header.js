import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import logo from './logo.png';
import { Navbar, Nav, Container, Alert, Dropdown } from 'react-bootstrap';

function Header() {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role);
        }
      } else {
        setRole(null);
      }
    };
    fetchUserRole();
  }, [user]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setShowLogoutAlert(true);
        setRole(null);
      })
      .catch((error) => {
        console.error('Logout error: ', error);
      });
  };

  return (
    <>
      {showLogoutAlert && (
        <Alert variant="success" onClose={() => setShowLogoutAlert(false)} dismissible>
          You have been logged out successfully.
        </Alert>
      )}
      <Navbar bg="light" expand="lg" className="py-3">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img 
              src={logo} 
              alt="Code Art Logo" 
              width="50" 
              height="50" 
              className="d-inline-block align-top" 
            />
            {' '}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
              
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  {role === 'admin' && (
                    <Dropdown>
                      <Dropdown.Toggle variant="link" id="admin-dropdown">
                        Admin
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/addCourse">Add Course</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/coursePostByAdmin">Course Post</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/adminDashboard">Admin Dashboard</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                  <Nav.Link onClick={handleLogout} className="btn btn-danger">Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/auth-page">Login</Nav.Link>
                  {/*<Nav.Link as={Link} to="/signup">Signup</Nav.Link>*/}
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;