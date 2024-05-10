import React from 'react'
import StudentSidebar from '../SideBar/StudentSidebar'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate, useParams } from "react-router-dom";
import { RiTv2Fill } from "react-icons/ri";
import { RiPresentationFill } from "react-icons/ri";
import Button from '@mui/material/Button';
import { IconButton } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useDispatch, useSelector } from 'react-redux';
import { studentLogin, studentLogout } from '../../Store';


// const sendata = async (id) => {
//   try {
//     const response = await axios.get(`http://localhost:5000/ADMIN/StudentData/${id}`);
//     return response.data; // Return the response data
//   } catch (error) {
//     console.error('Error fetching student data:', error);
//     return null; // Return null in case of error
//   }
// };


function StudentDashboard() {

  //Description:
  const handleMoreDetailsOpen = (details) => {
    setSelectedStudentDetails(details);
    setMoreDetailsOpen(true);
  };
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const nav = useNavigate();
  const [display, setDisplay] = useState([]);
  console.log(display, 'Display')
  const refreshUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/ADMIN/StudentRefresh', {
        withCredentials: true
      });
      return res.data; // Return data directly
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem('token');
        const expiration = localStorage.getItem('expiration');
        const now = Date.now();

        // Check if token is expired or about to expire (within 5 minutes)
        if (!token || (expiration && now >= parseInt(expiration) - 1000 * 60 * 5)) {
          // Token is expired or about to expire, refresh it
          const refreshedUserData = await refreshUser();
          if (refreshedUserData) {
            token = refreshedUserData.token;
            localStorage.setItem('token', token); // Update token in localStorage
            localStorage.setItem('expiration', Date.now() + 60 * 60 * 1000); // Set new expiration time
          } else {
            console.error('Failed to refresh token');
            return;
          }
        }

        // Move the axios request inside the if block to ensure it's executed after token refresh
        const res = await axios.get('http://localhost:5000/ADMIN/GetStudent', {
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

    fetchData();
  }, []);

  return (

    <Box sx={{ display: 'flex' }}>
      <StudentSidebar />
      <Box component="main" sx={{ flexGrow: 8, p: 8, ml: -15, mr: 0 }}>
        <Typography>
          <main className='main-container'>
            <div className='main-title'>
              {display.map((data, key) => (
                <h1 className='student-heading' key={key}>Welcome  <span className='studentname'>{data.Fname} </span></h1>
              ))}
            </div>
            {display.map((data, key) => (
              <div className='student-cards' key={key}>
                <div className='student-card'>
                  <div className='card-inner'>
                    <h2>Student Course</h2>
                    <RiTv2Fill className='card_icon' />
                  </div>
                  <span>{data.Course}</span>
                  <span
                    onClick={() => handleMoreDetailsOpen(data)}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Student Details
                  </span>
                </div>

                <div className='student-card' onClick={''}>
                  <div className='card-inner'>
                    <h2>Material</h2>
                    <PersonIcon className='card_icon' />
                  </div>
                  <h1>{ }</h1>
                </div>

                <div className='student-card' onClick={''}>
                  <div className='card-inner'>
                    <h2>Ebook</h2>
                    <RiPresentationFill className='card_icon' />
                  </div>
                  <h1>{ }</h1>
                </div>
                <div className='student-card' onClick={''}>
                  <div className='card-inner'>
                    <h2>Certification</h2>
                    <SchoolIcon className='card_icon' />
                  </div>
                  <h1>{ }</h1>
                </div>
                <div className='student-card' onClick={''}>
                  <div className='card-inner'>
                    <h2>Syllabuls</h2>
                    <SchoolIcon className='card_icon' />
                  </div>
                  <h1>{ }</h1>
                </div>
              </div>
            ))}

            {/* More Details: */}
            <Dialog open={moreDetailsOpen} onClose={() => setMoreDetailsOpen(false)}>
              <DialogTitle textAlign={"center"} fontWeight={'bold'} fontSize={26}>Student Details</DialogTitle>
              <DialogContent>
                {selectedStudentDetails && (
                  <>  <Typography sx={{ fontSize: 20, margin: 2 }}>
                    Student ID: {selectedStudentDetails._id}
                  </Typography>


                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      First Name : {selectedStudentDetails.Fname}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Last Name : {selectedStudentDetails.Lname}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Gender : {selectedStudentDetails.Gender}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Date Of Birth : {selectedStudentDetails.DateOfBirth}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Blood Group : {selectedStudentDetails.BloodGroup}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Qualification : {selectedStudentDetails.Qualification}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Course : {selectedStudentDetails.Course}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Batch : {selectedStudentDetails.Batch}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Batch Time : {selectedStudentDetails.BatchTime}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Address : {selectedStudentDetails.Address}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      E-Mail : {selectedStudentDetails.Email}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Password : {selectedStudentDetails.Password}
                    </Typography>
                    <Typography sx={{ fontSize: 20, margin: 2 }}>
                      Phone Number : {selectedStudentDetails.Phone}
                    </Typography>
                  </>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setMoreDetailsOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <div className='charts'>
              <ResponsiveContainer width='100%' height='50%'>
                <TableContainer component={Paper}>
                  <Table>

                  </Table>
                </TableContainer>
              </ResponsiveContainer>
            </div>
          </main>
        </Typography>
      </Box>
    </Box>
  )
}

export default StudentDashboard
