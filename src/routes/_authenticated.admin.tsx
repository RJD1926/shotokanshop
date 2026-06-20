import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Shield, Plus, Trash2, Edit, Package, ShoppingBag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/products.functions";
import { getAllOrders, updateOrderStatus } from "@/lib/orders.functions";
import { isAdmin } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | ShotokanShop" },
      { name: "description", content: "Manage products, orders, and store settings." },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw redirect({ to: "/" });
  },
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<"products" | "orders">("products");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your dojo's storefront</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-b">
        <button
          onClick={() => setTab("products")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "products" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          <Package className="h-4 w-4" /> Products
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "orders" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          <ShoppingBag className="h-4 w-4" /> Orders
        </button>
      </div>

      <div className="mt-6">
        {tab === "products" ? <ProductsTab /> : <OrdersTab />}
      </div>
    </div>
  );
}

function ProductsTab() {
  const fetchProducts = useServerFn(getProducts);
  const createFn = useServerFn(createProduct);
  const updateFn = useServerFn(updateProduct);
  const deleteFn = useServerFn(deleteProduct);
  const qc = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchProducts({ data: {} }),
  });

  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["featured-products"] });
      toast.success("Product deleted");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      description: String(fd.get("description") || ""),
      price: Number(fd.get("price") || 0),
      image_url: String(fd.get("image_url") || ""),
      category: String(fd.get("category") || "equipment"),
      stock: Number(fd.get("stock") || 0),
      featured: fd.get("featured") === "on",
    };
    try {
      if (editing) {
        await updateFn({ data: { id: editing.id, ...payload } });
        toast.success("Product updated");
      } else {
        await createFn({ data: payload });
        toast.success("Product created");
      }
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["featured-products"] });
      setOpen(false);
      setEditing(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} products</p>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>
              <Plus className="mr-1 h-4 w-4" /> New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><Label>Name</Label><Input name="name" defaultValue={editing?.name} required /></div>
              <div><Label>Description</Label><Textarea name="description" defaultValue={editing?.description} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Price ($)</Label><Input name="price" type="number" step="0.01" defaultValue={editing?.price} required /></div>
                <div><Label>Stock</Label><Input name="stock" type="number" defaultValue={editing?.stock ?? 0} required /></div>
              </div>
              <div><Label>Category</Label><Input name="category" defaultValue={editing?.category ?? "equipment"} required /></div>
              <div><Label>Image URL</Label><Input name="image_url" defaultValue={editing?.image_url ?? ""} /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" defaultChecked={editing?.featured} /> Featured
              </label>
              <Button type="submit" className="w-full">{editing ? "Save Changes" : "Create Product"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    {p.image_url && <img src={p.image_url} alt="" className="h-10 w-10 rounded object-cover" />}
                    <span className="font-medium">{p.name}</span>
                    {p.featured && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">FEATURED</span>}
                  </div>
                </td>
                <td className="px-4 py-2 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-2">${Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete?")) remove.mutate(p.id); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab() {
  const fetchOrders = useServerFn(getAllOrders);
  const updateStatus = useServerFn(updateOrderStatus);
  const qc = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fetchOrders(),
  });

  const change = useMutation({
    mutationFn: (vars: { order_id: string; status: any }) => updateStatus({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated");
    },
  });

  if (!orders.length) {
    return <p className="text-center text-muted-foreground py-12">No orders yet.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((o: any) => (
        <div key={o.id} className="rounded-xl border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Order #{o.id.slice(0, 8)} • {o.profiles?.full_name ?? "Customer"}</p>
              <p className="font-bold">${Number(o.total_amount).toFixed(2)}</p>
            </div>
            <select
              value={o.status}
              onChange={(e) => change.mutate({ order_id: o.id, status: e.target.value })}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
            >
              {["pending", "paid", "shipped", "delivered", "cancelled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {o.order_items?.map((it: any) => (
              <span key={it.id} className="mr-3">{it.products?.name} ×{it.quantity}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}