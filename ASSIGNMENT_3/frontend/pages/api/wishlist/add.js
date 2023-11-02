// pages/api/wishlist/add.js

import dbConnect from '../../utils/dbConnect';
import WishItem from '../../models/WishItem';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const { productId, title, image,price,shipping} = req.body;

    const item = await WishItem.create({
      productId,
      title,
      image,
      price,
      shipping
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message:error });

  }
}
