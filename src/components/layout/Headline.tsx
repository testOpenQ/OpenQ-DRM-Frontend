export default function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="flex items-center text-5xl font-bold leading-loose">
      {children}
    </h1>
  );
}
