const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground){
        req.flash('error', 'キャンプ場は見つかりませんでした');
        return res.redirect('/campground');
    }
    res.render('campgrounds/show', { campground });
}));

router.post('/', catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'キャンプ場が作成されました！');
    res.redirect(`/campground/${campground._id}`);
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground){
        req.flash('error', 'キャンプ場は見つかりませんでした');
        return res.redirect('/campground');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', "キャンプ場の更新完了");
    res.redirect(`/campground/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "キャンプ場の削除完了");
    res.redirect('/campground');
}));

module.exports = router;