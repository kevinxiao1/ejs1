const express = require('express');
const router = express.Router();

router.route('/admin/dashboard')
.get((req, res) => {
    res.render('admin/dashboard.ejs')
})
.post((req, res) => {
    
})


router.route('/admin/tables')
.get((req, res) => {
    res.render('admin/tables.ejs', {
        db : req.body.user
    })
})
.post((req, res) => {
    
})

module.exports = router;