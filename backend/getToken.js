const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const dotenv = require("dotenv");
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "admin@gmail.com";
const password = "adminpass123";

signInWithEmailAndPassword(auth, email, password)
  .then(async (userCred) => {
    const idToken = await userCred.user.getIdToken();
    console.log("✅ idToken:", idToken);
  })
  .catch((err) => {
    console.error("❌ Login Failed:", err.message);
  });
