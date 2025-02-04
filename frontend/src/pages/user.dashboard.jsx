import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Spacer,
  useColorModeValue,
  Text,
  Card,
  CardHeader,
  CardBody,
  VStack,
  Grid,
  Input,
} from "@chakra-ui/react";

import { BsArrowRight } from "react-icons/bs";

import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useEventStore } from "../store/event";
import { useReservationStore } from "../store/reservation";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  // Utils
  const { events, fetchEvent } = useEventStore();
  const { reservations, fetchReservation } = useReservationStore();

  const textColor = useColorModeValue("gray.700", "white");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Services
  useEffect(() => {
    fetchEvent();
    fetchReservation();
  }, [fetchEvent, fetchReservation]);

  return (
    <>
      <Background />
      <Box
        w="100%"
        maxWidth="100%"
        overflow="auto"
        position="relative"
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
        minH={"100vh"}
      >
        <Navbar />

        {/* Content */}
        <VStack
          justifyContent="start"
          px={{ base: "30px", xl: "40px" }}
          w="100%"
          spacing={{ base: "20px", xl: "30px" }}
          alignItems="center"
          minHeight="85vh"
        >
          {/* Card Event */}
          <Card px={{ base: "10px", xl: "20px" }} py="20px" borderRadius="16px" minW="100%">
            <CardHeader p="6px 0px 0px 0px" mb="0px" direction="row" justify="space-between">
              <Flex align="center" justify="space-between" p="6px 0px 22px 0px">
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Event List
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
              </Flex>
            </CardHeader>
            <CardBody pl="6px">
              <Grid
                templateColumns={{ sm: "1fr", md: "1fr 1fr", xl: "repeat(4, 1fr)" }}
                templateRows={{ sm: "1fr 1fr 1fr auto", md: "1fr 1fr", xl: "1fr" }}
                gap="24px"
                alignItems="flex-start"
              >
                {/* Fetch Card Event */}
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
                  .map((event) => {
                    const ticketId = event._id;
                    const totalReserved = reservations
                      .filter((reservation) => reservation.event_id._id === ticketId)
                      .filter((reservation) => reservation.status === "Booked")
                      .reduce((acc, reservation) => acc + reservation.quantity, 0);

                    const remainingTickets = event.quantity - totalReserved;

                    return (
                      <Box key={event._id} maxHeight="400px" p="1rem">
                        <Box
                          p="0px"
                          backgroundImage={`url(${
                            event.poster_path !== "-" && event.poster_path !== "undefined"
                              ? "/public/uploads/" + event.poster_path.replace(/\\/g, "/")
                              : "/public/uploads/default/event-pict.jpg"
                          })`}
                          bgPosition="center"
                          bgRepeat="no-repeat"
                          w="100%"
                          h={{ sm: "200px", lg: "250px" }}
                          bgSize="cover"
                          position="relative"
                          borderRadius="15px"
                        >
                          <Flex
                            flexDirection="column"
                            color="white"
                            justify="space-between"
                            p="1.5rem 1.2rem 0.3rem 1.2rem"
                            lineHeight="1.6"
                            h="100%"
                          >
                            <Box>
                              <Text fontSize="xl" fontWeight="bold" pb=".3rem">
                                {event.name}
                              </Text>
                              <Text fontSize="sm" fontWeight="normal" w={{ lg: "92%" }}>
                                {(() => {
                                  const startDate = new Date(event.start_date);
                                  const endDate = new Date(event.end_date);

                                  const startDay = startDate
                                    .toLocaleDateString("en-GB", {
                                      weekday: "long",
                                      day: "2-digit",
                                    })
                                    .replace(" ", ", ");

                                  const startMonth = startDate.toLocaleDateString("en-GB", {
                                    month: "long",
                                  });

                                  const startYear = startDate.getFullYear();

                                  const endDay = endDate.toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                  });

                                  const endMonth = endDate.toLocaleDateString("en-GB", {
                                    month: "long",
                                  });

                                  const endYear = endDate.getFullYear();

                                  if (
                                    startDate.getDate() === endDate.getDate() &&
                                    startDate.getMonth() === endDate.getMonth() &&
                                    startYear === endYear
                                  ) {
                                    return `${startDay} ${startMonth} ${startYear}`;
                                  }

                                  if (startYear === endYear) {
                                    if (startDate.getMonth() === endDate.getMonth()) {
                                      return `${startDay} - ${endDay} ${endMonth} ${endYear}`;
                                    } else {
                                      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
                                    }
                                  } else {
                                    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
                                  }
                                })()}
                              </Text>
                            </Box>
                            <Spacer flex="1" />
                            <Flex align="center" justify="space-between">
                              <Button
                                as={Link}
                                to={`/events/detail/${event._id}`}
                                p="0px"
                                variant="no-hover"
                                bg="transparent"
                                mt="12px"
                              >
                                <Text
                                  fontSize="sm"
                                  fontWeight="bold"
                                  _hover={{ me: "4px" }}
                                  transition="all .5s ease"
                                >
                                  Detail
                                </Text>
                                <Icon
                                  as={BsArrowRight}
                                  w="20px"
                                  h="20px"
                                  fontSize="xl"
                                  transition="all .5s ease"
                                  mx=".3rem"
                                  cursor="pointer"
                                  _hover={{ transform: "translateX(20%)" }}
                                  pt="4px"
                                />
                              </Button>
                              <Text fontSize="md" fontWeight="bold" mt="12px">
                                Available: {remainingTickets}
                              </Text>
                            </Flex>
                          </Flex>
                        </Box>
                      </Box>
                    );
                  })}
              </Grid>
            </CardBody>
          </Card>
        </VStack>

        <Footer />
      </Box>
    </>
  );
};

export default UserDashboard;
