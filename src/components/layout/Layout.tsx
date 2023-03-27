import Navigation from "./Navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen flex-col items-center px-24">
      <Navigation />
      {children}
    </main>
  );
}
