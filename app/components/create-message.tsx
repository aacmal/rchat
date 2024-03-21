import { Button, Input } from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";

export default function CreateMessage() {
  const [input, setInput] = useState("");

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
          minLength={1}
          required
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <Button
          disabled={input.length === 0}
          type="submit"
          isIconOnly
          size="lg"
          color="primary"
        >
          <IconSend />
        </Button>
      </Form>
    </div>
  );
}
