import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./Home";              // Welcome page
import RecipeApp from "./recipe/RApp";   // Your recipe app
import TrackerApp from "./Tracker/TApp"; // Your tracker app
import DayDetailWrapper from "./Tracker/DayDetail"; // wrapper for /tracker/day/:date
import MonthlyProgress from "./Tracker/MonthlyProgress";
import './index.css'
import AdminPage from "./AdminPage";

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
    </nav>
  );
}

function App() {
  return (
    <Router>
          {/* ✅ Show links only when at home */}
      <ConditionalNav />
      
      {/* ✅ Navigation is outside of Routes */}
     {/* <nav className=" nav-column"> */}
        {/* <Link to="/">Home</Link> */}
        {/* <Link className="Applink" to="/recipe">Create Recipes</Link>
        <Link className="Applink" to="/tracker">Calorie Tracker</Link>
      </nav> */}

      {/* ✅ All routes in one place */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe" element={<RecipeApp />} />
        <Route path="/tracker" element={<TrackerApp />} />
        <Route path="/tracker/day/:dayName" element={<DayDetailWrapper />} />
        <Route path="/tracker/monthly" element={<MonthlyProgress />} />
        {/* <Route path="AdminPage" element={<AdminPage />} /> */}
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
export default App;