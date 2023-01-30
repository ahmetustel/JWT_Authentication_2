const User = require("../models/model");
const brcpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    const searhedUser = await User.findOne({ name: req.params.name });
    res.status(200).json(searhedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addUser = async (req,res) => {
  try {
    const newUser = await new User({ username: req.body.username, title: req.body.title }); // user object oluşturulur
    const createdUser = await newUser.save(); // oluşturulan object veritabanına kaydedilir.
    res.status(201).json({ status: true, message: createdUser });
  } catch (error) {
    res.status(500).json(error);
  }
};

const createUser = async (req, res) => {
  try {
    const salt = await brcpt.genSalt();
    const hashedPassword = await brcpt.hash(req.body.password, salt);

    console.log(req.body.name);
    console.log(req.body.password);
    console.log(hashedPassword);

    /*shemadan "user" objesi oluşturup, oluşturulan objeye post edilen body değişkenlerine atmak hata almamızı
      engeller. Bunun için; */
    const newUser = await new User({ name: req.body.name, password: hashedPassword }); // user object oluşturulur
    const createdUser = await newUser.save(); // oluşturulan object veritabanına kaydedilir.
    res.status(201).json({ status: true, message: createdUser });

  } catch (error) {
    res.status(500).json(error);
  }
};

const login = async (req, res) => {
  const users = await User.find();
  const loginingUser = users.find(user => user.name === req.body.name);

  if (loginingUser == null) {
    console.log('cannot find user');
    return res.status(400).send('cannot find user');
  }
  try {
    if (await brcpt.compare(req.body.password, loginingUser.password)) {

      //Eğer password doğruysa token oluşturulur
      const secretKey = process.env.api_secret_key // Kullanılacak secret key environment değişkeninden alınır
      const { name, password } = req.body; // login esnasında kullanılan username ve şifre değişkene atanır
      const payLoad = { name, password }; // bu username ve şifre payload olarak ayarlanır
      const token = jwt.sign(payLoad, secretKey, { expiresIn: 120 /*dk*/ }); // TOKEN'IN OLUŞTUĞU KOD
      console.log('Success');
      res.status(201).json({
        status: true,
        name,
        password,
        token
      });
    } else {
      console.log('Not Allowed');
      res.send('Not Allowed');
    }
  } catch (error) {
    res.status(500).send();
  }
};

const deleteUser = async (req, res) => {
  try {
    const searhedUser = await User.findOne({ name: req.params.name });
    console.log(searhedUser.name, ' is deleted');
    const deletedUser = await User.deleteOne(searhedUser);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  createUser,
  login,
  deleteUser,
};