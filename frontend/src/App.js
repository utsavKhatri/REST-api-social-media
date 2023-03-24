import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import PrivateRoutes from "./utils/PrivateRoutes";
import UserProfile from "./components/UserProfile";
import Home from "./components/Home";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import FollowCard from "./components/FollowCard";
import ReceivePost from "./components/ReceivePost";
import ForgotPassword from "./components/Auth/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Home />} path="/" exact/>
          <Route element={<UserProfile />} path="/profile" exact/>
          <Route element={<ReceivePost />} path="/receive-post" exact/>
          <Route element={<FollowCard/>} path="/follow/:id" exact/>
        </Route>
        <Route path="/login" element={<Login />} exact/>
        <Route path="/signup" element={<Signup />} exact/>
        <Route path="/forgot-password" element={<ForgotPassword />} exact/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
