import dotenv from 'dotenv';

dotenv.config();
// "username": "root",
// "password": null,
// "database": "dmc_erp",
// "host": "127.0.0.1",
// "dialect": "mysql"

export const  {
     APP_PORT,
     DEBUG_MODE,
     DB_NAME,
     DB_USER,
     DB_PASSWORD,
     JWT_SECRET,
     REFRESH_SECRET
    }=process.env;