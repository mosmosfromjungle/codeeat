import dotenv from 'dotenv';
dotenv.config();

export const config = {
  jwt: {
    accessSecretKey: process.env.ACCESS_TOKEN_SECRET,
    refreshSecretKey: process.env.REFRESH_TOKEN_SECRET,
    accessExpiresIn: process.env.ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
  },
  db: {
    host: process.env.DB_HOST,
  },
};
