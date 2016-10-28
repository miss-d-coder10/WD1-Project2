const saveEvent = require("../models/event");

function eventsIndex(req, res) {
  saveEvent.find((err, saveEvents) => {
    if(err) return res.status(500).json({ error: "500: Server Error" });
    res.json(saveEvents);
  });
}

function eventsCreate(req, res){
  saveEvent.create(req.body, (err, saveEvent) => {
    if(err) return res.status(400).json({ error: "400: Invalid Data" });
    res.status(201).json(saveEvent);
  });
}

function eventsShow(req, res){
  saveEvent.findById(req.params.id, (err, saveEvent) => {
    if(err) return res.status(500).json({ error: "500: Server Error" });
    res.json(saveEvent);
  });
}

function eventsUpdate(req, res){
  saveEvent.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, saveEvent) => {
    if(err) return res.status(400).json({ error: "400: Invalid data" });
    res.json(saveEvent);
  });
}

function eventsDelete(req, res){
  saveEvent.findByIdAndRemove(req.params.id, (err) => {
    if(err) return res.status(500).json({ error: "500: Server error" });
    res.status(204).send();
  });
}


module.exports = {
  index: saveEventIndex,
  create: saveEventCreate,
  show: saveEventShow,
  update: saveEventUpdate,
  delete: saveEventDelete
};
