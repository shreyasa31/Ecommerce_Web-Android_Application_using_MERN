// pages/api/wishlist/index.js

import dbConnect from '../../utils/dbConnect';
import WishItem from '../../models/WishItem';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const items = await WishItem.find({});
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
