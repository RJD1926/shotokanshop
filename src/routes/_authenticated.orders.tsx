import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/orders.functions";
import { Package } from "lucide-react";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "My Orders | ShotokanShop" },
      { name: "description", content: "View your order history" },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["orders"],
      queryFn: () => getOrders(),
    }),
  component: OrdersPage,
});

function OrdersPage() {
  const fetchOrders = useServerFn(getOrders);
  const { data: orders } = useSuspenseQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });

  if (!orders?.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <Package className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h1 className="mt-6 text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">Your completed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="rounded-xl border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                <p className="text-lg font-bold">${Number(order.total_amount).toFixed(2)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                order.status === "delivered" ? "bg-green-100 text-green-700" :
                order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                order.status === "paid" ? "bg-primary/10 text-primary" :
                "bg-muted text-muted-foreground"
              }`}>
                {order.status}
              </span>
            </div>
            <div className="mt-3 space-y-1">
              {order.order_items?.map((item: any) => (
                <p key={item.id} className="text-sm text-muted-foreground">
                  {item.products?.name} x {item.quantity}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
