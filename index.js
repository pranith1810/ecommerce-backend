const express = require('express');
const config = require('./config/config.js');
const signup = require('./routes/signup.js');

const app = express();

app.use(express.json());
app.use('/signup', signup);

app.listen(config.port);
