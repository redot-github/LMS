
import './App.css';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminSideBar from './Components/SideBar/AdminSideBar';
import StaffSideBar from './Components/SideBar/StaffSidebar';
import StudentSideBar from './Components/SideBar/StudentSidebar';
import SignIn from './Components/SignIn';
import Attendance from './Components/Attendance/Attendance';
import Scheduler from './Components/Scheduler/Scheduler'

import AdminDashboard from './Components/Dashboard/AdminDashboard';
import StudentDashboard from './Components/Dashboard/StudentDashboard';
import StaffDashboard from './Components/Dashboard/StaffDashboard';
import Student from './Components/Student/Student';
import StudentForm from './Components/Student/StudentForm';
import Staff from './Components/Staff/Staff';
import StaffForm from './Components/Staff/StaffForm';
import Course from './Components/Course/Course';
import CourseForm from './Components/Course/CourseForm';
import Batch from './Components/Batch/Batch';
import BatchForm from './Components/Batch/BatchForm';
import { useSelector } from 'react-redux';


function App() {
  const adminLoggedIn = useSelector((state) => state.adminLoggedIn);
  const staffLoggedIn = useSelector((state) => state.staffLoggedIn);
  const studentLoggedIn = useSelector((state) => state.studentLoggedIn);

  const STATIC_PATHS = Object.freeze(['/dashboard', '/Student', '/Staff', '/Course', '/Batch', '/Scheduler']);

  useEffect(() => {
    const handleNavigate = () => {
      const path = window.location.pathname;
      const protectedPaths = ['/dashboard', '/Staff', '/Course', '/Batch', '/Scheduler'];

      // Check if the path is one of the static paths
      if (STATIC_PATHS.includes(path)) {
        return;
      }

      window.history.forward();

      // Check if the user has a token
      const token = localStorage.getItem('token');

      if (!token && protectedPaths.includes(path)) {
        window.location.replace('/');
        return;
      }

      if (token) {
        if (adminLoggedIn && protectedPaths.includes(path)) {
          window.history.replaceState(null, '', '/dashboard');
        } else if (staffLoggedIn) {
          window.history.replaceState(null, '', '/StaffDashboard');
        } else if (studentLoggedIn) {
          window.history.replaceState(null, '', '/StudentDashboard');
        }
      }
    };

    window.addEventListener('popstate', handleNavigate);

    return () => {
      window.removeEventListener('popstate', handleNavigate);
    };
  }, [adminLoggedIn, studentLoggedIn, staffLoggedIn]);

  return (
    <main>
      <Routes>
        <Route path="/" element={<SignIn />} />

        {/* Sidebar should be visible regardless of login status */}
        <Route path="/SideBar" element={<AdminSideBar />} />
        <Route path="/StaffSideBar" element={<StaffSideBar />} />
        <Route path="/StudentSideBar" element={<StudentSideBar />} />

        {/* Admin routes */}
        {adminLoggedIn && (
          <>
            <Route path="/Dashboard" element={<AdminDashboard />} p />
            <Route path="/Student" element={<Student />} />
            <Route path="/StudentForm" element={<StudentForm />} />
            <Route path="/Staff" element={<Staff />} />
            <Route path="/StaffForm" element={<StaffForm />} />
            <Route path="/Course" element={<Course />} />
            <Route path="/CourseForm" element={<CourseForm />} />
            <Route path="/Batch" element={<Batch />} />
            <Route path="/BatchForm" element={<BatchForm />} />
            <Route path="/Attendance" element={<Attendance />} />
            <Route path="/Scheduler" element={<Scheduler />} />
          </>
        )}

        {/* Staff routes */}
        {staffLoggedIn && (
          <>
            <Route path="/StaffDashboard" element={<StaffDashboard />} />
          </>
        )}

        {/* Student routes */}
        {studentLoggedIn && (
          <>
            <Route path="/StudentDashboard" element={<StudentDashboard />} />
          </>
        )}

      </Routes>
    </main>
  );
}

export default App;
