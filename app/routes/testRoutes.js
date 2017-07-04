/* eslint-disable indent */
// module.exports = {
//   bind: function (app) {
//     app.get('/project', function (req, res) {
//         res.render('./test/project-home')
//     })
//
//     app.get('/project/test', function (req, res) {
//         res.render('./test/project-1')
//     })
//   }
//
// }

router.get('/project', function (req, res) {
  res.render('test/project-home')
})
