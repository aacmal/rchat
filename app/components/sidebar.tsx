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
import { IconMail, IconUserPlus } from "@tabler/icons-react";
import { FormEvent, useCallback, useId, useState } from "react";
import { Function } from "~/constants/supabase";
import { OutletContext } from "~/types";
import { cn } from "~/utils/cn";

import MyProfile from "./my-profile";

export default function Sidebar() {
  const { conversations } = useOutletContext<OutletContext>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const formId = useId();
  const { supabase, session } = useOutletContext<OutletContext>();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <aside className="sticky top-0 hidden h-screen w-fit max-w-xs py-3 md:block lg:w-2/6">
      <div className="flex h-full w-fit flex-col items-center rounded-xl border border-default-100 bg-default-50 p-3 lg:w-full lg:items-stretch lg:p-5">
        <MyProfile />
        <Divider className="my-6" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="hidden text-lg font-bold lg:inline">Chats</h2>
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
                    Add new chat
                  </ModalHeader>
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
                </>
              }
            </ModalContent>
          </Modal>
        </div>
        <ul className="space-y-3">
          {conversations?.length === 0 ? (
            <li className="text-sm">You doesn&apos;s have conversation yet</li>
          ) : (
            conversations?.map((contact) => {
              // Exclude the current user from the profiles
              const excluded = contact.profiles.filter(
                (profile) => profile.id !== session.user.id,
              );
              if (excluded.length === 1) {
                return (
                  <li key={excluded[0].id}>
                    <NavLink
                      to={`/c/${contact.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex w-fit items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-default-200 hover:bg-default-100 lg:w-full",
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
                      <div className="hidden lg:block">
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
