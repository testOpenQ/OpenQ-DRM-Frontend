import Welcome from "./Welcome";
import Overview from "./Overview";
import { useCampaigns } from "~/store/CampaignsProvider";

export default function WelcomeModal() {
  const campaigns = useCampaigns();

  return campaigns.length > 0 ? (
    <Overview campaigns={campaigns} />
  ) : (
    <Welcome />
  );
}
