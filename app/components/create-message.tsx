import { Button, Input } from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

export default function CreateMessage() {
  const formRef = useRef<HTMLFormElement>();

  useEffect(() => {
    const form = formRef.current;

    function reset(event: SubmitEvent) {
      event.preventDefault();
      formRef.current?.reset();
    }

    form?.addEventListener("submit", reset);

    return () => {
      form?.removeEventListener("submit", reset);
    };
  }, []);

  return (
    <div className="sticky bottom-0 mx-auto w-full max-w-screen-lg">
      <Form method="post" className="flex gap-3 bg-background p-3">
        <Input
          isClearable
          classNames={{
            inputWrapper: "h-unit-12",
          }}
          placeholder="Type a message..."
          name="message"
          min={1}
        />
        <Button type="submit" isIconOnly size="lg" color="primary">
          <IconSend />
        </Button>
      </Form>
    </div>
  );
}
