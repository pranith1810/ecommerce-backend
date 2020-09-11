const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { connection } = require('../database/dbConnect.js');
const addUserDb = require('../database/addUserDb.js');

const router = express.Router();

router.post('/', (req, res) => {
  addUserDb.addUser(connection, uuidv4(), req.body);
  res.json({
    msg: 'User added successfully!',
  });
});

module.exports = router;
