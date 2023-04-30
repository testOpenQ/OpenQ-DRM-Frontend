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
  return (
    <>
      <EditableHeadline campaign={campaign} />

      {repos.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-indigo-700">Repositories</h2>
          <ScoresProvider>
            <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              {repos.map((repo) => (
                <RepoCard campaignId={campaign.id} key={repo.id} repo={repo} />
              ))}
            </div>
          </ScoresProvider>
        </>
      )}
    </>
  );
}
