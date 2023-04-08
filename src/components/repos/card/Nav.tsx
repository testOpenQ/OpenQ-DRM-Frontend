import DiscreetButton from "../../base/DiscreetButton";

export default function CardNav({
  onClickChanges,
  onClickIssues,
  onClickDiscussions,
  onClickDevelopers,
}: {
  onClickChanges: () => void;
  onClickIssues: () => void;
  onClickDiscussions: () => void;
  onClickDevelopers: () => void;
}) {
  return (
    <div className="flex">
      <DiscreetButton
        className="w-full rounded-none text-sm font-normal"
        onClick={onClickChanges}
      >
        Changes
      </DiscreetButton>
      <DiscreetButton
        className="w-full rounded-none text-sm font-normal"
        onClick={onClickIssues}
      >
        Issues
      </DiscreetButton>
      <DiscreetButton
        className="w-full rounded-none text-sm font-normal"
        onClick={onClickDiscussions}
      >
        Discussions
      </DiscreetButton>
      <DiscreetButton
        className="w-full rounded-none text-sm font-normal"
        onClick={onClickDevelopers}
      >
        Developers
      </DiscreetButton>
    </div>
  );
}
