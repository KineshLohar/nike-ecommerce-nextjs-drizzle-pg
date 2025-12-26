import Card from "@/components/Card";
import type { CardProps } from "@/components/Card";

const trendingProducts: CardProps[] = [
  {
    title: "Nike Air Force 1 Mid '07",
    subtitle: "Men's Shoes",
    category: "Shoes",
    price: 98.3,
    imageSrc: "/shoes/shoe-1.jpg",
    imageAlt: "Nike Air Force 1 Mid '07",
    badgeLabel: "Best Seller",
    badgeTone: "accent",
    colorsCount: 6,
    href: "#",
  },
  {
    title: "Nike Air Max 90",
    subtitle: "Men's Shoes",
    category: "Shoes",
    price: 120.0,
    imageSrc: "/shoes/shoe-2.webp",
    imageAlt: "Nike Air Max 90",
    badgeLabel: "New",
    badgeTone: "success",
    colorsCount: 4,
    href: "#",
  },
  {
    title: "Nike Dunk Low",
    subtitle: "Women's Shoes",
    category: "Shoes",
    price: 100.0,
    imageSrc: "/shoes/shoe-3.webp",
    imageAlt: "Nike Dunk Low",
    badgeLabel: "Trending",
    badgeTone: "accent",
    colorsCount: 8,
    href: "#",
  },
  {
    title: "Nike Air Max 95",
    subtitle: "Men's Shoes",
    category: "Shoes",
    price: 175.0,
    imageSrc: "/shoes/shoe-4.webp",
    imageAlt: "Nike Air Max 95",
    badgeLabel: "Popular",
    badgeTone: "neutral",
    colorsCount: 5,
    href: "#",
  },
  {
    title: "Nike Blazer Mid '77",
    subtitle: "Unisex Shoes",
    category: "Shoes",
    price: 100.0,
    imageSrc: "/shoes/shoe-5.avif",
    imageAlt: "Nike Blazer Mid '77",
    badgeLabel: "Best Seller",
    badgeTone: "accent",
    colorsCount: 7,
    href: "#",
  },
  {
    title: "Nike React Element 55",
    subtitle: "Men's Shoes",
    category: "Shoes",
    price: 130.0,
    imageSrc: "/shoes/shoe-6.avif",
    imageAlt: "Nike React Element 55",
    badgeLabel: "New",
    badgeTone: "success",
    colorsCount: 3,
    href: "#",
  },
  {
    title: "Nike Air Max 270",
    subtitle: "Men's Shoes",
    category: "Shoes",
    price: 150.0,
    imageSrc: "/shoes/shoe-7.avif",
    imageAlt: "Nike Air Max 270",
    badgeLabel: "Trending",
    badgeTone: "accent",
    colorsCount: 6,
    href: "#",
  },
  {
    title: "Nike Court Vision Low",
    subtitle: "Women's Shoes",
    category: "Shoes",
    price: 75.0,
    imageSrc: "/shoes/shoe-8.avif",
    imageAlt: "Nike Court Vision Low",
    badgeLabel: "Popular",
    badgeTone: "neutral",
    colorsCount: 4,
    href: "#",
  },
];

const Home = () => {
  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-12">
        <h2 className="mb-8 text-[length:var(--text-heading-2)] font-[var(--text-heading-2--font-weight)] leading-[var(--text-heading-2--line-height)] text-[color:var(--color-dark-900)]">
          Trending
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trendingProducts.map((product, index) => (
            <Card key={index} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;

