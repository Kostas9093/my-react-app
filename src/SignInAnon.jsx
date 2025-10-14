//src/Login.jsx
import React, { useState } from "react";
import { signInWithEmail, signUpWithEmail, signOutUser } from "./recipe/firebase";
import { useAuth } from "./AuthProvider";

export default function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [alias, setAlias] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState(""); // ✅ message state

  const handleSignUp = async () => {
    setMessage(""); // clear previous message
    try {
      await signUpWithEmail(email, pw, alias);
      setMessage("Account created successfully! You can now sign in.");
    } catch (err) {
      console.error("Sign up error", err);
      if (err.code === "auth/email-already-in-use") {
        setMessage("This email is already registered. Try signing in.");
      } else if (err.code === "auth/invalid-email") {
        setMessage("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setMessage("Password should be at least 6 characters.");
      } else {
        setMessage("Sign up failed. Please try again.");
      }
    }
  };

   const handleSignIn = async () => {
    setMessage(""); // clear previous message
    try {
      await signInWithEmail(email, pw);
      setMessage("Signed in successfully!");
    } catch (err) {
      console.error("Sign in error", err);
      if (err.code === "auth/user-not-found") {
        setMessage("You have not signed up yet. Please create an account.");
      } else if (err.code === "auth/wrong-password") {
        setMessage("Incorrect password. Try again.");
      } else if (err.code === "auth/invalid-email") {
        setMessage("Please enter a valid email address.");
      } else {
        setMessage("Sign in failed. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    setMessage("");
    try {
      await signOutUser();
      setMessage("Signed out successfully.");
    } catch (err) {
      console.error("Sign out error", err);
      setMessage("Sign out failed. Please try again.");
    }
  };

  if (user) {
    return (
      <div>
        <p>Signed in as: {user.displayName || user.email || user.uid}</p>
        <button onClick={handleSignOut}>Sign out</button>
        {message && <p className="message">{message}</p>}
      </div>
    );
  }

  return (
    <div>
        <h2>Please Log in</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
      <input placeholder="username" value={alias} onChange={(e) => setAlias(e.target.value)} />
      <br/>
      <button onClick={handleSignIn}>Sign in</button>
      <br/>
      <button onClick={handleSignUp}>Sign up</button>
       {message && <p className="message">{message}</p>} {/* ✅ display messages */}
    </div>
  );
}
