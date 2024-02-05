// Assuming you are using mongoose
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: String,
    image:String,
    title: String,
    price: String,
    shipping: String,
    shippingCost:String,
    shippingLocation:String,
    handlingTime:String,
    expeditedShipping:String,
    oneDayShipping:String,
    returnsAccepted:String,

    // Assuming you have an index or id to identify each product
   
  }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;


// const mongoose = require('mongoose');

// const wishItemSchema = new mongoose.Schema({
//   productId: {
//     type: String,
//     required: true,
//   },
//   title: String,
//   image: String,
//   price:String,
//   shipping:String,


//   // ... (add any other product attributes you wish to store)
// });

// module.exports = mongoose.models.WishItem || mongoose.model('WishItem', wishItemSchema);