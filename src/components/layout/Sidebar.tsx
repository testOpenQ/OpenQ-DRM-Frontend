import SidebarLink from "./SidebarLink";
import ScanInfo from "../ScanInfo";
import {
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  InformationCircleIcon,
  ChartPieIcon,
  RectangleGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import SidebarDivider from "./SidebarDivider";
import ConnectGithub from "../ConnectGithub";
import { useCampaigns } from "~/providers/CampaignsProvider";
import RateLimitInfo from "../RateLimitInfo";

export default function Sidebar() {
  const campaigns = useCampaigns();

  return (
    <div className="w-[320px] flex-none bg-gray-800">
      <div className="flex h-full flex-col whitespace-nowrap bg-gray-900/50">
        <ConnectGithub />
        <ScanInfo />
        <RateLimitInfo />
        <SidebarDivider />
        <SidebarLink href="/">
          <div className="mr-3 p-1.5">
            <RectangleGroupIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
          </div>
          Overview
        </SidebarLink>
        {campaigns?.map((campaign) => (
          <div key={campaign.id}>
            <SidebarLink href={`/campaigns/${campaign.id}`}>
              <div className="mr-3 p-1.5">
                <ChartPieIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
              </div>
              {campaign.name}
            </SidebarLink>
          </div>
        ))}
        <SidebarLink href="/users">
          <div className="mr-3 p-1.5">
            <InboxIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
          </div>
          Inbox
        </SidebarLink>
        <SidebarDivider />

        <SidebarDivider className="mt-auto" />
        <SidebarLink href="https://openq.dev/marketplace">
          <div className="mr-3 p-1.5">
            <BookOpenIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
          </div>
          Marketplace
          <div className="ml-auto p-1.5">
            <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-500" />
          </div>
        </SidebarLink>
        <SidebarLink href="https://openq.dev/hackathons">
          <div className="mr-3 p-1.5">
            <BookOpenIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
          </div>
          Hackathons
          <div className="ml-auto p-1.5">
            <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-500" />
          </div>
        </SidebarLink>
        <SidebarLink href="/">
          <div className="mr-3 p-1.5">
            <BookOpenIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
          </div>
          Documentation
          <div className="ml-auto p-1.5">
            <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-500" />
          </div>
        </SidebarLink>
        <SidebarLink href="/">
          <div className="mr-3 p-1.5">
            <InformationCircleIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
          </div>
          Contact
          <div className="ml-auto p-1.5">
            <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-500" />
          </div>
        </SidebarLink>
      </div>
    </div>
  );
}
