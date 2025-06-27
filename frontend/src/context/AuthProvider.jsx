// AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../services/firebase";

// 1. Create AuthContext and expose a consistent hook
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

// 2. Top-level hook (must be outside component for Fast Refresh compatibility)
export const useAuth = () => useContext(AuthContext);

// 3. Main provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up: Firebase -> backend registration
  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;
    const idToken = await firebaseUser.getIdToken();

    const res = await fetch(`${process.env.VITE_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, role: "user" }),
    });

    if (!res.ok) throw new Error("Backend registration failed");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    return data;
  };

  // Login: Firebase -> backend validation
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;
    const idToken = await firebaseUser.getIdToken();

    const res = await fetch(`${process.env.BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) throw new Error("Backend login failed");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    return signOut(auth);
  };

  // Keep track of auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener
  }, []);

  // Provide context when not loading
  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
