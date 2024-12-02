import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '../firebase';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Image, Row, Col, Toast, Card, Spinner, Pagination } from 'react-bootstrap';

function UserDashboard() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState({
    name: '',
    bio: '',
    location: '',
    gender: '',
    imageURL: '',
    enrolledCourses: [], 
    completedCourses: [] 
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [coursesDetails, setCoursesDetails] = useState([]); 
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const docRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          ...data,
          enrolledCourses: data.enrolledCourses || [], 
          completedCourses: data.completedCourses || [] 
        });
        await fetchCoursesDetails(data.enrolledCourses || []); 
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
      setError('Failed to fetch user data.');
    }
  };

  const fetchCoursesDetails = async (enrolledCourses) => {
    if (enrolledCourses.length === 0) {
      return;
    }

    try {
      const coursesPromises = enrolledCourses.map(courseId =>
        getDoc(doc(firestore, 'courses', courseId))
      );
      const courseDocs = await Promise.all(coursesPromises);
      const courses = courseDocs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCoursesDetails(courses);
    } catch (err) {
      console.error('Error fetching course details: ', err);
      setError('Failed to fetch course details.');
    }
  };

  const handleImageUpload = async () => {
    if (newImage) {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, newImage);
      const url = await getDownloadURL(storageRef);
      return url;
    }
    return userData.imageURL;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageURL = await handleImageUpload();
      await setDoc(doc(firestore, 'users', user.uid), {
        ...userData,
        imageURL: imageURL
      });

      setToastMessage('Profile updated successfully!');
      setToastVariant('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error updating profile: ', error);
      setToastMessage('Error updating profile. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const enrollInCourse = async (courseId) => {
    try {
      const courseRef = doc(firestore, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        const courseData = courseSnap.data();
        await setDoc(doc(firestore, 'users', user.uid), {
          ...userData,
          enrolledCourses: [...userData.enrolledCourses, courseId]
        });
        setToastMessage('Enrolled in course successfully!');
        setToastVariant('success');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error enrolling in course: ', error);
      setToastMessage('Error enrolling in course. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    }
  };
  const completeCourse = async (courseId) => {
    try {
      const courseRef = doc(firestore, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        const courseData = courseSnap.data();
        await setDoc(doc(firestore, 'users', user.uid), {
          ...userData,
          completedCourses: [...userData.completedCourses, courseId]
        });
        setToastMessage('Course completed successfully!');
        setToastVariant('success');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error completing course: ', error);
      setToastMessage('Error completing course. Please try again.');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">User  Dashboard</h2>
      {error && <Toast className="bg-danger text-white"><Toast.Body>{error}</Toast.Body></Toast>}
      
      <Row>
  <Col md={4} className="text-center">
    {newImage && (
      <Image
        src={URL.createObjectURL(newImage)}
        roundedCircle
        alt="Profile Picture"
        width={150}
        height={150}
        className="mb-3"
      />
    )}
    {!newImage && (
      <Image
        src={userData.imageURL || 'https://via.placeholder.com/150'}
        roundedCircle
        alt="Profile Picture"
        width={150}
        height={150}
        className="mb-3"
      />
    )}
    <Form.Group controlId="formFile" className="mb-3">
      <Form.Label>Change Profile Image</Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={(e) => setNewImage(e.target.files[0])}
      />
    </Form.Group>
  </Col>
  <Col md={8}>
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Profile Information</Card.Title>
        <Form onSubmit={handleUpdateProfile}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </Form.Group>

          <Form.Group controlId="formBio" className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              rows={3}
              value={userData.bio}
              onChange={handleInputChange}
              placeholder="Enter a short bio"
            />
          </Form.Group>

          <Form.Group controlId="formLocation" className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={userData.location}
              onChange={handleInputChange}
              placeholder="Enter your location"
            />
          </Form.Group>

          <Form.Group controlId="formGender" className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" className="mb-3" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  </Col>
</Row>

      {/* Enrolled Courses Section */}
      <Row className="mt-5">
        <Col>
          <h3 className="mb-3">Enrolled Courses</h3>
          <Form.Control
            type="search"
            placeholder="Search for courses"
            onChange={handleSearch}
          />
          <Form.Control
            as="select"
            value={filter}
            onChange={handleFilter}
          >
            <option value="">All</option>
            <option value="category">Category</option>
            <option value="level">Level</option>
            <option value="rating">Rating</option>
          </Form.Control>
          {coursesDetails && coursesDetails.length > 0 ? (
            coursesDetails.map((course) => (
              <Card className="mb-3" key={course.id}>
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                                    <Card.Text><strong>Duration:</strong> {course.duration}</Card.Text>
                  <Card.Text><strong>Level:</strong> {course.level}</Card.Text>
                  <Card.Text><strong>Rating:</strong> {course.rating} / 5</Card.Text>
                  <Button variant="primary" onClick={() => enrollInCourse(course.id)}>Enroll in Course</Button>
                  <Button variant="primary" onClick={() => completeCourse(course.id)}>Complete Course</Button>
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="primary">View Course</Button>
                  </Link>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No courses enrolled yet.</p>
          )}
        </Col>
      </Row>

      {/* Completed Courses Section */}
      <Row className="mt-5">
        <Col>
          <h3 className="mb-3">Completed Courses</h3>
          {userData.completedCourses && userData.completedCourses.length > 0 ? (
            userData.completedCourses.map((course, index) => (
              <Card className="mb-3" key={index}>
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <Card.Text><strong>Completed On:</strong> {course.completedDate}</Card.Text>
                  <Card.Text><strong>Rating:</strong> {course.rating} / 5</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No courses completed yet.</p>
          )}
        </Col>
      </Row>

      <Pagination>
        <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
        <Pagination.Item onClick={() => handlePageChange(2)}>2</Pagination.Item>
        <Pagination.Item onClick={() => handlePageChange(3)}>3</Pagination.Item>
      </Pagination>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        className={`mt-3 bg-${toastVariant} text-white`}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
    </Container>
  );
}

export default UserDashboard;
  