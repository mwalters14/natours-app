import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
/*
    ROUTE HANDLERS (Controllers)
    Handles request to the (tour) endpoint and returns a response to the client

    MIDDLEWARE Method example below
    We can create our own middleware to manipulate and validate request
*/
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name,price,ratingsAverage,summary,difficulty';
  next();
};

/*
    Build query
    ROUTE HANDLERS (Controllers)
*/
const getAllTours = catchAsync(
  async (req, res, next) => {
    const features = new APIFeatures(
      Tour.find(),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: req.requestTime,
      tours,
    });
  }
);

const getTour = catchAsync(
  async (req, res, next) => {
    // const tour = Tour.findOne({_id: req.params.id});

    const tour = await Tour.findById(
      req.params.id
    );

    res.status(200).json({
      status: 'success',
      tour,
    });
  }
);

const createTour = catchAsync(
  async (req, res, next) => {
    //   const newTour = new Tour({})
    //   newTour.save()

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      tour: newTour,
    });
  }
);

const updateTour = catchAsync(
  async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id.toString(),
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      tour,
    });
  }
);

const deleteTour = catchAsync(
  async (req, res, next) => {
    await Tour.findOneAndDelete({
      _id: req.params.id.toString(),
    }).then((doc) => {
      console.log(`Deleted ${doc._id}`);
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

const getTourStats = catchAsync(
  async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: {
            $sum: '$ratingsQuantity',
          },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
      //   {
      //     $match: {
      //       _id: { $ne: 'easy' },
      //     },
      //   },
    ]);

    res.status(200).json({
      status: 'success',
      stats,
    });
  }
);

const getMonthlyPlan = catchAsync(
  async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            $month: '$startDates',
          },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: 'success',
      plan,
    });
  }
);

export {
  getAllTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
  getTourStats,
  aliasTopTours,
  getMonthlyPlan,
};

/* 
    MIDDLEWARE METHOD EXAMPLE
 const checkBody = (req, res, next) => {
   if (!req.body.name || !req.body.price) {
     return res.status(400).json({
       status: 'failed',
       message: 'Bad request',
     });
   }
   next();
 };
*/
