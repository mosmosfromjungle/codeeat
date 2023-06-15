import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // jwt: {
  //   accessSecretKey: process.env.ACCESS_TOKEN_SECRET,
  //   refreshSecretKey: process.env.REFRESH_TOKEN_SECRET,
  //   accessExpiresIn: process.env.ACCESS_EXPIRES_IN,
  //   refreshExpiresIn: process.env.REFRESH_EXPIRES_IN,
  // },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
  },
  db: {
    host: process.env.DB_HOST,
  },
  // aws: {
  //   bucketName: process.env.AWS_BUCKET_NAME,
  //   bucketRegion: process.env.AWS_BUCKET_REGION,
  //   identityPoolId: process.env.AWS_IDENTITY_POOL_ID,
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // },
};
