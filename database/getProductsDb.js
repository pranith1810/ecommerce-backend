/* eslint-disable dot-notation */
function getTopProducts(connection) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * from products
                  where top_product=1`;

    connection.query(query, (err, dbResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(dbResponse);
      }
    });
  });
}

function getClothing(connection) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * from products
                  where type='clothing'`;

    connection.query(query, (err, dbResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(dbResponse);
      }
    });
  });
}

function getAccessories(connection) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * from products
                  where type='accessories'`;

    connection.query(query, (err, dbResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(dbResponse);
      }
    });
  });
}

function getAllProducts(connection) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * from products';

    connection.query(query, (err, dbResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(dbResponse);
      }
    });
  });
}

function getProduct(connection, id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * from products
                  where id='${id}'`;

    connection.query(query, (err, dbResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(dbResponse);
      }
    });
  });
}

module.exports = {
  getTopProducts,
  getClothing,
  getAccessories,
  getProduct,
  getAllProducts,
};
