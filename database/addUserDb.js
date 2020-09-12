/* eslint-disable dot-notation */
function addUser(connection, id, data) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users SET ?';

    const user = data;
    user.id = id;

    connection.query(query, user, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(user.id);
      }
    });
  });
}

module.exports = {
  addUser,
};
