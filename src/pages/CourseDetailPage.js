import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, ListGroup, Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './CourseDetailPage.css';

function CourseDetailPage() {
  const { courseId } = useParams(); // Get course ID from URL params
  const [user] = useAuthState(auth);
  const [course, setCourse] = useState(null); // Store course data
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Fetch course details from Firestore
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRef = doc(firestore, 'courses', courseId); // Get reference to the course document
        const courseSnap = await getDoc(courseRef); // Fetch the course document

        if (courseSnap.exists()) {
          setCourse(courseSnap.data()); // Store course data in state
        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Fetch enrollment status for the user
  useEffect(() => {
    if (user && course) {
      checkEnrollment();
    }
  }, [user, course]);

  const checkEnrollment = async () => {
    try {
      const docRef = doc(firestore, 'enrollments', `${user.uid}_${courseId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnrollModal = () => setShowEnrollModal(!showEnrollModal);

  const enrollInCourse = async () => {
    setEnrollLoading(true);
    try {
      const enrollmentData = {
        userId: user.uid,
        courseId,
        title: course.title,
        enrollmentDate: new Date(),
      };

      // Save the enrollment data to Firestore
      await setDoc(doc(firestore, 'enrollments', `${user.uid}_${courseId}`), enrollmentData);
      setIsEnrolled(true);
      setShowEnrollModal(false);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto my-5" />;
  }

  if (!course) {
    return <p>Course not found</p>;
  }

  return (
    <Container className="course-detail-page">
      <Row>
        <Col md={8}>
          <Card className="course-detail-card">
            <Card.Img variant="top" src={course.image} />
            <Card.Body>
              <Card.Title>{course.title}</Card.Title>
              <Card.Text>{course.details}</Card.Text>

              <ListGroup variant="flush">
                <ListGroup.Item><strong>Duration:</strong> {course.duration}</ListGroup.Item>
                <ListGroup.Item><strong>Level:</strong> {course.level}</ListGroup.Item>
                <ListGroup.Item><strong>Rating:</strong> {course.rating} / 5</ListGroup.Item>
                <ListGroup.Item><strong>Instructor:</strong> {course.instructor}</ListGroup.Item>
              </ListGroup>

              <h5 className="mt-4">Lessons</h5>
              <ListGroup variant="flush">
                {course.lessons.map((lesson, index) => (
                  <ListGroup.Item key={index}>{lesson}</ListGroup.Item>
                ))}
              </ListGroup>

              {user ? (
                isEnrolled ? (
                  <Button variant="success" className="mt-4" disabled>
                    You are already enrolled
                  </Button>
                ) : (
                  <Button variant="primary" className="mt-4" onClick={handleEnrollModal} disabled={enrollLoading}>
                    {enrollLoading ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                )
              ) : (
                <p className="mt-4">Please log in to enroll in this course.</p>
              )}
            </Card.Body>
          </Card>

          {/* Course Reviews */}
          <Card className="mt-4">
            <Card.Body>
              <h5>Reviews</h5>
              {course.reviews && course.reviews.length > 0 ? (
                course.reviews.map((review, index) => (
                  <div key={index} className="review">
                    <strong>{review.username}</strong> rated it {review.rating}/5
                    <p>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enroll Modal */}
      <Modal show={showEnrollModal} onHide={handleEnrollModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enroll in {course.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are about to enroll in this course. Please confirm your enrollment.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEnrollModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={enrollInCourse} disabled={enrollLoading}>
            {enrollLoading ? 'Enrolling...' : 'Confirm Enrollment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CourseDetailPage;



