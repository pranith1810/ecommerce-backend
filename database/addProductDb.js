/* eslint-disable dot-notation */
function addProduct(connection, productId, data) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO products SET ?';

    const user = {
      name: data.name,
      top_product: data.isTopProduct === 'Yes',
      price_rupees: data.price,
      type: data.productType.toLowerCase(),
      imgPath: data.imgPath,
    };
    user.id = productId;

    connection.query(query, user, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function deleteProduct(connection, productId) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM products
                  where id = '${productId}'`;

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
  addProduct,
  deleteProduct,
};
