const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { connection } = require('../database/dbConnect.js');
const checkUserDb = require('../database/checkUserDb');
const config = require('../config/config.js');
const logger = require('../logger.js');

const router = express.Router();

router.post('/',
  body('email').isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info('User verification failed');
      res.status(400).json({ errors: errors.array() });
    } else {
      logger.info('User verification successful');
      checkUserDb.checkUser(connection, req.body)
        .then((data) => {
          if (data.length > 0) {
            if (data[0].active) {
              jwt.sign(data[0].id, config.secret, (err, token) => {
                if (err) {
                  logger.error('User JWT signing failed');
                  next(err);
                } else {
                  res.json({
                    token,
                    isAdmin: data[0].is_admin,
                  });
                }
              });
            } else {
              logger.info('User not confirmed his mail!');
              res.status(409).json({ msg: 'Please confirm your mail!' });
            }
          } else {
            logger.info('User does not exist!');
            res.status(404).json({ msg: 'User does not exist!' });
          }
        })
        .catch((err) => {
          logger.error('User confirmation in database was not successful!');
          next(err);
        });
    }
  });

module.exports = router;
