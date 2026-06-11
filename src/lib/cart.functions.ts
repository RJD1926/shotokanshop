import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getCart = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, products(*)")
      .eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
  });

export const addToCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ product_id: z.string().uuid(), quantity: z.number().int().min(1) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("cart_items").upsert(
      { user_id: userId, product_id: data.product_id, quantity: data.quantity },
      { onConflict: "user_id,product_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

export const removeFromCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ product_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", data.product_id);
    if (error) throw error;
    return { ok: true };
  });

export const updateCartQuantity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ product_id: z.string().uuid(), quantity: z.number().int().min(0) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.quantity <= 0) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", data.product_id);
      if (error) throw error;
      return { ok: true };
    }
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: data.quantity })
      .eq("user_id", userId)
      .eq("product_id", data.product_id);
    if (error) throw error;
    return { ok: true };
  });
