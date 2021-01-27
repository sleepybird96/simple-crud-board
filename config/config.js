require("dotenv").config();

module.exports ={
  "development": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "gsang2board",
    "host": process.env.MYSQL_HOST,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "gsang2board",
    "host": process.env.MYSQL_HOST,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "gsang2board",
    "host": process.env.MYSQL_HOST,
    "dialect": "mysql"
  }
}
