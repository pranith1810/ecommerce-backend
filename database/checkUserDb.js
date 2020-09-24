/* eslint-disable dot-notation */
function checkUser(connection, data) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id,name,active,is_admin,password from users 
                  where email=?`;

    const valuesArray = [data.email];

    connection.query(query, valuesArray, (err, dbResponse) => {
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
