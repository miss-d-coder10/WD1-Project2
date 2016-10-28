const User = require("../models/user");
const jwt = require("jsonwebtoken");
const secret = require("../config/tokens").secret;

function register(req, res){
  console.log(req.body.user);
  User.create(req.body.user, (err, user) => {
    if(err) return res.status(500).json({ message: "Something went wrong" + err });

    let payload = { _id: user._id, username: user.username};
    let token = jwt.sign(payload, secret, {expiresIn: 60*60*24}); //make a a code and encode it with payload and secret.

    return res.status(201).json({
      message: `welcome ${user.username}`,
      user,
      token
    });
  });
}

function login(req, res){
  User.findOne({email: req.body.email}, (err, user) => {
    if(err) return res.status(500).json({ message: "Something went wrong" + err });
    if (!user || !user.validatePassword(req.body.password)) {
      return res.status(401).json({message: "unauthorised"});
    }

    let payload = { _id: user._id, username: user.username};
    let token = jwt.sign(payload, secret, {expiresIn: 60*60*24}); //make a a code and encode it with payload and secret.

    return res.status(200).json({
      message: `welcome ${user.username}`,
      user,
      token
    });
  });
}




module.exports ={
  register: register,
  login: login
};
