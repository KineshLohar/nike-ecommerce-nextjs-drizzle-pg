import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-[var(--color-light-100)] text-[color:var(--color-dark-900)] md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[var(--color-dark-900)] md:block">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.2)] via-[rgba(0,0,0,0.35)] to-[rgba(0,0,0,0.75)]" />
        <Image
          src="/hero-shoe.png"
          alt="Showcase sneaker"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 flex h-full flex-col justify-between px-10 py-10 text-[color:var(--color-light-100)]">
          <Image src="/logo.svg" alt="Brand logo" width={64} height={24} className="h-6 w-auto" />
          <div className="space-y-4">
            <h2 className="text-[length:var(--text-heading-2)] font-[var(--text-heading-2--font-weight)] leading-[var(--text-heading-2--line-height)]">
              Just Do It
            </h2>
            <p className="max-w-sm text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[rgba(255,255,255,0.85)]">
              Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
            </p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-light-100)]" />
              <span className="h-2 w-2 rounded-full bg-[rgba(255,255,255,0.6)]" />
              <span className="h-2 w-2 rounded-full bg-[rgba(255,255,255,0.6)]" />
            </div>
          </div>
          <p className="text-[length:var(--text-caption)] leading-[var(--text-caption--line-height)] text-[rgba(255,255,255,0.7)]">
            © 2025 Nike, Inc. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-xl space-y-8">
          <div className="flex items-center justify-between md:hidden">
            <Link href="/" aria-label="Go home" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Brand logo" width={64} height={24} className="h-6 w-auto" />
            </Link>
            <Link
              href="/"
              className="text-[length:var(--text-body)] font-[var(--text-body-medium--font-weight)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-700)] underline underline-offset-4"
            >
              Home
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

