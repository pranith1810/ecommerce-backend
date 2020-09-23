const express = require('express');
const jwt = require('jsonwebtoken');
const { connection } = require('../database/dbConnect.js');
const addProductCartDb = require('../database/addProductCartDb.js');
const getAllProductCartDb = require('../database/getAllProductCartDb.js');
const config = require('../config/config.js');
const logger = require('../logger.js');

const router = express.Router();

router.post('/add', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err, id) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).send('Verification failed!!');
    } else {
      logger.info('User verification successful');
      addProductCartDb.addProductCart(connection, id, req.body.productId)
        .then(() => {
          logger.info(`User with ${id} added product to cart with id ${req.body.productId} successfully`);
          res.send('Product added to cart successfully!');
        })
        .catch((error) => {
          if (error.code === 'ER_DUP_ENTRY') {
            logger.info(`User with ${id} added product to cart with id ${req.body.productId} failed as the product exists!`);
            res.status(409).json({ msg: 'Product already in cart!' });
          } else {
            logger.error(`User with ${id} was not able to add product to cart!`);
            next(error);
          }
        });
    }
  });
});

router.get('/all/:token', (req, res, next) => {
  jwt.verify(req.params.token, config.secret, (err, id) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).send('Verification failed!!');
    } else {
      logger.info('User verification successful');
      getAllProductCartDb.getAllProductCart(connection, id)
        .then((dbResponse) => {
          logger.info(`User with ${id} gets all cart products successfully!`);
          res.send(dbResponse);
        })
        .catch((error) => {
          logger.error(`User with ${id} was not able to get all products from cart!`);
          next(error);
        });
    }
  });
});

router.put('/update/add', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err, id) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).send('Verification failed!!');
    } else {
      logger.info('User verification successful');
      addProductCartDb.updateProductCartAdd(connection, id, req.body.productId)
        .then(() => {
          logger.info(`User with ${id} updated product quantity with id ${req.body.productId} successfully`);
          res.send('Product quantity increased successfully!');
        })
        .catch((error) => {
          logger.error(`User with ${id} was not able to update product quantity in cart!`);
          next(error);
        });
    }
  });
});

router.put('/update/minus', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err, id) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).send('Verification failed!!');
    } else {
      logger.info('User verification successful');
      addProductCartDb.updateProductCartMinus(connection, id, req.body.productId)
        .then(() => {
          logger.info(`User with ${id} updated product quantity with id ${req.body.productId} successfully`);
          res.send('Product quantity increased successfully!');
        })
        .catch((error) => {
          logger.error(`User with ${id} was not able to update product quantity in cart!`);
          next(error);
        });
    }
  });
});

router.delete('/delete', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err, id) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).send('Verification failed!!');
    } else {
      logger.info('User verification successful');
      addProductCartDb.deleteProductCart(connection, id, req.body.productId)
        .then(() => {
          logger.info(`User with ${id} deleted product in cart with id ${req.body.productId} successfully`);
          res.send('Product deleted from cart successfully!');
        })
        .catch((error) => {
          logger.error(`User with ${id} was not able to delete product in cart!`);
          next(error);
        });
    }
  });
});

module.exports = router;
