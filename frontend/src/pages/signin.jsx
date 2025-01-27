import React, { useEffect, useState } from "react";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import BgSignUp from "../assets/img/BgSignUp.png";
import Footer from "../components/Footer";

import { useUserStore } from "../store/user";

const Signin = () => {
  // Utils
  const { signin } = useUserStore();

  const toast = useToast();
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newUser, setNewUser] = useState({
    email: "",
    user_password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Services
  useEffect(() => {
    const signinMessage = searchParams.get("message");
    if (signinMessage === "Session Expired") {
      toast({
        title: "Error",
        description: "Session expired, please log in again",
        status: "error",
        isClosable: true,
      });
    } else if (signinMessage === "Password reset successfully") {
      toast({
        title: "Success",
        description: "Password reset successfully, please log in again",
        status: "success",
        isClosable: true,
      });
    } else if (signinMessage === "Token is invalid") {
      toast({
        title: "Error",
        description: "Token is invalid or expired",
        status: "error",
        isClosable: true,
      });
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    const currentErrors = {
      email: !newUser.email,
      user_password: !newUser.user_password,
    };

    setErrors(currentErrors);

    const { success, message } = await signin(newUser);

    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
      setNewUser({
        email: "",
        user_password: "",
      });
      setTimeout(() => {
        // navigate("/dashboard");
        navigate("/admin/dashboard");
        window.location.reload();
      }, 1500);
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
    <>
      <Flex
        minH={"100vh"}
        direction="column"
        alignSelf="center"
        justifySelf="center"
        overflow="hidden"
      >
        <Box
          position="absolute"
          minH={{ base: "70vh", md: "50vh" }}
          w={{ md: "calc(100vw - 50px)" }}
          borderRadius={{ md: "15px" }}
          left="0"
          right="0"
          bgRepeat="no-repeat"
          overflow="hidden"
          zIndex="-1"
          top="0"
          bgImage={BgSignUp}
          bgSize="cover"
          mx={{ md: "auto" }}
          mt={{ md: "14px" }}
        ></Box>
        <Flex
          direction="column"
          textAlign="center"
          justifyContent="center"
          align="center"
          mt="6.5rem"
          mb="30px"
        >
          <Text fontSize="4xl" color="white" fontWeight="bold">
            Welcome to Easy Tix!
          </Text>
          <Text
            fontSize="md"
            color="white"
            fontWeight="normal"
            mt="10px"
            mb="26px"
            w={{ base: "75%", sm: "60%" }}
          >
            Please log in first to access our features. Your amazing ticket booking experience
            starts here!
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
          <Flex
            direction="column"
            w="445px"
            background="transparent"
            borderRadius="15px"
            p="40px"
            mx={{ base: "100px" }}
            bg={bgColor}
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
          >
            <Text fontSize="xl" color={textColor} fontWeight="bold" textAlign="center" mb="22px">
              Sign In
            </Text>
            <FormControl>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Email
              </FormLabel>
              <Input
                fontSize="sm"
                ms="4px"
                borderRadius="15px"
                type="email"
                placeholder="Your email address"
                name="email"
                mb="24px"
                size="lg"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                borderColor={errors.email ? "red.500" : "gray.200"}
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Password
              </FormLabel>
              <InputGroup size="lg" mb="24px">
                <Input
                  fontSize="sm"
                  ms="4px"
                  borderRadius="15px"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  name="user_password"
                  mb="24px"
                  size="lg"
                  value={newUser.user_password}
                  onChange={(e) => setNewUser({ ...newUser, user_password: e.target.value })}
                  borderColor={errors.user_password ? "red.500" : "gray.200"}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide old password" : "Show old password"}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={togglePasswordVisibility}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup>
              <Button
                type="submit"
                bg="teal.300"
                fontSize="14px"
                color="white"
                fontWeight="bold"
                w="100%"
                h="45"
                mb="24px"
                _hover={{
                  bg: "teal.200",
                }}
                _active={{
                  bg: "teal.400",
                }}
                onClick={handleSubmit}
              >
                SIGN IN
              </Button>
            </FormControl>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px"
            >
              <Text color={textColor} fontWeight="medium" mb="10px">
                Forgot Password?
                <Text
                  color={titleColor}
                  as={Link}
                  ms="5px"
                  to="/signin/forgotpassword"
                  fontWeight="bold"
                >
                  Reset it
                </Text>
              </Text>
              <Text color={textColor} fontWeight="medium">
                Don't have an account?
                <Text color={titleColor} as={Link} ms="5px" to="/register" fontWeight="bold">
                  Sign up
                </Text>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Footer />
    </>
  );
};

export default Signin;
