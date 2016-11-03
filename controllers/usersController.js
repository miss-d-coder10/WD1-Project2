const User = require("../models/user");
const saveEvent = require("../models/saveEvent");

const usersIndex = (req, res) => {
 User.find((err, users) => {
   if (err) return res.status(500).json({ message: "Something went wrong." });
   return res.status(200).json({ users });
 });
};

const usersShow = (req, res) => {
 User.findById(req.params.id, (err, user) => {
   if (err) return res.status(500).json({ message: "Something went wrong." });
   if (!user) return res.status(404).json({ message: "User not found." });
   return res.status(200).json({ user });
 });
};

const usersUpdate = (req, res) => {
 User.findByIdAndUpdate(req.params.id, req.body.user, { new: true },  (err, user) => {
   if (err) return res.status(500).json({ message: "Something went wrong." });
   if (!user) return res.status(404).json({ message: "User not found." });
   return res.status(200).json({ user });
 });
};

const usersDelete = (req, res) => {
 User.findByIdAndRemove(req.params.id, (err, user) => {
   if (err) return res.status(500).json({ message: "Something went wrong." });
   if (!user) return res.status(404).json({ message: "User not found." });
   return res.status(204).send();
 });
};

const userEventSearch = (req, res) =>{
  saveEvent.find({ userId: req.params.id}, (err, saveEvent) => {
    if(err) return res.status(500).json({ error: "500: Server Error" });
    res.json(saveEvent);
  });
};

const eventSearch = (req, res) =>{
  saveEvent.find({ userId: req.params.id, skiddleId:req.params.eventId}, (err, saveEvent) => {
    if(err) return res.status(500).json({ error: "500: Server Error" });
    res.json(saveEvent);
  });
};

module.exports ={
  index: usersIndex,
  show: usersShow,
  eventIndex: userEventSearch,
  eventSearch:eventSearch,
  update: usersUpdate,
  delete: usersDelete
};
