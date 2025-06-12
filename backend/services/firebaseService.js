const admin = require("../config/firebase");

const verifyFirebaseToken = async (idToken) => {
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    throw new Error("Invalid Firebase token");
  }
};

module.exports = { verifyFirebaseToken };
