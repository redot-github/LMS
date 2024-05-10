import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeIcon from '@mui/icons-material/Home';
import ChecklistIcon from '@mui/icons-material/Checklist';
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout, staffLogout } from '../../Store';
import axios from 'axios';
import { color, colorChannel } from '@mui/system';
import myimage from '../img/Hello REDOT.png'
import human from '../img/mdi_human-hello.png'
import LMS from '../img/LMS.png'
import LMS1 from '../img/Group 14.png'
import REDOTLOGO from '../img/Group 30.png'
import REDOTLOGOS from '../img/redot-log 1.png'


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: 'darkblue'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
    backgroundColor: 'red',

  }),
  backgroundColor: 'darkblue',
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'left',
  justifyContent: 'flex-start',
  width: `calc(100% - ${drawerWidth}px)`,
  padding: theme.spacing(0, 0),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer
    + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: open ? 'white' : 'white',
  ...(open && {
    marginLeft: drawerWidth,
    backgroundColor: 'white',
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundRepeat: 'no-repeat',

}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    color: 'white',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor: 'darkblue',    // Add this line to set the background color
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),

    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    })
  })
);

const StyledChevronRightIcon = styled(ChevronRightIcon)(({ theme }) => ({
  transform: theme.direction === "ftl" ? 'rotate(180deg)' : 'none',
  backgroundColor: theme.direction === "ftl" ? 'white' : 'white',
  color: theme.direction === "ftl" ? 'blue' : 'white',
}));

export default function AdminSideBar() {
  // const theme = useTheme();
  const nav = useNavigate();
  const [open, setOpen] = React.useState(false);

  const [darkMode, setDarkMode] = React.useState(false);
  const [userData, setUserData] = useState('');
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
        setUserData(res.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    };

    fetchData();
  }, []);


  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create a theme based on the current dark mode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    }
  })

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    if (open) {
      setOpen(false)
    }
  };
  const dispatch = useDispatch();
  const [isLoggedInLocal, setIsLoggedInLocal] = useState(false);

  //Logout:
  const sendLogout = async () => {
    const res = await axios.post('http://localhost:5000/ADMIN/Logout', null, { withCredentials: true });
    // setNavigate(true);
    if (res.status == 200) {
      return res;
    }
    return new Error("unable to Logout")
  }
  const adminLoggedIn = useSelector((state) =>
    state.adminLoggedIn);
  const handleLogout = async () => {
    try {
      await sendLogout();
      if (adminLoggedIn) {
        dispatch(adminLogout());
      }
      localStorage.removeItem('token');
      setIsLoggedInLocal(false);
      nav('/');
    } catch (error) {
      // Handle logout error
    }
  }
  // eslint-disable-next-line
  const [openSignupDialog, setOpenSignupDialog] = useState(false);
  // eslint-disable-next-line
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  // eslint-disable-next-line
  const [openStudent, setOpenStudent] = useState(false);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} sx={{ backgroundColor: 'white' }} >
          <Toolbar sx={{ display: "flex-direction-end" }}>
            <IconButton
              color="white"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                color: 'whitesmoke',

                ...(open && { display: "none" }),
                color: 'darkblue',
                '&:hover': {
                  backgroundColor: 'white',
                },
                // boxShadow: '0 4px 12px rgba(0, 0, 139, 0.8)',

              }}
            >

              <MenuIcon />

            </IconButton>
            {userData && (
              <div>
                <h2 className='LoginUser'>Welcome <span style={{ color: 'darkblue' }}>{userData.Name}</span></h2>
                {/* Render other user data fields as needed */}
              </div>
            )}
            <img className='logohuman' src={human} alt=''></img>


            <Box sx={{ flexGrow: 1, backgroundColor: 'darkblue' }} /> {/* Add flexGrow: 1 here */}
            <Box sx={{ display: "flex", marginRight: "8px" }}>
              <Toolbar sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {/* <img src={myimage} alt=''></img> */}
                Dark mode toggle button
                <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                  <IconButton onClick={toggleDarkMode} sx={{ p: 0, marginRight: 1 }}>
                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Tooltip>

                {/* User menu button */}
                <Toolbar>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="" src="/static/images/avatar/2.jpg" sx={{ color: 'red' }} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>My account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </Toolbar>
              </Toolbar>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader className='heading-pro' sx={{ backgroundColor: 'white', color: 'green' }} >

            <IconButton onClick={handleDrawerClose}>
              <h2 className='heading-project'>LMS</h2>

              {theme.direction === "ftl" ? (
                <StyledChevronRightIcon />

              ) : (
                <ChevronLeftIcon sx={{ color: 'white' }} />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>

            {["Dashboard", "Student", "Staff", "Course", "Batch", "Attendance", "Scheduler"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                {open ? (
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      backgroundColor: 'darkblue',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'orange',
                      },
                    }}
                    onClick={() => nav(`/${text.toLowerCase()}`)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >

                      {index === 0 ? (
                        <DashboardIcon />
                      ) : index === 1 ? (
                        <LocalLibraryIcon />
                      ) : index === 2 ? (
                        <PersonIcon />
                      ) : index === 3 ? (
                        <SchoolIcon />
                      ) : index === 4 ? (
                        <GroupsIcon />
                      ) : index === 5 ? (
                        <ChecklistIcon />
                      ) : index === 6 ? (
                        <CalendarMonthIcon />
                      ) : index === 7 ? (
                        <>
                          <img className='REDOTLOGOS1' src={REDOTLOGOS} alt="LMS Logo" />
                          <img className='REDOTLOGOS' src={REDOTLOGO} alt="LMS Logo" />

                        </>
                      ) : null}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                ) : (
                  <Tooltip title={text} placement='right'>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'left',
                        px: 2.5,
                      }}
                      onClick={() => nav(`/${text.toLowerCase()}`)}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        {index === 0 ? (
                          <DashboardIcon />
                        ) : index === 1 ? (
                          <LocalLibraryIcon />
                        ) : index === 2 ? (
                          <PersonIcon />
                        ) : index === 3 ? (
                          <SchoolIcon />
                        ) : index === 4 ? (
                          <GroupsIcon />
                        ) : index === 5 ? (
                          <ChecklistIcon />
                        ) : index === 6 ? (
                          <CalendarMonthIcon />
                        ) : index === 7 ? (
                          <img className='REDOTLOGOS' src={REDOTLOGOS} alt="LMS Logo" href='#' />
                        ) :
                          null}
                      </ListItemIcon>
                      <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </Tooltip>
                )}
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
