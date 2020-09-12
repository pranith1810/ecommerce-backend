const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const senderGridTransport = require('nodemailer-sendgrid-transport');
const config = require('../config/config.js');
const { connection } = require('../database/dbConnect.js');
const addUserDb = require('../database/addUserDb.js');
const { confirmUser } = require('../database/confirmUser.js');

const router = express.Router();

function postAndVerify(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    addUserDb.addUser(connection, uuidv4(), req.body)
      .then(() => {
        let url = '';

        const transporter = nodemailer.createTransport(senderGridTransport({
          auth: {
            api_key: config.sendgridApiKey,
          },
        }));

        jwt.sign(req.body.id, config.secret, (err, token) => {
          url = `http://${req.get('host')}/signup/confirmation/${token}`;
          if (err) {
            next(err);
          } else {
            transporter.sendMail({
              to: req.body.email,
              from: 'n.rao@mountblue.tech',
              subject: 'Confirm Email Trendy.com',
              html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
            });
            res.send('user added successfully');
          }
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
}

router.post('/',
  body('email').isEmail(),
  body('name').isAlpha(),
  body('password').isLength({ min: 8 }),
  postAndVerify);

router.get('/confirmation/:token', (req, res) => {
  const id = jwt.verify(req.params.token, config.secret);
  confirmUser(connection, id)
    .then(() => {
      res.send('Thank you for confirming!');
    })
    .catch(() => {
      res.status(500).send('Internal server error');
    });
});

module.exports = router;
