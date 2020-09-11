/* eslint-disable dot-notation */
function addUser(connection, id, data) {
  const query = 'INSERT INTO users SET ?';

  const user = data;
  user.id = id;

  connection.query(query, user, (err) => {
    if (err) {
      throw err;
    }
  });
}

module.exports = {
  addUser,
};
