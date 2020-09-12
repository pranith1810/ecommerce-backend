const express = require('express');
const { body, validationResult } = require('express-validator');
const { connection } = require('../database/dbConnect.js');
const checkUserDb = require('../database/checkUserDb');

const router = express.Router();

router.post('/',
  body('email').isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      checkUserDb.checkUser(connection, req.body)
        .then((data) => {
          if (data.length > 0) {
            res.json({
              msg: 'Login successful!',
            });
          } else {
            res.status(404).json({ msg: 'User does not exist!' });
          }
        })
        .catch((err) => {
          next(err);
        });
    }
  });

module.exports = router;
