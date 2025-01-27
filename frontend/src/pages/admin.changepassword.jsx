import React from "react";
import { Box } from "@chakra-ui/react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
// import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

const AdminChangePassword = () => {
  return (
    <>
      <Sidebar />
      <Box
        w={{
          base: "100%",
          xl: "calc(100% - 275px)",
        }}
        float="right"
        maxWidth="100%"
        overflow="auto"
        position="relative"
        maxHeight="100%"
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
      >
        <Navbar />

        <Footer />
      </Box>
    </>
  );
};

export default AdminChangePassword;
