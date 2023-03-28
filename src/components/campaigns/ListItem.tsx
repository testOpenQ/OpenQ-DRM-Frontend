import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteCampaign, type Campaign } from "~/db";
import Link from "next/link";
import Button from "../base/Button";

export default function ListItem({ campaign }: { campaign: Campaign }) {
  function handleRemoveCampaign() {
    deleteCampaign(campaign.id).catch((err) => console.log(err));
  }

  return (
    <div className="flex w-full space-x-3">
      <Link className="w-full" href={`/campaigns/${campaign.id}`}>
        <Button>{campaign.name}</Button>
      </Link>
      <Button className="flex-1" onClick={handleRemoveCampaign}>
        <TrashIcon className="h-6 w-6 text-violet-700 transition-all group-hover:text-violet-100" />
      </Button>
    </div>
  );
}
