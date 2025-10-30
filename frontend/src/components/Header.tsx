import logo from "@/assets/logo.png";
import WalletConnect from "./WalletConnect";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 holographic-blur border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <img src={logo} alt="WhisperChat Logo" className="w-11 h-11 drop-shadow-lg" />
            <div>
              <h1 className="text-2xl font-bold text-holographic">WhisperChat</h1>
              <p className="text-xs text-muted-foreground font-medium">Encrypted conversations powered by FHE</p>
            </div>
          </div>
          
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};

export default Header;
