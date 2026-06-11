import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShoppingCart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/products.functions";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Shop | ShotokanShop" },
      { name: "description", content: "Browse our complete collection of Shotokan karate equipment, gi, belts, and training gear." },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["products"],
      queryFn: () => useServerFn(getProducts)({ data: {} }),
    }),
  component: ProductsPage,
});

const categories = ["All", "gi", "belts", "equipment", "books", "accessories", "weapons"];

function ProductsPage() {
  const fetchProducts = useServerFn(getProducts);
  const { data: products } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts({ data: {} }),
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const addItem = useCartStore((s) => s.addItem);

  const filtered =
    activeCategory === "All" ? products : products?.filter((p) => p.category === activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Shop All Gear</h1>
      <p className="mt-1 text-muted-foreground">Authentic equipment for serious karateka</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat === "All" ? cat : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered?.map((product) => (
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
                <h3 className="mt-1 font-semibold leading-tight hover:text-primary line-clamp-2">{product.name}</h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold">${Number(product.price).toFixed(2)}</span>
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
    </div>
  );
}
