import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  Td,
  Image,
  Input,
} from "@chakra-ui/react";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useUserStore } from "../store/user";

const AdminListUser = () => {
  // Utils
  const { users, fetchUser } = useUserStore();

  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Services
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Background />
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

        {/* Content */}
        <HStack
          justifyContent="space-between"
          px={{ base: "30px", xl: "40px" }}
          w="100%"
          spacing={{ base: "20px", xl: "30px" }}
          alignItems={{ base: "center", xl: "start" }}
          minHeight="85vh"
        >
          {/* Table Data */}
          <VStack
            spacing={2}
            alignItems={"left"}
            w="100%"
            p="20px"
            borderRadius="16px"
            bg={bgForm}
            overflowX={{ sm: "scroll", xl: "hidden" }}
          >
            <Flex align="center" justify="space-between" p="6px 0px 22px 0px">
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                User List
              </Text>
              <Box>
                <Input
                  placeholder="Search on list.."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  size="sm"
                  borderRadius="5px"
                  w={{ base: "85%", md: "100%" }}
                  ml={{ base: "15%", md: "0%" }}
                />
              </Box>
            </Flex>
            <Box>
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th pl="0px" borderColor={borderColor} color="gray.400">
                      Name & Email
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      User ID
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Role
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Registered Date
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users
                    .filter((user) => !user.na)
                    .filter((user) => {
                      const createdAt = new Date(user.createdAt);

                      const formattedRegisteredDate = createdAt
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                        .toLowerCase();

                      return (
                        user.user_id.toLowerCase().includes(searchQuery) ||
                        user.name.toLowerCase().includes(searchQuery) ||
                        user.email.toLowerCase().includes(searchQuery) ||
                        user.role.toLowerCase().includes(searchQuery) ||
                        formattedRegisteredDate.includes(searchQuery.toLowerCase())
                      );
                    })
                    .map((user) => {
                      return (
                        <Tr key={user._id} _hover={{ backgroundColor: hoverColor }}>
                          <Td
                            borderColor={borderColor}
                            width={{ base: "100px", xl: "300px" }}
                            p="0px"
                          >
                            <Flex direction="row">
                              <Image
                                src={
                                  user.profile_picture_path !== "-" &&
                                  user.profile_picture_path !== "undefined"
                                    ? "/public/uploads/" + user.profile_picture_path
                                    : "/public/uploads/default/profile-pict.jpg"
                                }
                                alt={user.profile_picture_path}
                                boxSize="50px"
                                objectFit="cover"
                                borderRadius="lg"
                                width="40px"
                                height="40px"
                                mr="10px"
                              />
                              <Flex direction="column" width={{ base: "100px", xl: "300px" }}>
                                <Text fontSize="md" color={textColor} fontWeight="bold">
                                  {user.name}
                                </Text>
                                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                  {user.email}
                                </Text>
                              </Flex>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {user.user_id}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {user.role}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {new Date(user.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </Text>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};

export default AdminListUser;
