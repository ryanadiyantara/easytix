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
  Input,
  Badge,
} from "@chakra-ui/react";

import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useReservationStore } from "../store/reservation";

const AdminListReservation = () => {
  // Utils
  const { reservations, fetchReservation } = useReservationStore();

  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");

  const statusColors = {
    Booked: "green.400",
    Cancelled: "#E53E3E",
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Services
  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

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
                Reservation List
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
                      User ID
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      User Name
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Event Name
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Reservation Date
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Quantity
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reservations
                    .filter((reservation) => {
                      const reservationDate = new Date(reservation.reservation_date);

                      const formattedReservationDate = reservationDate
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                        .toLowerCase();

                      return (
                        reservation.user_id.user_id.toLowerCase().includes(searchQuery) ||
                        reservation.user_id.name.toLowerCase().includes(searchQuery) ||
                        reservation.event_id.name.toLowerCase().includes(searchQuery) ||
                        String(reservation.quantity).includes(searchQuery) ||
                        reservation.status.toLowerCase().includes(searchQuery) ||
                        formattedReservationDate.includes(searchQuery.toLowerCase())
                      );
                    })
                    .map((reservation) => {
                      return (
                        <Tr
                          key={reservation._id}
                          _hover={{ backgroundColor: hoverColor }}
                        >
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {reservation.user_id.user_id}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {reservation.user_id.name}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {reservation.event_id.name}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {new Date(reservation.reservation_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {reservation.quantity}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              <Badge
                                bg={statusColors[reservation.status] || "gray.400"}
                                color={"white"}
                                fontSize="16px"
                                p="3px 10px"
                                borderRadius="8px"
                              >
                                {reservation.status}
                              </Badge>
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

export default AdminListReservation;
