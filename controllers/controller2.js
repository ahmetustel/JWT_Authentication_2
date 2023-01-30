const Post = require("../models/posts");
const User = require("../models/model");
const brcpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().lean();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addPost = async (req, res) => {
  try {
    const newPost = await new Post({ username: req.body.username, title: req.body.title }); // post object oluşturulur
    const createdPost = await newPost.save(); // oluşturulan post object veritabanına kaydedilir.
    res.status(201).json({ status: true, message: createdPost });
  } catch (error) {
    res.status(500).json(error);
  }
};

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
    const searhedUser = await User.findOne({ username: req.params.name });
    console.log(searhedUser);
    res.status(200).json(searhedUser);
  } catch (error) {
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

  const users = await User.find();
  const loginingUser = users.find(user => user.username === req.body.username);

  if (loginingUser == null) {
    console.log('cannot find user');
    return res.status(400).send('cannot find user');
  }
  try {
    if (await brcpt.compare(req.body.password, loginingUser.hashedpassword)) {

      //Eğer password doğruysa token oluşturulur
      const secretKey = process.env.api_secret_key // Kullanılacak secret key environment değişkeninden alınır
      const { name, password } = req.body; // login esnasında kullanılan username ve şifre değişkene atanır
      const payLoad = { name, password }; // bu username ve şifre payload olarak ayarlanır

      /*1.parametre: payload, 2.parametre: secretKey, 3.parametre: expire time*/
      const accessToken = jwt.sign(payLoad, secretKey, { expiresIn: 120 /*dk*/ }); // TOKEN'IN OLUŞTUĞU KOD
      console.log('Success');
      // const token = req.headers.authorization.split(" ")[1];
      // console.log(token);
      // console.log(req.headers.authorization.split(' ')[1]);

    //   function authToken(req, res, next) {
    //     const authHeader = req.headers['authorization'];
    //     const token = authHeader && authHeader.split(' ')[1];
    //     if (token == null) return res.sendStatus(401);
    
    //     jwt.verify(token, process.env.api_secret_key, (err,loginingUser)=>{
    //         if(err) return res.sendStatus(403) // token var ama artık geçerli değil ise 403
    //         req.body.username = loginingUser.username;
    //         next();
    //     });
    // }

      res.status(201).json({
        status: true,
        name,
        password,
        accessToken: accessToken
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
  getPosts,
  addPost,
  createUser,
  getUsers,
  login,
  deleteUser,
  getUser
};