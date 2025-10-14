import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./Home";              // Welcome page
import RecipeApp from "./recipe/RApp";   // Your recipe app
import TrackerApp from "./Tracker/TApp"; // Your tracker app
import DayDetailWrapper from "./Tracker/DayDetail"; // wrapper for /tracker/day/:date
import MonthlyProgress from "./Tracker/MonthlyProgress";
import './index.css'
import AdminIngredients from "./AdminIngredients"; // ✅ Correct import
import AuthProvider, { useAuth }  from "./AuthProvider";
import Login from "./SignInAnon";
import { signOutUser } from "./recipe/firebase";

// ✅ Separate component for conditional nav
function ConditionalNav() {
  const location = useLocation();

  // Show nav only on home page "/"
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <nav className="nav-column">
      <Link className="Applink" to="/recipe">Create Recipes</Link>
      <Link className="Applink" to="/tracker">Calorie Tracker</Link>
      <Link className="Admin" to="/admin">Admin</Link> {/* 👈 add this */}
    </nav>
  );
}

function App() {
   const { user } = useAuth();

// If no user, show login/sign-in UI
   if (!user) return <Login />;

    // handle sign out
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };


  return (
    <Router>
       <button className="signout" onClick={handleSignOut}>Sign Out</button>
     
      <ConditionalNav />

      {/* ✅ All routes in one place */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe" element={<RecipeApp />} />
        <Route path="/tracker" element={<TrackerApp />} />
        <Route path="/tracker/day/:dayName" element={<DayDetailWrapper />} />
        <Route path="/tracker/monthly" element={<MonthlyProgress />} />
         <Route path="/admin" element={<AdminIngredients />} />
     
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
export default App;