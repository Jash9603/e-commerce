const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number, required: true
  },
  quantity: {
     type: Number, required: true
  },
  description : {
    type: String, required: true
  },
  image: {
    type: String
  },
  
});



//create model
const item = mongoose.model('item', itemSchema);
module.exports = item;

