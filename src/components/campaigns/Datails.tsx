import { getCampaign } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import Button from "../base/Button";
import {
  CodeBracketIcon,
  PencilIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default function CampaignsDetails({
  campaignId,
}: {
  campaignId: string;
}) {
  const campaign = useLiveQuery(getCampaign(campaignId));

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <>
      <h1 className="mb-12 flex text-3xl font-bold">
        {campaign.name}
        <div className="ml-2">
          <Button className="bg-transparent hover:!bg-gray-800">
            <PencilIcon className="h-5 w-5 text-sky-700 transition-all group-hover:text-sky-600" />
          </Button>
        </div>
      </h1>
      <div className="flex w-full max-w-md items-center space-x-3">
        <Button>
          <CodeBracketIcon className="mr-2 h-5 w-5 text-sky-700 transition-all group-hover:text-sky-600" />
          Track Repositories
        </Button>
        <Button>
          <UsersIcon className="mr-2 h-5 w-5 text-sky-700 transition-all group-hover:text-sky-600" />
          Track Developers
        </Button>
      </div>
    </>
  );
}
