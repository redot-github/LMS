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
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useState } from 'react';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useDispatch, useSelector } from 'react-redux';
import { staffLogout } from '../../Store';
import axios from 'axios';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function StaffSideBar() {
  // const theme = useTheme();
  const nav = useNavigate();
  const [open, setOpen] = React.useState(false);

  const [darkMode, setDarkMode] = React.useState(false);

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
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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

  //Logout
  const sendLogout = async () => {
    const res = await axios.post('http://localhost:5000/ADMIN/StaffLogout', null, { withCredentials: true });
    if (res.status == 200) {
      return res;
    }
    return new Error("unable to Logout")
  }
  const staffLoggedIn = useSelector((state) =>
    state.staffLoggedIn);

  const dispatch = useDispatch();
  const [isLoggedInLocal, setIsLoggedInLocal] = useState(false);

  axios.defaults.withCredentials = true;

  const handleLogout = async () => {
    try {
      await sendLogout();
      if (staffLoggedIn) {
        dispatch(staffLogout());
      }
      localStorage.removeItem('token');
      setIsLoggedInLocal(false);
      nav('/');
    } catch (error) {
      // Handle logout error
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar sx={{ display: "flex-direction-end" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
                // color: 'blue', 
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", marginRight: "8px" }}>
              <Toolbar sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                  <IconButton onClick={toggleDarkMode} sx={{ p: 0, marginRight: 1 }}>
                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Tooltip>

                <Toolbar>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="" src="/static/images/avatar/2.jpg" />
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
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ftl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {["StaffDashboard",].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                {open ? (
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
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
                        <CalendarMonthIcon />
                      ) : null}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                ) : (
                  <Tooltip title={text} placement='right'>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                      onClick={() => nav(`/${text.toLowerCase()}`)}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
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
                          <CalendarMonthIcon />
                        ) : null}
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
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <DrawerHeader />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
