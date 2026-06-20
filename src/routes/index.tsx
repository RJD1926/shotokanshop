import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCart, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/products.functions";
import { useCartStore } from "@/stores/cartStore";
import KarateHero3D from "@/components/KarateHero3D";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShotokanShop - Authentic Karate Gear" },
      { name: "description", content: "Premium Shotokan karate equipment, gi, belts, and training gear with worldwide shipping." },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["featured-products"],
      queryFn: () => getProducts({ data: {} }),
    }),
  component: Index,
});

function Index() {
  const fetchProducts = useServerFn(getProducts);
  const { data: products } = useSuspenseQuery({
    queryKey: ["featured-products"],
    queryFn: () => fetchProducts({ data: {} }),
  });

  const addItem = useCartStore((s) => s.addItem);
  const featured = products?.filter((p) => p.featured).slice(0, 4) ?? [];

  return (
    <div>
      {/* 3D Hero Section */}
      <section className="relative overflow-hidden bg-karate-dark">
        <div className="absolute inset-0">
          <KarateHero3D />
        </div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Master the Way of
            <span className="text-primary"> Karate</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">
            Authentic Shotokan equipment for the dedicated practitioner. From traditional gi to training gear — everything you need for your journey.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/products">
              <Button size="lg" className="animate-pulse-glow">
                Shop Now <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Learn Shotokan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Gear</h2>
            <p className="mt-1 text-muted-foreground">Hand-picked essentials for every karateka</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <div key={product.id} className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
              <Link to={`/products/$productId`} params={{ productId: product.id }}>
                <div className="aspect-square overflow-hidden bg-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-muted-foreground">No image</div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <p className="text-xs font-medium uppercase text-primary">{product.category}</p>
                <Link to={`/products/$productId`} params={{ productId: product.id }}>
                  <h3 className="mt-1 font-semibold leading-tight hover:text-primary">{product.name}</h3>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold">${product.price}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      addItem(
                        {
                          id: product.id,
                          name: product.name,
                          price: Number(product.price),
                          image_url: product.image_url ?? "",
                        },
                        1,
                      )
                    }
                  >
                    <ShoppingCart className="mr-1 h-3 w-3" /> Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Cards */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Gichin Funakoshi",
                desc: "The father of modern karate who founded Shotokan in 1936. His 20 precepts guide practitioners worldwide.",
                icon: Star,
              },
              {
                title: "Kihon, Kata & Kumite",
                desc: "The three pillars of Shotokan training: basic techniques, forms, and sparring for complete development.",
                icon: Star,
              },
              {
                title: "Worldwide Shipping",
                desc: "We deliver authentic karate gear to dojos in over 50 countries. Quality guaranteed.",
                icon: Star,
              },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border bg-card p-6">
                <card.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
