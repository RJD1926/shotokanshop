import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart | ShotokanShop" },
      { name: "description", content: "Your shopping cart" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse our gear and start your training journey.</p>
        <Link to="/products">
          <Button className="mt-6">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={item.product_id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.product.image_url ? (
                <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-xs text-muted-foreground">No img</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                className="rounded p-1 hover:bg-muted"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                className="rounded p-1 hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="w-20 text-right font-semibold">
              ${(item.quantity * item.product.price).toFixed(2)}
            </div>
            <button onClick={() => removeItem(item.product_id)} className="rounded p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border bg-card p-6">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
        </div>
        <Link to="/checkout">
          <Button size="lg">
            Checkout <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
