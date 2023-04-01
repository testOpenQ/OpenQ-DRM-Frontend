import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const CampaignsDetails = dynamic(
  () => import("~/components/campaigns/Details"),
  {
    ssr: false,
  }
);

export default function Campaign() {
  const router = useRouter();
  const { campaignId } = router.query;

  if (!campaignId) return <>Loading...</>;

  if (Array.isArray(campaignId)) return <>Invalid campaign id.</>;

  return (
    <>
      <CampaignsDetails campaignId={campaignId} />
    </>
  );
}
