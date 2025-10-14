// src/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./recipe/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  const value = { user, initializing };

  return (
    <AuthContext.Provider value={value}>
      {initializing ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}
