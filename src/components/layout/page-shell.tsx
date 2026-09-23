// Temporary placeholder layout for pages that haven't been designed yet.
export function PageShell({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
      {children}
    </section>
  );
}
