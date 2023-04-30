import { useState } from "react";
import { type Repo } from "~/db";
import ChangesTab from "./Changes";
import DiscreetButton from "../../../base/DiscreetButton";
import { RepoEvaluationResult } from "~/lib/github/repo/evaluate";

enum CardTabs {
  Changes = "changes",
  Issues = "issues",
  Discussions = "discussions",
  Developers = "developers",
}

export default function Tabs({
  repo,
  evaluationResult,
}: {
  repo: Repo;
  evaluationResult: RepoEvaluationResult;
}) {
  const [showTab, setShowTab] = useState<CardTabs | null>(null);

  function handleClickTab(tab: CardTabs) {
    if (showTab === tab) setShowTab(null);
    else setShowTab(tab);
  }

  return (
    <div className="text-xs">
      <div className="flex">
        <DiscreetButton
          className={`w-full !rounded-b-none !rounded-tl-none text-sm font-normal ${
            showTab === CardTabs.Changes ? "!bg-gray-900/50 !text-gray-300" : ""
          }`}
          onClick={() => handleClickTab(CardTabs.Changes)}
        >
          Changes
        </DiscreetButton>
        <DiscreetButton
          className={`w-full !rounded-b-none text-sm font-normal ${
            showTab === CardTabs.Issues ? "!bg-gray-900/50 !text-gray-300" : ""
          }`}
          onClick={() => handleClickTab(CardTabs.Issues)}
          disabled
        >
          Issues
        </DiscreetButton>
        <DiscreetButton
          className={`w-full !rounded-b-none text-sm font-normal ${
            showTab === CardTabs.Discussions
              ? "!bg-gray-900/50 !text-gray-300"
              : ""
          }`}
          onClick={() => handleClickTab(CardTabs.Discussions)}
          disabled
        >
          Discussions
        </DiscreetButton>
        <DiscreetButton
          className={`w-full !rounded-b-none !rounded-tr-none text-sm font-normal ${
            showTab === CardTabs.Developers
              ? "!bg-gray-900/50 !text-gray-300"
              : ""
          }`}
          onClick={() => handleClickTab(CardTabs.Developers)}
          disabled
        >
          Developers
        </DiscreetButton>
      </div>
      <div
        className={`${
          showTab === "changes" ? "" : "max-h-0"
        } overflow-auto bg-gray-900/50 transition-all`}
      >
        <ChangesTab repo={repo} evaluationResult={evaluationResult} />
      </div>
    </div>
  );
}
