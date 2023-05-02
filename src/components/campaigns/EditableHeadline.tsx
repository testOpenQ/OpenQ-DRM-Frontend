import {
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { saveCampaign, type Campaign } from "~/db";
import DiscreetButton from "../base/DiscreetButton";
import Headline from "../layout/Headline";
import DeleteButton from "./DeleteButton";
import Input from "../base/Input";
import { useState } from "react";

export default function EditableHeadline({ campaign }: { campaign: Campaign }) {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(campaign.name);

  function handleSaveName() {
    if (!campaign) return;
    setEditName(false);
    campaign.name = name;
    saveCampaign(campaign).catch(console.error);
  }

  return (
    <Headline>
      <div className="mr-3 flex">
        {editName && (
          <Input value={name} setValue={setName} className="my-[21px]" />
        )}
        {!editName && <>{campaign.name}</>}
      </div>
      {editName && (
        <>
          <DiscreetButton onClick={handleSaveName}>
            <CheckIcon className="h-5 w-5" />
          </DiscreetButton>
          <DiscreetButton onClick={() => setEditName(false)}>
            <XMarkIcon className="h-5 w-5" />
          </DiscreetButton>
        </>
      )}
      {!editName && (
        <DiscreetButton onClick={() => setEditName(true)}>
          <PencilIcon className="h-5 w-5" />
        </DiscreetButton>
      )}
      <div className="ml-auto flex">
        <Link href={`/campaigns/${campaign.id}/edit`} className="ml-3">
          <DiscreetButton>
            <PlusIcon className="h-5 w-5" />
          </DiscreetButton>
        </Link>
        <DeleteButton campaign={campaign} />
      </div>
    </Headline>
  );
}
