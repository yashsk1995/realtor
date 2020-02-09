var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var session = req.session;
  session.name = '';
  session.email = '';
  session.phone = '';
  
  res.render('index', { title: 'SigmaApp' });

});
router.get('/calculator', function(req, res, next) {
  
  var session = req.session;
  
  if(session.name && session.name != ''){
    res.render('calculator', { title: 'SigmaApp', email: session.email, name: session.name, phone: session.phone });
    return;
  }

  res.redirect('/login');
});


router.get('/avg', function(req, res, next) {
  
  var session = req.session;
  
  if(session.name && session.name != ''){
    res.render('Avg', { title: 'SigmaApp', email: session.email, name: session.name, phone: session.phone });
    return;
  }

  res.redirect('/login');
});

router.get('/login', function(req, res, next) {
  var session = req.session;
  session.name = '';
  session.email = '';
  session.phone = '';
  
  res.render('login', { title: 'SigmaApp' });
});

router.get('/register', function(req, res, next) {
  var session = req.session;
  session.name = '';
  session.email = '';
  session.phone = '';
  
  res.render('register', { title: 'SigmaApp' });
});

module.exports = router;
