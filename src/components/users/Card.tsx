import { UserEvaluation } from '@mktcodelib/github-insights';

export default function Card({ data }: { data: UserEvaluation }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="max-w-sm text-center">
        <p>
          Your repositories have received
          <span className="font-bold">{ data.stargazerCount }</span> stars and
          have been forked
          <span className="font-bold">{ data.forkCount }</span> times.
        </p>

        <p>
          Your followers' repositories have received
          <span className="font-bold">{ data.followersStargazerCount }</span>
          stars and have been forked
          <span className="font-bold">{ data.followersForkCount }</span> times.
          <span className="font-bold">{ data.followersFollowerCount }</span>
          people follow your followers.
        </p>

        <p>
          You contributed
          <span className="font-bold">{ data.mergedPullRequestCount }</span>
          merged pull requests,
          <span className="font-bold">{ data.mergedPullRequestCount365d }</span>
          in the last year and
          <span className="font-bold">{ data.mergedPullRequestCount30d }</span>
          in the last 30 days.
        </p>
      </div>
    </div>
  );
}
