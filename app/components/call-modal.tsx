import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { IconPhoneOff, IconPhonePause } from "@tabler/icons-react";
import { useState } from "react";

interface Props {
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  isOpen: boolean;
  onOpen?: () => void;
  onOpenChange: () => void;
  onClickEndCall: () => void;
  onClickPause: () => void;
}
export default function CallModal({ profiles, ...props }: Props) {
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => {
    setIsPaused((prev) => !prev);
    props.onClickPause();
  };

  return (
    <Modal
      hideCloseButton
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      placement="center"
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Calling {profiles.full_name}</ModalHeader>
            <ModalBody className="space-y-3 py-5">
              <Avatar
                src={profiles.avatar_url}
                alt={profiles.full_name}
                size="lg"
                className="mx-auto"
              />
              <div className="flex justify-center gap-3">
                <Button
                  onPress={() => {
                    props.onClickEndCall();
                    onClose();
                  }}
                  isIconOnly
                  color="danger"
                >
                  <IconPhoneOff />
                </Button>
                <Button
                  onClick={handlePause}
                  isIconOnly
                  color="primary"
                  variant={isPaused ? "solid" : "flat"}
                >
                  <IconPhonePause />
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
