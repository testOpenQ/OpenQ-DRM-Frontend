import Image from "next/image";
import ConnectGithub from "../ConnectGithub";
import NavigationLink from "./NavigationLink";

export default function Navigation() {
  return (
    <div className="mt-6 mb-24 flex items-center p-3 text-white">
      <Image
        src="/openq-logo-white.png"
        alt="OpenQ"
        width="31"
        height="31"
        className="mr-3 h-auto w-auto"
      />
      <div className="text-xl font-bold">OpenQ DRM</div>
      <div className="ml-12 mr-6 space-x-3">
        <NavigationLink href="/">Overview</NavigationLink>
        <NavigationLink href="/campaigns">Campaigns</NavigationLink>
        <NavigationLink href="/repos">Repositories</NavigationLink>
        <NavigationLink href="/users">Users</NavigationLink>
      </div>
      <ConnectGithub />
    </div>
  );
}
