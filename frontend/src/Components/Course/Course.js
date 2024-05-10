import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { CourseDisplay } from '../URL'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Typography, Alert, Snackbar, Grid, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import AdminSideBar from "../SideBar/AdminSideBar";
import CourseForm from './CourseForm'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  fontWeight: 'bold'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Course() {

  const [searchTerm, setSearchTerm] = useState("");

  const [display, setdisplay] = useState([]);
  // eslint-disable-next-line
  const [openCourse, setOpenCourse] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState(null);

  const [updateCourse, setUpdateCourse] = useState(null);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);

  const [descriptionPopupOpen, setDescriptionPopupOpen] = useState(false);
  const [selectedCourseDescription, setSelectedCourseDescription] = useState("");

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5);

  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState(null);

  // Sort:
  const handleSort = (column) => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortOrder('asc');
    }
  };

  // Rendering Logic
  const sortedCourses = [...display].sort((a, b) => {
    const compareValue = sortOrder === 'asc' ? 1 : -1;
    return a[sortedColumn] > b[sortedColumn] ? compareValue : -compareValue;
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const filteredCourses = sortedCourses.filter((course) =>
    course.cname.toLowerCase().startsWith(searchTerm.toLowerCase())
  );
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  //Description:
  const handleDescriptionPopupOpen = (description) => {
    setSelectedCourseDescription(description);
    setDescriptionPopupOpen(true);
  };

  //Get:
  const sendata = async () => {
    const dat = await axios.get(CourseDisplay);
    setdisplay(dat.data.got);
    sendata();
  };

  useEffect(() => {
    sendata()
  }, []);

  // Delete:
  const Deleting = async (id) => {
    setDeleteCourseId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setDeleteCourseId(null);
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/ADMIN/CourseDelete/${deleteCourseId}`);
    sendata();
    handleDeleteConfirmClose();
    setDeleteSuccess(true);
  };

  // Update: 
  const handleUpdatePopupClose = () => {
    setOpenUpdatePopup(false);
    setUpdateCourse(null);
  };

  const handleUpdate = (data) => {
    setUpdateCourse(data);
    setOpenUpdatePopup(true);
  };

  const handleUpdateCourse = async (updatedCourse) => {
    await axios.put(`http://localhost:5000/ADMIN/CourseUpdate/${updatedCourse._id}`, updatedCourse);
    sendata();
    handleUpdatePopupClose();
    setUpdateSuccess(true);
  };

  //
  const handleCloseCourse = () => {
    setOpenCourse(false);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <AdminSideBar />
        <Box component="main" sx={{ flexGrow: 8, p: 8, ml: -11, mr: 0 }}>
        {/* <Box component="main" sx={{ flexGrow: 2, p: 9, ml: -17, position: 'relative' }}> */}

          <Typography>
            <IconButton sx={{ position: 'absolute', top: 70, right: 0 }}>
              <CourseForm isOpen={setOpenCourse} handleClose={handleCloseCourse} />
            </IconButton>
            <Typography variant="h4" align="center" sx={{ fontFamily: 'fantasy', color: 'purple', marginTop: '25px' }}>
              ALL COURSES
            </Typography>
            <TableContainer sx={{ position: "relative", top: 10 }} component={Paper}>
              <TextField
                sx={{
                  marginTop: 1,
                  marginLeft: 0,
                  maxWidth: '280px',
                  left: 810,
                  height: 80,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: '20px',
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: '15px',
                  },
                }}
                label="Search Course"
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
              />
              <Table sx={{ minWidth: 650 }} aria-label="customized table">
                <TableHead sx={{ bgcolor: 'black' }}>
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      sx={{ color: 'white', cursor: 'pointer' }}
                      onClick={() => handleSort('code')}
                    >
                      COURSE CODE
                      {sortedColumn === 'code' && (
                        <ArrowDropDownIcon
                          sx={{ verticalAlign: 'middle', transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ color: 'white', cursor: 'pointer' }}
                      onClick={() => handleSort('cname')}
                    >
                      COURSE NAME
                      {sortedColumn === 'cname' && (
                        <ArrowDropDownIcon
                          sx={{ verticalAlign: 'middle', transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: 'white' }}>
                      DESCRIPTION
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: 'white' }}>
                      STATUS
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: 'white' }}>
                      ACTION
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentCourses.length === 0 ? (
                    <TableRow>
                      <StyledTableCell colSpan={9} align="center" sx={{ color: 'red' }}>
                        No Data Found
                      </StyledTableCell>
                    </TableRow>
                  ) : (currentCourses.map((data) => (
                    <StyledTableRow key={data._id}>
                      <StyledTableCell align="center">{data.code}</StyledTableCell>
                      <StyledTableCell align="center">{data.cname}</StyledTableCell>
                      <StyledTableCell align="center">
                        <span
                          onClick={() => handleDescriptionPopupOpen(data.desc)}
                          style={{ color: 'blue', textDecoration: 'none', cursor: 'pointer' }}
                        >
                          overView
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="center">{data.check ? 'Active' : 'Inactive'}</StyledTableCell>
                      <StyledTableCell align="center">
                        <EditIcon onClick={() => handleUpdate(data)} sx={{ cursor: 'pointer' }} />--
                        <DeleteIcon onClick={() => Deleting(data._id)} sx={{ cursor: 'pointer' }} />
                      </StyledTableCell>
                    </StyledTableRow>
                  )))}
                </TableBody>

                {/* Description: */}
                <Dialog open={descriptionPopupOpen} onClose={() => setDescriptionPopupOpen(false)}>
                  <DialogTitle textAlign={'center'} > Course Description</DialogTitle>
                  <DialogContent>
                    <DialogContentText color={'black'}>{selectedCourseDescription}</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setDescriptionPopupOpen(false)} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Delete: */}
                <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete this course?
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
                {updateCourse && (
                  <Dialog open={openUpdatePopup} onClose={handleUpdatePopupClose}>
                    <DialogTitle sx={{ textAlign: 'center' }}>
                      <Typography component="h1" variant="h5">
                        Edit Course
                      </Typography>
                    </DialogTitle>
                    <br></br>

                    <DialogContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="code"
                            fullWidth
                            id="code"
                            label="Course Code"
                            value={updateCourse.code}
                            onChange={(e) => setUpdateCourse({ ...updateCourse, code: e.target.value })}
                            autoFocus
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            id="cname"
                            label="Course Name"
                            name="cname"
                            value={updateCourse.cname}
                            onChange={(e) => setUpdateCourse({ ...updateCourse, cname: e.target.value })}
                            autoComplete="family-name"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="desc"
                            label="Description"
                            name="desc"
                            value={updateCourse.desc}
                            onChange={(e) => setUpdateCourse({ ...updateCourse, desc: e.target.value })}
                          />
                        </Grid>
                      </Grid>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={updateCourse.check}
                            onChange={() => setUpdateCourse({ ...updateCourse, check: !updateCourse.check })}
                            color="primary"
                          />
                        }
                        label="Active"
                      />
                    </DialogContent>

                    <DialogActions>
                      <Button onClick={handleUpdatePopupClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={() => handleUpdateCourse(updateCourse)} color="primary" variant="contained">
                        Update Course
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </Table>
              {/* Pagination */}
              <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                <Pagination
                  count={Math.ceil(filteredCourses.length / coursesPerPage)}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                />
              </Box>
            </TableContainer>
          </Typography>
        </Box>
      </Box>

      {/* Update: */}
      <Snackbar open={updateSuccess} autoHideDuration={3000} onClose={() => setUpdateSuccess(false)}>
        <Alert onClose={() => setUpdateSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Course details have been updated successfully.
        </Alert>
      </Snackbar>

      {/* Delete: */}
      <Snackbar open={deleteSuccess} autoHideDuration={3000} onClose={() => setDeleteSuccess(false)}>
        <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Course details have been deleted successfully.
        </Alert>
      </Snackbar>
    </>
  );
}
