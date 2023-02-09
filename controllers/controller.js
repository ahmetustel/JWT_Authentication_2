const User = require("../models/model");
const Token = require("../models/token");
const brcpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('./generateToken');

const getUser = async (req, res) => {
  try {
    const searhedUser = await User.findOne({ username: req.params.name });
    console.log(searhedUser);
    res.status(200).json(searhedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const createUser = async (req, res) => {
  try {
    const salt = await brcpt.genSalt();
    const hashedPassword = await brcpt.hash(req.body.password, salt);

    console.log(req.body.username);
    console.log(req.body.password);
    console.log(hashedPassword);

    /*shemadan "user" objesi oluşturup, oluşturulan objeye post edilen body değişkenlerine atmak hata almamızı
      engeller. Bunun için; */
    const newUser = await new User({ username: req.body.username, password: req.body.password, hashedpassword: hashedPassword }); // user object oluşturulur
    const createdUser = await newUser.save(); // oluşturulan object, veritabanına kaydedilir.
    res.status(201).json({ status: true, message: createdUser });

  } catch (error) {
    res.status(500).json(error);
  }
};

const login = async (req, res) => {

  const users = await User.find(); // tüm userlar "users" değişkenine atanır.
  const loginingUser = users.find(user => user.username === req.body.username);

  if (loginingUser == null) {

    return res.status(400).send('cannot find user');
  }
  try {
    if (await brcpt.compare(req.body.password, loginingUser.hashedpassword)) {

      const { username, password } = req.body; // login esnasında kullanılan username ve şifre değişkene atanır
      const payLoad = { username, password }; // bu username ve şifre payload olarak ayarlanır

      const accessToken = generateToken.generateAccessToken(payLoad);
      const refreshToken = generateToken.generateRefreshToken(payLoad);

      const newToken = await new Token({ accessToken: accessToken, refreshToken: refreshToken }).save();

      console.log('accessToken: ', newToken.accessToken, ' is Successfully created');
      console.log('refreshToken: ', newToken.refreshToken, ' is Successfully created.');

      res.status(201).json({
        status: true,
        username,
        password,
        accessToken: newToken.accessToken,
        refreshToken: newToken.refreshToken
      });

    } else {
      console.log('Not Allowed');
      res.send('Not Allowed');
    }
  } catch (error) {
    res.status(500).send();
  }
};

const refreshToken = async (req, res) => {
  console.log(req.body.token);
  const tokens = await Token.find().lean(); // Tüm token kayırları veritabanından çekilir.
  const searchedToken = tokens.find(token => token.refreshToken === req.body.refreshToken); // Çekilen kayıtlar arasında bizim tokenimiz var ise DOCUMENT OLARAK alınır.
  console.log(searchedToken);

  // console.log(refreshToken); // DOKUMENT olarak alınan token ın Ekran Çıktısı. Document olduğu için token'a token.token ile ulaşılır.
  if (searchedToken == null) return res.sendStatus(401);
  if (!searchedToken) return res.sendStatus(403);
  jwt.verify(searchedToken.refreshToken, process.env.refresh_key, (err, payLoad) => {
    if (err) return res.sendStatus(403);
    //const accessToken = generateToken.generateAccessToken(payLoad);
    //res.json({accessToken: accessToken});
    console.log(payLoad);
    res.status(201).json(payLoad);
  }
  );
}

const logout = async (req, res) => {
  const tokens = await Token.find().lean(); // Tüm token kayırları veritabanından çekilir.
  const searchedToken = tokens.find(token => token.refreshToken === req.body.token);

  if (searchedToken == null) return res.sendStatus(403);
  if (searchedToken.refreshToken == req.body.token) {
    const deletedToken = await Token.deleteOne(searchedToken);
    console.log(deletedToken, ' is deleted');
    } return res.send('Logged out - Çıkış yapıldı');

}

const deleteUser = async (req, res) => {
  try {
    console.log(req.body.token);
    const searhedUser = await User.findOne({ name: req.params.token });
    console.log(searhedUser.name, ' is deleted');
    const deletedUser = await User.deleteOne(searhedUser);
    res.status(201).json(deletedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createUser,
  login,
  deleteUser,
  getUser,
  refreshToken,
  logout
};