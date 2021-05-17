import express from 'express';
import * as tourController from '../controllers/tourController.js';

const router = express.Router();
// We can define our own middleware to handle parameters
// router.param('id', tourController.checkId);
/*
    Routes
    Responsible for handling routing within the application

    Request sent to /api/v1/tours will be handled in this sub-application (router)
*/
router
  .route('/top-5-cheap')
  .get(
    tourController.aliasTopTours,
    tourController.getAllTours
  );

router
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan);

router
  .route('/tour-stats')
  .get(tourController.getTourStats);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export { router as default };
