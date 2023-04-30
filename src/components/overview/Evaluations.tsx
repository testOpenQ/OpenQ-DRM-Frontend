import { Campaign, Repo, getRepos } from "~/db";
import RepoCard from "../repos/card/Card";
import { useEffect, useState } from "react";
import { ScoresProvider } from "~/store/ScoresProvider";

export default function EvaluationsOverview({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  const repoIds = campaigns.map((campaign) => campaign.repoIds).flat();
  const uniqueRepoIds = [...new Set(repoIds)];
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    getRepos(uniqueRepoIds).then((repos) => setRepos(repos));
  }, [uniqueRepoIds]);

  return (
    <ScoresProvider>
      <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </ScoresProvider>
  );
}
