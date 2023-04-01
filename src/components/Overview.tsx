import { Campaign, addCampaign } from "~/db";
import { useRouter } from "next/router";
import { useState } from "react";
import Headline from "./layout/Headline";
import Link from "next/link";
import { CodeBracketIcon, UsersIcon } from "@heroicons/react/24/outline";

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
      <div className="grid grid-cols-2 gap-3">
        {campaigns.map((campaign) => (
          <Link
            href={`/campaigns/${campaign.id}`}
            key={campaign.id}
            className="group flex w-full max-w-md items-center whitespace-nowrap rounded-xl bg-indigo-900 p-6 transition-all hover:bg-indigo-800"
          >
            <h2 className="text-2xl font-bold">{campaign.name}</h2>
            <CodeBracketIcon className="ml-auto mr-1 h-6 w-6 text-indigo-500" />{" "}
            6
            <UsersIcon className="ml-3 mr-1 h-6 w-6 text-indigo-500" /> 28
          </Link>
        ))}
      </div>
    </div>
  );
}
