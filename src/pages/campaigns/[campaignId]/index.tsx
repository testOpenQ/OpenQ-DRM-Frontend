import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const DetailsWrapper = dynamic(
  () => import("~/components/campaigns/DetailsWrapper"),
  {
    ssr: false,
  }
);

export default function CampaignPage() {
  const router = useRouter();
  const { campaignId } = router.query;

  if (!campaignId) return <>Loading...</>;

  if (Array.isArray(campaignId)) return <>Invalid campaign id.</>;

  return (
    <>
      <DetailsWrapper campaignId={campaignId} />
    </>
  );
}
