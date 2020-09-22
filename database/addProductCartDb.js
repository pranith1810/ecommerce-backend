/* eslint-disable dot-notation */
function addProductCart(connection, userId, productId) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO user_cart
                  SET ?`;

    const userProduct = {
      user_id: userId,
      product_id: productId,
      quantity: 1,
    };

    connection.query(query, userProduct, (err) => {
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
                  where user_id = ? and product_id = ?`;

    connection.query(query, [userId, productId], (err) => {
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
                  where user_id = ? and product_id = ?`;

    connection.query(query, [userId, productId], (err) => {
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
                  where user_id = ? and product_id = ?`;

    connection.query(query, [userId, productId], (err) => {
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
