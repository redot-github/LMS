import * as React from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Alert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { CURL } from '../URL'

const theme = createTheme();

export default function CourseForm() {

  const nav = useNavigate();

  const [open, setOpen] = useState(false);
  
  const [code, setcode] = useState('');
  const [cname, setcname] = useState('');
  const [desc, setdesc] = useState('');
  const [check, setCheck] = useState(false);

  const [codeError, setcodeError] = useState('');
  const [cnameError, setcnameError] = useState('');
  const [descError, setdescError] = useState('');

  const [successPopup, setSuccessPopup] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setcode('')
    setcname('')
    setdesc('')
    setCheck('')
  };

  const handleSuccessPopupClose = () => {
    setSuccessPopup(false);
  };

  // Post:
  const sendata = async (e) => {
    if (validateForm()) {
    await axios.post(CURL, { code, cname, desc, check });
    setSuccessPopup(true);
    handleClose();
    setcode('')
    setdesc('')
    setCheck('')
    // window.location.reload(false);
    nav('/Course');
  }
}

//Validation:
const validateForm = () => {
  let isValid = true;

  if (!code) {
    setcodeError("Code is required");
    isValid = false;
  } else {
    setcodeError("");
  }

  if (!cname) {
    setcnameError("Name is required");
    isValid = false;
  } else {
    setcnameError("");
  }
  if (!desc) {
    setdescError("Decription is required");
    isValid = false;
  } else {
    setdescError("");
  }
  return isValid;
}
  return (
    <>
      <ThemeProvider theme={theme}>
        <div>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add Course
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>
              <Typography component="h1" variant="h5">
                Course
              </Typography>
            </DialogTitle>
            <br></br>

            <DialogContent>
              <DialogContentText>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="code"
                      fullWidth
                      id="code"
                      label="Course Code"
                      value={code}
                      onChange={(e) => setcode(e.target.value)}
                      autoFocus
                      error={!!codeError}
                      helperText={codeError}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="cname"
                      label="Course Name"
                      name="cname"
                      value={cname}
                      onChange={(e) => setcname(e.target.value)}
                      autoComplete="family-name"
                      error={!!cnameError}
                      helperText={cnameError}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="desc"
                      label="Description"
                      name="desc"
                      value={desc}
                      onChange={(e) => setdesc(e.target.value)}
                      error={!!descError}
                      helperText={descError}
                    />
                  </Grid>
                </Grid>
                <FormControlLabel
                  control={<Checkbox checked={check} color="primary" />}
                  onChange={() => setCheck(!check)}
                  label="Active"
                />
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={sendata} color="primary" variant="contained">
                Add Course
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar open={successPopup} autoHideDuration={3000} onClose={handleSuccessPopupClose}>
            <Alert onClose={handleSuccessPopupClose} severity="success" sx={{ width: "100%" }}>
              Course Created Successfully
            </Alert>
          </Snackbar>

        </div>
      </ThemeProvider>
    </>
  );
}
