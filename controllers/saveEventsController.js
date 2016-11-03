const saveEvent = require("../models/saveEvent");

const saveEventsIndex = (req, res) => {
  saveEvent.find((err, saveEvents) => {
    if(err) return res.status(500).json({ error: "500: Server Error" });
    res.json(saveEvents);
  });
};

const saveEventsCreate = (req, res) =>{
  saveEvent.create(req.body, (err, saveEvent) => {
    if(err) return res.status(400).json({ error: "400: Invalid Data" });
    res.status(201).json(saveEvent);
  });
};

const savesEventShow = (req, res) =>{
  saveEvent.findById(req.params.id, (err, saveEvent) => {
    if(err) return res.status(500).json({ error: "500: Server Error" });
    res.json(saveEvent);
  });
};

const savesEventUpdate = (req, res) =>{
  saveEvent.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, saveEvent) => {
    if(err) return res.status(400).json({ error: "400: Invalid data" });
    res.json(saveEvent);
  });
};

const savesEventDelete = (req, res) =>{
  saveEvent.findByIdAndRemove(req.params.id, (err) => {
    if(err) return res.status(500).json({ error: "500: Server error" });
    res.status(204).send();
  });
};


module.exports = {
  index: saveEventsIndex,
  create: saveEventsCreate,
  show: savesEventShow,
  update: savesEventUpdate,
  delete: savesEventDelete
};
