const express = require('express');
const router = express.Router();

const usersArr = require('../database/usersArr.js');

router.get('/users', (request, response, next) => {
  var optionsObj = {
    pageTitle: 'Users',
    path: '/users',
    users: usersArr
  };

  response.render('users.ejs', optionsObj);
});

module.exports = router;