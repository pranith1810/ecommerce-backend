const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
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
      logger.info('User login details validation failed');
      res.status(400).json({ errors: errors.array() }).end();
    } else {
      logger.info('User details validation successful');
      checkUserDb.checkUser(connection, req.body)
        .then((data) => {
          if (data.length > 0) {
            bcrypt.compare(req.body.password, data[0].password, (error, result) => {
              if (error) {
                logger.error(`error occurred while comparing password with hashed password: ${JSON.stringify(error)}`);
                next(error);
              } else if (result === true) {
                if (data[0].active) {
                  const tokenClaims = {
                    id: data[0].id,
                    isAdmin: data[0].is_admin,
                  };
                  jwt.sign(tokenClaims, config.secret, (err, token) => {
                    if (err) {
                      logger.error('User JWT signing failed');
                      next(err);
                    } else {
                      res.json({
                        token,
                      }).end();
                    }
                  });
                } else {
                  logger.info('User not confirmed his mail!');
                  res.status(409).json({ msg: 'Please confirm your mail!' }).end();
                }
              } else {
                logger.info('User does not exist!');
                res.status(404).json({ msg: 'User does not exist!' }).end();
              }
            });
          } else {
            logger.info('User does not exist!');
            res.status(404).json({ msg: 'User does not exist!' }).end();
          }
        })
        .catch((err) => {
          logger.error(`User confirmation in database was not successful!: ${JSON.stringify(err)}`);
          next(err);
        });
    }
  });

module.exports = router;
