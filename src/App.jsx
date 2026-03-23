import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";

function App() {
  return (
    <div>
      <nav style={{ padding: "10px", background: "#f7ebeb", textAlign: "center" }}>
        <Link to="/" style={{ color: "#c54c06", marginRight: "50px", textDecoration: "none" }}>Home</Link>
        <Link to="/history" style={{ color: "#c54c06", textDecoration: "none" }}>History</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  );
}

export default App;