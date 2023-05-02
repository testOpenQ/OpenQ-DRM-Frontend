import { type Campaign, type Repo } from "~/store/model";
import { getRepos } from "~/store";
import RepoCard from "../repos/card/Card";
import { useEffect, useState } from "react";
import { ScoresProvider } from "~/providers/ScoresProvider";
import { EvaluationProvider } from "~/providers/EvaluationProvider";

export default function EvaluationsOverview({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  const repoIds = campaigns.map((campaign) => campaign.repoIds).flat();
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const uniqueRepoIds = [...new Set(repoIds)];
    getRepos(uniqueRepoIds)
      .then((repos) => setRepos(repos))
      .catch(console.error);
  });

  return (
    <ScoresProvider>
      <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {repos.map((repo) => (
          <EvaluationProvider target={repo} type="repo" key={repo.id}>
            <RepoCard repo={repo} />
          </EvaluationProvider>
        ))}
      </div>
    </ScoresProvider>
  );
}
