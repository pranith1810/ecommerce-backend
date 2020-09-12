const express = require('express');
const config = require('./config/config.js');
const signup = require('./routes/signup.js');

const app = express();

app.use(express.json());
app.use('/signup', signup);

app.use((req, res, next) => {
  const err = new Error('Not Found!');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status,
      message: err.message,
    },
  });
});

app.listen(config.port);
