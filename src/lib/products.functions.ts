import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getProducts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ category: z.string().optional() }).parse(input ?? {}))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin.from("products").select("*").order("created_at", { ascending: false });
    if (data.category) {
      query = query.eq("category", data.category);
    }
    const { data: products, error } = await query;
    if (error) throw error;
    return products ?? [];
  });

export const getProductById = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return product;
  });

export const createProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        name: z.string().min(1),
        description: z.string(),
        price: z.number().positive(),
        image_url: z.string().optional(),
        category: z.string(),
        stock: z.number().int().min(0),
        featured: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: product, error } = await supabaseAdmin.from("products").insert(data).select().single();
    if (error) throw error;
    return product;
  });

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        image_url: z.string().optional(),
        category: z.string().optional(),
        stock: z.number().int().min(0).optional(),
        featured: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { id, ...updates } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return product;
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
