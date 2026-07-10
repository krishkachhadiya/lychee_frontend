import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-4">
      <h1 className="text-4xl font-bold text-[var(--color-text)]">404</h1>
      <p className="text-[var(--color-text-muted)]">
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <Link href="/" className="btn btn-primary btn-sm">
        Back to Home
      </Link>
    </div>
  );
}
