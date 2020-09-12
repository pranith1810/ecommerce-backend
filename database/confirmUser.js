/* eslint-disable dot-notation */
function confirmUser(connection, id) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users
                    SET active = true
                    where id='${id}'`;

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
  confirmUser,
};
