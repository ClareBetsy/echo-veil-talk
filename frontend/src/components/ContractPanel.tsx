import { useMemo, useState, useCallback } from "react";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { FHECOUNTER_ABI, getFheCounterAddress } from "@/lib/contracts";
import { sendEncryptedDelta } from "@/lib/fheClient";
import { toast } from "sonner";

const ContractPanel = () => {
  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = useMemo(() => getFheCounterAddress(chainId), [chainId]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [lastErr, setLastErr] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: counterValue, refetch } = useReadContract({
    abi: FHECOUNTER_ABI,
    address: contractAddress as `0x${string}` | undefined,
    functionName: "getCount",
    query: { enabled: Boolean(contractAddress) },
  });

  return (
    <div className="holographic-blur rounded-2xl p-4 border border-border shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">FHE Counter</h3>
          <p className="text-xs text-muted-foreground">
            Network: {chainId === 31337 ? "Localhost" : chainId === 11155111 ? "Sepolia Testnet" : chainId ?? "N/A"} · Address: {contractAddress ?? "Not configured"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={!isConnected || !contractAddress || isSubmitting}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
            onClick={async () => {
              if (!chainId) return;
              try {
                setIsSubmitting(true);
                const tx = await sendEncryptedDelta({ chainId, delta: 1, direction: "inc" });
                toast.success("Submitted encrypted increment", { description: tx });
                setLastTx(tx);
                setLastErr(null);
                await refetch();
              } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                toast.error("Failed to submit", { description: message });
                setLastErr(message);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {isSubmitting ? "Submitting..." : "Increment +1"}
          </button>
          <button
            disabled={!isConnected || !contractAddress || isSubmitting}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-9 px-4"
            onClick={async () => {
              if (!chainId) return;
              try {
                setIsSubmitting(true);
                const tx = await sendEncryptedDelta({ chainId, delta: 1, direction: "dec" });
                toast.success("Submitted encrypted decrement", { description: tx });
                setLastTx(tx);
                setLastErr(null);
                await refetch();
              } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                toast.error("Failed to submit", { description: message });
                setLastErr(message);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {isSubmitting ? "Submitting..." : "Decrement -1"}
          </button>
          <button
            disabled={!isConnected || !contractAddress || isRefreshing}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/90 h-9 px-4"
            onClick={async () => {
              try {
                setIsRefreshing(true);
                await refetch();
                toast.success("Contract data refreshed");
              } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                toast.error("Failed to refresh", { description: message });
              } finally {
                setIsRefreshing(false);
              }
            }}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        {isConnected ? (
          <span>Connected as {userAddress}</span>
        ) : (
          <span>Connect your wallet to interact with the contract.</span>
        )}
      </div>
      <div className="mt-3 text-xs">
        <div>
          <span className="font-medium">Encrypted count:</span>
          <span className="ml-1 font-mono break-all text-blue-600">
            {(counterValue as string | undefined) ?? "—"}
          </span>
        </div>
        <div className="mt-2">
          {lastTx ? (
            <div className="text-muted-foreground">
              Last tx: <span className="font-mono break-all">{lastTx}</span>
            </div>
          ) : null}
          {lastErr ? (
            <div className="text-red-500">
              Error: <span className="break-all">{lastErr}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ContractPanel;


