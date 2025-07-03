const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');

const campgroundRoutes = require('./rootes/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("mongo接続成功！")
    })
    .catch(err => { 
        console.log("mongoエラー！");
        console.log(err);
    });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateReview = (res, req, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


app.get('/', (req, res) => {
    res.render('home');
});

app.use('/campground', campgroundRoutes);

app.post('/campground/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
}));

app.delete('/campground/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`)
}));

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('ページが見つかりません！', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if (!err.message) {
        err.message = '何か問題が発生しました！';
    }
    res.status(statusCode).render('error' , { err });
});

app.listen(3000, () => {
  console.log('今やってる!!');
});