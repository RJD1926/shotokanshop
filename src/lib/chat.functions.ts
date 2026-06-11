import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

export const chatWithBot = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ messages: z.array(z.any()) }).parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const result = streamText({
      model,
      system:
        "You are a helpful Shotokan karate expert assistant. You know about Gichin Funakoshi (founder of Shotokan), kata, kihon, kumite, dojo etiquette, and karate philosophy. Be knowledgeable, encouraging, and concise. Use a respectful martial arts tone.",
      messages: await convertToModelMessages(data.messages as UIMessage[]),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: data.messages as UIMessage[],
    });
  });

export const saveChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ role: z.enum(["user", "assistant"]), content: z.string() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("chat_messages").insert({
      user_id: userId,
      role: data.role,
      content: data.content,
    });
    if (error) throw error;
    return { ok: true };
  });

export const getChatHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(() => ({}))
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  });
