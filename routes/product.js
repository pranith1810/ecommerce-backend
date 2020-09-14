const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { connection } = require('../database/dbConnect.js');
const config = require('../config/config.js');
const getProductsDb = require('../database/getProductsDb.js');
const addProductDb = require('../database/addProductDb.js');

const router = express.Router();

router.get('/home', (req, res, next) => {
  getProductsDb.getTopProducts(connection)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/clothing', (req, res, next) => {
  getProductsDb.getClothing(connection)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/accessories', (req, res, next) => {
  getProductsDb.getAccessories(connection)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/all', (req, res, next) => {
  getProductsDb.getAllProducts(connection)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  getProductsDb.getProduct(connection, req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

function addProduct(req, res, next) {
  jwt.verify(req.body.token, config.secret, (err) => {
    if (err) {
      res.status(403).send('Verification failed!!');
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        addProductDb.addProduct(connection, uuidv4(), req.body)
          .then(() => {
            res.send('Product added successfully!');
          })
          .catch((error) => {
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
    throw new Error('Invalid top product value!');
  }),
  body('price').custom((price) => {
    if (parseInt(price, 10) > 0) {
      return true;
    }
    throw new Error('Invalid price!');
  }),
  body('productType').custom((productType) => {
    if (productType === 'Clothing' || productType === 'Accessories') {
      return true;
    }
    throw new Error('Invalid type!');
  }),
  addProduct);

router.post('/delete', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err) => {
    if (err) {
      res.status(403).send('Verification failed!!');
    } else {
      addProductDb.deleteProduct(connection, req.body.productId)
        .then(() => {
          res.send('Product deleted successfully!');
        })
        .catch((error) => {
          next(error);
        });
    }
  });
});

router.post('/update', (req, res, next) => {
  jwt.verify(req.body.token, config.secret, (err) => {
    if (err) {
      res.status(403).send('Verification failed!!');
    } else {
      addProductDb.deleteProduct(connection, req.body.productId)
        .then(() => {
          addProductDb.addProduct(connection, req.body.productId, req.body)
            .then(() => {
              res.send('Product added successfully!');
            })
            .catch((error) => {
              next(error);
            });
        })
        .catch((error) => {
          next(error);
        });
    }
  });
});

module.exports = router;
