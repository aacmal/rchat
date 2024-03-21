import {
  Avatar,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { NavLink, useOutletContext } from "@remix-run/react";
import { Session } from "@supabase/supabase-js";
import { IconMail, IconUserPlus } from "@tabler/icons-react";
import { FormEvent, useCallback, useId, useState } from "react";
import { Function } from "~/constants/supabase";
import { Conversation, OutletContext } from "~/types";
import { cn } from "~/utils/cn";

interface Props {
  data: Conversation[];
  currentSession: Session;
}
export default function Sidebar({ currentSession, data }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const formId = useId();
  const { supabase } = useOutletContext<OutletContext>();
  const [isAdding, setIsAdding] = useState(false);

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

      const participant2Id = profileData.data?.id;

      await supabase
        .rpc(Function.CreateConversation, {
          participant1: participant1Id,
          participant2: participant2Id,
        })
        .then(() => {
          setIsAdding(false);
        });
    },
    [supabase],
  );

  return (
    <aside className="sticky top-0 h-screen w-2/6 max-w-xs p-3">
      <div className="h-full w-full rounded-xl border border-default-100 bg-default-50 p-5">
        <Avatar
          src={currentSession.user?.user_metadata.avatar_url}
          name={currentSession.user.user_metadata.full_name}
          alt={`Avatar of ${currentSession.user.user_metadata.full_name}`}
          className="mx-auto"
        />
        <Divider className="my-6" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Contacts</h2>
          <Button onPress={onOpen} variant="flat" isIconOnly>
            <IconUserPlus />
          </Button>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Add new contact
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={addConversation} id={formId}>
                      <Input
                        endContent={<IconMail />}
                        placeholder="Enter user email"
                        name="participant2Email"
                      />
                      <input
                        name="participant1Id"
                        type="hidden"
                        value={currentSession.user.id}
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
                </>
              }
            </ModalContent>
          </Modal>
        </div>
        <ul className="space-y-3">
          {data?.length === 0 ? (
            <li className="text-sm">You doesn&apos;s have conversation yet</li>
          ) : (
            data?.map((contact) => {
              // Exclude the current user from the profiles
              const excluded = contact.profiles.filter(
                (profile) => profile.id !== currentSession.user.id,
              );
              if (excluded.length === 1) {
                return (
                  <li key={excluded[0].id}>
                    <NavLink
                      to={`/${contact.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-default-200 hover:bg-default-100",
                          {
                            "border-default-200 bg-default-100": isActive,
                          },
                        )
                      }
                    >
                      <Avatar
                        src={excluded[0].photo_url}
                        name={excluded[0].full_name}
                        alt={`Avatar of ${excluded[0].full_name}`}
                      />
                      <div>
                        <h3 className="text-sm font-medium">
                          {excluded[0].full_name}
                        </h3>
                        <p className="text-sm text-default-500">
                          {excluded[0].email}
                        </p>
                      </div>
                    </NavLink>
                  </li>
                );
              }
              return null;
            })
          )}
        </ul>
      </div>
    </aside>
  );
}
