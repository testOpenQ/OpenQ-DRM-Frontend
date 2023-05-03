import { useState } from "react";
import type { Customer, User } from "~/lib/openQApi/types";
import Button from "../base/Button";
import Textarea from "../base/Textarea";
import Input from "../base/Input";
import axiosClient from "~/lib/axiosClient";
import { CREATE_EMAIL } from "~/lib/openQApi";
import type { Email } from "~/lib/openQApi/types";
import { useSession } from "next-auth/react";
import { useUser } from "~/store/UserProvider";

const CustomerIndividual = ({ customer }: { customer: Customer }) => {
  const [aliasEmail, showAliasEmail] = useState(false);
  const [sendMessage, showSendMessage] = useState(false);
  const [textareaInput, setTextareaInput] = useState("");

  const [emailStatus, setEmailStatus] = useState({ status: "idle" });
  const user = useUser() as User | null;
  console.log(user);
  const { data } = useSession();
  const [subject, setSubject] = useState("");
  if (!data?.accessToken) return <>div</>;
  const { accessToken } = data;

  const handleSetTextareaInput = (value: string) => {
    setTextareaInput(value);
  };
  const handleSendMessage = () => {
    type CreateEmailResponse = {
      createEmail: Email;
    };
    if (!user) return;
    axiosClient<CreateEmailResponse>(CREATE_EMAIL, accessToken, {
      subject,
      text: textareaInput,
      to: [customer.aliasEmail],
      from: user.invoicingEmail,
      customerId: customer.id,
      userId: user.id,
      html: textareaInput,
      sentByUser: true,
    })
      .then(() => {
        showSendMessage(false);
        setEmailStatus({ status: "success" });
      })
      .catch(() => setEmailStatus({ status: "failiure" }));
  };
  return (
    <li className="list-none bg-gray-800" key={customer.id}>
      <div className="flex flex-col gap-4 bg-gray-900/50 p-4">
        <div className="grid grid-cols-3 content-center items-center gap-4">
          <div>{customer.name}</div>
          <div>{customer.email}</div>

          {false && (
            <Button
              onClick={() => showAliasEmail(() => !aliasEmail)}
              className="ml-auto"
            >
              {aliasEmail ? "Hide" : "Show"} Alias Email
            </Button>
          )}
          <Button
            onClick={() => showSendMessage(() => !sendMessage)}
            className="ml-auto"
          >
            {sendMessage ? "Hide" : "Show"} Send Message
          </Button>
        </div>
        {sendMessage && (
          <>
            <Input
              placeholder="subject"
              value={subject}
              setValue={(value) => setSubject(value)}
            />
            <Textarea
              placeholder="body"
              rows={10}
              value={textareaInput}
              setValue={handleSetTextareaInput}
            />

            <Button onClick={handleSendMessage}>Send</Button>
          </>
        )}
        {emailStatus.status === "success" && <div>Success</div>}
        {true && <div>{customer.aliasEmail}</div>}
      </div>
    </li>
  );
};

export default CustomerIndividual;
