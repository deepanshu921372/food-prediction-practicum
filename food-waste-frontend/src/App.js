import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddData from "./pages/AddData";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<SplashScreen />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/add-data" 
            element={
              <ProtectedRoute>
                <AddData />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
