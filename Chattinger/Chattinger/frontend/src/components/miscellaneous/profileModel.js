import React from "react";
import {
  IconButton,
  useDisclosure,
  Dialog,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Button,
} from "@chakra-ui/react";

import { Popover, Portal } from "@chakra-ui/react";
import { useState } from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<i class="fa-solid fa-bell"></i>}
          onClick={onOpen}
        />
      )}
      <Popover.Root
        open={isPopoverOpen}
        onOpenChange={(e) => setPopoverOpen(e.open)}
      >
        <Popover.Trigger asChild>
          <Button size="sm" variant="outline">
            My Profile
          </Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow />
              <Popover.Body>{user.name}</Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </>
  );
};

export default ProfileModal;
