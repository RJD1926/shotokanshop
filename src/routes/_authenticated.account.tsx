import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Package, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account | ShotokanShop" },
      { name: "description", content: "Manage your ShotokanShop profile and orders." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", data.user.id)
          .maybeSingle();
        setFullName(profile?.full_name ?? "");
      }
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, full_name: fullName }, { onConflict: "user_id" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">My Account</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={save} className="mt-8 rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div>
          <Label>Full name</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link to="/orders" className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:border-primary">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">My Orders</p>
            <p className="text-xs text-muted-foreground">Track purchases & history</p>
          </div>
        </Link>
        <button onClick={signOut} className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left hover:border-destructive">
          <LogOut className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium">Sign Out</p>
            <p className="text-xs text-muted-foreground">End your session</p>
          </div>
        </button>
      </div>
    </div>
  );
}