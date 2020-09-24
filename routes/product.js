const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { connection } = require('../database/dbConnect.js');
const config = require('../config/config.js');
const getProductsDb = require('../database/getProductsDb.js');
const addProductDb = require('../database/addProductDb.js');
const logger = require('../logger.js');

const router = express.Router();

router.get('/home', (req, res, next) => {
  getProductsDb.getTopProducts(connection)
    .then((data) => {
      res.json(data).end();
    })
    .catch((err) => {
      logger.error(`Home tab products request failed: ${JSON.stringify(err)}`);
      next(err);
    });
});

router.get('/clothing', (req, res, next) => {
  getProductsDb.getClothing(connection)
    .then((data) => {
      res.json(data).end();
    })
    .catch((err) => {
      logger.error(`Clothing products request failed: ${JSON.stringify(err)}`);
      next(err);
    });
});

router.get('/accessories', (req, res, next) => {
  getProductsDb.getAccessories(connection)
    .then((data) => {
      res.json(data).end();
    })
    .catch((err) => {
      logger.error(`Accessory products request failed: ${JSON.stringify(err)}`);
      next(err);
    });
});

router.get('/all', (req, res, next) => {
  getProductsDb.getAllProducts(connection)
    .then((data) => {
      res.json(data).end();
    })
    .catch((err) => {
      logger.error(`All products request failed: ${JSON.stringify(err)}`);
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  getProductsDb.getProduct(connection, req.params.id)
    .then((data) => {
      res.json(data).end();
    })
    .catch((err) => {
      logger.error(`Product with id ${req.params.id} request failed: ${JSON.stringify(err)}`);
      next(err);
    });
});

function addProduct(req, res, next) {
  jwt.verify(req.body.token, config.secret, (err) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).json({ msg: 'Verification failed!!' }).end();
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() }).end();
      } else {
        addProductDb.addProduct(connection, uuidv4(), req.body)
          .then(() => {
            res.json({ msg: 'Product added successfully!' }).end();
          })
          .catch((error) => {
            logger.error(`Add product request failed: ${JSON.stringify(error)}`);
            next(error);
          });
      }
    }
  });
}

router.post('/add',
  body('name').isAlpha(),
  body('isTopProduct').custom((isTopProduct) => {
    if (isTopProduct === 'Yes' || isTopProduct === 'No') {
      return true;
    }
    logger.info('Product details entered are not valid');
    throw new Error('Invalid top product value!');
  }),
  body('price').custom((price) => {
    if (parseInt(price, 10) > 0) {
      return true;
    }
    logger.info('Product details entered are not valid');
    throw new Error('Invalid price!');
  }),
  body('productType').custom((productType) => {
    if (productType === 'Clothing' || productType === 'Accessories') {
      return true;
    }
    logger.info('Product details entered are not valid');
    throw new Error('Invalid product type!');
  }),
  addProduct);

router.delete('/delete', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).json({ msg: 'Verification failed!!' }).end();
    } else {
      addProductDb.deleteProduct(connection, req.body.productId)
        .then(() => {
          res.json({ msg: 'Product deleted successfully!' }).end();
        })
        .catch((error) => {
          logger.error(`Delete product request failed: ${JSON.stringify(err)}`);
          next(error);
        });
    }
  });
});

router.put('/update', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err) => {
    if (err) {
      logger.info('User verification failed');
      res.status(403).json({ msg: 'Verification failed!!' });
    } else {
      addProductDb.deleteProduct(connection, req.body.productId)
        .then(() => {
          addProductDb.addProduct(connection, req.body.productId, req.body)
            .then(() => {
              res.json({ msg: 'Product added successfully!' });
            })
            .catch((error) => {
              next(error);
            });
        })
        .catch((error) => {
          logger.error(`Update product request failed: ${JSON.stringify(error)}`);
          next(error);
        });
    }
  });
});

module.exports = router;
