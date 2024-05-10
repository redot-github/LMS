import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiTv2Fill, RiPresentationFill } from "react-icons/ri";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem } from '@mui/material';
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import StaffSideBar from '../SideBar/StaffSidebar';
import ChecklistIcon from '@mui/icons-material/Checklist';

export default function StaffDashboard() {
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);
  const [selectedStaffDetails, setSelectedStaffDetails] = useState(null);
  const [courseCount, setCourseCount] = useState({});
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedStudentNames, setSelectedStudentNames] = useState([]);
  const [studentNamesDialogOpen, setStudentNamesDialogOpen] = useState(false);
  const [display, setDisplay] = useState([]);
  const [disp, setDisp] = useState([]);

  // Define fetchData function outside of useEffect
  const fetchData = async () => {
    try {
      let token = localStorage.getItem('token');
      const expiration = localStorage.getItem('expiration');
      const now = Date.now();

      if (!token || (expiration && now >= parseInt(expiration) - 1000 * 60 * 5)) {
        const refreshedUserData = await refreshUser();
        if (refreshedUserData) {
          token = refreshedUserData.token;
          localStorage.setItem('token', token);
          localStorage.setItem('expiration', Date.now() + 60 * 60 * 1000);
        } else {
          console.error('Failed to refresh token');
          return;
        }
      }
      const res = await axios.get('http://localhost:5000/ADMIN/GetStaff', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setDisplay([res.data.user]);
      return res.data.user;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Define refreshUser function
  const refreshUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/ADMIN/StaffRefresh', {
        withCredentials: true
      });
      return res.data;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  };

  //
  const fetchStudentData = async () => {
    try {
      const staffData = await fetchData();
      console.log(staffData.Course, 'staffdata..');

      if (staffData) {
        const { Course: staffCourses, Batch: staffBatches, BatchTime: staffBatchTimes } = staffData;

        const response = await axios.get('http://localhost:5000/ADMIN/StudentDisplay');
        const students = response.data.got;
        console.log(students, 'students...');

        const filteredStudents = students.filter((student) => {
          const courseMatch = staffCourses.some((course) => student.Course.includes(course));
          const batchMatch = staffBatches.some((batch) => student.Batch.includes(batch));
          const batchTimeMatch = staffBatchTimes.some((batchTime) => student.BatchTime.includes(batchTime));
          return courseMatch && batchMatch && batchTimeMatch;
        });

        const courseBatchCounts = {};
        filteredStudents.forEach((student) => {
          const courseBatch = `${student.Course}_${student.Batch}`;
          courseBatchCounts[courseBatch] = (courseBatchCounts[courseBatch] || 0) + 1;
        });
        console.log(filteredStudents, 'filteredStudents...');
        setCourseCount(courseBatchCounts);
        setDisp(filteredStudents);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  //
  const handleMoreDetailsOpen = (details, cardIndex) => {
    setSelectedStaffDetails(details);
    const course = details.Course[cardIndex];
    const batch = details.Batch[cardIndex];
    const batchTime = details.BatchTime[cardIndex];
    console.log(course);
    console.log(batch);
    console.log(batchTime);

    const filteredStudents = disp.filter(student => {
      return student.Course.includes(course) &&
        student.Batch.includes(batch) &&
        student.BatchTime.includes(batchTime);
    });
    console.log(filteredStudents, 'sorted Students...');

    const studentNames = filteredStudents.map(student => `${student.Fname} ${student.Lname}`);
    console.log(studentNames, 'studentNames..');

    setSelectedCourseDetails({ course, batch, studentCount: filteredStudents.length });
    handleViewDetails(studentNames);
    setMoreDetailsOpen(true);
  };

  //
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleViewDetails = (studentNames) => {
    setSelectedStudentNames(studentNames);
    handleClickOpen();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StaffSideBar />
      <Box component="main" sx={{ flexGrow: 8, p: 8, ml: -15, mr: 0 }}>
        <Typography>
          <main className='main-container'>
            <div className='main-title'>
              {display.map((data, key) => (
                <h1 className='staff-heading' key={key}>Welcome  <span className='staffname'>{data.Fname} </span></h1>
              ))}
            </div>
            {display.map((data, key) => (
              <div className='staff-cards' key={key}>
                <div className='staff-card'>
                  <div className='card-inner'>
                    <h3 sx={{ color: 'black' }}>{data.Course[0]} <br /> {data.Batch[0]} <br /> {data.BatchTime[0]}</h3>
                    <RiTv2Fill className='card_icon' />
                  </div>
                  <span
                    className='staff-details'
                    onClick={() => handleMoreDetailsOpen(data, 0)}
                    style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Student Details:
                  </span>
                </div>

                {data.Course.length > 1 && (
                  <div className='staff-card'>
                    <div className='card-inner'>
                      <h3 sx={{ color: 'black' }}>{data.Course[1]} <br /> {data.Batch[1]} <br /> {data.BatchTime[1]}</h3>
                      <RiTv2Fill className='card_icon' />
                    </div>
                    <span
                      className='staff-details'
                      onClick={() => handleMoreDetailsOpen(data, 1)}
                      style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Student Details:
                    </span>
                  </div>
                )}

                <div className='staff-card' >
                  <div className='card-inner'>
                    <h2>Attendance</h2>
                    <ChecklistIcon className='card_icon' />
                  </div>
                  <h1>{ }</h1>
                </div>

                <div className='staff-card' >
                  <div className='card-inner'>
                    <h2>Ebook</h2>
                    <RiPresentationFill className='card_icon' />
                  </div>
                  <h1>{ }</h1>
                </div>

                <div className='staff-card' >
                  <div className='card-inner'>
                    <h2>Syllabus</h2>
                    <SchoolIcon className='card_icon' />
                  </div>
                  <h1>{ }</h1>
                </div>
              </div>
            ))}

            <Dialog open={moreDetailsOpen} onClose={() => setMoreDetailsOpen(false)}>
              <DialogTitle sx={{ textAlign: 'center' }}></DialogTitle>
              <DialogContent>
                <Table>
                  <TableHead sx={{ textAlign: 'center' }}>
                    <TableBody>
                      {selectedCourseDetails && (
                        <TableRow>
                          <TableCell>{selectedCourseDetails.course}</TableCell>
                          <TableCell>{selectedCourseDetails.batch}</TableCell>
                          <TableCell>{selectedCourseDetails.batchTime}</TableCell>
                          <TableCell>{selectedCourseDetails.studentCount}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>

                    <TableRow>
                      <TableCell sx={{ color: 'Red', textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', fontSize: 20 }}>
                        STUDENT NAMES:
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedStudentNames.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center' }}>No Data Found</TableCell>
                      </TableRow>
                    ) : (
                      selectedStudentNames.map((name, index) => (
                        <ListItem key={index}>
                          <Typography component="span" sx={{ textAlign: 'center' }}>
                            * {`${name}`}
                          </Typography>
                        </ListItem>
                      ))
                    )}
                  </TableBody>
                </Table>

                <DialogActions sx={{ justifyContent: 'flex-end' }}>
                  <Button onClick={() => setMoreDetailsOpen(false)} variant="outlined">
                    Close
                  </Button>
                </DialogActions>
              </DialogContent>
            </Dialog>
          </main>
        </Typography>
      </Box>
    </Box>
  )
}
