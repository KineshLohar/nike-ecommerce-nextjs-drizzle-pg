import Card from "@/components/Card";
import { getAllProducts } from "@/src/lib/actions/product";


const Home = async () => {
  const { products } = await getAllProducts({ limit: 6 });

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-12">
        <h2 className="mb-8 text-[length:var(--text-heading-2)] font-[var(--text-heading-2--font-weight)] leading-[var(--text-heading-2--line-height)] text-[color:var(--color-dark-900)]">
          Trending
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => {
            const price =
              p.minPrice !== null && p.maxPrice !== null && p.minPrice !== p.maxPrice
                ? `$${p.minPrice.toFixed(2)} - $${p.maxPrice.toFixed(2)}`
                : p.minPrice !== null
                  ? p.minPrice
                  : undefined;
            return (
              <Card
                key={p.id}
                title={p.name}
                subtitle={p.subtitle ?? undefined}
                imageSrc={p.imageUrl ?? "/shoes/shoe-1.jpg"}
                price={price}
                href={`/products/${p.id}`}
              />
            )
          })}
        </div>
      </section>
    </main>
  );
};

export default Home;

