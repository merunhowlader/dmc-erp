
require('dotenv').config(); 


module.exports ={
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "port":process.env.DB_PORT,
    "sslmode" : "require",
    "dialectOptions": {
      "ssl": {
        "rejectUnauthorized": false
      }
    }
  },
  "test": {
    "username": "dmcinv",
    "password": "vbABcQoIWfVaOQSQ",
    "database": "dmcinventory",
    "host": "db-postgresql-sgp1-37192-do-user-1794786-0.b.db.ondigitalocean.com",
    "dialect": "postgres",
    "port":"25060",
    "sslmode" : "require",
    "dialectOptions": {
      "ssl": {
        "rejectUnauthorized": false
      }
    }
  },
  "production": {
    "username": "dmcinv",
    "password": "vbABcQoIWfVaOQSQ",
    "database": "dmcinventory",
    "host": "db-postgresql-sgp1-37192-do-user-1794786-0.b.db.ondigitalocean.com",
    "dialect": "postgres",
    "port":"25060",
    "sslmode" : "require",
    "dialectOptions": {
      "ssl": {
        "rejectUnauthorized": false
      }
    }
  }
}
