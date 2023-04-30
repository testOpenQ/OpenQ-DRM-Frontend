import { addCampaign } from "~/db";
import { useRouter } from "next/router";
import { useState } from "react";
import Headline from "../layout/Headline";
import Input from "../base/Input";
import Button from "../base/Button";

export default function Welcome() {
  const router = useRouter();

  const [campaignName, setCampaignName] = useState("");

  function handleAddCampaign() {
    setCampaignName("");
    addCampaign({
      name: campaignName,
      repoIds: [],
      userIds: [],
      orgIds: [],
    })
      .then((id) => {
        router
          .push(`/campaigns/${id.toString()}`)
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="max-w-3xl">
      <Headline>Add new campaign</Headline>
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
