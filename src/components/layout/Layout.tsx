import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex max-h-screen grow flex-col items-center overflow-auto bg-gray-900 p-12">
        <div className="w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
