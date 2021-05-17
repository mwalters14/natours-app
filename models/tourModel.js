import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';
/*
    Schema - Describing our data
  */
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less or equal 40 characters',
      ],
      minlength: [
        10,
        'A tour must have 10 or more characters',
      ],
      validate: [
        validator.isAlpha,
        'Tour name must only contain characters',
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [
        true,
        'A tour must have a duration',
      ],
    },
    maxGroupSize: {
      type: Number,
      required: [
        true,
        'A tour must have a group size',
      ],
    },
    difficulty: {
      type: String,
      required: [
        true,
        'A tour must have a difficulty',
      ],
      trim: true,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message:
          'Difficulty can be: [easy, medium, hard]',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be 5.0 or less'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [
        true,
        'A tour must have a price',
      ],
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        return val < this.price;
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [
        true,
        'A tour must have a summary',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [
        true,
        'A tour must have a cover image',
      ],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// We use a regular function here instead of an arrow function because
// We want access to the "this" keyword inside the scope of this function
// A virtual property can not be used in a query because our database does not know about a virtual property
tourSchema
  .virtual('durationWeeks')
  .get(function () {
    return this.duration / 7;
  });

/* 
    MONGOOSE DOCUMENT MIDDLEWARE: MIDDLEWARE always needs next to move on to the next process
        runs before .save() and .create()
    Pre hook - We can act on a document prior to database process (save or create)
        - [this] - gives us access to the document being processed
        - 'save' - pre save hook - happens prior to a save command to the DB
    Post hook - We can act on a document after (post) DB processing
  */
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

/*
    QUERY MIDDLEWARE - Mongoose
    This function will run prior to a find query command
    We can manipulate how data is returned to the user when a certain query is passed

    /^find/ - Regular expression that means all query strings that start with find
*/
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(
    `Query took ${
      Date.now() - this.start
    } milliseconds`
  );
  //   console.log(docs);
  next();
});

/*
    AGGREGATION MIDDLEWARE
    Add hooks before or after an aggregation happens
*/
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  //   console.log(this);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export { Tour as default };
