const express = require('express');
const Wishlist = require('./models/wishlistModel'); // Import your wishlist model
const router = express.Router();

// Endpoint to add an item to the wishlist
router.post('/wishlist/add', async (req, res) => {
  const { productId,image,title,price, shipping } = req.body;
  
  try {
    let wishlist = await Wishlist.findOne({ productId});

    if (!wishlist) {
      // If the wishlist doesn't exist, create a new one
      wishlist = new Wishlist({ productId, items: [] });
    }

    // Add the new item to the wishlist
    wishlist.items.push({ productId, image,title, price, shipping });
    
    await wishlist.save();
    
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to wishlist', error });
  }
});

// Endpoint to get the user's wishlist items
router.get('/wishlist/:productID', async (req, res) => {
  const { productId } = req.params;
  
  try {
    const wishlist = await Wishlist.findOne({ productId }).populate('items.productId');
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.json(wishlist.items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving wishlist', error });
  }
});

module.exports = router;
