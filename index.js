const express = require('express');
const cors = require('cors');
const config = require('./config/config.js');
const signup = require('./routes/signup.js');
const login = require('./routes/login.js');
const product = require('./routes/product.js');
const cart = require('./routes/cart.js');
const initializeDatabase = require('./database/initializeDatabase');
const logger = require('./logger.js');

Promise.all([
  initializeDatabase.createUserTable,
  initializeDatabase.createProductsTable,
  initializeDatabase.createUserCartTable,
])
  .then(() => {
    logger.info('Tables created successfully');
    const app = express();

    app.use(cors());

    app.use(express.json());
    app.use('/signup', signup);
    app.use('/login', login);
    app.use('/product', product);
    app.use('/cart', cart);

    app.use((req, res, next) => {
      const err = new Error('Not Found!');
      err.status = 404;
      next(err);
      logger.info('User request not able to proceed as route was not found!');
    });

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      logger.error('Internal server error!');
      res.status(err.status || 500);
      res.json({
        error: {
          message: err.message,
        },
      }).end();
    });

    app.listen(config.port, () => {
      logger.info(`Server started at port ${config.port}`);
    });
  })
  .catch((error) => {
    logger.error(JSON.stringify(error));
    throw JSON.stringify(error);
  });
