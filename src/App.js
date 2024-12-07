/**
import React ,{useState,useEffect} from 'react';
//import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';  // Assuming you have a Header component
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import UserDashboard from './pages/UserDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';  // Import the Footer component
import AddCoursePage from './pages/AddCoursePage'
import CoursePostByAdmin from './pages/CoursePostByAdmin'
import AdminAuthPanel from './pages/AdminAuthPanel';
import AdminDashboard from './pages/AdminDashboard';
//auth page 
import AuthPage from './pages/AuthPage'
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';  // Your protected route logic
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [isLoading,setIsLoading] = useState(true);
  useEffect(()=>{
    setTimeout(()=> {
    setIsLoading(false);
      
    }, 10000);
  },[]);
  
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        {isLoading?(
        <>
          <Loader />
          </>
        ):(
        <>
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/addCourse" element={<AddCoursePage/>}/>
            <Route path="/coursePostByAdmin" element={<CoursePostByAdmin/>}/>
            <Route path="/adminAuthPanel" element={<AdminAuthPanel/>}/>
            <Route path="/adminDashboard" element={ <AdminRoute><AdminDashboard/> </AdminRoute> }/>
            <Route path="/auth-page" element={<AuthPage/>}/>
            
          </Routes>
        </main>
        <Footer/>
       </> )}
      </div>
    </Router>
  );
}

export default App;
*/

const App = () =>{
  return(
    <>
    <div className="container border-amber-700 bg-gradient-to-brint w-6/12 h-1/3">
    <h1> It is working</h1>
    </div>
    </>
    );
}