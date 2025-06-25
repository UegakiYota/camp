const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

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

app.get('/campground', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

app.get('/campground/new', (req, res) => {
    res.render('campgrounds/new');
});


app.get('/campground/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
}));

app.post('/campground', catchAsync(async (req, res) => {
    if (!req.body.campground) 
        throw new ExpressError('キャンプ場のデータがありません！', 400);
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campground/${campground._id}`);
}));

app.get('/campground/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

app.put('/campground/:id', catchAsync(async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campground/${campground._id}`);
}));

app.delete('/campground/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
}));

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('ページが見つかりません！', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'エラー！' } = err;
    res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log('今やってる!!');
});