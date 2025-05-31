const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.testFunction = functions.https.onRequest((req, res) => {
  res.send("Functions working!");
});
