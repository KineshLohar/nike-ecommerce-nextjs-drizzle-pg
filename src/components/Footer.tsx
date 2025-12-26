import Image from "next/image";
import Link from "next/link";

type FooterLink = { label: string; href: string };
type SocialLink = { label: string; href: string; iconSrc: string };

const footerColumns: Array<{ heading: string; links: FooterLink[] }> = [
  {
    heading: "Featured",
    links: [
      { label: "Air Force 1", href: "#" },
      { label: "Huarache", href: "#" },
      { label: "Air Max 90", href: "#" },
      { label: "Air Max 95", href: "#" },
    ],
  },
  {
    heading: "Shoes",
    links: [
      { label: "All Shoes", href: "#" },
      { label: "Custom Shoes", href: "#" },
      { label: "Jordan Shoes", href: "#" },
      { label: "Running Shoes", href: "#" },
    ],
  },
  {
    heading: "Clothing",
    links: [
      { label: "All Clothing", href: "#" },
      { label: "Modest Wear", href: "#" },
      { label: "Hoodies & Pullovers", href: "#" },
      { label: "Shirts & Tops", href: "#" },
    ],
  },
  {
    heading: "Kids'",
    links: [
      { label: "Infant & Toddler Shoes", href: "#" },
      { label: "Kids' Shoes", href: "#" },
      { label: "Kids' Jordan Shoes", href: "#" },
      { label: "Kids' Basketball Shoes", href: "#" },
    ],
  },
];

const socialLinks: SocialLink[] = [
  { label: "X", href: "#", iconSrc: "/x.svg" },
  { label: "Facebook", href: "#", iconSrc: "/facebook.svg" },
  { label: "Instagram", href: "#", iconSrc: "/instagram.svg" },
];

const legalLinks: FooterLink[] = [
  { label: "Guides", href: "#" },
  { label: "Terms of Sale", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Nike Privacy Policy", href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-[var(--color-dark-900)] text-[color:var(--color-light-100)]">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link href="/" aria-label="Home">
              <Image
                src="/logo.svg"
                alt="Brand logo"
                width={64}
                height={24}
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading} className="space-y-4">
              <h3 className="text-[length:var(--text-heading-3)] font-[var(--text-heading-3--font-weight)] leading-[var(--text-heading-3--line-height)]">
                {column.heading}
              </h3>
              <ul className="space-y-2 text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-500)]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-[var(--color-light-100)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="hidden items-start justify-end gap-3 md:col-span-1 md:flex">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-light-100)] transition hover:opacity-80"
              >
                <Image
                  src={item.iconSrc}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-[var(--color-dark-700)] pt-6 text-[length:var(--text-caption)] leading-[var(--text-caption--line-height)] text-[color:var(--color-dark-500)] md:mt-12 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <Image
                src="/globe.svg"
                alt="Region"
                width={16}
                height={16}
                className="h-4 w-4"
              />
              Croatia
            </span>
            <span>© 2025 Nike, Inc. All Rights Reserved</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-[var(--color-light-100)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 md:hidden">
          {socialLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-light-100)] transition hover:opacity-80"
            >
              <Image
                src={item.iconSrc}
                alt={item.label}
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

