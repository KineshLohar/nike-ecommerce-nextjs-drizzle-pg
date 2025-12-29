"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/src/store/cart";

type NavLink = {
  label: string;
  href: string;
};

export interface NavbarProps {
  links?: NavLink[];
  logoSrc?: string;
  className?: string;
}

const defaultLinks: NavLink[] = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=unisex" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
];

const cn = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

const Navbar = ({
  links = defaultLinks,
  logoSrc = "/logo.svg",
  className,
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* ----------------------------
   * Cart state (Zustand)
   * ---------------------------- */
  const items = useCartStore((s) => s.items);

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <header
      className={cn(
        "w-full border-b border-light-300 bg-light-100 text-dark-900",
        className
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6 lg:px-8">
        {/* Logo */}
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

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((o) => !o)}
          className="ml-auto inline-flex items-center justify-center rounded-full border border-light-300 bg-light-100 p-2 text-dark-900 transition hover:border-dark-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-900 md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <span aria-hidden className="flex h-4 w-5 flex-col justify-between">
            <span className="block h-[2px] w-full rounded-full bg-current" />
            <span className="block h-[2px] w-3/4 rounded-full bg-current" />
            <span className="block h-[2px] w-full rounded-full bg-current" />
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="transition hover:text-dark-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Cart (desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 transition hover:text-dark-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-900"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>My Cart</span>

            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-dark-900 px-1.5 py-0.5 text-footnote font-medium text-light-100">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mx-4 mb-4 rounded-2xl border border-light-300 bg-light-100 shadow-md md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-lg px-2 py-2 transition hover:bg-light-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-2 py-2 transition hover:bg-light-200"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                My Cart
              </span>

              {cartCount > 0 && (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-dark-900 px-2 py-0.5 text-footnote text-light-100">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
