import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useOutletContext, useRevalidator } from "@remix-run/react";
import { IconMail } from "@tabler/icons-react";
import { FormEvent, useCallback, useId, useState } from "react";
import { Function } from "~/constants/supabase";
import { OutletContext } from "~/types";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}
export default function CreateConversation({
  isOpen,
  onOpen,
  onOpenChange,
}: Props) {
  const { supabase, session } = useOutletContext<OutletContext>();
  const { revalidate } = useRevalidator();

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formId = useId();

  const addConversation = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsAdding(true);
      const formData = new FormData(e.currentTarget);
      const participant1Id = formData.get("participant1Id") as string;
      const participant2Email = formData.get("participant2Email") as string;

      const profileData = await supabase
        .from("profiles")
        .select("id")
        .filter("email", "eq", participant2Email)
        .single();

      if (!profileData.data) {
        setError("User not found");
        setIsAdding(false);
        return;
      }

      const participant2Id = profileData.data?.id;

      supabase
        .rpc(Function.CreateConversation, {
          participant1: participant1Id,
          participant2: participant2Id,
        })
        .then(() => {
          setIsAdding(false);
          revalidate();
          onOpen();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supabase],
  );
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add new chat</ModalHeader>
        <ModalBody>
          <form onSubmit={addConversation} id={formId}>
            <Input
              endContent={<IconMail />}
              placeholder="Enter user email"
              name="participant2Email"
              errorMessage={error}
              type="email"
            />
            <input
              name="participant1Id"
              type="hidden"
              value={session.user.id}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isAdding}
            disabled={isAdding}
            type="submit"
            form={formId}
            color="primary"
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
