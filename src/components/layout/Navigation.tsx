import Image from "next/image";
import NavigationLink from "./NavigationLink";

export default function Navigation() {
  return (
    <div className="flex text-white items-center p-3 mt-6 mb-24">
      <Image src='/openq-logo-white.png' alt='OpenQ' width='31' height='31' className="mr-3" />
      <div className="font-bold text-xl">
        OpenQ DRM
      </div>
      <div className="ml-12 space-x-3">
        <NavigationLink href="/">Overview</NavigationLink>
        <NavigationLink href="/campaigns">Campaigns</NavigationLink>
      </div>
    </div>
  );
}
