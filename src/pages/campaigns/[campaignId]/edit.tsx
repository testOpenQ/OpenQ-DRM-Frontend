import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Edit = dynamic(() => import("~/components/campaigns/Edit"), {
  ssr: false,
});

export default function EditCampaignPage() {
  const router = useRouter();
  const { campaignId } = router.query;

  if (!campaignId) return <>Loading...</>;

  if (Array.isArray(campaignId)) return <>Invalid campaign id.</>;

  return (
    <>
      <Edit campaignId={campaignId} />
    </>
  );
}
