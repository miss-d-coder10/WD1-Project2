const mongoose = require('mongoose');

const pizzaSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  toppings: [{ type: String }],
  img: { type: String },
  isVegetarian: Boolean
});

module.exports = mongoose.model('Pizza', pizzaSchema);
