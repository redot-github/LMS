import * as React from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { StudentDisplay } from "../URL";
import { IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { Box, Typography, Alert, Snackbar, Grid, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Pagination from '@mui/material/Pagination';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from "@mui/icons-material/Delete";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AdminSideBar from "../SideBar/AdminSideBar";
import StudentForm from "./StudentForm";
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  fontWeight: 'bold',
}));

export default function Student() {

  const [display, setdisplay] = useState([]);
  const [openStudent, setOpenStudent] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);

  const [updateStudent, setUpdateStudent] = useState(null);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);

  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [Getdata, setGetdata] = useState([])

  const [Batch, setBatch] = useState([]);
  const [BatchTime, setBatchTime] = useState([]);
  const [Course, setCourses] = useState([])
  const [isCourses, setisCourses] = useState(false)
  const [batchTypes, setBatchTypes] = useState([])

  const nav = useNavigate();


  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);

  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseCount, setCourseCount] = useState({});

  // Sort:
  const handleSort = (column) => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortOrder('asc');
    }
    // eslint-disable-next-line
  };

  // Rendering Logic
  const sortedStudents = [...display].sort((a, b) => {
    const compareValue = sortOrder === 'asc' ? 1 : -1;
    return a[sortedColumn] > b[sortedColumn] ? compareValue : -compareValue;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  const filteredStudents = sortedStudents.filter((student) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const phoneString = typeof student.Phone === 'string'
      ? student.Phone
      : student.Phone && typeof student.Phone.toString === 'function'
        ? student.Phone.toString()
        : '';
    const phoneMatch = phoneString.toLowerCase().includes(lowerSearchTerm);

    const courseString = Array.isArray(student.Course)
      ? student.Course.join(', ') // Convert array of courses to a comma-separated string
      : typeof student.Course === 'string'
        ? student.Course // If it's already a string, use it as is
        : ''; // If it's not a string or an array, leave it empty

    const courseMatch = courseString.toLowerCase().includes(lowerSearchTerm);

    return (
      (student.Fname && student.Fname.toLowerCase().startsWith(lowerSearchTerm)) ||
      (student._id && student._id.toString().toLowerCase().startsWith(lowerSearchTerm)) ||
      courseMatch ||
      student.Email.toLowerCase().includes(lowerSearchTerm) ||
      phoneMatch
    );
  });

  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  //Description:
  const handleMoreDetailsOpen = (details) => {
    setSelectedStudentDetails(details);
    setMoreDetailsOpen(true);
  };

  //Get:
  const sendata = async () => {
    try {
      const response = await axios.get(StudentDisplay);
      const students = response.data.got;

      // Calculate course count based on batch type:
      const countByCourse = students.reduce((acc, student) => {
        const key = `${student.Course}_${student.Batch}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      setCourseCount(countByCourse);
      setdisplay(students);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    sendata();
  }, []);

  //Delete:
  const Deleting = async (id) => {
    setDeleteStudentId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setDeleteStudentId(null);
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/ADMIN/StudentDelete/${deleteStudentId}`);
    sendata();
    handleDeleteConfirmClose();
    setDeleteSuccess(true);
  };

  // Update: 
  const handleUpdatePopupClose = () => {
    setOpenUpdatePopup(false);
    setUpdateStudent(null);
  };

  const handleUpdate = (data) => {
    setUpdateStudent(data);
    setOpenUpdatePopup(true);
  };
  // Perform any logic or API calls needed for the update
  const handleUpdates = async () => {

    try {
      const response = await axios.get(`http://localhost:5000/ADMIN/Get/${Course}`);
      setGetdata(response.data);
      setisCourses(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    // Update other state values as needed
    const selectedBatch = Getdata.find(data => data.BatchType === Batch);
    setBatchTime(selectedBatch ? [`${selectedBatch.BatchIntime} to ${selectedBatch.BatchOuttime}`] : []);
  };

  const handleUpdateStudent = async (updatedStudent) => {
    await axios.put(`http://localhost:5000/ADMIN/StudentUpdate/${updatedStudent._id}`, updatedStudent);
    sendata();
    handleUpdatePopupClose();
    setUpdateSuccess(true);
  };

  //
  const handleCloseStudent = () => {
    setOpenStudent(false);
  };

  //GetBatch:
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/ADMIN/GetBatches");
        setBatchTypes(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  //
  const getFullName = (Student) => {
    return `${Student.Fname} ${Student.Lname}`;
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <AdminSideBar />
        <Box component="main" sx={{ flexGrow: 2, p: 8, ml: -11, position: 'relative' }}>
          <Typography>
            <IconButton sx={{ position: 'absolute', top: 70, right: 0 }}>
              <StudentForm isOpen={setOpenStudent} handleClose={handleCloseStudent} />
            </IconButton>

            <Typography variant="h4" align="center" sx={{ textDecoration: 'none', fontFamily: 'fantasy', color: 'green', marginTop: '25px' }}>
              ALL Students </Typography>
            <TableContainer sx={{ position: "relative", top: 20 }} component={Paper}>
              <TextField
                sx={{
                  marginTop: 1,
                  marginLeft: 0,
                  maxWidth: '262px',
                  left: 810,
                  height: 80,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: '20px',
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: '15px',
                  },
                }}
                label="Search Student"
                fullWidth
                value={searchTerm}
                onChange={handleSearchTermChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{ // Add InputLabelProps for centering the label
                  sx: {
                    textAlign: 'center', // Center-align the label text
                  }
                }}
              />

              <Table sx={{ minWidth: 650 }} aria-label="customized table">
                <TableHead sx={{ bgcolor: "black" }}>
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      sx={{ color: 'white', cursor: 'pointer' }}
                      onClick={() => handleSort('id')}
                    >
                      ID
                      {sortedColumn === 'id' && (
                        <ArrowDropDownIcon
                          sx={{ verticalAlign: 'middle', transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ color: 'white', cursor: 'pointer' }}
                      onClick={() => handleSort('Fname')}
                    >
                      STUDENT NAME
                      {sortedColumn === 'Fname' && (
                        <ArrowDropDownIcon
                          sx={{ verticalAlign: 'middle', transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: "white" }}>
                      GENDER
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: "white" }}>
                      COURSE
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: "white" }}>
                      EMAIL
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: "white" }}>
                      PHONE
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: "white" }}>

                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: "white" }}>
                      ACTION
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentStudents.length === 0 ? (
                    <TableRow>
                      <StyledTableCell colSpan={9} align="center" sx={{ color: 'red' }}>
                        No Data Found
                      </StyledTableCell>
                    </TableRow>
                  ) : (currentStudents.map((data, id) => (
                    <StyledTableRow key={id}>
                      <StyledTableCell align="center">{`STA-${data._id}`}</StyledTableCell>
                      <StyledTableCell align="center">{getFullName(data)}</StyledTableCell>
                      <StyledTableCell align="center">{data.Gender}</StyledTableCell>
                      <StyledTableCell align="center">
                        {Array.isArray(data.Course) ? (
                          data.Course.map((course, index) => (
                            <div key={index}>{`${course}`}</div>
                          ))
                        ) : (
                          data.Course
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">{data.Email}</StyledTableCell>
                      <StyledTableCell align="center">{data.Phone}</StyledTableCell>
                      <StyledTableCell align="center">
                        <span
                          onClick={() => handleMoreDetailsOpen(data)}
                          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          More Details
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <EditIcon onClick={() => handleUpdate(data)} sx={{ cursor: "pointer" }} />--
                        <DeleteIcon onClick={() => Deleting(data._id)} sx={{ cursor: "pointer" }} />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                  )}
                </TableBody>

                {/* More Details: */}
                <Dialog open={moreDetailsOpen} onClose={() => setMoreDetailsOpen(false)}>
                  <DialogTitle textAlign={"center"} fontWeight={'bold'} fontSize={26}>Student Details</DialogTitle>
                  <DialogContent>
                    {selectedStudentDetails && (
                      <>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          Student ID: {selectedStudentDetails._id}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          First Name: {selectedStudentDetails.Fname}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          Last Name: {selectedStudentDetails.Lname}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          Gender: {selectedStudentDetails.Gender}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          Date Of Birth: {selectedStudentDetails.DateOfBirth}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          Blood Group: {selectedStudentDetails.BloodGroup}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          Qualification: {selectedStudentDetails.Qualification}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontSize: 20 }}>Course</TableCell>
                                <TableCell sx={{ fontSize: 20 }}>Batch</TableCell>
                                <TableCell sx={{ fontSize: 20 }}>Batch Timing</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedStudentDetails.Course?.map((course, index) => (
                                <TableRow key={index}>
                                  <TableCell sx={{ fontSize: 16 }}>{course}</TableCell>
                                  <TableCell sx={{ fontSize: 16 }}>{selectedStudentDetails.Batch[index]}</TableCell>
                                  <TableCell sx={{ fontSize: 16 }}>{selectedStudentDetails.BatchTime[index]}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          Address: {selectedStudentDetails.Address}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          E-Mail: {selectedStudentDetails.Email}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          Password: {selectedStudentDetails.Password}
                        </Typography>
                        <Typography sx={{ fontSize: 20, margin: 2 }}>
                          Phone Number: {selectedStudentDetails.Phone}
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

                {/* Delete: */}
                <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete this Student Details?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDeleteConfirmClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Update: */}
                {updateStudent && (
                  <Dialog open={openUpdatePopup} onClose={handleUpdatePopupClose}>
                    <DialogTitle sx={{ textAlign: 'center' }}>
                      <Typography component="h1" variant="h5">
                        Edit Student Details
                      </Typography>
                    </DialogTitle>
                    <br></br>
                    <DialogContent>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            value={updateStudent.Fname}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, Fname: e.target.value })}
                            autoFocus
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            value={updateStudent.Lname}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, Lname: e.target.value })}
                            autoComplete="family-name"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            required
                            fullWidth
                            id="gender"
                            value={updateStudent.Gender}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, Gender: e.target.value })}
                            SelectProps={{
                              native: true,
                            }}
                          >
                            <option value="" disabled>
                              Select Gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="dateOfBirth"
                            label="Date of Birth"
                            type="date"
                            value={updateStudent.DateOfBirth}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, DateOfBirth: e.target.value })}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="BloodGroup"
                            label="Blood Group"
                            name="BloodGroup"
                            value={updateStudent.BloodGroup}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, BloodGroup: e.target.value })}
                            autoComplete="BloodGroup"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="Qualification"
                            label="Qualification"
                            name="Qualification"
                            value={updateStudent.Qualification}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, Qualification: e.target.value })}
                            autoComplete="Qualification"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="Address"
                            label="Address"
                            name="Address"
                            value={updateStudent.Address}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, Address: e.target.value })}
                            autoComplete="Address"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={updateStudent.Email}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, Email: e.target.value })}
                            autoComplete="email"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="PASSWORD"
                            label="Password"
                            name="password"
                            value={updateStudent.Password}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, Password: e.target.value })}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="PHONE"
                            label="Phone Number"
                            name="phone"
                            value={updateStudent.Phone}
                            onChange={(e) => setUpdateStudent({ ...updateStudent, Phone: e.target.value })}
                            autoComplete="Phone"
                          />
                        </Grid>
                      </Grid>
                    </DialogContent>

                    <DialogActions>
                      <Button onClick={handleUpdatePopupClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={() => handleUpdateStudent(updateStudent)} color="primary" variant="contained">
                        Update Student
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
                {/* Pagination */}
                <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                  <Pagination
                    count={Math.ceil(filteredStudents.length / studentsPerPage)}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                  />
                </Box>
              </Table>
            </TableContainer>
          </Typography>
        </Box>
      </Box>

      {/* Update: */}
      <Snackbar open={updateSuccess} autoHideDuration={3000} onClose={() => setUpdateSuccess(false)}>
        <Alert onClose={() => setUpdateSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Student details have been updated successfully.
        </Alert>
      </Snackbar>

      {/* Delete: */}
      <Snackbar open={deleteSuccess} autoHideDuration={3000} onClose={() => setDeleteSuccess(false)}>
        <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Student details have been deleted successfully.
        </Alert>
      </Snackbar>
    </>
  );
}
