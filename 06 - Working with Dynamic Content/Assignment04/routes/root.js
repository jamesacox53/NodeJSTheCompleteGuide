const express = require('express');
const router = express.Router();

const usersArr = require('../database/usersArr.js');

router.get('/', (request, response, next) => {
  var optionsObj = {
    pageTitle: 'Root',
    path: '/'
  };

  response.render('root.ejs', optionsObj);
});

router.post('/', (request, response, next) => {
  var userDetailsObj = {
    name: request.body.name
  };

  console.log(userDetailsObj.name);

  usersArr.push(userDetailsObj);
  response.redirect('/users');
});

module.exports = router;