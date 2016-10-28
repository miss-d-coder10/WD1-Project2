const Pizza = require("../models/pizza");

const pizzasIndex = (req, res) => {
  Pizza.find((err, pizzas) => {
    if(err) return res.status(500).json({ error: "500: Server Error" });
    res.json(pizzas);
  });
};

const pizzasCreate = (req, res) =>{
  Pizza.create(req.body, (err, pizza) => {
    if(err) return res.status(400).json({ error: "400: Invalid Data" });
    res.status(201).json(pizza);
  });
};

const pizzasShow = (req, res) =>{
  Pizza.findById(req.params.id, (err, pizza) => {
    if(err) return res.status(500).json({ error: "500: Server Error" });
    res.json(pizza);
  });
};

const pizzasUpdate = (req, res) =>{
  Pizza.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, pizza) => {
    if(err) return res.status(400).json({ error: "400: Invalid data" });
    res.json(pizza);
  });
};

const pizzasDelete = (req, res) =>{
  Pizza.findByIdAndRemove(req.params.id, (err) => {
    if(err) return res.status(500).json({ error: "500: Server error" });
    res.status(204).send();
  });
};


module.exports = {
  index: pizzasIndex,
  create: pizzasCreate,
  show: pizzasShow,
  update: pizzasUpdate,
  delete: pizzasDelete
};
