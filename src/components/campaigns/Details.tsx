import { getCampaign } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import Button from "../base/Button";
import { CodeBracketIcon, PencilIcon } from "@heroicons/react/24/outline";
import GithubSearch from "../layout/GithubSearch";
import Textarea from "../base/Textarea";
import { useState } from "react";

export default function CampaignsDetails({
  campaignId,
}: {
  campaignId: string;
}) {
  const campaign = useLiveQuery(getCampaign(campaignId));

  const [textareaInput, setTextareaInput] = useState<string>("");
  const [textareaInputRows, setTextareaInputRows] = useState<number>(2);

  function handleSetTextareaInput(value: string) {
    const sanitizedInput = value
      .split("\n")
      .filter(Boolean)
      .map((url) => url.trim())
      .map((url) => url.replace(/https?:\/\/github\.com\/?/g, ""));

    setTextareaInputRows(Math.max(sanitizedInput.length + 1, 2));
    setTextareaInput(sanitizedInput.join("\n") + "\n");
  }

  function onSelectSearchResult(result: Record<string, any>) {
    const newInput = textareaInput.split("\n").filter(Boolean);
    newInput.push(result.html_url);

    handleSetTextareaInput(newInput.join("\n"));
  }

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <div className="max-w-2xl">
      <h1 className="flex items-center text-5xl font-bold">
        {campaign.name}
        <div className="ml-2">
          <Button className="!bg-transparent hover:!bg-gray-800">
            <PencilIcon className="h-5 w-5 text-indigo-700 transition-all group-hover:text-indigo-600" />
          </Button>
        </div>
      </h1>
      <h2 className="mt-1 flex text-2xl text-indigo-700">
        Add users and repositories to your campaign.
      </h2>
      <p className="my-6 text-2xl text-gray-500">
        Paste a list of GitHub URLs or use the search to find developers and
        repositories you want to track.
      </p>
      <div className="mb-3">
        <GithubSearch onSelect={onSelectSearchResult} />
      </div>
      <div className="mb-3">
        <Textarea
          rows={textareaInputRows}
          value={textareaInput}
          setValue={handleSetTextareaInput}
          placeholder={`https://github.com/...\nhttps://github.com/...`}
        />
      </div>
    </div>
  );
}
