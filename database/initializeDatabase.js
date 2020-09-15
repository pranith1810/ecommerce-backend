const { connection } = require('./dbConnect.js');

function createUserTable() {
  const query = `create table if not exists users(
                  id varchar(36) not null primary key,
                  name text,
                  email varchar(255) unique,
                  password text,
                  is_admin boolean default false,
                  active boolean default false
                  )`;

  connection.query(query, (err) => {
    if (err) {
      throw err;
    }
  });
}

function createProductsTable() {
  const query = `create table if not exists products(
    id varchar(36) not null primary key,
      name text,
      top_product bool,
      price_rupees int,
      type text,
      imgPath text
  );`;

  connection.query(query, (err) => {
    if (err) {
      throw err;
    }
  });
}

function createUserCartTable() {
  const query = `create table if not exists user_cart(
    user_id varchar(36) references users(id),
      product_id varchar(36) ,
      quantity int,
      primary key(user_id, product_id),
      foreign key(product_id) references products(id) on delete cascade on update cascade)`;

  connection.query(query, (err) => {
    if (err) {
      throw err;
    }
  });
}

createUserTable();

module.exports = {
  createUserTable,
  createProductsTable,
  createUserCartTable,
};
