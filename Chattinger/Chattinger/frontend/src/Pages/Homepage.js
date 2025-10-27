import React from "react";
import { Container, Box, Text, Link, Tabs } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="white"
        w={"100%"}
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work Sans" color="black">
          Chattinger
        </Text>
      </Box>
      <Box bg={"white"} w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs.Root defaultValue="members">
          <Tabs.List>
            <Tabs.Trigger value="members" asChild width={"50%"}>
              <Link
                unstyled
                href="#members"
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                Login
              </Link>
            </Tabs.Trigger>
            <Tabs.Trigger value="projects" asChild width={"50%"}>
              <Link
                unstyled
                href="#projects"
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                SignUp
              </Link>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="members">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="projects">
            <SignUp />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default Homepage;
