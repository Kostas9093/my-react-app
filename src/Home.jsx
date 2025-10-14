// home.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
// import Login from "./SignInAnon";

export default function Home() {

  const location = useLocation();
  const { user } = useAuth();

  // ✅ Render message only when we are exactly on "/"
  // if (location.pathname !== "/") return null;

  return (
    <div className="homediv">
      {/* <h1 className="text-2xl font-bold">Welcome!</h1> */}
      <h2 id="sum" >Welcome {user.displayName || user.uid}!<br/> <br/>Choose an app to create recipes & add them on your daily calories calendar</h2>
    </div>
  );
}
