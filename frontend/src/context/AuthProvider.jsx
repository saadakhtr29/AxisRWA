import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../services/firebase";

// Create a secure context to avoid leaking auth state
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

// Custom hook for easy access to auth
export const useAuth = () => useContext(AuthContext);

// Provider component wrapping entire app
export const AuthProvider = ({ children }) => {
  // Firebase user object (email, uid, etc.)
  const [currentUser, setCurrentUser] = useState(null);
  // Backend-defined role ("investor", "admin", etc.)
  const [userRole, setUserRole] = useState(null);
  // Prevents rendering app until auth is verified
  const [loading, setLoading] = useState(true);
  // Indicates session is valid and secure
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Signup with Firebase & then register on backend with selected role
  const signup = async (email, password, role = "investor") => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // Get Firebase ID token for backend verification
    const idToken = await firebaseUser.getIdToken();

    // POST to backend /auth/register with token + role
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, role }),
    });

    if (!res.ok) {
      throw new Error("Backend registration failed");
    }

    const data = await res.json();

    // Sanitize and validate token/role
    if (!data.token || !data.user?.role) {
      throw new Error("Invalid backend response structure");
    }

    localStorage.setItem("token", data.token);
    setUserRole(data.user.role);
    setIsAuthenticated(true);
    return data.user;
  };

  // Login with Firebase, validate against backend, receive secure token
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

    if (!res.ok) {
      throw new Error("Backend login failed");
    }

    const data = await res.json();

    if (!data.token || !data.user?.role) {
      throw new Error("Invalid token or user role returned from backend");
    }

    localStorage.setItem("token", data.token);
    setUserRole(data.user.role);
    setIsAuthenticated(true);
    return data.user;
  };

  // Logout securely (clears frontend + backend session)
  const logout = async () => {
    await signOut(auth); // Firebase session
    localStorage.removeItem("token"); // JWT
    setCurrentUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  // 🔎 Get current user role from backend using stored JWT
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");

    // No token = no backend fetch
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized or session expired");

      const data = await res.json();

      // Defensive checks
      if (!data.user || !data.user.role) {
        throw new Error("Invalid user structure from backend");
      }

      setUserRole(data.user.role);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error validating backend session:", error.message);
      await logout(); // Force logout on any backend error
    }
  };

  // Monitor Firebase auth state & sync with backend token
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        setCurrentUser(user);
        await fetchUserDetails(); // Sync role
      } else {
        // Clear state on logout or token expiry
        setCurrentUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // Context value for all child components
  const contextValue = {
    currentUser,
    isAuthenticated,
    userRole,
    signup,
    login,
    logout,
  };

  // Don't render anything until auth check completes
  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
