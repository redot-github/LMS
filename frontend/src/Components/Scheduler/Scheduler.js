import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid,
  TableCell, Table, TableBody, TableHead, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import AdminSideBar from "../SideBar/AdminSideBar";

const localizer = momentLocalizer(moment);

export default function Scheduler() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [updatedEvent, setUpdatedEvent] = useState({});
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [Course, setCourse] = useState([])
  const [isCourses, setIsCourses] = useState(false)
  const [isBatchType, setIsBatchType] = useState(false);
  const [batchTypes, setBatchTypes] = useState([])
  const [Getdata, setGetdata] = useState([])
  const [Batch, setBatch] = useState([]);
  const [BatchTime, setBatchTime] = useState([]);
  const [BatchTimes, setBatchTimes] = useState([]);
  const [StaffName, setStaffName] = useState([]);
  const [display, setDisplay] = useState([]);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Validation states
  const [courseError, setCourseError] = useState(false);
  const [batchError, setBatchError] = useState(false);
  const [batchTimeError, setBatchTimeError] = useState(false);
  const [staffNameError, setStaffNameError] = useState(false);
  const [dateError, setDateError] = useState(false);

  // Validation function
  const validateForm = () => {
    let isValid = true;

    if (!Course) {
      setCourseError(true);
      isValid = false;
    } else {
      setCourseError(false);
    }

    if (!Batch) {
      setBatchError(true);
      isValid = false;
    } else {
      setBatchError(false);
    }

    if (!BatchTime) {
      setBatchTimeError(true);
      isValid = false;
    } else {
      setBatchTimeError(false);
    }

    if (!StaffName) {
      setStaffNameError(true);
      isValid = false;
    } else {
      setStaffNameError(false);
    }

    if (!newEvent.Date) {
      setDateError(true);
      isValid = false;
    } else {
      setDateError(false);
    }

    return isValid;
  };

  //Get Scheduler Data: 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ADMIN/getallscheduler');
        const formattedEvents = response.data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchData();
  }, []);

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Show snackbar function
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);

    setTimeout(() => {
      setSnackbarOpen(false);
    }, 3000);
  };

  // 
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
    setNewEvent({
      title: '',
      Batch: '',
      BatchTime: '',
      StaffName: '',
      Date: '',
    });
    setCourse('');
    setIsCourses(false);
    setIsBatchType(false);
    setBatch('');
    setBatchTime('');
    setStaffName(false);

    // Reset error states
    setCourseError(false);
    setBatchError(false);
    setBatchTimeError(false);
    setStaffNameError(false);
    setDateError(false);
  };

  // Add Event:
  const handleAddEvent = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const eventToAdd = {
        ...newEvent,
        title: Course,
        Batch: Batch,
        BatchTime: BatchTime,
        StaffName: StaffName,
      };
      const response = await axios.post("http://localhost:5000/ADMIN/addscheduler", eventToAdd);
      setEvents([...events, response.data]);
      handleCloseAddDialog();
      showSnackbar("Event Added Successfully", "success");
    } catch (error) {
      console.error('Error posting event data:', error);
      showSnackbar("Error adding event", "error");
    }
  };

  //
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

  //
  useEffect(() => {
    const fetchGetdata = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ADMIN/Get/${Course}`);
        setGetdata(response.data);
        setIsCourses(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchGetdata();
  }, [Course]);

  //Get StaffName:
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ADMIN/getStaffByCourse/${Course}/${Batch}/${BatchTime}`);
        setDisplay(response.data.staffs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [Course, Batch, BatchTime]);

  // Course:
  const handleCourseChange = (event) => {
    const selectedCourses = event.target.value;
    setCourse(selectedCourses);
    setIsCourses(false);
    setCourseError(false);
  };

  // Batch:
  const handleBatchChange = (event) => {
    const selectedBatchType = event.target.value;
    setBatch(selectedBatchType);

    const selectedBatch = batchTypes.find(data => data.BatchType === selectedBatchType);
    const batchInTime = selectedBatch ? selectedBatch.batchInTime : '';
    const batchOutTime = selectedBatch ? selectedBatch.batchOutTime : '';
    setBatchTimes(selectedBatch ? [`${batchInTime} to ${batchOutTime}`] : []);
    setIsBatchType(!!selectedBatchType);
    setBatchError(false);
  };

  // BatchTime:
  const handleBatchTimeChange = () => {
    setBatchTimeError(false);
  };

  // StaffName
  const handleStaffNameChange = () => {
    setStaffNameError(false);
  };

  // Date:
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevState => ({
      ...prevState,
      [name]: value
    }));
    setDateError(false);
  };

  // Open update dialog:
  const handleOpenUpdateDialog = (event) => {
    setSelectedEvent(event);
    const updatedEventData = {
      ...event,
      title: event.title,
      Batch: event.Batch,
      BatchTime: event.BatchTime,
      StaffName: event.StaffName,
      Date: event.Date
    };
    setUpdatedEvent(updatedEventData);
    setIsUpdateDialogOpen(true);
  };

  // Close update dialog:
  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setUpdatedEvent({});
  };

  //Update Event:
  const handleUpdateDialogSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/ADMIN/updatescheduler/${updatedEvent._id}`, updatedEvent);
      setEvents(events.map(event => event._id === updatedEvent._id ? response.data : event));
      handleCloseUpdateDialog();
      showSnackbar("Event Updated Successfully", "success");
    } catch (error) {
      console.error('Error updating event data:', error);
      showSnackbar("Error updating event", "error");
    }
  };

  // Delete Event:
  const handleDeleteEvent = (eventId) => {
    setDeleteEventId(eventId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/ADMIN/deletescheduler/${deleteEventId}`);
      const updatedEvents = events.filter(event => event._id !== deleteEventId);
      setEvents(updatedEvents);
      setIsDeleteDialogOpen(false);
      showSnackbar("Event Deleted Successfully", "success");
    } catch (error) {
      console.error('Error deleting event:', error);
      showSnackbar("Error deleting event", "error");
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <AdminSideBar />
        <Box component="main" sx={{ flexGrow: 8, p: 8, ml: -11, mr: 0 }}>
          <Typography variant="h4" align="center" sx={{ fontFamily: 'fantasy', color: 'darkblue', marginTop: '5px' }}>
            Scheduler
          </Typography>

          <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
            Add Event
          </Button>

          {/* Snackbar */}
          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
            <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>

          <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog}>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date"
                    name="Date"
                    type="date"
                    value={newEvent.Date || ''}
                    onChange={handleDateChange}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={dateError}
                    helperText={dateError ? 'Date is required' : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    required
                    fullWidth
                    id="Course"
                    value={Course}
                    onChange={handleCourseChange}
                    autoFocus
                    SelectProps={{
                      native: true,
                    }}
                    error={courseError}
                    helperText={courseError ? 'Course is required' : ''}
                  >
                    <option value="">Select Course </option>
                    {batchTypes.map((data) => (
                      <option key={data._id}>
                        {data.Course}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    required
                    fullWidth
                    id="Batch"
                    value={Batch}
                    onChange={handleBatchChange}
                    SelectProps={{
                      native: true,
                    }}
                    disabled={!isCourses}
                    error={batchError}
                    helperText={batchError ? 'Batch Type is required' : ''}
                  >
                    <option value="">Select Batch Type</option>
                    {Getdata.map((data) => (
                      <option key={data.id} value={data.Batchtype}>
                        {data.BatchType}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    required
                    fullWidth
                    id="BatchTime"
                    value={BatchTime}
                    onChange={(e) => {
                      handleBatchTimeChange();
                      setBatchTime(e.target.value)
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    disabled={!isCourses || !isBatchType}
                    error={batchTimeError}
                    helperText={batchTimeError ? 'Batch Timing is required' : ''}
                  >
                    <option value="">Select Batch Timing </option>
                    {BatchTimes.map((time, index) => (
                      <option key={index}>{`From: ${time}`}</option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    required
                    fullWidth
                    id="StaffName"
                    value={StaffName}
                    onChange={(e) => {
                      handleStaffNameChange();
                      setStaffName(e.target.value);
                    }}
                    SelectProps={{
                      native: true,
                    }}
                    disabled={!isCourses || !isBatchType || BatchTime === ''}
                    error={staffNameError}
                    helperText={staffNameError ? 'Staff Name is required' : ''}
                  >
                    <option value="">Select Staff Name</option>
                    {display.map((staff, index) => (
                      <option key={index} value={staff.StaffName}>
                        {staff.StaffName}
                      </option>
                    ))}
                  </TextField>
                </Grid>

              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAddEvent} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>

          {/* Update */}
          <Dialog open={isUpdateDialogOpen} onClose={handleCloseUpdateDialog}>
            <DialogTitle>Update Event</DialogTitle>
            <DialogContent>

              {updatedEvent && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date"
                      name="date"
                      type="date"
                      value={updatedEvent.Date}
                      onChange={(e) => setUpdatedEvent(prevState => ({ ...prevState, Date: e.target.value }))}
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={dateError}
                      helperText={dateError ? 'Date is required' : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      // select
                      required
                      fullWidth
                      id="Course"
                      value={updatedEvent.title || ''}
                      onChange={(e) =>
                        setUpdatedEvent(prevState => ({ ...prevState, title: e.target.value }))}
                      disabled={true}
                      SelectProps={{
                        native: true,
                      }}
                      style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                    >
                      <option value="">Select Course </option>
                      {batchTypes.map((data) => (
                        <option key={data._id}>
                          {data.Course}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      // select
                      required
                      fullWidth
                      id="Batch"
                      value={updatedEvent.Batch}
                      onChange={(e) => setUpdatedEvent(prevState => ({ ...prevState, Batch: e.target.value }))}
                      disabled={true}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Select Batch Type</option>
                      {Getdata.map((data) => (
                        <option key={data.id} value={data.Batchtype}>
                          {data.BatchType}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      // select
                      required
                      fullWidth
                      id="BatchTime"
                      value={updatedEvent.BatchTime}
                      onChange={(e) => setUpdatedEvent(prevState => ({ ...prevState, BatchTime: e.target.value }))}
                      disabled={true}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Select Batch Timing </option>
                      {BatchTimes.map((time, index) => (
                        <option key={index}>{`From: ${time}`}</option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      // select
                      required
                      fullWidth
                      id="StaffName"
                      value={updatedEvent.StaffName}
                      onChange={(e) => setUpdatedEvent(prevState => ({ ...prevState, StaffName: e.target.value }))}
                      disabled={true}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Select Staff Name</option>
                      {display.map((staff, index) => (
                        <option key={index} value={staff.StaffName}>
                          {staff.StaffName}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                </Grid>
              )}

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUpdateDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleUpdateDialogSubmit} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>


          {/* Delete */}
          <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete this event?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Scheduler */}
          <Calendar
            localizer={localizer}
            events={events}
            showAllEvents={true}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, backgroundColor: 'white' }}
            views={['month', 'agenda']}
            onSelectEvent={handleEventClick}
          />

          {/* Update and Delete Popup */}
          {selectedEvent && (
            <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
              <DialogContent>
                <Table sx={{ textAlign: 'center' }}>
                  <TableHead>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Course Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Batch Type</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                  </TableHead>

                  <TableBody>
                    <TableCell align="center">{selectedEvent.title}</TableCell>
                    <TableCell align="center">{selectedEvent.Batch}</TableCell>
                    <TableCell align="center" sx={{ color: 'red' }}>{selectedEvent.StaffName}</TableCell>
                  </TableBody>
                </Table>

                <DialogContent sx={{ textAlign: 'center' }}>
                  <Typography variant="body1">
                    Date : {new Date(selectedEvent?.start).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' })}
                  </Typography>
                  <Typography variant="body1">
                    Start: {new Date(selectedEvent?.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })}
                  </Typography>
                  <Typography variant="body1">
                    End : {new Date(selectedEvent?.end).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })}
                  </Typography>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center' }}>
                  <Button onClick={() => {
                    handleOpenUpdateDialog(selectedEvent);
                    setSelectedEvent(null);
                  }} color="primary">
                    Update
                  </Button>

                  <Button onClick={() => {
                    handleDeleteEvent(selectedEvent._id);
                    setSelectedEvent(null);
                  }} color="error">
                    Delete
                  </Button>

                  <Button onClick={() => setSelectedEvent(null)} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </DialogContent>
            </Dialog>
          )}
        </Box>
      </Box >
    </>
  )
}
