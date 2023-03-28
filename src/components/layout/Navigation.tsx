import Image from "next/image";
import ConnectGithub from "../ConnectGithub";
import NavigationLink from "./NavigationLink";

export default function Navigation() {
  return (
    <div className="flex items-center border-b border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-gray-400">
      <Image
        src="/openq-logo-white.png"
        alt="OpenQ"
        width="24"
        height="24"
        className="mr-3 h-6 w-6"
      />
      <div className="mr-auto">
        <NavigationLink href="https://openq.dev">Explore</NavigationLink>
        <NavigationLink href="https://openq.dev/marketplace">
          Marketplace
        </NavigationLink>
        <NavigationLink href="https://openq.dev/hackathons">
          Hackathons
        </NavigationLink>
        <NavigationLink href="https://openq.dev/good-first-issues">
          Good First Issues
        </NavigationLink>
      </div>
      <ConnectGithub />
    </div>
  );
}
