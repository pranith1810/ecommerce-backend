const { connection } = require('./dbConnect.js');
const initialProductsData = require('../seedData/initialProductsData.json');

function createUserTable() {
  return new Promise((resolve, reject) => {
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
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function createProductsTable() {
  return new Promise((resolve, reject) => {
    const query = `create table if not exists products(
      id varchar(36) not null primary key,
        name text,
        top_product int,
        price_rupees int,
        type text,
        imgPath text
    );`;

    connection.query(query, (err) => {
      if (err) {
        reject(err);
      } else {
        initialProductsData.forEach((object) => {
          connection.query(
            'insert ignore into products set ?', object, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            },
          );
        });
      }
    });
  });
}

function createUserCartTable() {
  return new Promise((resolve, reject) => {
    const query = `create table if not exists user_cart(
      user_id varchar(36) references users(id),
        product_id varchar(36) ,
        quantity int,
        primary key(user_id, product_id),
        foreign key(product_id) references products(id) on delete cascade on update cascade)`;

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
  createUserTable,
  createProductsTable,
  createUserCartTable,
};
