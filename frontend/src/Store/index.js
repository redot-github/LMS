import { createSlice, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


// Combined Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: { adminLoggedIn: false, staffLoggedIn: false,studentLoggedIn :false },
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

// Persisted reducer for the combined store
const persistedAuthReducer = persistReducer(
    {
        key: 'auth',
        storage,
    },
    authSlice.reducer
);

// Store configuration
export const authStore = configureStore({
    reducer: persistedAuthReducer,
});

// Persist the store
export const authPersistor = persistStore(authStore);

// Export actions
export const { adminLogin, adminLogout, staffLogin, staffLogout,studentLogin, studentLogout } = authSlice.actions;
