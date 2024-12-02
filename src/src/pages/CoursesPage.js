// CoursesPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore';

function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState([]); // State to hold fetched courses

  // Sample list of courses
  const sampleCourses = [
    {
      id: 'react-beginners',
      title: 'React for Beginners',
      category: 'Web Development',
      description: 'Learn the fundamentals of React.js.',
      image: 'https://via.placeholder.com/400x300?text=React+Course',
    },
    {
      id: 'advanced-js',
      title: 'Advanced JavaScript',
      category: 'Web Development',
      description: 'Master advanced JavaScript concepts.',
      image: 'https://via.placeholder.com/400x300?text=JS+Course',
    },
    {
      id: 'python-programming',
      title: 'Python Programming',
      category: 'Programming Languages',
      description: 'Master Python programming with real-world projects.',
      image: 'https://via.placeholder.com/400x300?text=Python+Course',
    },
    // Add more sample courses as needed
  ];

  // Fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(firestore, 'courses'); // Your Firestore collection name
        const courseSnapshot = await getDocs(coursesCollection);
        const courseList = courseSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(courseList); // Set the fetched courses in state
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses(sampleCourses); // Fallback to sample courses if there's an error
      }
    };

    fetchCourses();
  }, []);

  // Course categories for filtering
  const categories = ['All', 'Web Development', 'Programming Languages', 'Data Science', 'Machine Learning'];

  // Filtering logic based on search query and selected category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container className="courses-page">
      <h2 className="section-title text-center">Our Courses</h2>

      {/* Search Bar */}
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>

      {/* Category Filters */}
      <Row className="justify-content-center mb-4">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={selectedCategory === category ? 'primary' : 'outline-primary'}
            className="category-button"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </Row>

      {/* Courses List */}
      <Row>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Col key={course.id} md={4} className="mb-4">
              <Card className="course-card">
                <Card.Img variant="top" src={course.image} />
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="outline-primary">Learn More</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No courses found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default CoursesPage;








/*

// CoursesPage
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

function CoursesPage() {
  const courses = [
    { id: 1, title: 'React for Beginners', description: 'Learn React from scratch' },
    { id: 2, title: 'Advanced JavaScript', description: 'Deep dive into JavaScript' },
    { id: 3, title: 'Node.js and Express', description: 'Build server-side applications' },
  ];

  return (
    <Container className="mt-5">
      <h2>Courses</h2>
      <Row>
        {courses.map((course) => (
          <Col md={4} key={course.id}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                <Button as={Link} to={`/courses/${course.id}`} variant="primary">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CoursesPage;
*/