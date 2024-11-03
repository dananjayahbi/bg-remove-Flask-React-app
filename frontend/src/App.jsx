import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";
import "./App.css";

const App = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");

  return (
    <>
      <Routes>
        {isLogged ? (
          <Route path="*" element={<Home />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App