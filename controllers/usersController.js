const User = require("../models/user");

const usersIndex = (req, res) => {
  User.find((err, users) => {
    if (err) return res.status(500).json({ message: "Something went SERIOUSLY wrong" });
    return res.status(200).json(users);
  });
};

const usersShow = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).json({ message: "Something went SERIOUSLY wrong" });
    return res.status(200).json(user);
  });
};

const usersUpdate = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
    if (err) return res.status(500).json({ message: "Something went SERIOUSLY wrong" });
    if(!user) return res.staus(404).json({ message: "User not found!"});
    return res.status(200).json(user);
  });
};

const usersDelete = (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) return res.status(500).json({ message: "Something went SERIOUSLY wrong" });
    if(!user) return res.staus(404).json({ message: "User not found!"});
    return res.status(204).send();
  });
};

module.exports ={
  index: usersIndex,
  show: usersShow,
  update: usersUpdate,
  delete: usersDelete
};
