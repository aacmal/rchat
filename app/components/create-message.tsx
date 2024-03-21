import { Button, Input } from "@nextui-org/react";
import { Form, useSubmit } from "@remix-run/react";
import { IconSend } from "@tabler/icons-react";

export default function CreateMessage() {
  const submit = useSubmit();

  return (
    <div className="sticky bottom-0 mx-auto w-full max-w-screen-lg">
      <Form
        onSubmit={(e) => {
          submit(e.currentTarget);
          e.currentTarget.reset();
        }}
        method="post"
        className="flex gap-3 bg-background pb-3 pt-3"
      >
        <Input
          inputMode="text"
          isClearable
          classNames={{
            inputWrapper: "h-unit-12",
          }}
          name="message"
          type="text"
          minLength={2}
          placeholder="Type a message..."
          required
        />
        <Button type="submit" isIconOnly size="lg" color="primary">
          <IconSend />
        </Button>
      </Form>
    </div>
  );
}
