import React from 'react';
import { Container, Row, Col, Card, Carousel, Button } from 'react-bootstrap';
import './HomePage.css'; // Add your custom CSS for styling

function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section with Carousel */}
      <section className="hero-section">
        <Carousel className="hero-carousel">
          <Carousel.Item>
            <img
              className="d-block w-100 hero-image"
              src="https://via.placeholder.com/1200x500?text=Learn+from+Experts"
              alt="First slide"
            />
            <Carousel.Caption className="hero-caption">
              <h1 className="hero-title">Learn from Experts</h1>
              <p className="hero-text">Upskill yourself with top-tier courses and hands-on experience.</p>
              <Button variant="primary" className="hero-button">Get Started</Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 hero-image"
              src="https://via.placeholder.com/1200x500?text=Upgrade+Your+Skills"
              alt="Second slide"
            />
            <Carousel.Caption className="hero-caption">
              <h1 className="hero-title">Upgrade Your Skills</h1>
              <p className="hero-text">Access courses that are industry-relevant and future-proof.</p>
              <Button variant="primary" className="hero-button">Explore Now</Button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* Latest Courses Section */}
      <section className="latest-courses">
        <Container>
          <h2 className="section-title text-center">Latest Courses</h2>
          <Row className="course-grid">
            {latestCourses.map((course, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="course-card">
                  <Card.Img variant="top" src={course.image} />
                  <Card.Body>
                    <Card.Title className="course-title">{course.title}</Card.Title>
                    <Card.Text className="course-description">{course.description}</Card.Text>
                    <Button variant="outline-primary" className="course-button">Learn More</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Explore Categories Section */}
      <section className="explore-section">
        <Container>
          <h2 className="section-title text-center">Explore Our Categories</h2>
          <Row>
            {exploreCategories.map((category, index) => (
              <Col key={index} md={3} sm={6} className="mb-4 text-center">
                <Card className="explore-card">
                  <Card.Body>
                    <Card.Title className="explore-title">{category.title}</Card.Title>
                    <Card.Text className="explore-description">{category.description}</Card.Text>
                    <Button variant="outline-secondary" className="explore-button">Explore</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container>
          <h2 className="section-title text-center">What Our Students Say</h2>
          <Row className="testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="testimonial-card">
                  <Card.Body>
                    <Card.Text className="testimonial-text">"{testimonial.text}"</Card.Text>
                    <Card.Subtitle className="testimonial-author">- {testimonial.name}</Card.Subtitle>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
}

// Sample Data for Latest Courses
const latestCourses = [
  {
    title: "React for Beginners",
    description: "Learn the fundamentals of React.js in this beginner-friendly course.",
    image: "https://via.placeholder.com/400x300?text=React+Course",
  },
  {
    title: "Advanced JavaScript",
    description: "Deep dive into the advanced concepts of JavaScript.",
    image: "https://via.placeholder.com/400x300?text=JS+Course",
  },
  {
    title: "Python Programming",
    description: "Master Python with hands-on examples and real-world projects.",
    image: "https://via.placeholder.com/400x300?text=Python+Course",
  },
];

// Sample Data for Explore Categories
const exploreCategories = [
  { title: "Web Development", description: "HTML, CSS, JavaScript, and more." },
  { title: "Data Science", description: "Data analysis, visualization, and more." },
  { title: "Artificial Intelligence", description: "Machine learning, neural networks." },
  { title: "Mobile Development", description: "iOS, Android, React Native." },
];

// Sample Data for Testimonials
const testimonials = [
  {
    text: "This platform helped me land my dream job. The courses are top-notch!",
    name: "John Doe",
  },
  {
    text: "I loved the learning experience, very interactive and informative.",
    name: "Jane Smith",
  },
  {
    text: "The instructors are industry experts, and their insights are invaluable.",
    name: "Mark Johnson",
  },
];

//export default Home;
export default HomePage;