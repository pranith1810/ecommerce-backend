/* eslint-disable dot-notation */
function getAllProductCart(connection, userId) {
  return new Promise((resolve, reject) => {
    const query = `select product_id, quantity,price_rupees from user_cart
    inner join products 
    on user_cart.product_id = products.id
    where user_id =? `;

    connection.query(query, [userId], (err, data) => {
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
