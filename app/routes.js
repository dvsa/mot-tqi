var express = require('express')
var router = express.Router()

var fs = require('fs')

/*module.exports = function (app) {
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file == 'index.js') return
        var name = file.substr(0, file.indexOf('.'))
        require('./routes' + name)(app)
    })
}*/

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// add your routes here

router.get('/testing', function (req, res) {
  res.render('test/test')
})


router.get('/project', function (req, res) {
  res.render('test/project-home')
})

module.exports = router
