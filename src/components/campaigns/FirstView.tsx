import { addRepo, addUser, deleteCampaign, getCampaign } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import Button from "../base/Button";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import GithubSearch from "../layout/GithubSearch";
import Textarea from "../base/Textarea";
import { useState } from "react";
import Headline from "../layout/Headline";
import { useRouter } from "next/router";

export default function CampaignsDetails({
  campaignId,
}: {
  campaignId: string;
}) {
  const router = useRouter();
  const campaign = useLiveQuery(getCampaign(campaignId));

  const [textareaInput, setTextareaInput] = useState<string>("");
  const [textareaInputRows, setTextareaInputRows] = useState<number>(2);

  const [users, setUsers] = useState<string[]>([]);
  const [repos, setRepos] = useState<string[]>([]);

  function handleSetTextareaInput(value: string) {
    const sanitizedInput = value
      .split("\n")
      .filter(Boolean)
      .map((url) => url.trim())
      .map((url) => url.replace(/https?:\/\/github\.com\/?/g, ""));

    sanitizedInput.forEach((url) => {
      if (url.includes("/")) {
        setRepos((repos) => [...repos, url]);
      } else {
        setUsers((users) => [...users, url]);
      }
      setUsers((users) => [...new Set(users)]);
      setRepos((repos) => [...new Set(repos)]);
    });

    setTextareaInputRows(Math.max(sanitizedInput.length + 1, 2));
    setTextareaInput(sanitizedInput.join("\n") + "\n");
  }

  function onSelectSearchResult(result: Record<string, any>) {
    const newInput = textareaInput.split("\n").filter(Boolean);
    newInput.push(result.html_url);

    handleSetTextareaInput(newInput.join("\n"));
  }

  function handleDeleteCampaign(id: number) {
    router
      .push("/")
      .then(() => deleteCampaign(id))
      .catch((err) => console.log(err));
  }

  function handleContinue() {
    if (!campaign) return;

    repos.forEach((repo) => {
      const [owner, name] = repo.split("/");
      if (!owner || !name) return;

      addRepo({ owner, name, campaignId: campaign.id });
    });

    users.forEach((user) => {
      addUser({ login: user, campaignId: campaign.id });
    });
  }

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <div className="max-w-2xl">
      <Headline>
        {campaign.name}
        <div className="ml-2">
          <Button className="!bg-transparent hover:!bg-gray-800">
            <PencilIcon className="h-5 w-5 text-indigo-700 transition-all group-hover:text-indigo-600" />
          </Button>
        </div>
        <div className="ml-auto">
          <Button onClick={() => handleDeleteCampaign(campaign.id)}>
            <TrashIcon className="h-5 w-5 transition-all" />
          </Button>
        </div>
      </Headline>
      <h1 className="text-3xl font-bold text-indigo-700">
        Add users and repositories to your campaign.
      </h1>
      <p className="text-2xl text-gray-400">
        Paste a list of GitHub URLs or use the search to find individual
        developers and repositories.
      </p>
      <div className="mb-3 mt-6">
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
      {(users.length > 0 || repos.length > 0) && (
        <div className="mb-3">
          <Button onClick={handleContinue}>Continue</Button>

          <div className="mt-12 grid grid-cols-2 gap-3">
            {repos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-indigo-700">
                  Repositories
                </h2>
                <ul className="list-inside list-disc">
                  {repos.map((repo) => (
                    <li key={repo}>{repo}</li>
                  ))}
                </ul>
              </div>
            )}
            {users.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-indigo-700">Users</h2>
                <ul className="list-inside list-disc">
                  {users.map((user) => (
                    <li key={user}>{user}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
