import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/user/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/user/Register";
import Dashboard from "./components/event/Dashboard";
import CreateEvent from "./components/event/CreateEvent";
import Registrations from "./components/registrations/Registrations";
import io from "socket.io-client";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard  />} />
          <Route path="/event/create" element={<CreateEvent />} />
          <Route path="/registrations" element={<Registrations />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
