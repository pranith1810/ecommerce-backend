/* eslint-disable dot-notation */
function getAllProductCart(connection, userId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT product_id, quantity 
                  FROM user_cart
                  WHERE user_id='${userId}'`;

    connection.query(query, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  getAllProductCart,
};
