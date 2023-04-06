import { Campaign } from "~/db";
import Headline from "./layout/Headline";
import Card from "./campaigns/Card";

export default function Overview({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <>
      <Headline>Overview</Headline>
      <div className="grid grid-cols-2 gap-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </>
  );
}
