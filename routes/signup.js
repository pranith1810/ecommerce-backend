const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { connection } = require('../database/dbConnect.js');
const addUserDb = require('../database/addUserDb.js');

const router = express.Router();

router.post('/',
  body('email').isEmail(),
  body('name').isAlpha(),
  body('password').isLength({ min: 8 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    addUserDb.addUser(connection, uuidv4(), req.body)
      .then(() => {
        res.json({
          msg: 'User added successfully!',
        });
      })
      .catch((err) => {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(409).json({ msg: 'User already exists!' });
        } else {
          next(err);
        }
      });
  });

module.exports = router;
