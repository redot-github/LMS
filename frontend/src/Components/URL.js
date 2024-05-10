import axios from 'axios'
//Admin:
export const URL = 'http://localhost:5000/ADMIN/AdminSignUp';

export const DisplayURL = 'http://localhost:5000/ADMIN/AdminDisplay';

export const DeleteURL = 'http://localhost:5000/ADMIN/AdminDelete/:id';

//Student:
export const SURL = `http://localhost:5000/ADMIN/StudentDetails`;

export const StudentDisplay= 'http://localhost:5000/ADMIN/StudentDisplay';

export const StudentUpdate = 'http://localhost:5000/ADMIN/StudentUpdate/:id' 

//Course:
export const CURL = `http://localhost:5000/ADMIN/CourseDetails`;

export const CourseDisplay = 'http://localhost:5000/ADMIN/CourseDisplay';

export const CourseUpdate = 'http://localhost:5000/ADMIN/CourseUpdate/:id' 

// Batch:
export const BURL = `http://localhost:5000/ADMIN/BatchDetails`;

export const BatchDisplay= 'http://localhost:5000/ADMIN/BatchDisplay';

//Staff:
export const FURL = `http://localhost:5000/ADMIN/StaffDetails`;

export const StaffDisplay= 'http://localhost:5000/ADMIN/StaffDisplay';

const BaseURL = 'http://localhost:5000/ADMIN/Login'
export const axiosPrivate = axios.create
({
    baseURL: BaseURL,
    headers: {'Content-Type': 'application/json'},
    Withcredentials: true

});


export const sendLogout = 'http://localhost:5000/ADMIN/Stafflogout';