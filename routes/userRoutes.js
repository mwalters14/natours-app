import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

/*
    Routes
    Responsible for handling routing within the application

    Request sent to /api/v1/users will be handled in this sub-application (router)
*/
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export { router as default };
