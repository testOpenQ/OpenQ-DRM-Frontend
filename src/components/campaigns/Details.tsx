import { type Campaign, type Repo, type User, saveCampaign } from "~/db";
import {
  PencilIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Headline from "../layout/Headline";
import RepoCard from "../repos/card/Card";
import DiscreetButton from "../base/DiscreetButton";
import Link from "next/link";
import { useMemo, useState } from "react";
import Input from "../base/Input";
import DeleteButton from "./DeleteButton";

export default function CampaignsDetails({
  campaign,
  repos,
}: {
  campaign: Campaign;
  repos: Repo[];
  users: User[];
}) {
  const since = useMemo(() => {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setMonth(since.getMonth() - 1);
    return since.toISOString();
  }, []);

  const until = useMemo(() => {
    const until = new Date();
    until.setHours(0, 0, 0, 0);
    return until.toISOString();
  }, []);

  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(campaign.name);

  const [scores, setScores] = useState<{
    [repoId: string]: { [category: string]: number };
  }>({});
  const scoreRanks = useMemo<{
    [repoId: string]: { [category: string]: number };
  }>(() => {
    // TODO: Fix type complaints
    const ranks: { [repoId: string]: { [category: string]: number } } = {};

    const minScores: { [category: string]: number } = {};
    const maxScores: { [category: string]: number } = {};

    for (const repoId in scores) {
      for (const category in scores[repoId]) {
        const score = scores[repoId]![category];
        if (!minScores[category] || score < minScores[category]) {
          minScores[category] = score;
        }
        if (!maxScores[category] || score > maxScores[category]) {
          maxScores[category] = score;
        }
      }
    }

    for (const repoId in scores) {
      ranks[repoId] = {};
      for (const category in scores[repoId]) {
        const score = scores[repoId][category];
        const minScore = minScores[category];
        const maxScore = maxScores[category];
        ranks[repoId][category] =
          (10 * (score - minScore)) / (maxScore - minScore);
      }
    }

    return ranks;
  }, [scores]);

  const submitScore = (repoId: number, score: number, category: string) => {
    setScores((scores) => ({
      ...scores,
      [repoId]: {
        ...scores[repoId],
        [category]: score,
      },
    }));
  };

  function handleSaveName() {
    if (!campaign) return;
    setEditName(false);
    campaign.name = name;
    saveCampaign(campaign).catch(console.error);
  }

  return (
    <>
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

      {repos.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-indigo-700">Repositories</h2>
          <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {repos.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                since={since}
                until={until}
                ranks={scoreRanks[repo.id] || {}}
                submitScore={(score: number, category: string) =>
                  submitScore(repo.id, score, category)
                }
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
