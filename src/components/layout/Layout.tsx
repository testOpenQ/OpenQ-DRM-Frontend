import Navigation from "./Navigation";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex grow">
        <Sidebar />
        <div className="w-full flex-1 bg-gray-900 p-6">
          <div className="mx-auto max-w-5xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
