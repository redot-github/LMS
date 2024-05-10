import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { SURL } from "../URL";
import { Grid } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function StudentForm() {

  const nav = useNavigate();

  const [open, setOpen] = useState(false);
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [Gender, setGender] = useState('');
  const [DateOfBirth, setDateOfBirth] = useState('')
  const [BloodGroup, setBloodGroup] = useState('')
  const [Qualification, setQualification] = useState('')
  const [Address, setAddress] = useState('')
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState('')
  const [Password, setPassword] = useState('')

  const [FnameError, setFnameError] = useState("");
  const [LnameError, setLnameError] = useState("");
  const [GenderError, setGenderError] = useState('');
  const [DateOfBirthError, setDateOfBirthError] = useState('');
  const [BloodGroupError, setBloodGroupError] = useState('');
  const [QualificationError, setQualificationError] = useState('')
  const [CourseError, setCourseError] = useState('')
  const [AddressError, setAddressError] = useState('')
  const [EmailError, setEmailError] = useState("");
  const [PhoneError, setPhoneError] = useState('')
  const [PasswordError, setPasswordError] = useState('')

  const [successPopup, setSuccessPopup] = useState(false);

  const [Course, setCourse] = useState([])
  const [isCourses, setisCourses] = useState(false)
  const [batchTypes, setBatchTypes] = useState([])
  const [Getdata, setGetdata] = useState([])
  const [Batch, setBatch] = useState([]);
  const [BatchTime, setBatchTime] = useState([]);
  const [BatchTimes, setBatchTimes] = useState([]);

  const [isAddingField, setIsAddingField] = useState(true);
  const [dynamicFields, setDynamicFields] = useState([{ isCourses: '', Batch: '', BatchTime: '' }]);
  //
  const addDynamicField = () => {
    setDynamicFields([...dynamicFields, { isCourses: '', Batch: '', BatchTime: '' }]);
    setIsAddingField(false);
  };

  const removeDynamicField = (indexToRemove) => {
    const newFields = dynamicFields.filter((_, index) => index !== indexToRemove);
    setDynamicFields(newFields);
    setIsAddingField(true);
  };

  //
  const handleClickOpen = () => {
    setOpen(true);
  };

  // 
  const resetForm = () => {
    setFname('');
    setLname('');
    setGender('');
    setDateOfBirth('');
    setBloodGroup('');
    setCourse([]);
    setQualification('');
    setAddress('');
    setEmail('');
    setPhone('');
    setPassword('');

    setFnameError('');
    setLnameError('');
    setGenderError('');
    setDateOfBirthError('');
    setCourseError('');
    setBloodGroupError('');
    setQualificationError('');
    setAddressError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');

    setDynamicFields([{ isCourses: '', Batch: '', BatchTime: '' }]);
    setIsAddingField(true);
  };

  //
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  //
  const handleSuccessPopupClose = () => {
    setSuccessPopup(false);
  };

  //Post:
  const sendata = async (e) => {
    if (validateForm()) {
      try {
        const dataToSend = {
          Fname,
          Lname,
          Gender,
          DateOfBirth,
          BloodGroup,
          Qualification,
          Address,
          Email,
          Phone,
          Password,
          Course: Course,
          Batch: dynamicFields.map(field => field.Batch),
          BatchTime: dynamicFields.map(field => field.BatchTime)
        };
        await axios.post(SURL, dataToSend);
        setSuccessPopup(true);
        handleClose();
        window.location.reload(false);
        nav('/Student');
      } catch (err) {
        console.error("Error during Login:", err);
        alert("Invalid");
      }
    }
    console.log(sendata)
  };

  //Validation:
  const validateForm = () => {
    let isValid = true;
    if (!Fname) {
      setFnameError("Fname is required");
      isValid = false;
    } else {
      setFnameError("");
    }

    if (!Lname) {
      setLnameError("Lname is required");
      isValid = false;
    } else {
      setLnameError("");
    }
    if (!Gender) {
      setGenderError("Gender is required");
      isValid = false;
    } else {
      setGenderError("");
    }

    if (!DateOfBirth) {
      setDateOfBirthError("DateOfBirth is required");
      isValid = false;
    } else {
      setDateOfBirthError("");
    }

    if (!BloodGroup) {
      setBloodGroupError("BloodGroup is required");
      isValid = false;
    } else {
      setBloodGroupError("");
    }

    if (!Course) {
      setCourseError("Course is required");
      isValid = false;
    } else {
      setCourseError("");
    }

    if (!Qualification) {
      setQualificationError("Qualification is required");
      isValid = false;
    } else {
      setQualificationError("");
    }

    if (!Address) {
      setAddressError("Address is required");
      isValid = false;
    } else {
      setAddressError("");
    }

    if (!Phone) {
      setPhoneError("Phone is required");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!Email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!Password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
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

  useEffect(() => {
    const fetchGetdata = async () => {
      try {
        for (let i = 0; i < Course.length; i++) {
          const selectedCourse = Course[i];
          if (selectedCourse) {
            const response = await axios.get(`http://localhost:5000/ADMIN/Get/${selectedCourse}`);
            const { data } = response;

            setGetdata(prevData => {
              const newData = [...prevData];
              newData[i] = data;
              return newData;
            });

            const times = data.map(item => item.BatchTime);
            setBatchTimes(prevTimes => {
              const newTimes = [...prevTimes];
              newTimes[i] = times;
              return newTimes;
            });

            const batches = data.map(item => item.BatchType);
            setBatch(prevBatches => {
              const newBatches = [...prevBatches];
              newBatches[i] = batches;
              return newBatches;
            });

            setisCourses(true);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGetdata();
  }, [Course]);

  //
  const handleDynamicFieldChange = (e, index, fieldName) => {
    const newFields = [...dynamicFields];
    newFields[index][fieldName] = e.target.value;
    setDynamicFields(newFields);
  };

  //
  const Enabling = async (event, index) => {
    const newDynamicFields = [...dynamicFields];
    newDynamicFields[index].isCourses = event.target.value;
    setDynamicFields(newDynamicFields);

    const newCourse = [...Course];
    newCourse[index] = event.target.value;
    setCourse(newCourse);
  };

  const handleLastNameChange = (e, index) => {
    const selectedBatchType = e.target.value;
    const newDynamicFields = [...dynamicFields];
    newDynamicFields[index].Batch = selectedBatchType;
    setDynamicFields(newDynamicFields);

    const filteredTimes = Getdata[index]?.filter(data => data.BatchType === selectedBatchType)
      .map(data => data.BatchTime);

    const newBatchTimes = [...BatchTimes];
    newBatchTimes[index] = filteredTimes;
    setBatchTimes(newBatchTimes);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <div>
          <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            Add Student
          </Button>

          <Dialog open={open} onClose={handleClose} required>
            <DialogTitle sx={{ textAlign: "center" }}>
              <Typography component="h1" variant="h5">
                Student Details
              </Typography>
            </DialogTitle>
            <br></br>

            <DialogContent>
              <DialogContentText>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      value={Fname}
                      onChange={(e) => setFname(e.target.value)}
                      error={!!FnameError}
                      helperText={FnameError}
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
                      value={Lname}
                      onChange={(e) => setLname(e.target.value)}
                      autoComplete="family-name"
                      error={!!LnameError}
                      helperText={LnameError}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      required
                      fullWidth
                      id="gender"
                      value={Gender}
                      onChange={(e) => setGender(e.target.value)}
                      error={!!GenderError}
                      helperText={GenderError}

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
                      id="DateOfBirth"
                      label="Date of Birth"
                      input type="date"
                      value={DateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      error={!!DateOfBirthError}
                      helperText={DateOfBirthError}

                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="BloodGroup"
                      label="Blood Group"
                      value={BloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      error={!!BloodGroupError}
                      helperText={BloodGroupError}
                    />
                  </Grid>

                  {dynamicFields.map((field, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          required
                          fullWidth
                          id={`Course-${index}`}
                          value={field.Course}
                          onChange={(e) => Enabling(e, index)}
                          error={!!CourseError}
                          helperText={CourseError}
                          autoFocus
                          SelectProps={{
                            native: true,
                          }}
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
                          id={`Batch-${index}`}
                          value={field.Batch}
                          onChange={(e) => handleLastNameChange(e, index)}
                          SelectProps={{
                            native: true,
                          }}
                          disabled={!field.isCourses}
                        >
                          <option value="">Select Batch Type</option>
                          {Batch[index]?.map((batch, batchIndex) => (
                            <option key={batchIndex} value={batch}>
                              {batch}
                            </option>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          required
                          fullWidth
                          id={`BatchTime-${index}`}
                          value={field.BatchTime}
                          onChange={(e) => handleDynamicFieldChange(e, index, 'BatchTime')}
                          SelectProps={{
                            native: true,
                          }}
                          disabled={!field.isCourses || !field.Batch}
                        >
                          <option value="">Select Timings </option>
                          {BatchTimes[index]?.map((time, timeIndex) => (
                            <option key={timeIndex}>{`From: ${time}`}</option>
                          ))}
                        </TextField>
                      </Grid>
                    </React.Fragment>
                  ))}

                  {isAddingField ? (
                    <Grid item xs={12}>
                      <Button variant="contained" color="secondary" onClick={addDynamicField}>
                        Add More
                      </Button>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Button variant="outlined" color="secondary" onClick={() => removeDynamicField(dynamicFields.length - 1)}>
                        Remove
                      </Button>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="Qualification"
                      label="Qualification"
                      name="Qualification"
                      value={Qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      autoComplete="Qualification"
                      error={!!QualificationError}
                      helperText={QualificationError}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="Address"
                      label="Address"
                      name="Address"
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete="Address"
                      error={!!AddressError}
                      helperText={AddressError}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      error={!!EmailError}
                      helperText={EmailError}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="Password"
                      label="Password"
                      name="Password"
                      value={Password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!PasswordError}
                      helperText={PasswordError}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="PHONE"
                      label="Phone Number"
                      name="phone"
                      value={Phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="Phone"
                      error={!!PhoneError}
                      helperText={PhoneError}
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
                Add
              </Button>
            </DialogActions>
          </Dialog>

          {/* Create: */}
          <Snackbar open={successPopup} autoHideDuration={3000} onClose={handleSuccessPopupClose}>
            <Alert onClose={handleSuccessPopupClose} severity="success" sx={{ width: "100%" }}>
              Student details have been uploaded Successfully.
            </Alert>
          </Snackbar>
        </div>
      </ThemeProvider>
    </>
  );
}
