import type { Campaign } from "~/db";
import Headline from "./layout/Headline";
import Card from "./campaigns/Card";
import DiscreetButton from "./base/DiscreetButton";
import Link from "next/link";
import { EyeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Overview({ campaigns }: { campaigns: Campaign[] }) {
  const [viewMode, setViewMode] = useState<"campaigns" | "evaluations">(
    "campaigns"
  );

  return (
    <>
      <Headline>
        Overview
        <div className="ml-auto flex">
          <DiscreetButton
            onClick={() =>
              setViewMode(
                viewMode === "campaigns" ? "evaluations" : "campaigns"
              )
            }
          >
            <EyeIcon className="mr-2 h-5 w-5" />
            {viewMode === "campaigns" ? "Campaigns" : "Evaluations"}
          </DiscreetButton>
          <Link href={`/campaigns/new`} className="ml-3">
            <DiscreetButton className="hover:!bg-indigo-900">
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Campaign
            </DiscreetButton>
          </Link>
        </div>
      </Headline>
      <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </>
  );
}
