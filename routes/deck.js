const express = require('express');
const router = express.Router();
const userRouter = require('./login')
const User = require('./../model/user');

router.route('/deck')
.get((req, res) => {
    res.render('landing/deck.ejs')
})
.post((req, res) => {
    
})

module.exports = router;
