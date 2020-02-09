var express = require('express');
const axios = require('axios');
const xmlParser = require('xml2json');
require('dotenv').config();

var router = express.Router();

var mysql = require('mysql');
var connection;

if(process.env.JAWSDB_URL){
  connection=mysql.createConnection(process.env.JAWSDB_URL);

}
else{

var mysql_con = mysql.createConnection({
  host: process.env.mysql_host,
  user: process.env.mysql_user,
  password: process.env.mysql_password,
  database: process.env.mysql_db
})
}
mysql_con.connect(function(err) {
  if (err) throw err;

  console.log("Mysql Connected!");
});

var ZWSID = process.env.ZWSID;
var EppraisalID = process.env.EppraisalID;
var appName = process.env.appName;
var default_address = 'New York Avenue';
var default_citystate = 'New Brunswick, New Jersey';

/* GET home page. */
router.post('/get_zillow_deep_search', function(req, res, next) {
  console.log('req address', req.body.address);
  var address = req.body.address;
  var citystate = req.body.citystate;
  console.log(ZWSID);
  axios.get('http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=' + ZWSID + '&address=' + address + '&citystatezip=' + citystate)
  .then(response => {
    // console.log(xmlParser.toJson(response.data));
    res.send(xmlParser.toJson(response.data));
  })
  .catch(error => {
    console.log(error);
  });
});


router.post('/get_Eppraisal_deep_search', function(req, res, next) {
  console.log('req address aaa', req.body.address);
  console.log('citystate',req.body.citystate);
  console.log("aaaaaaaaaaa");
  console.log(EppraisalID);
  console.log(appName);
  console.log(address);
  console.log(citystate);
  var address = req.body.address;
  var citystate = req.body.citystate;
  console.log("bbb");
  console.log("apikey="+EppraisalID+"&appname="+appName+"&addr="+address+"&citystatezip="+citystate);
  axios.get('https://api.eppraisal.com/avm.json?apikey='+EppraisalID+'&appname='+appName+'&addr='+address+'&citystatezip='+citystate)
  .then(response => {
    // console.log(xmlParser.toJson(response.data));
    // res.send(xmlParser.toJson(response.data));
    console.log("Eppraisal data");
    // console.log(response.data);
    res.send(response.data);
    // console.log(xmlParser.toJson(response.data));
  })
  .catch(error => {
    console.log(error);
  });
});


router.get('/get_zillow_deep_search', function(req, res, next) {
  // res.json({'success': 'ok'});
  axios.get('http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id='+ ZWSID +'&address=New York Avenue&citystatezip=New Brunswick, New Jersey')
  .then(response => {
    console.log(xmlParser.toJson(response.data));
    res.json(xmlParser.toJson(response.data));
  })
  .catch(error => {
    console.log(error);
  });
});


router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;

  var sql = "INSERT INTO user(`name`, `email`, `phone`, `password`) VALUES('" + name + "', '" + email + "', '" + phone + "', '" + password + "')";
  console.log(sql);
  mysql_con.query(sql, function (err, result) {
    if (err) {
      res.json({
        success: false,
        error: result
      })
    }
    else{
      res.json({
        success: true
      })
    }
  });

  
});

router.get('/check', function(req, res, next) {
  var email = req.query.email;

  var sql = "SELECT * FROM user WHERE `email` = '" + email + "'";
  console.log('sql:', sql);
  mysql_con.query(sql, function (err, result) {
    console.log('result:', result);
    if (err) {
      res.json({
        success: false,
        error: result
      })
    }
    else if(result.length > 0){
      res.json({
        success: false
      })
    }
    else {
      res.json({
        success: true
      })
    }
  });
});

router.get('/login', function(req, res, next) {
  var email = req.query.email;
  var password = req.query.password;

  var sql = "SELECT * FROM user WHERE `email` = '" + email + "' AND `password` = '" + password + "'";
  console.log('sql:', sql);
  mysql_con.query(sql, function (err, result) {
    console.log('result:', result);
    if (err) {
      res.json({
        success: false,
        error: result
      })
    }
    else if(result.length > 0){
      
      var session = req.session;
      session.name = result[0].name;
      session.email = result[0].email;
      session.phone = result[0].phone;

      res.json({
        success: true
      })
    }
    else {
      
      var session = req.session;
      session.name = '';
      session.email = '';
      session.phone = '';

      res.json({
        success: false
      })
    }
  });
});

module.exports = router;
