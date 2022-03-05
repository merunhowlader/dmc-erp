import dotenv from 'dotenv';

dotenv.config();

export const  {
     APP_PORT,
     DEBUG_MODE,
     DB_NAME,
     DB_USER,
     DB_PASSWORD,
     JWT_SECRET,
     REFRESH_SECRET
    }=process.env;