import { createSlice } from '@reduxjs/toolkit';

const createAuthSlice = () => {
  return createSlice({
    name: 'auth',
    initialState: { adminLoggedIn: false, staffLoggedIn: false, studentLoggedIn: false },
    reducers: {
      adminLogin(state) {
        state.adminLoggedIn = true;
      },
      adminLogout(state) {
        state.adminLoggedIn = false;
      },
      staffLogin(state) {
        state.staffLoggedIn = true;
      },
      staffLogout(state) {
        state.staffLoggedIn = false;
      },
      studentLogin(state) {
        state.studentLoggedIn = true;
      },
      studentLogout(state) {
        state.studentLoggedIn = false;
      },
    },
  });
};

export default createAuthSlice;
