import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { createOrder } from "@/lib/orders.functions";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | ShotokanShop" },
      { name: "description", content: "Complete your order" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const createOrderFn = useServerFn(createOrder);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast.error("Please sign in to checkout");
        navigate({ to: "/auth" });
        return;
      }

      await createOrderFn({
        data: {
          items: items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            price_at_purchase: i.product.price,
          })),
          total_amount: totalPrice,
          shipping_address: {
            full_name: form.full_name,
            address: form.address,
            city: form.city,
            postal_code: form.postal_code,
            country: form.country,
          },
        },
      });

      clearCart();
      toast.success("Order placed successfully! Osu!");
      navigate({ to: "/orders" });
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some gear before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-6 rounded-xl border bg-card p-6">
        <h2 className="font-semibold">Order Summary</h2>
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span>{item.product.name} x {item.quantity}</span>
              <span>${(item.quantity * item.product.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <h2 className="font-semibold">Shipping Details</h2>
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input id="postal_code" required value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
        </Button>
        <p className="text-center text-xs text-muted-foreground">Payment gateway integration coming soon. Orders are saved in your account.</p>
      </form>
    </div>
  );
}
