import './config.js';
import mongoose from 'mongoose';
import app from './app.js';

/*
    SERVER.JS - entry point
    Where we setup the application
    Set environment variables
    Start the server
*/

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection successful');
  });

const port = !process.env.PORT
  ? 3000
  : process.env.PORT;

app.listen(port, () => {
  console.log(`Running on port ${port}....`);
});
