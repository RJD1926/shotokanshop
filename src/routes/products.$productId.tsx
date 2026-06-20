import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getProductById } from "@/lib/products.functions";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/products/$productId")({
  head: ({ params }) => ({
    meta: [
      { title: "Product | ShotokanShop" },
      { name: "description", content: "Product details" },
    ],
  }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["product", params.productId],
      queryFn: () => getProductById({ data: { id: params.productId } }),
    }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const fetchProduct = useServerFn(getProductById);
  const { data: product } = useSuspenseQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct({ data: { id: productId } }),
  });

  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to shop
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-muted-foreground">No image</div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase text-primary">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          <p className="mt-6 text-3xl font-bold">${Number(product.price).toFixed(2)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{product.stock} in stock</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-muted"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              onClick={() =>
                addItem(
                  {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image_url: product.image_url ?? "",
                  },
                  quantity,
                )
              }
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
