import { useState } from "react";
import Header from "@/components/Header";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { toast } from "sonner";
import ContractPanel from "@/components/ContractPanel";
import { ensureSendAuth, ensureDecryptAuth, isDecryptAuthorized } from "@/lib/auth";
import { encryptMessage, decryptMessage } from "@/lib/crypto";

interface Message {
  id: string;
  text?: string; // plaintext when available
  ivB64?: string; // encrypted iv
  dataB64?: string; // encrypted data
  isUser: boolean;
  timestamp: string;
  encrypted: boolean;
  displayText?: string; // rendered text (may be placeholder when locked)
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to WhisperChat! Your messages are protected by fully homomorphic encryption (FHE). Chat freely while your data remains encrypted end-to-end.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      encrypted: true,
      displayText: "Welcome to WhisperChat! Your messages are protected by fully homomorphic encryption (FHE). Chat freely while your data remains encrypted end-to-end.",
    },
  ]);

  const handleSendMessage = async (text: string) => {
    const authorized = await ensureSendAuth();
    if (!authorized) {
      toast.error("Send not authorized", { description: "Wallet signature required to send." });
      return;
    }

    const { ivB64, dataB64 } = await encryptMessage(text);
    const newMessage: Message = {
      id: Date.now().toString(),
      ivB64,
      dataB64,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      encrypted: true,
      displayText: isDecryptAuthorized() ? text : "Encrypted message (auth required)",
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate an encrypted response
    setTimeout(async () => {
      const replyText = "Message received and encrypted via FHE. Running sentiment analysis on encrypted data...";
      const enc = await encryptMessage(replyText);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        ivB64: enc.ivB64,
        dataB64: enc.dataB64,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        encrypted: true,
        displayText: isDecryptAuthorized() ? replyText : "Encrypted message (auth required)",
      };
      setMessages((prev) => [...prev, response]);
      toast.success("Message Encrypted & Analyzed", {
        description: "FHE processing completed successfully",
      });
    }, 800);
  };

  const authorizeDecrypt = async () => {
    const ok = await ensureDecryptAuth();
    if (!ok) {
      toast.error("Decrypt not authorized", { description: "Wallet signature required to decrypt." });
      return;
    }
    // Decrypt all encrypted messages currently in view.
    const updated: Message[] = [];
    for (const m of messages) {
      if (m.encrypted && m.ivB64 && m.dataB64) {
        try {
          const pt = await decryptMessage(m.ivB64, m.dataB64);
          updated.push({ ...m, text: pt, displayText: pt });
        } catch {
          updated.push({ ...m, displayText: m.displayText ?? "Encrypted message" });
        }
      } else {
        updated.push(m);
      }
    }
    setMessages(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-secondary/30 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Header />

      <main className="flex-1 pt-24 pb-6 relative z-10">
        <div className="container mx-auto px-4 h-full max-w-6xl">
          <div className="h-full flex flex-col gap-4">
            {/* Info banner */}
            <div className="holographic-blur rounded-2xl p-4 border border-border shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <div className="absolute w-4 h-4 rounded-full border-2 border-primary/30 animate-ping" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">FHE Encryption Active</h2>
                    <p className="text-xs text-muted-foreground">All messages encrypted end-to-end • Sentiment analysis on encrypted data</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={authorizeDecrypt}
                    className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    🔓 Authorize Decrypt
                  </button>
                </div>
              </div>
            </div>
            
            {/* Contract panel */}
            <ContractPanel />

            {/* Chat container */}
            <div className="flex-1 holographic-blur rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col">
              {/* Chat messages area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message.displayText ?? message.text ?? (message.encrypted ? "Encrypted message" : "")}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                    encrypted={message.encrypted}
                  />
                ))}
              </div>

              {/* Input area */}
              <div className="border-t border-border bg-background/50 p-4">
                <ChatInput onSend={handleSendMessage} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
