import React, { useState } from "react";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";

import BgSignUp from "../assets/img/BgSignUp.png";
import Footer from "../components/Footer";

import { useUserStore } from "../store/user";

const ForgotPassword = () => {
  // Utils
  const { forgotPassword } = useUserStore();

  const toast = useToast();
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});

  // Services
  const handleResetLink = async () => {
    const currentErrors = {
      email: !newUser.email,
    };

    setErrors(currentErrors);

    const { success, message } = await forgotPassword(newUser);

    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
      setNewUser({
        email: "",
      });
      setTimeout(() => {
        navigate("/signin");
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
            Forgot Your Password?
          </Text>
          <Text
            fontSize="md"
            color="white"
            fontWeight="normal"
            mt="10px"
            mb="26px"
            w={{ base: "75%", sm: "60%" }}
          >
            No worries! Just enter your email address, and we'll send you instructions to reset your
            password and regain access to your account.
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
              Forgot Password
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
                onClick={handleResetLink}
              >
                SEND RESET LINK
              </Button>
            </FormControl>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px"
            >
              <Text color={textColor} fontWeight="medium">
                Back to Sign In?
                <Text color={titleColor} as={Link} ms="5px" to="/signin" fontWeight="bold">
                  Sign In
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

export default ForgotPassword;
