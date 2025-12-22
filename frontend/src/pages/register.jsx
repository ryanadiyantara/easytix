import React, { useState } from "react";
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

const Register = () => {
  // Utils
  const { createUser } = useUserStore();

  const toast = useToast();
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    user_password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Services
  const handleSubmit = async () => {
    const currentErrors = {
      name: !newUser.name,
      email: !newUser.email,
      user_password: !newUser.user_password,
    };
    setErrors(currentErrors);

    newUser.role = "User";
    const { success, message } = await createUser(newUser);

    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      });
      setNewUser({
        name: "",
        email: "",
        user_password: "",
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
        />
        <Flex
          direction="column"
          textAlign="center"
          justifyContent="center"
          align="center"
          mt="6.5rem"
          mb="30px"
        >
          <Text fontSize="4xl" color="white" fontWeight="bold">
            Create a New Account
          </Text>
          <Text
            fontSize="md"
            color="white"
            fontWeight="normal"
            mt="10px"
            mb="26px"
            w={{ base: "75%", sm: "60%" }}
          >
            Join us to access exclusive features and services. Fill out the form below to create a
            new account and start your journey!
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
              Register With
            </Text>
            <FormControl>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Name
              </FormLabel>
              <Input
                fontSize="sm"
                ms="4px"
                borderRadius="15px"
                type="text"
                placeholder="Your full name"
                name="name"
                mb="24px"
                size="lg"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                borderColor={errors.name ? "red.500" : "gray.200"}
              />
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
                SIGN UP
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
                Already have an account?
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

export default Register;
