import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { IconPhoneOff } from "@tabler/icons-react";

interface Props {
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  isOpen: boolean;
  onOpen?: () => void;
  onOpenChange: () => void;
}
export default function CallModal({ profiles, ...props }: Props) {
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
            <ModalHeader>Call {profiles.full_name}</ModalHeader>
            <ModalBody className="space-y-3 py-5">
              <Avatar
                src={profiles.avatar_url}
                alt={profiles.full_name}
                size="lg"
                className="mx-auto"
              />
              <Button
                onPress={onClose}
                className="mx-auto"
                isIconOnly
                color="danger"
              >
                <IconPhoneOff />
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
