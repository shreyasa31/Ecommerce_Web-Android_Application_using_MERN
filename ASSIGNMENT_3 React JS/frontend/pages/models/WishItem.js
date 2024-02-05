// models/WishItem.js

const mongoose = require('mongoose');

const wishItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  title: String,
  image: String,
  price:String,
  shipping:String,


  // ... (add any other product attributes you wish to store)
});

module.exports = mongoose.models.WishItem || mongoose.model('WishItem', wishItemSchema);
