import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Text, Input } from "@chakra-ui/react";
import { getSender } from "../config/chatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      alert("Error fetching messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        setMessages([...messages, data]);
      } catch (error) {
        alert("Error sending message");
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Additional logic for typing indicator or other features can be added here
  };

  return (
    <>
      {selectedChat ? (
        <Box
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          d="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
          <Button
            d={{ base: "flex", md: "none" }}
            onClick={() => setSelectedChat("")}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </Button>
          {!selectedChat.isGroupChat ? (
            <>{getSender(user, selectedChat.users)}</>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            </>
          )}
          <Box
            d="flex"
            flexDir="column"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="700px"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <div fontSize="2xl" margin="auto">
                Loading...
              </div>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
          </Box>
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message..."
            onChange={typingHandler}
            value={newMessage}
            onKeyDown={sendMessage}
            position="bottom"
          />
        </Box>
      ) : (
        <Box>
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
