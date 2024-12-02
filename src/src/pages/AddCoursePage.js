import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { firestore } from '../firebase'; // Make sure to import your firestore instance
import { doc, setDoc } from 'firebase/firestore';
//import './AddCoursePage.css'; // Optional, for styling

const AddCoursePage = () => {
  const [courseDetails, setCourseDetails] = useState({
    title: '',
    description: '',
    details: '',
    image: '',
    lessons: '',
    duration: '',
    level: '',
    rating: 0,
    instructor: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'lessons') {
      setCourseDetails((prev) => ({
        ...prev,
        [name]: value.split(',').map((lesson) => lesson.trim()), // Split input into an array
      }));
    } else {
      setCourseDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const courseId = courseDetails.title.toLowerCase().replace(/\s+/g, '-'); // Generate course ID from title
      await setDoc(doc(firestore, 'courses', courseId), {
        ...courseDetails,
        rating: parseFloat(courseDetails.rating),
      });
      setSuccess(true);
      // Reset form
      setCourseDetails({
        title: '',
        description: '',
        details: '',
        image: '',
        lessons: '',
        duration: '',
        level: '',
        rating: 0,
        instructor: '',
      });
    } catch (err) {
      console.error('Error adding course:', err);
      setError('Failed to add course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="add-course-page">
      <h2>Add New Course</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Course added successfully!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCourseTitle">
          <Form.Label>Course Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={courseDetails.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCourseDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={courseDetails.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCourseDetails">
          <Form.Label>Course Details</Form.Label>
          <Form.Control
            type="text"
            name="details"
            value={courseDetails.details}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCourseImage">
          <Form.Label>Course Image URL</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={courseDetails.image}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCourseLessons">
          <Form.Label>Lessons (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            name="lessons"
            value={courseDetails.lessons}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCourseDuration">
          <Form.Label>Duration</Form.Label>
          <Form.Control
            type="text"
            name="duration"
            value={courseDetails.duration}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCourseLevel">
          <Form.Label>Level</Form.Label>
          <Form.Control
            type="text"
            name="level"
            value={courseDetails.level}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCourseRating">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            name="rating"
            value={courseDetails.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            required
          />
        </Form.Group>

        <Form.Group controlId="formCourseInstructor">
          <Form.Label>Instructor Name</Form.Label>
          <Form.Control
            type="text"
            name="instructor"
            value={courseDetails.instructor}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Course'}
        </Button>
      </Form>
    </Container>
  );
};

export default AddCoursePage;