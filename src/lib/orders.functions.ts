import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        items: z.array(
          z.object({
            product_id: z.string().uuid(),
            quantity: z.number().int().min(1),
            price_at_purchase: z.number().positive(),
          }),
        ),
        total_amount: z.number().positive(),
        shipping_address: z.object({
          full_name: z.string(),
          address: z.string(),
          city: z.string(),
          postal_code: z.string(),
          country: z.string(),
        }),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: data.total_amount,
        shipping_address: data.shipping_address,
      })
      .select()
      .single();
    if (orderError) throw orderError;

    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    await supabase.from("cart_items").delete().eq("user_id", userId);

    return order;
  });

export const getOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name, image_url))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const getAllOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminRole) throw new Error("Forbidden");

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name, image_url)), profiles(full_name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ order_id: z.string().uuid(), status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminRole) throw new Error("Forbidden");
    const { error } = await supabase.from("orders").update({ status: data.status }).eq("id", data.order_id);
    if (error) throw error;
    return { ok: true };
  });
