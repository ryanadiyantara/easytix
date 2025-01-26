import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import ForgotPassword from "./pages/forgotpassword";
import AdminDashboard from "./pages/admin.dashboard";
import AdminChangePassword from "./pages/admin.changepassword";
import UserDashboard from "./pages/user.dashboard";
import UserChangePassword from "./pages/user.changepassword";
import EventList from "./pages/user.eventlist";
import EventDetail from "./pages/user.eventdetail";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/changepassword" element={<AdminChangePassword />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/changepassword" element={<UserChangePassword />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/detail" element={<EventDetail />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
