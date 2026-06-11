import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
    id: "shotokan-chat",
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="flex h-[480px] w-[360px] flex-col rounded-2xl border bg-card shadow-2xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Sensei AI</h3>
                <p className="text-[10px] text-white/70">Shotokan Karate Expert</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-white/20">
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                Ask me anything about Shotokan karate — kata, techniques, history, or training tips!
              </div>
            )}
            {messages.map((msg: UIMessage) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.parts.map((part: { type: string; text?: string }, i: number) =>
                    part.type === "text" ? <span key={i}>{part.text}</span> : null,
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Shotokan..."
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform hover:scale-105 animate-pulse-glow"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
