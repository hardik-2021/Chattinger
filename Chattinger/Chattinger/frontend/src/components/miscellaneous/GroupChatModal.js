import React, { useState } from "react";
import { Button, Input, Popover, Portal, Text, Box } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Await } from "react-router-dom";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      // Optionally, add a toast notification for error
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      console.log("Please fill all the fields");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      //onclose();
      console.log("Group chat created successfully");
    } catch (error) {
      console.log(error);
      // Optionally, add a toast notification for error
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      console.log("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button size="sm" variant="outline">
            New Group Chat <Text fontSize="2xl">+</Text>
          </Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow />
              <Popover.Body>
                <Popover.Title
                  fontSize="20px"
                  fontFamily="Work sans"
                  d="flex"
                  justifyContent="center"
                  flexDir="column"
                  alignItems="center"
                >
                  Create Group Chat
                  <Input
                    placeholder="Chat Name"
                    mb={3}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Input
                    placeholder="Add Users eg: John, Piyush, Jane"
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                  {loading ? (
                    <>Loading...</>
                  ) : (
                    searchResult
                      ?.slice(0, 4)
                      .map((user) => (
                        <UserListItem
                          key={user._id}
                          user={user}
                          handleFunction={() => handleGroup(user)}
                        />
                      ))
                  )}
                  <Button
                    d="flex"
                    justifyContent="center"
                    onClick={handleSubmit}
                  >
                    Create
                  </Button>
                </Popover.Title>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </>
  );
};

export default GroupChatModal;
