import Image from "next/image";
import Link from "next/link";

type CardTone = "accent" | "success" | "neutral";

export interface CardProps {
    title: string;
    subtitle?: string;
    category?: string;
    price?: string | number;
    imageSrc: string;
    imageAlt?: string;
    badgeLabel?: string;
    badgeTone?: CardTone;
    colorsCount?: number;
    href?: string;
    className?: string;
}

const badgeStyles: Record<CardTone, string> = {
    accent:
        "bg-[var(--color-orange)] text-[color:var(--color-light-100)]",
    success:
        "bg-[var(--color-green)] text-[color:var(--color-light-100)]",
    neutral:
        "bg-[var(--color-light-300)] text-[color:var(--color-dark-900)]",
};

const cn = (...classes: Array<string | false | undefined>): string =>
    classes.filter(Boolean).join(" ");

const Card = ({
    title,
    subtitle,
    category,
    price,
    imageSrc,
    imageAlt,
    badgeLabel,
    badgeTone = "accent",
    colorsCount,
    href,
    className,
}: CardProps) => {
    const priceLabel =
        price === undefined
            ? null
            : typeof price === "number"
                ? `$${price.toFixed(2)}`
                : price;

    const content = (
        <div
            className={cn(
                "flex h-full flex-col gap-4 transition hover:-translate-y-0.5",
                className
            )}
        >
            <div className="relative overflow-hidden bg-light-300">
                <Image
                    src={imageSrc}
                    alt={imageAlt ?? title}
                    width={900}
                    height={700}
                    priority={false}
                    className="h-72 w-full object-cover sm:h-80"
                />
            </div>

            <div className="flex flex-1 flex-col">
                {subtitle && (
                    <p className="text-caption font-[var(--text-body--font-weight)] leading-[var(--text-caption--line-height)] text-[color:var(--color-dark-700)]">
                        {subtitle}
                    </p>
                )}
                <h3 className="mt-1 text-[length:var(--text-heading-3)] font-[var(--text-heading-3--font-weight)] leading-[var(--text-heading-3--line-height)] text-[color:var(--color-dark-900)]">
                    {title}
                </h3>
                <div className="mt-3 flex items-center justify-between text-[length:var(--text-body)] leading-[var(--text-body--line-height)]">
                    <span className="text-[color:var(--color-dark-700)]">
                        {category ?? "Shoes"}
                    </span>
                    {priceLabel && (
                        <span className="text-[color:var(--color-dark-900)] font-[var(--text-body-medium--font-weight)]">
                            {priceLabel}
                        </span>
                    )}
                </div>
                {colorsCount ? (
                    <p className="mt-1 text-[length:var(--text-caption)] leading-[var(--text-caption--line-height)] text-[color:var(--color-dark-700)]">
                        {colorsCount} Colour{colorsCount > 1 ? "s" : ""}
                    </p>
                ) : null}
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} aria-label={title} className="block h-full">
                {content}
            </Link>
        );
    }

    return <article className="h-full">{content}</article>;
};

export default Card;

