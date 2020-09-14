const express = require('express');
const { connection } = require('../database/dbConnect.js');
const getProductsDb = require('../database/getProductsDb.js');

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

module.exports = router;
