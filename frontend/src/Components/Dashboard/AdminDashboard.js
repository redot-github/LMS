import React from 'react'
import AdminSideBar from '../SideBar/AdminSideBar'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination, Button } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout, staffLogout } from '../../Store';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChecklistIcon from '@mui/icons-material/Checklist';

function Home() {

  const [CyberCount, setCyberCount] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortCriteria, setSortCriteria] = useState({ column: 'Course', order: 'asc' });

  const nav = useNavigate();

  // Pagination:
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort:
  const handleSort = (column) => {
    setSortCriteria((prevCriteria) => ({
      column,
      order: prevCriteria.column === column && prevCriteria.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  //Refresh Token:
  axios.defaults.withCredentials = true;

  const refreshUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/ADMIN/refresh', {
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

        if (!token || (expiration && now >= parseInt(expiration) - 1000 * 60 * 5)) {
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

        const res = await axios.get('http://localhost:5000/ADMIN/GetUser', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        return res.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    };

    fetchData();
  }, []);

  // Fetch Counts
  useEffect(() => {
    const CyberCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ADMIN/GetCourseCount');
        setCyberCount(response.data.Courses);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };
    const CourseCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ADMIN/GetCourseCount');
        setcoursecode(response.data.coursecode);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };
    CyberCounts();
    CourseCounts();

  }, []);

  //To Display The Total Value in the Box:
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [coursecode, setcoursecode] = useState(0);

  useEffect(() => {
    // Fetch total students count
    const fetchTotalStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ADMIN/GetTotalStudents');
        setTotalStudents(response.data.totalStudents);
      } catch (error) {
        console.error('Error fetching total students count:', error);
      }
    };

    // Fetch total staffs count
    const fetchTotalStaffs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ADMIN/GetTotalStaffs');
        setTotalStaffs(response.data.totalStaffs);
      } catch (error) {
        console.error('Error fetching total staffs count:', error);
      }
    };

    // Fetch total courses count
    const fetchTotalCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ADMIN/GetTotalCourses');
        setTotalCourses(response.data.totalCourses);
      } catch (error) {
        console.error('Error fetching total courses count:', error);
      }
    };

    // Fetch total batches count
    const fetchTotalBatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ADMIN/GetTotalBatches');
        setTotalBatches(response.data.totalBatches);
      } catch (error) {
        console.error('Error fetching total Batches count:', error);
      }
    };

    fetchTotalStudents();
    fetchTotalStaffs();
    fetchTotalCourses();
    fetchTotalBatches();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 6, ml: -15, mr: 1 }}>

        <Typography>
          <main className='main-container'>
            <div className='main-title'>
              <h1 className='heading'></h1>
            </div>

            <div className='main-cards'>
              <div className='card' onClick={() => nav('/student')}>
                <div className='card-inner'>
                  <LocalLibraryIcon className='card_icon' />
                  <h1>Total Students <br /> {totalStudents}</h1>
                </div>
              </div>
              <div className='card' onClick={() => nav('/staff')}>
                <div className='card-inner'>
                  <PersonIcon className='card_icon' />
                  <h1>Total Staffs  <br />{totalStaffs}</h1>
                </div>
              </div>
              <div className='card' onClick={() => nav('/course')}>
                <div className='card-inner'>
                  <SchoolIcon className='card_icon' />
                  <h1>Total Courses <br /> {totalCourses}</h1>
                </div>
              </div>

              <div className='card' onClick={() => nav('/batch')}>
                <div className='card-inner'>
                  <GroupsIcon className='card_icon' />
                  <h1>Total Batches  <br /> {totalBatches}</h1>
                </div>
              </div>
              {/* <div className='card' onClick={() => nav('/student')} >
                <div className='card-inner'>
                  <LocalLibraryIcon className='card_icon' />
                  <h1>Total Students <br />{totalStudents}</h1>
                </div>
              </div>
              <div className='card' onClick={() => nav('/staff')} >
                <div className='card-inner'>
                  <PersonIcon className='card_icon' />
                  <h1> Total Staffs  <br />{totalStaffs}</h1>
                </div>
              </div> */}
              <div className='card' onClick={() => nav('/Attendance')}>
                <div className='card-inner'>
                  <ChecklistIcon className='card_icon' />
                  <h1>Attendance <br /> </h1>
                </div>
              </div>
              <div className='card' onClick={() => nav('/Scheduler')}>
                <div className='card-inner'>
                  <CalendarMonthIcon className='card_icon' />
                  <h1>Scheduler<br /> { }</h1>
                </div>
              </div>
            </div>

            <div className='charts'>
              <ResponsiveContainer width='100%' height='50%'>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow className='tr' sx={{ background: 'lightgreen' }}>
                        <TableCell
                          sx={{ color: 'purple', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                          onClick={() => handleSort('Course')}
                        >
                          Course Name {sortCriteria.column === 'Course' && sortCriteria.order === 'asc' && '▲'}
                          {sortCriteria.column === 'Course' && sortCriteria.order === 'desc' && '▼'}
                        </TableCell>
                        <TableCell
                          sx={{ color: 'purple', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                          onClick={() => handleSort('count')}
                        >
                          Course Count {sortCriteria.column === 'count' && sortCriteria.order === 'asc' && '▲'}
                          {sortCriteria.column === 'count' && sortCriteria.order === 'desc' && '▼'}
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {CyberCount && CyberCount.length > 0 ? (
                        Object.values(
                          CyberCount.reduce((acc, data) => {
                            const course = data.Course;
                            acc[course] = acc[course] ? { ...data, count: acc[course].count + 1 } : { ...data, count: 1 };
                            return acc;
                          }, {})
                        )
                          .sort((a, b) => {
                            const orderMultiplier = sortCriteria.order === 'asc' ? 1 : -1;
                            if (sortCriteria.column === 'Course') {
                              const courseA = String(a.course);
                              const courseB = String(b.course);
                              return courseA.localeCompare(courseB) * orderMultiplier;
                            } else if (sortCriteria.column === 'count') {
                              return (a.count - b.count) * orderMultiplier;
                            }
                            return 0;
                          })
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((uniqueCourse, key) => (
                            <TableRow key={key} className={key % 2 === 0 ? 'odd-row' : 'even-row'}>
                              <TableCell component='th' scope='row' sx={{ textAlign: 'center' }} >
                                {uniqueCourse.Course}
                              </TableCell>
                              <TableCell sx={{ textAlign: 'center' }} >{uniqueCourse.count}</TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2}>No courses available</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={Object.keys(CyberCount.reduce((acc, data) => ({ ...acc, [data.Course]: true }), {})).length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </ResponsiveContainer>
            </div>
          </main>
        </Typography>
      </Box>
    </Box>
  )
}

export default Home
