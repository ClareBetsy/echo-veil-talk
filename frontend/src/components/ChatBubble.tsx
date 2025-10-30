import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  encrypted?: boolean;
}

const ChatBubble = ({ message, isUser, timestamp, encrypted = true }: ChatBubbleProps) => {
  return (
    <div className={cn("flex gap-3 message-enter", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md border border-primary/20">
          AI
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%] rounded-2xl p-4 relative group",
        isUser 
          ? "bg-primary text-primary-foreground shadow-lg rounded-tr-sm" 
          : "bg-card border border-border shadow-md rounded-tl-sm"
      )}>
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isUser ? "bg-primary/90" : "bg-accent/5"
        )} />
        
        <p className={cn(
          "relative z-10 break-words leading-relaxed text-[15px]",
          isUser ? "text-primary-foreground" : "text-foreground"
        )}>{message}</p>
        
        <div className="flex items-center justify-between mt-3 relative z-10 gap-3">
          <span className={cn(
            "text-[11px] font-medium",
            isUser ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>{timestamp}</span>
          {encrypted && (
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full border",
              isUser 
                ? "bg-primary-foreground/20 border-primary-foreground/30" 
                : "bg-primary/10 border-primary/30"
            )}>
              <svg className={cn("w-3 h-3", isUser ? "text-primary-foreground" : "text-primary")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className={cn("text-[11px] font-semibold", isUser ? "text-primary-foreground" : "text-primary")}>FHE</span>
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md border border-secondary/20">
          You
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
