import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Account from "./pages/Account";
import Calendar from "./pages/Calendar";
import Consult from "./components/Consult";
import Navbar from "./components/Navbar";
import LinkGenerator from "./pages/LinkGenerator"; // Import LinkGenerator page
import VideoCall from "./pages/VideoCall"; // Import VideoCall page

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consult"
          element={
            <ProtectedRoute>
              <Consult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/link-generator"
          element={
            <ProtectedRoute>
              <LinkGenerator />
            </ProtectedRoute>
          }
        />
        <Route path="/call/:roomId" element={<VideoCall />} /> {/* This is the route for the Video Call */}
      </Routes>
    </Router>
  );
};

export default App;
