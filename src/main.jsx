import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";              // Welcome page
import RecipeApp from "./recipe/RApp";   // Your recipe app
import TrackerApp from "./Tracker/TApp"; // Your tracker app
import DayDetailWrapper from "./Tracker/DayDetail"; // wrapper for /tracker/day/:date

  // import "./home.module.css";

function App() {
  return (
    <Router>
      {/* ✅ Navigation is outside of Routes */}
      <nav className="p-4 bg-gray-200 flex gap-4">
        {/* <Link to="/">Home</Link> */}
        <Link to="/recipe">Recipe App</Link>
        <Link to="/tracker">Tracker App</Link>
      </nav>

      {/* ✅ All routes in one place */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe" element={<RecipeApp />} />
        <Route path="/tracker" element={<TrackerApp />} />
        <Route path="/tracker/day/:date" element={<DayDetailWrapper />} />
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