import dynamic from "next/dynamic";

const New = dynamic(() => import("~/components/campaigns/New"), {
  ssr: false,
});

export default () => {
  return <New />;
};
