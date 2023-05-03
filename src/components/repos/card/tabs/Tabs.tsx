import { useState } from "react";
import type { Repo } from "~/store/model";
import ChangesTab from "./Changes";
import DiscreetButton from "../../../base/DiscreetButton";
import DevelopersTab from "./Developers";

enum CardTabs {
  Changes = "changes",
  Conversation = "conversation",
  Developers = "developers",
}

export default function Tabs({ repo }: { repo: Repo }) {
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
            showTab === CardTabs.Changes
              ? "!bg-gray-900/50 !text-gray-300 hover:!bg-gray-900/50"
              : ""
          }`}
          onClick={() => handleClickTab(CardTabs.Changes)}
        >
          Changes
        </DiscreetButton>
        <DiscreetButton
          className={`w-full !rounded-b-none text-sm font-normal ${
            showTab === CardTabs.Conversation
              ? "!bg-gray-900/50 !text-gray-300 hover:!bg-gray-900/50"
              : ""
          }`}
          onClick={() => handleClickTab(CardTabs.Conversation)}
          disabled
        >
          Conversation
        </DiscreetButton>
        <DiscreetButton
          className={`w-full !rounded-b-none !rounded-tr-none text-sm font-normal ${
            showTab === CardTabs.Developers
              ? "!bg-gray-900/50 !text-gray-300 hover:!bg-gray-900/50"
              : ""
          }`}
          onClick={() => handleClickTab(CardTabs.Developers)}
        >
          Developers
        </DiscreetButton>
      </div>
      <div
        className={`${
          showTab === "changes" ? "" : "max-h-0"
        } overflow-auto bg-gray-900/50 transition-all`}
      >
        <ChangesTab repo={repo} />
      </div>
      <div
        className={`${
          showTab === "developers" ? "" : "max-h-0"
        } overflow-auto bg-gray-900/50 transition-all`}
      >
        <DevelopersTab />
      </div>
    </div>
  );
}
