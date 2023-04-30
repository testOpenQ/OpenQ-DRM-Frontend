import type { Campaign } from "~/db";
import Headline from "./layout/Headline";
import DiscreetButton from "./base/DiscreetButton";
import Link from "next/link";
import { EyeIcon, PlusIcon } from "@heroicons/react/24/outline";
import CampaignsOverview from "./overview/Campaigns";
import EvaluationsOverview from "./overview/Evaluations";
import useLocalStorage from "~/hooks/useLocalstorage";

export default function Overview({ campaigns }: { campaigns: Campaign[] }) {
  const [viewMode, setViewMode] = useLocalStorage<"campaigns" | "evaluations">(
    "ui.overview.viewMode",
    "campaigns"
  );

  return (
    <>
      <Headline>
        {viewMode === "campaigns" ? "Campaigns" : "Evaluations"}{" "}
        <div className="ml-auto flex">
          <DiscreetButton
            onClick={() =>
              setViewMode(
                viewMode === "campaigns" ? "evaluations" : "campaigns"
              )
            }
          >
            <EyeIcon className="mr-2 h-5 w-5" />
            {viewMode === "campaigns" ? "Evaluations" : "Campaigns"}
          </DiscreetButton>
          <Link href={`/campaigns/new`} className="ml-3">
            <DiscreetButton className="hover:!bg-indigo-900">
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Campaign
            </DiscreetButton>
          </Link>
        </div>
      </Headline>
      {viewMode === "campaigns" ? (
        <CampaignsOverview campaigns={campaigns} />
      ) : (
        <EvaluationsOverview campaigns={campaigns} />
      )}
    </>
  );
}
