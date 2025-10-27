import React from "react";
import { Tooltip } from "../ui/tooltip";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Menu,
  Text,
  Portal,
  Avatar,
  Input,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./profileModel";
import { useNavigate } from "react-router-dom";
import { Popover } from "@chakra-ui/react";
import { CloseButton, Drawer } from "@chakra-ui/react";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      // insert a toast here "Please Enter something to search";
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      // insert toast here "Error Occured! Failed to Load the Search Results";
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id))
        setSelectedChat([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onclose();
    } catch (error) {
      // display toast here " Error fetching the chat"
    }
  };

  return (
    // console.log(user),
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
        h={"25px%"}
      >
        <Tooltip content="Search User To chat">
          <Drawer.Root placement="left">
            <Drawer.Trigger asChild>
              <Button variant="outline" size="sm">
                <i className="fas fa-search"></i>
                <Text display={{ base: "none", md: "flex" }} px={4}>
                  Search User
                </Text>
              </Button>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>
                      <Box d="flex" pb={2}>
                        <Input
                          placeholder="Search by name or email"
                          mr={2}
                          value={search || ""}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={handleSearch}>Go</Button>
                      </Box>
                      {loading ? (
                        <div>
                          {/* Can also create a loading stack uising Stack */}
                          Loading...
                        </div>
                      ) : (
                        searchResult?.map((user) => (
                          <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => accessChat(user._id)}
                          />
                        ))
                      )}
                      {loadingChat && <div>Loading...</div>}
                    </Drawer.Title>
                  </Drawer.Header>
                  <Drawer.Body></Drawer.Body>
                  <Drawer.Footer>
                    <Button variant="outline">Cancel</Button>
                    <Button>Save</Button>
                  </Drawer.Footer>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Chattinger
        </Text>

        <div>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" size="sm" fontSize="2xl">
                <i className="fa-solid fa-bell"></i>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="new-txt">New Text File</Menu.Item>
                  <Menu.Item value="new-file">New File...</Menu.Item>
                  <Menu.Item value="new-win">New Window</Menu.Item>
                  <Menu.Item value="open-file">Open File...</Menu.Item>
                  <Menu.Item value="export">Export</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" size="xs">
                <Avatar.Root>
                  <Avatar.Fallback name={user?.name} />
                  {/* <Avatar.Image src={user?.pic} /> */}
                </Avatar.Root>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Popover.Root
                    open={isPopoverOpen}
                    onOpenChange={(e) => setPopoverOpen(e.open)}
                  >
                    <Popover.Trigger asChild>
                      <Button size="sm" variant="outline">
                        {user?.user?.name || "My Profile"}
                      </Button>
                    </Popover.Trigger>
                    <Portal>
                      <Popover.Positioner>
                        <Popover.Content>
                          <Popover.Arrow />
                          <Popover.Body fontcolor="black">
                            <Text> hello {user?.user?.name}</Text>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover.Positioner>
                    </Portal>
                  </Popover.Root>
                  <Menu.Separator />
                  <Menu.Item value="new-file" onClick={logoutHandler}>
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
