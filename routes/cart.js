const express = require('express');
const jwt = require('jsonwebtoken');
const { connection } = require('../database/dbConnect.js');
const addProductCartDb = require('../database/addProductCartDb.js');
const config = require('../config/config.js');

const router = express.Router();

router.post('/add', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err, id) => {
    if (err) {
      res.status(403).send('Verification failed!!');
    } else {
      addProductCartDb.addProductCart(connection, id, req.body.productId)
        .then(() => {
          res.send('Product added to cart successfully!');
        })
        .catch((error) => {
          if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ msg: 'Product already in cart!' });
          } else {
            next(error);
          }
        });
    }
  });
});

module.exports = router;
