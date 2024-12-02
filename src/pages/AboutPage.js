import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'react-bootstrap';

function AboutPage() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow">
            <CardBody>
              <CardTitle as="h2" className="text-center">About Us</CardTitle>
              <CardText>
                <p>
                  Welcome to our online learning platform, where we're dedicated to providing high-quality education to individuals from all walks of life. Our mission is to make learning accessible, affordable, and enjoyable for everyone.
                </p>
                <h3>Our Story:</h3>
                <p>
                  Our platform was founded by a team of educators and entrepreneurs who were passionate about making a difference in the world through education. We saw an opportunity to leverage technology to make learning more accessible, affordable, and effective.
                </p>
                <h3>Our Mission:</h3>
                <p>
                  Our mission is to empower individuals to reach their full potential through education. We believe that everyone deserves access to high-quality education, regardless of their background, location, or financial situation.
                </p>
                <h3>Key Features:</h3>
                <ul>
                  <li>
                    <strong>Personalized Learning Paths</strong>: Our AI-powered platform creates customized learning paths tailored to your goals, interests, and learning style.
                    <p>
                      Our algorithm takes into account your strengths, weaknesses, and learning preferences to create a unique learning path that's optimized for your success.
                    </p>
                  </li>
                  <li>
                    <strong>Interactive Courses</strong>: Engage with interactive lessons, quizzes, and games that make learning fun and effective.
                    <p>
                      Our courses are designed to be engaging, interactive, and relevant to the modern world. We use a variety of multimedia elements, including videos, animations, and simulations, to make learning fun and effective.
                    </p>
                  </li>
                  <li>
                    <strong>Expert Instructors</strong>: Learn from experienced instructors and industry experts who are passionate about teaching and mentoring.
                    <p>
                      Our instructors are experts in their fields and have a passion for teaching and mentoring. They're dedicated to helping you succeed and providing personalized support and feedback.
                    </p>
                  </li>
                  <li>
                    <strong>Flexible Learning</strong>: Access our courses anytime, anywhere, and on any device, at your own pace.
                    <p>
                      Our platform is designed to be flexible and accessible, so you can learn whenever and wherever you want. Whether you're a busy professional or a stay-at-home parent, we've got you covered.
                    </p>
                  </li>
                  <li>
                    <strong>Community Support</strong>: Join a community of learners and get support from peers, instructors, and mentors.
                    <p>
                      Our community is a vibrant and supportive network of learners, instructors, and mentors. We provide a range of community features, including discussion forums, live chats, and social media groups, to help you connect with others and get support.
                    </p>
                  </li>
                  <li>
                    <strong>Certification and Credits</strong>: Earn recognized certifications and credits that can be applied to your career or further education.
                    <p>
                      Our courses are designed to provide recognized certifications and credits that can be applied to your career or further education. We partner with leading institutions and organizations to ensure that our certifications are recognized and respected.
                    </p>
                  </li>
                </ul>
                <p>
                  Whether you're looking to upskill, reskill, or simply explore new interests, we invite you to join our community of learners and start your journey today.
                </p>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;