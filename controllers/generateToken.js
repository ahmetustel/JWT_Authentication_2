const jwt = require("jsonwebtoken");

module.exports.generateAccessToken = function (payLoad) {
    const secretKey1 = process.env.access_key // Kullanılacak access_key environment değişkeninden alınır
    return jwt.sign(payLoad, secretKey1, { expiresIn: '15m' /*dk*/ });
  }

module.exports.generateRefreshToken = function (payLoad) {
    const secretKey2 = process.env.refresh_key // Kullanılacak access_key environment değişkeninden alınır
    return jwt.sign(payLoad, secretKey2, { expiresIn: '15m' /*dk*/ });
  }