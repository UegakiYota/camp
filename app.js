const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const settion = require('express-session');
const flash = require('connect-flash');
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
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'mesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7日間
    }
};

app.use(settion(sessionConfig));
app.use(flash());
// フラッシュのミドルウェアを作成
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

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