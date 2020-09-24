const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config.js');
const { connection } = require('../database/dbConnect.js');
const addUserDb = require('../database/addUserDb.js');
const { confirmUser } = require('../database/confirmUser.js');
const logger = require('../logger.js');
const nodeMailer = require('../config/nodeMailer');

const router = express.Router();

function postAndVerify(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.info('User signup details validation failed');
    res.status(400).json({ errors: errors.array() }).end();
  } else {
    bcrypt.hash(req.body.password, 10, (error, hash) => {
      if (error) {
        logger.error(`Generating hash for password failed: ${JSON.stringify(error)}`);
        next(error);
      } else {
        const user = {
          name: req.body.name,
          email: req.body.email,
          password: hash,
          id: uuidv4(),
        };

        addUserDb.addUser(connection, user)
          .then(() => {
            let url = '';

            jwt.sign(user.id, config.secret, (err, token) => {
              url = `http://${req.get('host')}/signup/confirmation/${token}`;
              if (err) {
                logger.error('User id JWT sign failed!');
                next(err);
              } else {
                nodeMailer.sendMail({
                  to: user.email,
                  from: config.sendgridFromEmail,
                  subject: 'Confirm Email Trendy.com',
                  html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                })
                  .then(() => {
                    logger.info('sending email for confirmation successful');
                  })
                  .catch((addUserError) => {
                    logger.error(`Error sending confirmation mail!: ${JSON.stringify(addUserError)}`);
                    next(error);
                  });
                res.json({ msg: 'user added successfully' }).end();
              }
            });
          })
          .catch((err) => {
            if (err.code === 'ER_DUP_ENTRY') {
              logger.info('User already exists');
              res.status(409).json({ msg: 'User already exists!' }).end();
            } else {
              logger.error(`Adding user to database failed!: ${JSON.stringify(err)}`);
              next(err);
            }
          });
      }
    });
  }
}

router.post('/',
  body('email').isEmail(),
  body('name').isAlpha(),
  body('password').isLength({ min: 8 }),
  postAndVerify);

router.get('/confirmation/:token', (req, res, next) => {
  jwt.verify(req.params.token, config.secret, (err, id) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).json({ msg: 'Verification failed!!' }).end();
    } else {
      confirmUser(connection, id)
        .then(() => {
          logger.info('User confirmation successful');
          res.send('Thank you for confirming!').end();
        })
        .catch((error) => {
          logger.error(`User confirmation status update in database failed!: ${JSON.stringify(error)}`);
          next(error);
        });
    }
  });
});

module.exports = router;
