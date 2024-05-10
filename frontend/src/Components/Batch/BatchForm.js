
import * as React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Alert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { BURL } from '../URL'

const theme = createTheme();

export default function BatchForm() {

  const nav = useNavigate();

  const [open, setOpen] = useState(false);
  const [batchtype, setbatchtype] = useState('')
  const [batchIntime, setbatchIntime] = useState('')
  const [batchOuttime, setbatchOuttime] = useState('')

  const [batchtypeError, setbatchtypeError] = useState('')
  const [batchIntimeError, setbatchIntimeError] = useState('')
  const [batchOuttimeError, setbatchOuttimeError] = useState('')
  const [coursecodeError, setcoursecodeError] = useState([])

  const [batchTypes, setBatchTypes] = useState([]);
  const [coursecode, setcourseCode] = useState([])

  const [successPopup, setSuccessPopup] = useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form fields
    setcourseCode('')
    setbatchtype('');
    setbatchIntime('');
    setbatchOuttime('');
  };

  const handleSuccessPopupClose = () => {
    setSuccessPopup(false);
  };

  //Post:
  const sendata = async () => {
    if (validateForm()) {
      await axios.post(BURL, { batchtype, coursecode, batchIntime, batchOuttime });
      setSuccessPopup(true);
      handleClose();
      // Refresh the page without full reload
      setBatchTypes([...batchTypes, { CourseName: batchtype, Code: coursecode }]);
      nav('/Batch');
    };
  }

  //Validation:
  const validateForm = () => {
    let isValid = true;

    if (!batchtype) {
      setbatchtypeError("Batchtype is required");
      isValid = false;
    } else {
      setbatchtypeError("");
    }

    if (!coursecode) {
      setcoursecodeError("Course is required");
      isValid = false;
    } else {
      setcoursecodeError("");
    }

    if (!batchIntime) {
      setbatchIntimeError("BatchIntime is required");
      isValid = false;
    } else {
      setbatchIntimeError("");
    }

    if (!batchOuttime) {
      setbatchOuttimeError("BatchOuttime is required");
      isValid = false;
    } else {
      setbatchOuttimeError("");
    }
    return isValid;
  };

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
return (
  <>
    <ThemeProvider theme={theme}>
      <div>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Batch
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ textAlign: 'center' }}>
            <Typography component="h1" variant="h5">
              Batch
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
                  onChange={(e) => setbatchtype(e.target.value)}
                  error={!!batchtypeError}
                  helperText={batchtypeError}
                  autoFocus
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
                    onChange={(e) => setcourseCode(e.target.value)}
                    SelectProps={{
                      native: true,
                    }}
                  >
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
                    onChange={(e) => setbatchIntime(e.target.value)}
                    autoComplete="family-name"
                    error={!!batchIntimeError}
                    helperText={batchIntimeError}
                    autoFocus
                  />

                  <TextField
                    required
                    id="batchOuttime"
                    type='time'
                    //   label="Outtime"
                    name="batchOuttime"
                    value={batchOuttime}
                    onChange={(e) => setbatchOuttime(e.target.value)}
                    autoComplete="family-name"
                    error={!!batchOuttimeError}
                    helperText={batchOuttimeError}
                    autoFocus
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={sendata} color="primary" variant="contained">
              Add Batch
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={successPopup} autoHideDuration={3000} onClose={handleSuccessPopupClose}>
          <Alert onClose={handleSuccessPopupClose} severity="success" sx={{ width: "100%" }}>
            Batch Created Successfully
          </Alert>
        </Snackbar>

      </div>
    </ThemeProvider>
  </>
)

                    }