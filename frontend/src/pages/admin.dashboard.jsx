import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  useColorModeValue,
  VStack,
  Td,
  Image,
} from "@chakra-ui/react";
import { FaPen, FaTrash } from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CustomModal from "../components/Modal";
import Footer from "../components/Footer";

import { useEventStore } from "../store/event";

const AdminDashboard = () => {
  // Utils
  const { events, createEvent, fetchEvent, updateEvent, deleteEvent } = useEventStore();

  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const [searchQuery, setSearchQuery] = useState("");
  const [newEvent, setNewEvent] = useState({
    name: "",
    start_date: "",
    end_date: "",
    venue: "",
    description: "",
    categories: "",
    poster: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedEventName, setSelectedEventName] = useState(null);
  const [selectedEventPid, setSelectedEventPid] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

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

      setNewEvent({ ...newEvent, poster: file });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    if (name === "start_date" && !value) {
      newEvent.end_date = "";
    }

    if (name === "end_date" && new Date(value) < new Date(newEvent.start_date)) {
      toast({
        title: "Error",
        description: "End Date cannot be before Start Date.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      e.target.value = "";
      return;
    }
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleEditClick = (event) => {
    setNewEvent({
      name: event.name,
      start_date: formatDate(event.start_date),
      end_date: formatDate(event.end_date),
      venue: event.venue,
      description: event.description,
      categories: event.categories,
      poster: event.poster,
      quantity: event.quantity,
    });
    setErrors({});
    setIsEditing(true);
    setEditingEventId(event._id);
  };

  const handleCancelEdit = () => {
    setNewEvent({
      name: "",
      start_date: "",
      end_date: "",
      venue: "",
      description: "",
      categories: "",
      poster: "",
      quantity: "",
    });
    document.querySelector('input[type="file"]').value = "";
    setErrors({});
    setIsEditing(false);
    setEditingEventId(null);
  };

  const openDeleteModal = (name, pid) => {
    setSelectedEventName(name);
    setSelectedEventPid(pid);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue("");
    setSelectedEventName(null);
    setSelectedEventPid(null);
  };

  // Services
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleSubmit = async () => {
    const currentErrors = {
      name: !newEvent.name,
      start_date: !newEvent.start_date,
      end_date: !newEvent.end_date,
      venue: !newEvent.venue,
      description: !newEvent.description,
      categories: !newEvent.categories,
      quantity: !newEvent.quantity,
    };

    setErrors(currentErrors);

    if (isEditing && editingEventId) {
      // Update event
      const { success, message } = await updateEvent(editingEventId, newEvent);

      if (success) {
        toast({
          title: "Success",
          description: "Event updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        setEditingEventId(null);
        setNewEvent({
          event_name: "",
          name: "",
          start_date: "",
          end_date: "",
          venue: "",
          description: "",
          categories: "",
          quantity: "",
        });
        document.querySelector('input[type="file"]').value = "";
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    } else {
      // Create new event
      const { success, message } = await createEvent(newEvent);

      if (success) {
        toast({
          title: "Success",
          description: message,
          status: "success",
          isClosable: true,
        });
        setNewEvent({
          event_name: "",
          name: "",
          start_date: "",
          end_date: "",
          venue: "",
          description: "",
          categories: "",
          quantity: "",
        });
        document.querySelector('input[type="file"]').value = "";
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteEvent = async (pid) => {
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

    const { success, message } = await deleteEvent(pid);

    if (success) {
      toast({
        title: "Success",
        description: "Event deleted successfully",
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
          flexDirection={{
            base: "column",
            lg: "row",
          }}
          justifyContent="space-between"
          px={{ base: "30px", xl: "40px" }}
          w="100%"
          spacing={{ base: "20px", xl: "30px" }}
          alignItems={{ base: "center", lg: "start" }}
          minHeight="85vh"
        >
          {/* Table Data */}
          <VStack
            spacing={1}
            alignItems={"left"}
            w="100%"
            background="white"
            p="20px"
            borderRadius="16px"
            bg={bgForm}
            overflowX="scroll"
          >
            <Flex align="center" justify="space-between" p="6px 0px 22px 0px">
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                Event List
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
                      No.
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Poster
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Event Name
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Start Date
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      End Date
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Venue
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Description
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Categories
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Quantity
                    </Th>
                    <Th borderColor={borderColor} color="gray.400">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {events
                    .filter((event) => !event.na)
                    .filter((event) => {
                      const startDate = new Date(event.start_date);
                      const endDate = new Date(event.end_date);

                      const formattedStartDate = startDate
                        .toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                        .toLowerCase();

                      const formattedEndDate = endDate
                        .toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                        .toLowerCase();

                      return (
                        event.name.toLowerCase().includes(searchQuery) ||
                        formattedStartDate.includes(searchQuery.toLowerCase()) ||
                        formattedEndDate.includes(searchQuery.toLowerCase()) ||
                        event.description.toLowerCase().includes(searchQuery)
                      );
                    })
                    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
                    .map((event, index) => (
                      <Tr
                        key={event._id}
                        _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
                      >
                        <Td width={{ sm: "50px" }} pl="0px" borderColor={borderColor} py={5}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                            {index + 1}
                          </Text>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Box
                            width="200px"
                            height="100px"
                            position="relative"
                            borderRadius="lg"
                            overflow="hidden"
                          >
                            <Image
                              src={
                                event.poster_path !== "-"  && event.poster_path !== "undefined"
                                  ? "/public/uploads/" + event.poster_path
                                  : "/public/uploads/default/event-pict.jpg"
                              }
                              alt={event.poster_path}
                              layout="fill"
                              objectFit="cover"
                            />
                          </Box>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                            {event.name}
                          </Text>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                            {new Date(event.start_date)
                              .toLocaleDateString("en-GB", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                              .replace(" ", ", ")}
                          </Text>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                            {new Date(event.end_date)
                              .toLocaleDateString("en-GB", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                              .replace(" ", ", ")}
                          </Text>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                            {event.venue}
                          </Text>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                            {event.description}
                          </Text>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                            {event.categories}
                          </Text>
                        </Td>
                        <Td borderColor={borderColor}>
                          <Text fontSize="md" color={textColor} fontWeight="bold" minWidth="100%">
                            {event.quantity}
                          </Text>
                        </Td>

                        <Td borderColor={borderColor}>
                          <Flex direction="row" p="0px" alignItems="center" gap="4">
                            <Flex
                              alignItems="center"
                              gap="1"
                              as="button"
                              onClick={() => handleEditClick(event)}
                            >
                              <FaPen size="14" color={iconColor} />
                              <Text fontSize="14px" color={textColor} fontWeight="bold">
                                EDIT
                              </Text>
                            </Flex>
                            <Flex
                              alignItems="center"
                              gap="1"
                              as="button"
                              onClick={() => openDeleteModal(event.name, event._id)}
                            >
                              <FaTrash size="14" color="#E53E3E" />
                              <Text fontSize="14px" color="#E53E3E" fontWeight="bold">
                                DELETE
                              </Text>
                            </Flex>
                            {/* Modal Delete */}
                            <CustomModal
                              isOpen={isOpen}
                              onClose={handleClose}
                              title="Delete Event"
                              bodyContent={
                                <p>
                                  To delete a event named{" "}
                                  <span style={{ fontWeight: "bold" }}>{selectedEventName}</span>,
                                  type the name to confirm.
                                </p>
                              }
                              modalBgColor="blackAlpha.400"
                              modalBackdropFilter="blur(1px)"
                              inputValue={inputValue}
                              onInputChange={(e) => setInputValue(e.target.value)}
                              onConfirm={() => handleDeleteEvent(selectedEventPid)}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>

          {/* Input Form */}
          <VStack>
            <Flex direction="column" w="325px" borderRadius="15px" p="40px" bg={bgForm} mb="60px">
              <Text fontSize="xl" color={textColor} fontWeight="bold" mb="22px">
                {isEditing ? "Edit Event" : "Add New Event"}
              </Text>
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Event Name
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Event name"
                  name="name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  borderColor={errors.name ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Start Date
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="date"
                  mb="24px"
                  size="lg"
                  placeholder="Start Date"
                  name="start_date"
                  value={newEvent.start_date}
                  onChange={handleDateChange}
                  borderColor={errors.start_date ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  End Date
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="date"
                  mb="24px"
                  size="lg"
                  placeholder="End Date"
                  name="end_date"
                  value={newEvent.end_date}
                  onChange={handleDateChange}
                  borderColor={errors.end_date ? "red.500" : "gray.200"}
                  isDisabled={!newEvent.start_date}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Venue
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Venue"
                  name="venue"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  borderColor={errors.venue ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Description
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Description"
                  name="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  borderColor={errors.description ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Categories
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="text"
                  mb="24px"
                  size="lg"
                  placeholder="Categories"
                  name="categories"
                  value={newEvent.categories}
                  onChange={(e) => setNewEvent({ ...newEvent, categories: e.target.value })}
                  borderColor={errors.categories ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Quantity
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="number"
                  mb="24px"
                  size="lg"
                  placeholder="Quantity"
                  name="quantity"
                  value={newEvent.quantity}
                  onChange={(e) => setNewEvent({ ...newEvent, quantity: e.target.value })}
                  borderColor={errors.quantity ? "red.500" : "gray.200"}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Poster
                </FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  type="file"
                  size="lg"
                  name="poster"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 12px",
                  }}
                  onChange={handleFileChange}
                  borderColor={errors.poster ? "red.500" : "gray.200"}
                />
                <Text fontSize="xs" color="red.500" ms="4px" fontStyle="italic">
                  * Accepted file types: JPG, JPEG, PNG.
                </Text>
                <Text fontSize="xs" color="red.500" ms="4px" mb="24px" fontStyle="italic">
                  * Recommended aspect ratio: 2:1.
                </Text>

                <Button
                  bg="teal.300"
                  fontSize="14px"
                  color="white"
                  fontWeight="bold"
                  w="100%"
                  h="45"
                  mt="24px"
                  onClick={handleSubmit}
                >
                  {isEditing ? "Update" : "Submit"}
                </Button>
                {isEditing && (
                  <Button
                    fontSize="14px"
                    variant="solid"
                    fontWeight="bold"
                    w="100%"
                    h="45"
                    mt="4"
                    onClick={handleCancelEdit}
                    colorScheme="gray"
                  >
                    Cancel
                  </Button>
                )}
              </FormControl>
            </Flex>
          </VStack>
        </HStack>

        <Footer />
      </Box>
    </>
  );
};

export default AdminDashboard;
