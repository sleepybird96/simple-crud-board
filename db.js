require('dotenv').config();
const mysql = require('mysql');

const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USERNAME;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DATABASE;