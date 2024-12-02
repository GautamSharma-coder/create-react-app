import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Assuming you've initialized firebase correctly
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';

function CoursePostByAdmin() {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    details: '',
    image: '',
    lessons: '',
    duration: '',
    level: '',
    instructor: '',
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch existing courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'courses'));
        const fetchedCourses = [];
        querySnapshot.forEach((doc) => {
          fetchedCourses.push({ id: doc.id, ...doc.data() });
        });
        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Error fetching courses: ", err);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handlePostCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const lessonsArray = courseData.lessons.split(',').map(lesson => lesson.trim());

      await addDoc(collection(firestore, 'courses'), {
        ...courseData,
        lessons: lessonsArray, // Split the lessons into an array
      });

      setSuccess('Course posted successfully!');
      setCourseData({
        title: '',
        description: '',
        details: '',
        image: '',
        lessons: '',
        duration: '',
        level: '',
        instructor: '',
      });

      // Fetch courses again to update the list
      const querySnapshot = await getDocs(collection(firestore, 'courses'));
      const fetchedCourses = [];
      querySnapshot.forEach((doc) => {
        fetchedCourses.push({ id: doc.id, ...doc.data() });
      });
      setCourses(fetchedCourses);

    } catch (err) {
      setError('Failed to post course. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Admin Dashboard</h2>

      {/* Course Posting Form */}
      <Row className="mt-4">
        <Col md={6}>
          <h4>Post a New Course</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handlePostCourse}>
            <Form.Group controlId="formTitle" className="mt-3">
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={courseData.description}
                onChange={handleInputChange}
                placeholder="Enter course description"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDetails" className="mt-3">
              <Form.Label>Details</Form.Label>
              <Form.Control
                as="textarea"
                name="details"
                rows={3}
                value={courseData.details}
                onChange={handleInputChange}
                placeholder="Enter course details"
              />
            </Form.Group>

            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={courseData.image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </Form.Group>

            <Form.Group controlId="formLessons" className="mt-3">
              <Form.Label>Lessons (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="lessons"
                value={courseData.lessons}
                onChange={handleInputChange}
                placeholder="Lesson 1, Lesson 2, Lesson 3..."
                required
              />
            </Form.Group>

            <Form.Group controlId="formDuration" className="mt-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={courseData.duration}
                onChange={handleInputChange}
                placeholder="Enter duration (e.g., 8 hours)"
                required
              />
            </Form.Group>

            <Form.Group controlId="formLevel" className="mt-3">
              <Form.Label>Level</Form.Label>
              <Form.Control
                type="text"
                name="level"
                value={courseData.level}
                onChange={handleInputChange}
                placeholder="Enter course level (e.g., Beginner, Intermediate)"
                required
              />
            </Form.Group>

            <Form.Group controlId="formInstructor" className="mt-3">
              <Form.Label>Instructor</Form.Label>
              <Form.Control
                type="text"
                name="instructor"
                value={courseData.instructor}
                onChange={handleInputChange}
                placeholder="Enter instructor name"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
              {loading ? 'Posting...' : 'Post Course'}
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          <h4>Existing Courses</h4>
          <Row>
            {courses.length > 0 ? (
              courses.map((course) => (
                <Col md={12} key={course.id} className="mt-3">
                  <Card>
                    <Card.Img variant="top" src={course.image || 'https://via.placeholder.com/400x300'} />
                    <Card.Body>
                      <Card.Title>{course.title}</Card.Title>
                      <Card.Text>{course.description}</Card.Text>
                      <Card.Text><strong>Level:</strong> {course.level}</Card.Text>
                      <Card.Text><strong>Instructor:</strong> {course.instructor}</Card.Text>
                      <Card.Text><strong>Duration:</strong> {course.duration}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No courses found</p>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CoursePostByAdmin;