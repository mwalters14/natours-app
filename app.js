import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

/*
  APP.JS
  Director of the application
    - Handles middleware
    - Routes request to controller

      MIDDLEWARE
      Can modify the incoming request data
*/
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static('./public'));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/*
  ROUTES
  Always use versioning in an API to allow updates without breaking current implementations
*/
// Mounting Routers as middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export { app as default };
