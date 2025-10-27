import React from "react";
import { Button, Popover, Portal, Box, Input } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { TbRecycle } from "react-icons/tb";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {}
  };
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert("User already in group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("Only admins can add someone!");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Error Occurred!");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.error(error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
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

  return (
    <>
      <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Popover.Trigger asChild>
          <Button size="sm" variant="outline">
            Click me
          </Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow />
              <Popover.Body>
                <>
                  <Box>{selectedChat.chatName}</Box>
                  <Box>
                    {selectedChat.users.map((u) => (
                      <UserBadgeItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleRemove(u)}
                      />
                    ))}
                  </Box>
                  <Input
                    placeholder="Chat Name"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    isLoading={renameLoading}
                    variant="solid"
                    colorScheme="teal"
                    size="sm"
                    ml={1}
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                  <Input
                    placeholder="Add User to group"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {loading ? (
                    <>Loading...</>
                  ) : (
                    searchResult
                      ?.slice(0, 4)
                      .map((user) => (
                        <UserListItem
                          key={user._id}
                          user={user}
                          handleFunction={() => handleAddUser(user)}
                        />
                      ))
                  )}
                  <Button
                    isLoading={renameLoading}
                    variant="solid"
                    backgroundColor="red"
                    size="sm"
                    ml={1}
                    onClick={handleRename}
                  >
                    Leave Group
                  </Button>
                </>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </>
  );
};

export default UpdateGroupChatModal;
