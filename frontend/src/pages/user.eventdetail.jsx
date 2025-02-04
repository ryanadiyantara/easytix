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
  Textarea,
} from "@chakra-ui/react";

import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useUserStore } from "../store/user";
import { useEventStore } from "../store/event";
import { useReservationStore } from "../store/reservation";
import { useNavigate, useParams } from "react-router-dom";

const EventDetail = () => {
  // Utils
  const { id } = useParams();
  const { currentUsers, fetchCurrentUser } = useUserStore();
  const { eventById, fetchEventById } = useEventStore();
  const { reservations, createReservation, fetchReservation } = useReservationStore();

  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.700");
  const navigate = useNavigate();

  const [newEvent, setNewEvent] = useState({
    name: "",
    start_date: "",
    end_date: "",
    venue: "",
    description: "",
    poster_path: "",
    quantity: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const openApprovalModal = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Services
  useEffect(() => {
    fetchCurrentUser();
    fetchReservation();
  }, [fetchCurrentUser, fetchReservation]);

  useEffect(() => {
    if (id) {
      fetchEventById(id);
    }
  }, [id, fetchEventById]);

  useEffect(() => {
    if (eventById) {
      setNewEvent({
        name: eventById.name || "",
        start_date: eventById.start_date || "",
        end_date: eventById.end_date || "",
        venue: eventById.venue || "",
        description: eventById.description || "",
        poster_path: eventById.poster_path || "",
      });
    }
  }, [eventById]);

  const handleSubmit = async () => {
    newEvent.event_id = eventById._id;

    const { success, message } = await createReservation(currentUsers._id, newEvent);

    if (success) {
      toast({
        title: "Success",
        description: "Event reservation successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsOpen(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
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

  const totalReserved = reservations
    .filter((reservation) => reservation.event_id._id === eventById._id)
    .reduce((acc, reservation) => acc + reservation.quantity, 0);

  const remainingTickets = eventById.quantity - totalReserved;
  const isEventSoldOut = remainingTickets <= 0;

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
            <Flex direction="column" alignItems="center" justifyContent="center" mb="24px">
              <Image
                src={
                  eventById.poster_path !== "-" && eventById.poster_path !== "undefined"
                    ? "/public/uploads/" + eventById.poster_path
                    : "/public/uploads/default/event-pict.jpg"
                }
                alt="Event Picture"
                boxSize="50px"
                objectFit="cover"
                borderRadius="15px"
                width="300px"
                height="150px"
              />
            </Flex>

            <FormControl>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Event Name
              </FormLabel>
              <Input
                fontSize="sm"
                ms="4px"
                borderRadius="15px"
                type="text"
                name="name"
                mb="24px"
                size="lg"
                value={eventById.name}
                readOnly
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Start Date
              </FormLabel>
              <Input
                fontSize="sm"
                ms="4px"
                borderRadius="15px"
                type="text"
                name="start_date"
                mb="24px"
                size="lg"
                value={new Date(eventById.start_date)
                  .toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                  .replace(" ", ", ")}
                readOnly
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                End Date
              </FormLabel>
              <Input
                fontSize="sm"
                ms="4px"
                borderRadius="15px"
                type="text"
                name="end_date"
                mb="24px"
                size="lg"
                value={new Date(eventById.end_date)
                  .toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                  .replace(" ", ", ")}
                readOnly
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Venue
              </FormLabel>
              <Input
                fontSize="sm"
                ms="4px"
                borderRadius="15px"
                type="text"
                name="venue"
                mb="24px"
                size="lg"
                value={eventById.venue}
                readOnly
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Description
              </FormLabel>
              <Textarea
                fontSize="sm"
                ms="4px"
                borderRadius="15px"
                name="description"
                mb="24px"
                size="lg"
                value={eventById.description}
                readOnly
                resize="none" // Agar tidak bisa di-resize manual oleh user
                isDisabled // Jika ingin tampilan lebih mirip dengan input readOnly
                _disabled={{ bg: "gray.100", cursor: "not-allowed" }}
                overflow="hidden"
                whiteSpace="pre-wrap" // Agar teks panjang tidak terpotong
              />
              {/* Button jika tiket sudah habis */}
              {isEventSoldOut ? (
                <>
                  <Button
                    bg="teal.300"
                    fontSize="14px"
                    fontWeight="bold"
                    w="100%"
                    h="45"
                    mb="24px"
                    isDisabled
                  >
                    SOLDOUT
                  </Button>
                  <Button
                    fontSize="14px"
                    variant="solid"
                    fontWeight="bold"
                    w="100%"
                    h="45"
                    mb="24px"
                    colorScheme="gray"
                    onClick={() => navigate("/dashboard")}
                  >
                    BACK TO DASHBOARD
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="submit"
                    bg="teal.300"
                    fontSize="14px"
                    fontWeight="bold"
                    w="100%"
                    h="45"
                    mb="24px"
                    onClick={() => openApprovalModal()}
                  >
                    BOOK NOW
                  </Button>
                  <Button
                    fontSize="14px"
                    variant="solid"
                    fontWeight="bold"
                    w="100%"
                    h="45"
                    mb="24px"
                    colorScheme="gray"
                    onClick={() => navigate("/dashboard")}
                  >
                    CANCEL
                  </Button>
                </>
              )}
            </FormControl>

            {/* Modal Confirmation */}
            <Modal isOpen={isOpen} onClose={handleClose} motionPreset="slideInBottom">
              <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(2px)" />
              <ModalContent borderRadius="15px" boxShadow="none" p={4} maxW="400px" w="90%">
                <ModalHeader>Reservation Confirmation</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p>Are you sure you want to proceed with this reservation?</p>
                  <p>
                    You can cancel your reservation anytime from the <strong>My Reservation</strong>{" "}
                    page.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="gray" mr={3} onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button color="white" bg="teal.300" onClick={handleSubmit}>
                    Confirm Reservation
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

export default EventDetail;
