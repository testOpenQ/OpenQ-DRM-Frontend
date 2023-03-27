import Navigation from "./Navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen px-24 flex-col items-center mx-auto">
      <Navigation />
      {children}
    </main>
  );
}
