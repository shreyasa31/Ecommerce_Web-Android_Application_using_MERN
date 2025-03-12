// utils/dbConnect.js

const mongoose = require('mongoose');

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect("mongodb+srv://shreyakamath3105:bvthOY7mg2vK22sK@cluster0.zvkvjtu.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.isConnected = db.connections[0].readyState;
}

module.exports = dbConnect;
