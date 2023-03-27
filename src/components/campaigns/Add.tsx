import { addCampaign } from "@mktcodelib/github-insights";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "../base/Button";
import Input from "../base/Input";

export default function AddUser() {
  const [campaignName, setCampaignName] = useState("");

  function handleAddCampaign() {
    setCampaignName("");
    addCampaign(campaignName).catch((err) => {
      console.log(err);
    });
  }

  return (
    <div className="flex w-full">
      <Input
        value={campaignName}
        setValue={setCampaignName}
        placeholder="My new campaign"
      />
      <div className="ml-3">
        <Button onClick={handleAddCampaign}>
          <PlusSmallIcon className="h-6 w-6 text-violet-700 transition-all group-hover:text-violet-100" />
        </Button>
      </div>
    </div>
  );
}
