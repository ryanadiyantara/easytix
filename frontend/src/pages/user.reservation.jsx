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
  Button,
} from "@chakra-ui/react";
import { FaCreditCard, FaTrash } from "react-icons/fa";

import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useReservationStore } from "../store/reservation";
import { useUserStore } from "../store/user";
import { Link } from "react-router-dom";
import ModalPayment from "../components/ModalPayment";
import CustomModal from "../components/Modal";

const UserReservation = () => {
  // Utils
  const { reservations, fetchReservation, updateReservation, cancelReservation } =
    useReservationStore();
  const { currentUsers, fetchCurrentUser } = useUserStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");

  const statusColors = {
    Booked: "green.400",
    Cancelled: "#E53E3E",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);
  const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedReservationPid, setSelectedReservationPid] = useState(null);
  const [selectedReservationQuantity, setSelectedReservationQuantity] = useState(null);
  const [selectedEventName, setSelectedEventName] = useState(null);
  const [selectedEventPrice, setSelectedEventPrice] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const openPaymentModal = (reservation) => {
    setSelectedReservationPid(reservation._id);
    setSelectedReservationQuantity(reservation.quantity);
    setSelectedEventName(reservation.event_id.name);
    setSelectedEventPrice(reservation.event_id.price);
    setIsOpenPaymentModal(true);
  };

  const openCancelModal = (reservation) => {
    setSelectedReservationPid(reservation._id);
    setSelectedEventName(reservation.event_id.name);
    setIsOpenCancelModal(true);
  };

  const handleClosePaymentModal = () => {
    setIsOpenPaymentModal(false);
    setPaymentMethod("");
    setSelectedReservationPid(null);
    setSelectedReservationQuantity(null);
    setSelectedEventName(null);
    setSelectedEventPrice(null);
  };

  const handleCloseCancelModal = () => {
    setIsOpenCancelModal(false);
    setInputValue("");
    setSelectedReservationPid(null);
    setSelectedEventName(null);
  };

  // Services
  useEffect(() => {
    fetchReservation();
    fetchCurrentUser();
  }, [fetchReservation, fetchCurrentUser]);

  const handlePayment = async (pid) => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const { success, message } = await updateReservation(pid, paymentMethod);
    if (success) {
      toast({
        title: "Success",
        description: "Payment completed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpenPaymentModal(false);
      setPaymentMethod("");
      setSelectedReservationPid(null);
      setSelectedReservationQuantity(null);
      setSelectedEventName(null);
      setSelectedEventPrice(null);
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

  const handleCancelPayment = async (pid) => {
    if (!selectedEventName) return;

    if (inputValue !== selectedEventName) {
      toast({
        title: "Error",
        description: "Input does not match the event name.",
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
        description: "Reservation cancelled successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpenCancelModal(false);
      setInputValue("");
      setSelectedEventName(null);
      setSelectedReservationPid(null);
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
                My Reservations
              </Text>

              <Flex
                align="center"
                justify="space-between"
                p="0px"
                gap={{ base: "0px", md: "20px" }}
              >
                <Button
                  fontSize="xs"
                  as={Link}
                  to="/dashboard"
                  bg="teal.300"
                  color="white"
                  maxH="30px"
                  borderRadius="5px"
                  _hover={{
                    bg: "teal.200",
                  }}
                >
                  Dashboard
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
            </Flex>
            <Box>
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th pl="0px" borderColor={borderColor} color="gray.400">
                      Event Name
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Reservation Date
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Quantity
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Price
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Status
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Payment Method
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Payment Date
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
                        String(reservation.price).includes(searchQuery) ||
                        reservation.status.toLowerCase().includes(searchQuery) ||
                        formattedReservationDate.includes(searchQuery.toLowerCase())
                      );
                    })
                    .map((reservation) => {
                      return (
                        <Tr key={reservation._id} _hover={{ backgroundColor: hoverColor }}>
                          <Td pl="0px" borderColor={borderColor}>
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
                              Rp. {reservation.event_id.price}
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
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {reservation.payment_method}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                              {new Date(reservation.payment_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="row" p="0px" alignItems="center" gap="4">
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => openPaymentModal(reservation)}
                                isDisabled={reservation.status !== "Pending"}
                                opacity={reservation.status !== "Pending" ? 0.5 : 1}
                                cursor={
                                  reservation.status !== "Pending" ? "not-allowed" : "pointer"
                                }
                                pointerEvents={reservation.status !== "Pending" ? "none" : "auto"}
                              >
                                <FaCreditCard size="14" color={iconColor} />
                                <Text fontSize="14px" color={textColor} fontWeight="bold">
                                  Pay Now
                                </Text>
                              </Flex>
                              <Flex
                                alignItems="center"
                                gap="1"
                                as="button"
                                onClick={() => openCancelModal(reservation)}
                                isDisabled={reservation.status !== "Pending"}
                                opacity={reservation.status !== "Pending" ? 0.5 : 1}
                                cursor={
                                  reservation.status !== "Pending" ? "not-allowed" : "pointer"
                                }
                                pointerEvents={reservation.status !== "Pending" ? "none" : "auto"}
                              >
                                <FaTrash size="14" color="#E53E3E" />
                                <Text fontSize="14px" color="#E53E3E" fontWeight="bold">
                                  Cancel
                                </Text>
                              </Flex>
                              {/* Modal Payment */}
                              <ModalPayment
                                isOpen={isOpenPaymentModal}
                                onClose={handleClosePaymentModal}
                                title="Complete Payment"
                                bodyContent={
                                  <>
                                    <p style={{ marginBottom: "12px" }}>
                                      You are about to complete the payment for:
                                    </p>

                                    <p>
                                      <strong>Event:</strong> {selectedEventName}
                                    </p>
                                    <p>
                                      <strong>Quantity:</strong> {selectedReservationQuantity}
                                    </p>
                                    <p style={{ marginBottom: "16px" }}>
                                      <strong>Total Price:</strong>
                                      {" Rp. "}
                                      {selectedReservationQuantity * selectedEventPrice}
                                    </p>

                                    <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
                                      Choose a payment method:
                                    </p>

                                    <div>
                                      <label style={{ display: "block", marginBottom: "6px" }}>
                                        <input
                                          type="radio"
                                          name="payment_method"
                                          value="PayPal"
                                          onChange={(e) => setPaymentMethod(e.target.value)}
                                        />{" "}
                                        PayPal
                                      </label>

                                      <label style={{ display: "block", marginBottom: "6px" }}>
                                        <input
                                          type="radio"
                                          name="payment_method"
                                          value="Credit Card"
                                          onChange={(e) => setPaymentMethod(e.target.value)}
                                        />{" "}
                                        Credit Card (Visa / Mastercard)
                                      </label>

                                      <label style={{ display: "block", marginBottom: "6px" }}>
                                        <input
                                          type="radio"
                                          name="payment_method"
                                          value="Apple Pay"
                                          onChange={(e) => setPaymentMethod(e.target.value)}
                                        />{" "}
                                        Apple Pay
                                      </label>

                                      <label style={{ display: "block", marginBottom: "6px" }}>
                                        <input
                                          type="radio"
                                          name="payment_method"
                                          value="Google Pay"
                                          onChange={(e) => setPaymentMethod(e.target.value)}
                                        />{" "}
                                        Google Pay
                                      </label>
                                    </div>
                                  </>
                                }
                                modalBgColor="blackAlpha.400"
                                modalBackdropFilter="blur(1px)"
                                onConfirm={() => handlePayment(selectedReservationPid)}
                              />
                              {/* Modal Cancel */}
                              <CustomModal
                                isOpen={isOpenCancelModal}
                                onClose={handleCloseCancelModal}
                                title="Cancel Reservation"
                                bodyContent={
                                  <p>
                                    To cancel the reservation for the event{" "}
                                    <span style={{ fontWeight: "bold" }}>{selectedEventName}</span>,
                                    type the name to confirm.
                                  </p>
                                }
                                modalBgColor="blackAlpha.400"
                                modalBackdropFilter="blur(1px)"
                                inputValue={inputValue}
                                onInputChange={(e) => setInputValue(e.target.value)}
                                onConfirm={() => handleCancelPayment(selectedReservationPid)}
                              />
                            </Flex>
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
