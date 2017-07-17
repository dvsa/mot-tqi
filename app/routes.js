var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// add your routes here

router.get('/testing', function (req, res) {
  res.render('test/test')
})

router.get('/reminders/v2c/channel', function (req, res) {
  // get the answer from the query string (eg. ?your-email=false)
  var selectChannel = req.query.selectChannel

  if (selectChannel == 'email') {
    // redirect to the relevant page
    res.redirect('/reminders/v2c/your-email')
  } else if (selectChannel == 'text') {
    // redirect to the relevant page
    res.redirect('/reminders/v2c/your-phone')
  } else if (selectChannel == 'both') {
    // redirect to the relevant page
    res.redirect('/reminders/v2c/your-phone-email')
  }

})

module.exports = router
