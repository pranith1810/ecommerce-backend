const express = require('express');
const jwt = require('jsonwebtoken');
const { connection } = require('../database/dbConnect.js');
const addProductCartDb = require('../database/addProductCartDb.js');
const getAllProductCartDb = require('../database/getAllProductCartDb.js');
const config = require('../config/config.js');
const logger = require('../logger.js');

const router = express.Router();

router.post('/add', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err, claims) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).json({ msg: 'Verification failed!!' }).end();
    } else {
      logger.info('User verification successful');
      addProductCartDb.addProductCart(connection, claims.id, req.body.productId)
        .then(() => {
          logger.info(`User with ${claims.id} added product to cart with id ${req.body.productId} successfully`);
          res.json({ msg: 'Product added to cart successfully!' }).end();
        })
        .catch((error) => {
          if (error.code === 'ER_DUP_ENTRY') {
            logger.info(`User with ${claims.id} added product to cart with id ${req.body.productId} failed as the product exists!`);
            res.status(409).json({ msg: 'Product already in cart!' }).end();
          } else {
            logger.error(`User with ${claims.id} was not able to add product to cart!: ${JSON.stringify(error)}`);
            next(error);
          }
        });
    }
  });
});

router.get('/all/:token', (req, res, next) => {
  jwt.verify(req.params.token, config.secret, (err, claims) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).json({ msg: 'Verification failed!!' }).end();
    } else {
      logger.info('User verification successful');
      getAllProductCartDb.getAllProductCart(connection, claims.id)
        .then((dbResponse) => {
          logger.info(`User with ${claims.id} gets all cart products successfully!`);
          res.json(dbResponse).end();
        })
        .catch((error) => {
          logger.error(`User with ${claims.id} was not able to get all products from cart!: ${JSON.stringify(error)}`);
          next(error);
        });
    }
  });
});

router.put('/update/add', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err, claims) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).json({ msg: 'Verification failed!!' }).end();
    } else {
      logger.info('User verification successful');
      addProductCartDb.updateProductCartAdd(connection, claims.id, req.body.productId)
        .then(() => {
          logger.info(`User with ${claims.id} updated product quantity with id ${req.body.productId} successfully`);
          res.json({ msg: 'Product quantity increased successfully!' }).end();
        })
        .catch((error) => {
          logger.error(`User with ${claims.id} was not able to update product quantity in cart!: ${JSON.stringify(error)}`);
          next(error);
        });
    }
  });
});

router.put('/update/minus', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err, claims) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).json({ msg: 'Verification failed!!' }).end();
    } else {
      logger.info('User verification successful');
      addProductCartDb.updateProductCartMinus(connection, claims.id, req.body.productId)
        .then(() => {
          logger.info(`User with ${claims.id} updated product quantity with id ${req.body.productId} successfully`);
          res.json({ msg: 'Product quantity increased successfully!' }).end();
        })
        .catch((error) => {
          logger.error(`User with ${claims.id} was not able to update product quantity in cart!: ${JSON.stringify(error)}`);
          next(error);
        });
    }
  });
});

router.delete('/delete/:token/:productId', (req, res, next) => {
  jwt.verify(req.params.token, config.secret, (err, claims) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).json({ msg: 'Verification failed!!' }).end();
    } else {
      logger.info('User verification successful');
      addProductCartDb.deleteProductCart(connection, claims.id, req.params.productId)
        .then(() => {
          logger.info(`User with ${claims.id} deleted product in cart with id ${req.body.productId} successfully`);
          res.json({ msg: 'Product deleted from cart successfully!' }).end();
        })
        .catch((error) => {
          logger.error(`User with ${claims} was not able to delete product in cart!: ${JSON.stringify(error)}`);
          next(error);
        });
    }
  });
});

module.exports = router;
