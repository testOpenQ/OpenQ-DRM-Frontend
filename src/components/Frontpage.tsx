import { getCampaigns } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import Welcome from "./Welcome";
import Overview from "./Overview";

export default function WelcomeModal() {
  const campaigns = useLiveQuery(getCampaigns);

  return campaigns && campaigns.length > 0 ? (
    <Overview campaigns={campaigns} />
  ) : (
    <Welcome />
  );
}
