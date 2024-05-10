import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import bgimg from "./bg/img.jpg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState, forwardRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { useDispatch } from "react-redux";
import { adminLogin, staffLogin, studentLogin } from '../Store';


const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const boxstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "70%",
  // bgcolor: "background.paper",
  // boxShadow: 24,
};

const center = {
  position: "relative",
  top: "50%",
  left: "37%",
};

export default function Login() {

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [open, setOpen] = useState(false);
  const [remember, setRemember] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const vertical = "top";
  const horizontal = "right";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Post:
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Email) {
      setEmailError("Email is required");
      return;
    }
    if (!Password) {
      setPasswordError("Password is required");
      return;
    }
    setEmailError("");
    setPasswordError("");

    let loginSuccess = false;
    let loginSuccesses = false;

    // Admin:
    try {
      const AdminResponse = await axios.post(
        'http://localhost:5000/ADMIN/loginadmin',
        { Email, Password },
        { withCredentials: true }
      );
      const token = AdminResponse.data.token;

      dispatch(adminLogin());
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/dashboard');
      handleClose();
      loginSuccess = true;
    } catch (adminError) {
      console.error("Error during Admin Login:", adminError);
      // setEmailError("Invalid username or password");
      // setPasswordError("Invalid username or password");
    }

    // Staff:
    if (!loginSuccess) {
      try {
        const StaffResponse = await axios.post(
          'http://localhost:5000/ADMIN/loginStaff',
          { Email, Password },
          { withCredentials: true }
        );
        const token = StaffResponse.data.token;

        dispatch(staffLogin());
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        navigate(`/StaffDashboard`);
        handleClose();
        loginSuccess = true;
      } catch (staffError) {
        console.error("Error during Staff Login:", staffError);
        // setEmailError("Invalid username or password");
        // setPasswordError("Invalid username or password");
      }
    }

    // Student:
    if (!loginSuccesses) {
      try {
        const StudentResponse = await axios.post(
          'http://localhost:5000/ADMIN/loginStudent',
          { Email, Password },
          { withCredentials: true }
        );
        const token = StudentResponse.data.token;

        dispatch(studentLogin());
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        navigate("/StudentDashboard");
        handleClose();
        loginSuccesses = true;
      } catch (studentError) {
        console.error("Error during Student Login:", studentError);
        // setEmailError("Invalid username or password");
        // setPasswordError("Invalid username or password");
      }
    }

    if (loginSuccess) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    if (loginSuccesses) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Failed! Enter correct username and password.
        </Alert>
      </Snackbar>
      <div
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          // backgroundSize:"cover",
          height: "100vh",
        }}
      >
        <Box sx={boxstyle}>
          <Grid container>
            <Grid item xs={12} sm={12} lg={6}>
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <Box>
                <ThemeProvider theme={darkTheme}>
                  <Container>
                    <Box height={35} />
                    <Box sx={center}>
                      <Avatar sx={{ ml: "35px", mb: "4px", bgcolor: "#ffffff" }}>
                        <LockOutlinedIcon />
                      </Avatar>
                      <Typography component="h1" variant="h4">
                        Login
                      </Typography>
                    </Box>
                    <Box
                      component="form"
                      noValidate
                      onSubmit={handleSubmit}
                      sx={{ mt: 2 }}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={12} sx={{ ml: "auto", mr: "auto" }}>
                          <TextField
                            required
                            fullWidth
                            id="email"
                            label="Username"
                            name="email"
                            value={Email}
                            autoComplete="email"
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError(""); // Clear error when user types
                            }}
                            error={!!emailError}
                            helperText={emailError}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ ml: "auto", mr: "auto" }}>
                          <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            value={Password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setPasswordError(""); // Clear error when user types
                            }}
                            error={!!passwordError}
                            helperText={passwordError}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    edge="end"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ ml: "auto", mr: "auto" }}>
                          <Stack direction="row" spacing={2}>
                            <FormControlLabel
                              sx={{ width: "60%" }}
                              onClick={() => setRemember(!remember)}
                              control={<Checkbox checked={remember} />}
                              label="Remember me"
                            />
                            {/* <Typography
                              variant="body1"
                              component="span"
                              onClick={() => {
                                navigate("/reset-password");
                              }}
                              style={{ marginTop: "10px", cursor: "pointer" }}
                            >
                              Forgot password?
                            </Typography> */}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sx={{ ml: "auto", mr: "auto" }}>
                          <Button
                            type="submit"
                            variant="contained"
                            fullWidth="true"
                            size="large"
                            sx={{
                              mt: "10px",
                              mr: "auto",
                              borderRadius: 28,
                              color: "#ffffff",
                              minWidth: "170px",
                              backgroundColor: "#FF9A01",
                              backgroundColor: "rgb(237,83,202)",
                              backgroundColor: "linear-gradient(90deg, rgba(237,83,202,1) 45%, rgba(200,205,230,1) 92%)",
                            }}
                          >
                            Login
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Container>
                </ThemeProvider>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}

