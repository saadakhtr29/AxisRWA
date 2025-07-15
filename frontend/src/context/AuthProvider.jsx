import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { signup as registerUser } from "../services/api";

// Define context once
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

// Custom hook
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Signup with Firebase + backend registration
  const signup = async (email, password, role = "investor", wallet) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;
    const idToken = await firebaseUser.getIdToken();

    const data = await registerUser(email, password, role, wallet, idToken);

    if (!data.token || !data.user?.role) {
      throw new Error("Invalid backend response");
    }

    localStorage.setItem("token", data.token);
    setUserRole(data.user.role);
    setIsAuthenticated(true);
    return data.user;
  };

  // Login with Firebase + backend verification
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;
    const idToken = await firebaseUser.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();

    if (!data.token || !data.user?.role) {
      throw new Error("Invalid token or user role");
    }

    localStorage.setItem("token", data.token);
    setUserRole(data.user.role);
    setIsAuthenticated(true);
    return data.user;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    setCurrentUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  // Fetch current user from backend
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.user || !data.user.role) throw new Error("Invalid user");

      setUserRole(data.user.role);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Session expired:", err.message);
      await logout();
    }
  };

  // Sync Firebase and backend session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        await fetchUserDetails();
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const contextValue = {
    currentUser,
    isAuthenticated,
    userRole,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
