const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config.js');
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
    } else {
      addUserDb.addUser(connection, uuidv4(), req.body)
        .then((userId) => {
          res.json({
            msg: 'User added successfully!',
            // userId,
          });
        })
        .catch((err) => {
          if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ msg: 'User already exists!' });
          } else {
            next(err);
          }
        });
    }
  });

// router.post('/confirm/:id', (req, res, next) => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: 'Your Gmail ID',
//       pass: 'Gmail Password',
//     },
//   });

//   jwt.sign({ id: req.params.id }, config.secret, (err, emailToken) => {
//     const url = `http://localhost:8080/confirmation/${emailToken}`;

//     if (err) {
//       next(err);
//     } else {
//       transporter.sendMail({
//         to: .email,
//         subject: 'Confirm Email',
//         html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
//       });
//     }
//   });
// });

module.exports = router;
