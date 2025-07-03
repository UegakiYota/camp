const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


const campgroundRoutes = require('./rootes/campgrounds');
const reviewRoutes = require('./rootes/reviews');

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

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/campground', campgroundRoutes);
app.use('/campground/:id/reviews', reviewRoutes);

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