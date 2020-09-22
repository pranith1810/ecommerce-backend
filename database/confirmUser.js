/* eslint-disable dot-notation */
function confirmUser(connection, id) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users
                    SET active = true
                    where id=?`;

    connection.query(query, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  confirmUser,
};
