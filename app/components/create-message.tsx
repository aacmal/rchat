import { Button, Input } from "@nextui-org/react";
import { Form, useSubmit } from "@remix-run/react";
import { IconSend } from "@tabler/icons-react";

interface Props {
  recipientId: string;
}
export default function CreateMessage({ recipientId }: Props) {
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
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          inputMode="text"
          isClearable
          classNames={{
            inputWrapper: "h-unit-12",
          }}
          name="message"
          type="text"
          minLength={2}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e.currentTarget.form);
              e.currentTarget.form.reset();
            }
          }}
          required
        />
        <input type="hidden" name="recipient_id" defaultValue={recipientId} />
        <Button
          tabIndex={-1}
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
