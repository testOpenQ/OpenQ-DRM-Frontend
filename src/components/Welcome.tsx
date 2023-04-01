import { Dialog, Transition } from "@headlessui/react";
import { addCampaign, getCampaigns } from "~/db";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import Button from "./base/Button";
import Input from "./base/Input";
import { useLiveQuery } from "dexie-react-hooks";

export default function WelcomeModal() {
  const router = useRouter();

  const campaigns = useLiveQuery(getCampaigns);

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

  if (campaigns && campaigns.length > 0) {
    return null;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Create your first campaign</h1>
      <p className="mt-2 text-2xl text-gray-400">
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
        >
          Continue
          <div className="ml-auto mr-1 transition-all group-hover:mr-0 group-disabled:mr-1">
            →
          </div>
        </Button>
      </div>
    </div>
  );
}