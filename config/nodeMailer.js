const senderGridTransport = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');
const config = require('./config.js');

const transporter = nodemailer.createTransport(senderGridTransport({
  auth: {
    api_key: config.sendgridApiKey,
  },
}));

module.exports = transporter;
