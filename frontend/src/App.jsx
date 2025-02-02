import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";

import Signin from "./pages/signin";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgotpassword";
import AdminDashboard from "./pages/admin.dashboard";
import AdminListUser from "./pages/admin.listuser";
import AdminListReservation from "./pages/admin.listreservation";
import AdminChangePassword from "./pages/admin.changepassword";
import UserDashboard from "./pages/user.dashboard";
import UserProfile from "./pages/user.profile";
import EventDetail from "./pages/user.eventdetail";
import MyReservation from "./pages/user.reservation";

function App() {
  return (
    <>
      <Box minH={"100vh"}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin/forgotpassword" element={<ForgotPassword />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/listuser" element={<AdminListUser />} />
          <Route path="/admin/listreservation" element={<AdminListReservation />} />
          <Route path="/admin/changepassword" element={<AdminChangePassword />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/events/detail" element={<EventDetail />} />
          <Route path="/reservation" element={<MyReservation />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
