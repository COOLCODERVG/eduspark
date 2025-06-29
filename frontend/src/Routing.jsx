import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./Login"
import Organization from "./Organization";
import Mentor from "./Mentor"
import MentorDashboard from "./mentorDashboard";
import Call from "./call.tsx";
import Event from "./events";
import Hours from "./dashboard";
import Opportunities from "./Opportunities";
import Assignments from "./Assignment.jsx";




const Routing = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<App />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/call" element={<Call />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/assignment/:event_id" element={<Assignments />} />


        
        <Route path="/Org" element={<Organization />} />
        <Route path="/hours" element={<Hours />} />
        <Route path="/orgevent" element={<Event />} />
        <Route path="/dashboard" element={<Hours />} />
        <Route path="/opportunities" element={<Opportunities />} />


      </Routes>
    </Router>
  );
};

export default Routing;