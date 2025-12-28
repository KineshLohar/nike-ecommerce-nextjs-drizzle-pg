"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type NavLink = {
  label: string;
  href: string;
};

export interface NavbarProps {
  links?: NavLink[];
  logoSrc?: string;
  cartCount?: number;
  showSearch?: boolean;
  className?: string;
}

const defaultLinks: NavLink[] = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=unisex" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
] as const;

const cn = (...classes: Array<string | false | undefined>): string =>
  classes.filter(Boolean).join(" ");

const Navbar = ({
  links = defaultLinks,
  logoSrc = "/logo.svg",
  cartCount = 0,
  showSearch = true,
  className,
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "w-full border-b border-light-300 bg-light-100 text-dark-900",
        className
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Home">
            <Image
              src={logoSrc}
              alt="Brand logo"
              width={60}
              height={24}
              priority
              className="h-6 w-auto brightness-0"
            />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="ml-auto inline-flex items-center justify-center rounded-full border border-[var(--color-light-300)] bg-[var(--color-light-100)] p-2 text-[color:var(--color-dark-900)] transition hover:border-[var(--color-dark-900)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-dark-900)] md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <span
            aria-hidden
            className="flex h-4 w-5 flex-col justify-between"
          >
            <span className="block h-[2px] w-full rounded-full bg-current" />
            <span className="block h-[2px] w-3/4 rounded-full bg-current" />
            <span className="block h-[2px] w-full rounded-full bg-current" />
          </span>
        </button>

        <ul className="hidden flex-1 items-center justify-center gap-8 text-[length:var(--text-body)] font-[var(--text-body--font-weight)] leading-[var(--text-body--line-height)] md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="transition hover:text-[var(--color-dark-700)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 text-[length:var(--text-body)] font-[var(--text-body--font-weight)] leading-[var(--text-body--line-height)] md:flex">
          {showSearch && (
            <button
              type="button"
              className="transition hover:text-[color:var(--color-dark-700)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-dark-900)]"
            >
              Search
            </button>
          )}
          <button
            type="button"
            className="flex items-center gap-2 transition hover:text-[color:var(--color-dark-700)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-dark-900)]"
          >
            <span>My Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--color-dark-900)] px-2 py-0.5 text-[color:var(--color-light-100)] text-[length:var(--text-footnote)] font-[var(--text-body-medium--font-weight)] leading-[var(--text-footnote--line-height)]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mx-4 mb-4 rounded-2xl border border-[var(--color-light-300)] bg-[var(--color-light-100)] text-[color:var(--color-dark-900)] shadow-md md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {showSearch && (
              <button
                type="button"
                className="text-left text-[length:var(--text-body)] font-[var(--text-body--font-weight)] leading-[var(--text-body--line-height)]"
              >
                Search
              </button>
            )}
            <ul className="flex flex-col gap-3 text-[length:var(--text-body)] font-[var(--text-body--font-weight)] leading-[var(--text-body--line-height)]">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-lg px-2 py-2 transition hover:bg-[var(--color-light-200)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-[length:var(--text-body)] font-[var(--text-body--font-weight)] leading-[var(--text-body--line-height)]">
              <span>My Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--color-dark-900)] px-2 py-1 text-[color:var(--color-light-100)] text-[length:var(--text-footnote)] leading-[var(--text-footnote--line-height)]">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

