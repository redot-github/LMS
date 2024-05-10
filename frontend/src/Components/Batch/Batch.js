import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { BatchDisplay } from '../URL'
import Button from '@mui/material/Button';
import { Box, Typography, Alert, Snackbar, Grid, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Pagination from '@mui/material/Pagination';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AdminSideBar from "../SideBar/AdminSideBar";
import BatchForm from './BatchForm'

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

export default function Batch() {

  const [searchTerm, setSearchTerm] = useState("");

  const [display, setdisplay] = useState([]);
  // eslint-disable-next-line
  const [OpenBatch, setOpenBatch] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteBatchId, setDeleteBatchId] = useState(null);

  const [updateBatch, setUpdateBatch] = useState(null);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const { batchtype, coursecode, batchIntime, batchOuttime } = updateBatch || {};
  const [batchTypes, setBatchTypes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [batchesPerPage] = useState(5);

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
  const sortedBatches = [...display].sort((a, b) => {
    const compareValue = sortOrder === 'asc' ? 1 : -1;
    return a[sortedColumn] > b[sortedColumn] ? compareValue : -compareValue;
  });

  const indexOfLastBatch = currentPage * batchesPerPage;
  const indexOfFirstBatch = indexOfLastBatch - batchesPerPage;

  const filteredBatches = sortedBatches.filter((batch) =>
    (batch.batchtype && batch.batchtype.toLowerCase().startsWith(searchTerm.toLowerCase())) ||
    (batch.coursecode && batch.coursecode.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (`${batch.batchIntime} - ${batch.batchOuttime}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const currentBatches = filteredBatches.slice(indexOfFirstBatch, indexOfLastBatch);

  //Get:
  const sendata = async () => {
    const dat = await axios.get(BatchDisplay);
    setdisplay(dat.data.got);
    sendata();
  };

  useEffect(() => {
    sendata();
  }, []);

  //GetBatch:
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

  //Delete:
  const Deleting = async (id) => {
    setDeleteBatchId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setDeleteBatchId(null);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/ADMIN/BatchDelete/${deleteBatchId}`);
    sendata();
    handleDeleteConfirmClose();
    setDeleteSuccess(true);
  }

  //Update:
  const handleUpdatePopupClose = () => {
    setOpenUpdatePopup(false);
    setUpdateBatch(null);
  };

  const handleUpdate = (data) => {
    setUpdateBatch(data);
    setOpenUpdatePopup(true);
  };

  const handleUpdateBatch = async (updatedBatch) => {
    await axios.put(`http://localhost:5000/ADMIN/BatchUpdate/${updatedBatch._id}`, updatedBatch);
    sendata();
    handleUpdatePopupClose();
    setUpdateSuccess(true);
  };

  //
  const handleCloseBatch = () => {
    setOpenBatch(false);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <AdminSideBar />
        {/* <Box component="main" sx={{ flexGrow: 8, p: 8, ml: -11, mr: 0 }}> */}
        <Box component="main" sx={{ flexGrow: 2, p: 8,ml: -13,position:'relative'}}>

          <Typography>

            <IconButton sx={{ position: 'absolute', top: 70, right: 0 }}>
              <BatchForm isOpen={setOpenBatch} handleClose={handleCloseBatch} />
            </IconButton>
            <Typography variant="h4" align="center" sx={{ textDecoration: 'none', fontFamily: 'fantasy', color: 'blue' ,marginTop: '25px' }}>
              ALL Batches
            </Typography>
            <TableContainer sx={{ position: "relative", top: 25 }} component={Paper}>
              <TextField
                sx={{
                  marginTop: 1,
                  marginLeft:0,
                  maxWidth: '263px',
                  left: 860,
                  height: 80,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: '20px',
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: '15px',
                  },
                }}
                label="Search Batch"
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
                      onClick={() => handleSort('coursecode')}
                    >
                      COURSE
                      {sortedColumn === 'coursecode' && (
                        <ArrowDropDownIcon
                          sx={{ verticalAlign: 'middle', transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: 'white' }}>
                      BATCH TYPE
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: 'white' }}>
                      BATCH TIMING
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: 'white' }}>
                      ACTION
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentBatches.length === 0 ? (
                    <TableRow>
                      <StyledTableCell colSpan={9} align="center" sx={{ color: 'red' }}>
                        No Data Found
                      </StyledTableCell>
                    </TableRow>
                  ) : (currentBatches.map((data, id) => (
                    <StyledTableRow key={id}>
                      <StyledTableCell align="center">{data.coursecode}</StyledTableCell>
                      <StyledTableCell align="center">{data.batchtype}</StyledTableCell>
                      <StyledTableCell align="center">From {data.batchIntime} To {data.batchOuttime}</StyledTableCell>
                      <StyledTableCell align="center">
                        <EditIcon onClick={() => handleUpdate(data)} sx={{ cursor: 'pointer' }} />--
                        <DeleteIcon onClick={() => Deleting(data._id)} sx={{ cursor: 'pointer' }} />
                      </StyledTableCell>
                    </StyledTableRow>
                  )))}
                </TableBody>

                {/* Delete: */}
                <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete this Batch?
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
                {updateBatch && (
                  <Dialog open={openUpdatePopup} onClose={handleUpdatePopupClose}>
                    <DialogTitle sx={{ textAlign: 'center' }}>
                      <Typography component="h1" variant="h5">
                        Edit Batch
                      </Typography>
                    </DialogTitle>
                    <br></br>

                    <DialogContent>
                      <DialogContentText>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            required
                            fullWidth
                            id="batchtype"
                            value={batchtype}
                            onChange={(e) => setUpdateBatch({ ...updateBatch, batchtype: e.target.value })}
                            // onChange={(e) => setbatchtype(e.target.value)}
                            SelectProps={{
                              native: true,
                            }}
                          >
                            <option value="" >
                              Select Batch Type
                            </option>
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Evening">Evening</option>
                          </TextField>
                        </Grid>
                        <br></br>

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              select
                              required
                              fullWidth
                              id="coursecode"
                              value={coursecode}
                              onChange={(e) => setUpdateBatch({ ...updateBatch, coursecode: e.target.value })}
                              SelectProps={{
                                native: true,
                              }}
                            >
                              {/* Map over the batchTypes array */}
                              <option value="">Select Course </option>
                              {batchTypes.map((data) => (
                                <option key={data._id}>
                                  {data.CourseName} - {data.Code}
                                </option>
                              ))}
                            </TextField>
                          </Grid>

                          <Grid item xs={71} sm={55}>
                            <TextField
                              required
                              id="batchIntime"
                              type='time'
                              //   label="Intime"
                              name="batchIntime"
                              value={batchIntime}
                              onChange={(e) => setUpdateBatch({ ...updateBatch, batchIntime: e.target.value })}
                              autoComplete="family-name"
                            />

                            <TextField
                              required
                              id="batchOuttime"
                              type='time'
                              //   label="Outtime"
                              name="batchOuttime"
                              value={batchOuttime}
                              onChange={(e) => setUpdateBatch({ ...updateBatch, batchOuttime: e.target.value })}
                              autoComplete="family-name"
                            />
                          </Grid>
                        </Grid>
                      </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                      <Button onClick={handleUpdatePopupClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={() => handleUpdateBatch(updateBatch)} color="primary" variant="contained">
                        Update Batch
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
                < Box sx={{ textAlign: 'center', marginTop: 2 }}>
                  <Pagination
                    count={Math.ceil(filteredBatches.length / batchesPerPage)}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                  />
                </Box>
              </Table>
            </TableContainer>
          </Typography>
        </Box>
      </Box >
      {/* Update: */}
      < Snackbar open={updateSuccess} autoHideDuration={3000} onClose={() => setUpdateSuccess(false)
      }>
        <Alert onClose={() => setUpdateSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Batch details have been updated successfully.
        </Alert>
      </Snackbar >

      {/* Delete: */}
      < Snackbar open={deleteSuccess} autoHideDuration={3000} onClose={() => setDeleteSuccess(false)}>
        <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Batch details have been deleted successfully.
        </Alert>
      </Snackbar >
    </>
  );
}
