import { useLatestEvaluation } from "~/store/EvaluationProvider";
import CardMember from "./Member";
import { RepoEvaluation } from "~/db";
import WaitingForFirstEvaluation from "./WaitingForFirstEvaluation";

export default function CardMembers() {
  const latestEvaluation = useLatestEvaluation<RepoEvaluation>();

  const authors = latestEvaluation?.result?.authors || [];

  if (!latestEvaluation) {
    return (
      <div className="flex grow flex-col items-center justify-center px-12">
        <WaitingForFirstEvaluation />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center -space-x-3 p-3">
      {authors[0] && (
        <CardMember
          avatarUrl={authors[0].user.avatarUrl}
          className="z-10 h-12 w-12"
        />
      )}
      {authors[1] && (
        <CardMember
          avatarUrl={authors[1].user.avatarUrl}
          className="z-20 h-14 w-14"
        />
      )}
      {authors[2] && (
        <CardMember
          avatarUrl={authors[2].user.avatarUrl}
          className="z-30 h-16 w-16"
        />
      )}
      {authors[3] && (
        <CardMember
          avatarUrl={authors[3].user.avatarUrl}
          className="z-20 h-14 w-14"
        />
      )}
      {authors[4] && (
        <CardMember
          avatarUrl={authors[4].user.avatarUrl}
          className="z-10 h-12 w-12"
        />
      )}
      {authors.length > 5 && (
        <div
          className="z-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-600 bg-cover font-bold"
          style={{
            boxShadow: "0 0 0 1px #ccc, 0 0 5px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          +{authors.length - 5}
        </div>
      )}
    </div>
  );
}
