import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, TextField, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import AdminSideBar from '../SideBar/AdminSideBar';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  fontWeight: 'bold'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Attendance() {
  const [display, setDisplay] = useState([]);
  const [batchtype, setBatchType] = useState('');
  const [batchTypes, setBatchTypes] = useState([]);
  const [coursecode, setCourseCode] = useState('');
  const [dataFetched, setDataFetched] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/ADMIN/GetBatch");
        setBatchTypes(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  //GetData:
  const getData = async (Course, Batch) => {
    if (!Course || !Batch) {
      console.warn('Course or BatchType is not defined');
      return;
    }
    const url = `http://localhost:5000/ADMIN/getCourseAndBatch/${Course}/${Batch}`;
    try {
      const response = await axios.get(url);
      setDisplay(response.data.students);
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDataFetched(false);
    }
  };

  //Generate Button:
  const handleGenerateClick = () => {
    if (coursecode && batchtype) {
      getData(coursecode, batchtype);
      setCourseCode('');
      setBatchType('');
    } else {
      console.warn('Please select both course and batch type');
      setDataFetched(false);
      setDisplay([]);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSideBar />
      <Box component="main" sx={{ flexGrow: 8, p: 8, ml: -11, mr: 0 }}>
        <Typography variant="h4" align="center" sx={{ fontFamily: 'fantasy', color: 'brown', marginTop: '40px', marginBottom: "30px" }}>
          Attendance Details
        </Typography>

        <Grid container spacing={3} alignItems="center" direction="row">
          <Grid item xs={12} sm={3}>
            <TextField
              select
              required
              fullWidth
              id="coursecode"
              value={coursecode}
              onChange={(e) => {
                setCourseCode(e.target.value);
                getData(e.target.value, batchtype);
              }}
              SelectProps={{ native: true }}
            >
              <option value="">Select Course</option>
              {batchTypes
                .slice()
                .map((data) => (
                  <option key={`${data.CourseName}-${data.Code}`}>
                    {data.CourseName}-{data.Code}
                  </option>
                ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              select
              required
              fullWidth
              id="batchtype"
              value={batchtype}
              onChange={(e) => setBatchType(e.target.value)}
              SelectProps={{ native: true }}
              disabled={!coursecode}
            >
              <option value="">Select Batch Type</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              onClick={handleGenerateClick}
            >
              Generate
            </Button>
          </Grid>
        </Grid>

        <TableContainer sx={{ position: "relative", top: 10 }} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="attendance table">
            <TableHead sx={{ bgcolor: 'black' }}>
              <TableRow>
                <StyledTableCell align="center" sx={{ color: 'white' }}>Course</StyledTableCell>
                <StyledTableCell align="center" sx={{ color: 'white' }}>Batch Type</StyledTableCell>
                <StyledTableCell align="center" sx={{ color: 'white' }}>Student ID</StyledTableCell>
                <StyledTableCell align="center" sx={{ color: 'white' }}>Student Name</StyledTableCell>
                <StyledTableCell align="center" sx={{ color: 'white' }}>Status</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!dataFetched ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={4} align="center" sx={{ color: 'red' }} >No Data Found </StyledTableCell>
                </StyledTableRow>
              ) : (
                display.length === 0 ? (
                  <StyledTableRow>
                    <StyledTableCell colSpan={4} align="center">No Data Found</StyledTableCell>
                  </StyledTableRow>
                ) : (
                  display.map((student, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">{student.Course}</StyledTableCell>
                      <StyledTableCell align="center">{student.Batch}</StyledTableCell>
                      <StyledTableCell align="center">STU-{student._id}</StyledTableCell>
                      <StyledTableCell align="center">{student.fullName}</StyledTableCell>
                    </StyledTableRow>
                  ))
                )
              )}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Attendance;
