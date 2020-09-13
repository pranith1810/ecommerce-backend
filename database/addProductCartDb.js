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

module.exports = {
  addProductCart,
};
