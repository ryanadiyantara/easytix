import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useColorModeValue,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";

import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useUserStore } from "../store/user";

const UserProfile = () => {
  // Utils
  const { currentUsers, fetchCurrentUser, updateUser } = useUserStore();
  
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.700");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    profilePict: "",
  });
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedType = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (file) {
      const fileTypeValid = allowedType.some((type) => file.type === type);
      if (!fileTypeValid) {
        toast({
          title: "Error",
          description: "The file must be in JPG, JPEG, or PNG format.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        e.target.value = "";
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "The file size must not exceed 5 MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        e.target.value = "";
        return;
      }

      setNewUser({ ...newUser, profilePict: file });
    }
  };

  const openApprovalModal = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Services
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (currentUsers) {
      setNewUser({
        name: currentUsers.name || "",
        email: currentUsers.email || ""
      });
    }
  }, [currentUsers]);

  const handleSubmit = async () => {
    const currentErrors = {
      name: !newUser.name,
      email: !newUser.email,
    };
    setErrors(currentErrors);

    const { success, message } = await updateUser(currentUsers._id, newUser);

    if (success) {
      toast({
        title: "Success",
        description: "User updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      document.querySelector('input[type="file"]').value = "";
      setIsOpen(false);
      window.location.reload();
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      <Background/>
      <Box
        w="100%"
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
        
        {/* Content */}
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
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              mb="24px" 
            >
              <Image
                src={
                  currentUsers.profile_picture_path !== "-"  && currentUsers.profile_picture_path !== "undefined"
                    ? "/public/uploads/" + currentUsers.profile_picture_path
                    : "/public/uploads/default/profile-pict.jpg"
                }
                alt="Profile Picture"
                boxSize="50px"
                objectFit="cover"
                borderRadius="full"
                width="150px"
                height="150px"
              />
            </Flex>

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
                Profile Picture
              </FormLabel>
              <Input
                fontSize="sm"
                ms="4px"
                type="file"
                size="lg"
                name="profilePict"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 12px",
                }}
                onChange={handleFileChange}
                borderColor={errors.profilePict ? "red.500" : "gray.200"}
              />
              <Text fontSize="xs" color="red.500" ms="4px" fontStyle="italic">
                * Accepted file types: JPG, JPEG, PNG.
              </Text>
              <Text fontSize="xs" color="red.500" ms="4px" mb="24px" fontStyle="italic">
                * Recommended aspect ratio: 1:1.
              </Text>
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
                onClick={() => openApprovalModal()}
              >
                UPDATE
              </Button>
            </FormControl>
            
            {/* Modal Update */}
            <Modal isOpen={isOpen} onClose={handleClose} motionPreset="slideInBottom">
              <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(2px)" />
              <ModalContent borderRadius="15px" boxShadow="none" p={4} maxW="400px" w="90%">
                <ModalHeader>Update Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p>
                    Are you sure you want to update your profile? This action cannot be undone.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="gray" mr={3} onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button color="white" bg="teal.300" onClick={handleSubmit}>
                    Update
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
        </Flex>

        <Footer />
      </Box>
    </>
  );
};

export default UserProfile;
