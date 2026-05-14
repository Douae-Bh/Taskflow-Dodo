const jwt = require('jsonwebtoken');

const generateToken = (userId) => {   //une fct resoit userid
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = generateToken;