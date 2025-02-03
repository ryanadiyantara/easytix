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
  useToast,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

import Background from "../components/Background";
import Navbar from "../components/Navbar";
import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

import { useReservationStore } from "../store/reservation";
import { useUserStore } from "../store/user";

const UserReservation = () => {
  // Utils
  const { reservations, fetchReservation, cancelReservation } = useReservationStore();
  const { currentUsers, fetchCurrentUser } = useUserStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  
  const statusColors = {
    Booked: "green.400",
    Cancelled: "#E53E3E",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedReservationPid, setSelectedReservationPid] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const openCancelModal = (pid) => {
    setSelectedReservationPid(pid);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSelectedReservationPid(null);
  };

  // Services
  useEffect(() => {
    fetchReservation();
    fetchCurrentUser();
  }, [fetchReservation, fetchCurrentUser]);

  const handleCancelReservation = async (pid) => {
    if (inputValue !== "CONFIRM") {
      toast({
        title: "Error",
        description: "Input does not match, try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { success, message } = await cancelReservation(pid);

    if (success) {
      toast({
        title: "Success",
        description: "Reservation cancel successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setInputValue("");
      setSelectedEventName(null);
      setSelectedEventPid(null);
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Background />
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
                My Reservation List 
              </Text>
              <Button
                fontSize="xs"
                as={Link}
                to="/reservation"
                bg="teal.300"
                color="white"
                maxH="30px"
                borderRadius="5px"
                _hover={{
                  bg: "teal.200",
                }}
              >
                My Reservation
              </Button>
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
                    <Th borderColor={borderColor} color="gray.400">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reservations
                    .filter((reservation) => reservation.user_id._id === currentUsers?._id)
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

                          <Td borderColor={borderColor}>
                            <Flex
                              alignItems="center"
                              gap="1"
                              as="button"
                              onClick={() => openCancelModal(reservation._id)}
                              cursor={reservation.status === "Cancelled" ? "not-allowed" : "pointer"}
                              opacity={reservation.status === "Cancelled" ? 0.5 : 1}
                              pointerEvents={reservation.status === "Cancelled" ? "none" : "auto"}
                            >
                              <FaTrash size="14" color="#E53E3E" />
                              <Text fontSize="14px" color="#E53E3E" fontWeight="bold">
                                Cancel
                              </Text>
                            </Flex>
                            {/* Modal Canceled */}
                            <CustomModal
                              isOpen={isOpen}
                              onClose={handleClose}
                              title="Cancel Event"
                              bodyContent={
                                <p>
                                  Please note that this action cannot be undone. To cancel this reservation, type{" "}
                                  <span style={{ fontWeight: "bold" }}>CONFIRM</span>.
                                </p>
                              }
                              modalBgColor="blackAlpha.400"
                              modalBackdropFilter="blur(1px)"
                              inputValue={inputValue}
                              onInputChange={(e) => setInputValue(e.target.value)}
                              onConfirm={() => handleCancelReservation(selectedReservationPid)}
                            />
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

export default UserReservation;
