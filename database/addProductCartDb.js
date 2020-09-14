/* eslint-disable dot-notation */
function addProductCart(connection, userId, productId) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO user_cart
                  VALUES('${userId}','${productId}', 1)`;

    connection.query(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function updateProductCartAdd(connection, userId, productId) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE user_cart
                  set quantity = quantity+1
                  where user_id = '${userId}' and product_id = '${productId}'`;

    connection.query(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function updateProductCartMinus(connection, userId, productId) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE user_cart
                  set quantity = quantity-1
                  where user_id = '${userId}' and product_id = '${productId}'`;

    connection.query(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function deleteProductCart(connection, userId, productId) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM user_cart
                  where user_id = '${userId}' and product_id = '${productId}'`;

    connection.query(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  addProductCart,
  updateProductCartAdd,
  updateProductCartMinus,
  deleteProductCart,
};
