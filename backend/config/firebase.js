const admin = require("firebase-admin");
const serviceAccount = require("../config/axisrwa-firebase-adminsdk-fbsvc-bf0b858f31.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase Admin initialized using JSON file");

module.exports = admin;