import { addCampaign } from "~/db";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "./base/Button";
import Input from "./base/Input";
import Headline from "./layout/Headline";

export default function Welcome() {
  const router = useRouter();

  const [campaignName, setCampaignName] = useState("");

  function handleAddCampaign() {
    setCampaignName("");
    addCampaign({ name: campaignName })
      .then((id) => {
        router
          .push(`/campaigns/${id.toString()}`)
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="max-w-3xl">
      <Headline>Welcome</Headline>
      <h1 className="text-3xl font-bold text-indigo-700">
        Create your first campaign
      </h1>
      <p className="text-2xl text-gray-400">
        Track and compare repositories and developers.
      </p>
      <div className="mt-6">
        <Input
          value={campaignName}
          setValue={setCampaignName}
          placeholder="My first campaign"
        />
      </div>

      <div className="mt-4">
        <Button
          onClick={handleAddCampaign}
          disabled={campaignName.length === 0}
          className="ml-auto"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
