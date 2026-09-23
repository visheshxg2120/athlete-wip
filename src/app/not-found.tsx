import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-7xl flex-1 flex-col justify-center px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <Link href="/" className="mt-6 text-accent underline-offset-4 hover:underline">
        Back home
      </Link>
    </main>
  );
}
