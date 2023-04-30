import type { Campaign, Repo, User, Org } from "~/db";
import RepoCard from "../repos/card/Card";
import { useMemo } from "react";
import EditableHeadline from "./EditableHeadline";
import { ScoresProvider } from "~/store/ScoresProvider";

export default function CampaignsDetails({
  campaign,
  repos,
}: {
  campaign: Campaign;
  orgs: Org[];
  users: User[];
  repos: Repo[];
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

  return (
    <>
      <EditableHeadline campaign={campaign} />

      {repos.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-indigo-700">Repositories</h2>
          <ScoresProvider>
            <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              {repos.map((repo) => (
                <RepoCard
                  campaignId={campaign.id}
                  key={repo.id}
                  repo={repo}
                  since={since}
                  until={until}
                />
              ))}
            </div>
          </ScoresProvider>
        </>
      )}
    </>
  );
}
