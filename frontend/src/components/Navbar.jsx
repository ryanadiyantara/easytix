import React, { useEffect, useState } from "react";
import {
  Box,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Link,
  Flex,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Button,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { matchPath, NavLink, useLocation, useNavigate } from "react-router-dom";

import { ProfileIcon, SettingsIcon } from "./Icons/Icons";
import { HSeparator } from "./Separator";
import { SidebarResponsive } from "./Sidebar";

import { useUserStore } from "../store/user";

function Navbar() {
  // Utils
  const { currentUsers, fetchCurrentUser, logout } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { path: "/admin/dashboard", name: "Dashboard", category: "" },
    { path: "/admin/listuser", name: "List of Users", category: "" },
    { path: "/admin/listreservation", name: "List of Reservations", category: "" },
    { path: "/admin/changepassword", name: "Change Password", category: "" },
    { path: "/dashboard", name: "Dashboard", category: "" },
    { path: "/profile", name: "Profile", category: "" },
    { path: "/events/detail/:id", name: "Event Detail", category: "" },
    { path: "/reservation", name: "Reservation", category: "" },
  ];

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isUserSession, setIsUserSession] = useState(false);
  const activeRoute = routes.find((route) => matchPath(route.path, location.pathname)) || {};

  const { colorMode, toggleColorMode } = useColorMode();
  const handleOpenDrawer = () => setIsOpen(true);
  const handleCloseDrawer = () => setIsOpen(false);

  // Services
  useEffect(() => {
    const checkAccess = async () => {
      await fetchCurrentUser();
      setIsUserLoaded(true);
    };

    checkAccess();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (isUserLoaded && currentUsers) {
      if (currentUsers?.role === "User") {
        setIsUserSession(true);
      } else {
        setIsUserSession(false);
      }
    }
  }, [isUserLoaded, currentUsers]);

  const handleLogout = async () => {
    const { success, message } = await logout();

    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
      navigate("/signin");
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      position="static"
      boxShadow="none"
      bg="none"
      borderColor="transparent"
      filter="none"
      backdropFilter="none"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      borderRadius="16px"
      display="flex"
      minH="75px"
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      mx="auto"
      mt="22px"
      pb="8px"
      px={{
        sm: "15px",
        md: "30px",
      }}
      ps={{
        xl: "12px",
      }}
      pt="8px"
      top="18px"
      w={{ sm: "calc(100vw - 30px)", xl: "calc(100vw - 75px - 275px)" }}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "column",
          md: "row",
        }}
        alignItems={{ xl: "center" }}
        justifyContent={{ md: "space-between" }}
      >
        <Box mb={{ sm: "8px", md: "0px" }}>
          <Breadcrumb>
            <BreadcrumbItem color={"gray.500"}>
              <BreadcrumbLink
                href={isUserSession ? "/dashboard" : "/admin/dashboard"}
                color={"gray.500"}
              >
                Pages
              </BreadcrumbLink>
            </BreadcrumbItem>
            {!isUserSession && (
              <BreadcrumbItem color={useColorModeValue("black", "white")}>
                <BreadcrumbLink href="/admin/dashboard" color={useColorModeValue("black", "white")}>
                  Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {activeRoute.category && (
              <BreadcrumbItem color={useColorModeValue("black", "white")}>
                <BreadcrumbLink href="#" color={useColorModeValue("black", "white")}>
                  {activeRoute.category}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            <BreadcrumbItem color={useColorModeValue("black", "white")}>
              <BreadcrumbLink href={activeRoute.path} color={useColorModeValue("black", "white")}>
                {activeRoute ? activeRoute.name : "Page Not Found"}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Link
            color={useColorModeValue("black", "white")}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            _hover={{ color: "black" }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            {activeRoute ? activeRoute.name : "Page Not Found"}
          </Link>
        </Box>
        <Flex
          w={{ sm: "100%", md: "auto" }}
          alignItems="center"
          flexDirection="row"
          justifyContent="flex-end"
        >
          {!isUserSession && <SidebarResponsive />}

          {isUserSession && (
            <NavLink to="/profile">
              <ProfileIcon
                cursor="pointer"
                color={useColorModeValue("black", "white")}
                w="18px"
                h="18px"
                mr="16px"
              />
            </NavLink>
          )}

          <SettingsIcon
            cursor="pointer"
            color={useColorModeValue("black", "white")}
            onClick={handleOpenDrawer}
            w="18px"
            h="18px"
          />
        </Flex>
        <Drawer isOpen={isOpen} onClose={handleCloseDrawer}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerCloseButton />
              <Text fontSize="xl" fontWeight="bold" mt="16px">
                Easy Tix Options
              </Text>
              <HSeparator />
            </DrawerHeader>
            <DrawerBody>
              <Flex flexDirection="column">
                <Flex justifyContent="space-between" alignItems="center" mb="24px">
                  <Text fontSize="md" fontWeight="600" mb="4px">
                    Dark/Light
                  </Text>
                  <Button
                    onClick={toggleColorMode}
                    color={colorMode === "light" ? "Dark" : "Light"}
                  >
                    Toggle {colorMode === "light" ? "Dark" : "Light"}
                  </Button>
                </Flex>
                <HSeparator />
                <Box mt="24px">
                  <Button
                    w="100%"
                    bg={useColorModeValue("white", "transparent")}
                    border="1px solid"
                    borderColor={useColorModeValue("gray.700", "white")}
                    color={useColorModeValue("gray.700", "white")}
                    fontSize="xs"
                    variant="no-effects"
                    px="20px"
                    mb="16px"
                    onClick={handleLogout}
                  >
                    <Text textDecoration="none">Log Out</Text>
                  </Button>
                </Box>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Flex>
  );
}

export default Navbar;
