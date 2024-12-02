import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Assuming Firebase is correctly initialized
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Container, Row, Col, Card, Button, Modal, Form, Pagination, Alert } from 'react-bootstrap';
import { FaCogs, FaSignOutAlt } from 'react-icons/fa';

import './AdminDashboard.css';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [adminDetails, setAdminDetails] = useState({
    name: 'Admin Name',
    profileImage: 'https://via.placeholder.com/150',
    coursesPosted: 0,
  });

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'courses'));
        const fetchedCourses = [];
        querySnapshot.forEach((doc) => {
          fetchedCourses.push({ id: doc.id, ...doc.data() });
        });
        setCourses(fetchedCourses);
        setAdminDetails((prev) => ({
          ...prev,
          coursesPosted: fetchedCourses.length,
        }));
      } catch (error) {
        console.error('Error fetching courses: ', error);
      }
    };

    fetchCourses();
  }, []);

  // Pagination Logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Course Editing
  const handleEditClick = (course) => setEditingCourse(course);
  const handleEditSave = () => {
    // Save edited course back to Firestore
    setEditingCourse(null); // Close modal after saving
  };
  const handleClose = () => setEditingCourse(null);

  return (
    <Container className="mt-5">
      {/* Admin Profile */}
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <div className="admin-profile d-flex align-items-center">
            <img
              src={adminDetails.profileImage}
              alt="Admin Profile"
              width="80"
              height="80"
              className="me-3"
            />
            <div>
              <h3>{adminDetails.name}</h3>
              <p>Courses Posted: {adminDetails.coursesPosted}</p>
            </div>
          </div>
        </Col>
        <Col md={4} className="text-end">
          <FaCogs
            className="settings-icon me-3"
            onClick={() => setShowSettingsModal(true)}
          />
          <FaSignOutAlt className="logout-icon" />
        </Col>
      </Row>

      {/* Courses List */}
      <Row>
        {currentCourses.length > 0 ? (
          currentCourses.map((course) => (
            <Col md={4} key={course.id} className="mt-3">
              <Card className="course-card">
                <Card.Img
                  variant="top"
                  src={course.image || 'https://via.placeholder.com/400x300'}
                />
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <Card.Text>
                    <strong>Level:</strong> {course.level}
                  </Card.Text>
                  <Card.Text>
                    <strong>Instructor:</strong> {course.instructor}
                  </Card.Text>
                  <Card.Text>
                    <strong>Duration:</strong> {course.duration}
                  </Card.Text>
                  <div className="text-center">
                    <Button variant="primary" onClick={() => handleEditClick(course)}>
                      Edit
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Alert variant="info">No courses found</Alert>
        )}
      </Row>

      {/* Pagination */}
      <Pagination className="mt-4 justify-content-center">
        {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Settings Modal */}
      <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAdminName">
              <Form.Label>Admin Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue={adminDetails.name}
                onChange={(e) =>
                  setAdminDetails({ ...adminDetails, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formProfileImage" className="mt-3">
              <Form.Label>Profile Image URL</Form.Label>
              <Form.Control
                type="text"
                defaultValue={adminDetails.profileImage}
                onChange={(e) =>
                  setAdminDetails({
                    ...adminDetails,
                    profileImage: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSettingsModal(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowSettingsModal(false)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Course Modal */}
      {editingCourse && (
        <Modal show={!!editingCourse} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCourseTitle">
                <Form.Label>Course Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formCourseDescription" className="mt-3">
                <Form.Label>Course Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingCourse.description}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formCourseLevel" className="mt-3">
                <Form.Label>Level</Form.Label>
                <Form.Control
                  type="text"
                  value={editingCourse.level}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, level: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formCourseDuration" className="mt-3">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="text"
                  value={editingCourse.duration}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      duration: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formCourseInstructor" className="mt-3">
                <Form.Label>Instructor</Form.Label>
                <Form.Control
                  type="text"
                  value={editingCourse.instructor}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      instructor: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formCourseImage" className="mt-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={editingCourse.image}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, image: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default AdminDashboard;