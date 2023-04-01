import { Campaign, addCampaign, deleteCampaign } from "~/db";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "./base/Button";
import Input from "./base/Input";
import Headline from "./layout/Headline";

export default function Overview({ campaigns }: { campaigns: Campaign[] }) {
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
      <Headline>Overview</Headline>
      <div className="grid grid-cols-3 gap-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-md border border-gray-300 p-4"
          >
            <h2 className="text-2xl font-bold">{campaign.name}</h2>

            <div className="flex justify-end">
              <Button
                onClick={() =>
                  router
                    .push(`/campaigns/${campaign.id.toString()}`)
                    .catch((err) => console.log(err))
                }
              >
                Open
              </Button>

              <Button onClick={() => deleteCampaign(campaign.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
