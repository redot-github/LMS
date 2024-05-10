const express = require('express');
const mongoose = require('mongoose');
const router = require('./view/router');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const cookieParser = require('cookie-parser'); // Corrected import statement

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.use(bodyParser.json());

app.use('/ADMIN', router); // http://localhost:5000/ADMIN

mongoose.connect('mongodb://localhost:27017/LMS')
  .then(() => {
    console.log('DB Connected');
    app.listen(5000);
  });
