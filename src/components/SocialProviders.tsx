'use client'

import Image from "next/image";

export type SocialProvider = "google" | "apple";

const providerConfig: Record<
  SocialProvider,
  { label: string; iconSrc: string }
> = {
  google: {
    label: "Continue with Google",
    iconSrc: "/google.svg",
  },
  apple: {
    label: "Continue with Apple",
    iconSrc: "/apple.svg",
  },
};

export interface SocialProvidersProps {
  onSelect?: (provider: SocialProvider) => void;
  className?: string;
}

const SocialProviders = ({ onSelect, className }: SocialProvidersProps) => {
  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(providerConfig) as SocialProvider[]).map((provider) => {
          const config = providerConfig[provider];
          return (
            <button
              key={provider}
              type="button"
              onClick={() => onSelect?.(provider)}
              className="flex items-center justify-center gap-3 rounded-full border border-[var(--color-light-300)] bg-[var(--color-light-100)] px-4 py-3 text-[length:var(--text-body)] font-[var(--text-body-medium--font-weight)] leading-[var(--text-body--line-height)] text-[color:var(--color-dark-900)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-dark-900)]"
            >
              <Image
                src={config.iconSrc}
                alt={config.label}
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SocialProviders;

