/* eslint-disable dot-notation */
function checkUser(connection, data) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id,name,active from users 
                  where email='${data.email}' and password='${data.password}'`;

    connection.query(query, (err, dbResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(dbResponse);
      }
    });
  });
}

module.exports = {
  checkUser,
};
