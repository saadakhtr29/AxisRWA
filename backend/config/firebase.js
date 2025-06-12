const admin = require('firebase-admin');
const serviceAccount = require(''); // Add your Firebase Admin SDK file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;