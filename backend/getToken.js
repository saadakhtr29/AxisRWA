const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "test@example.com";
const password = "password123";

signInWithEmailAndPassword(auth, email, password)
  .then(async (userCred) => {
    const idToken = await userCred.user.getIdToken();
    console.log("✅ idToken:", idToken);
  })
  .catch((err) => {
    console.error("❌ Login Failed:", err.message);
  });
