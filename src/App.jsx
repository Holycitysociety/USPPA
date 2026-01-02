// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  CheckoutWidget,
  ConnectEmbed,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useWalletBalance,
  darkTheme,
} from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";
import "./App.css";

// ---- Thirdweb client / chain / wallets ----
const client = createThirdwebClient({
  clientId: "f58c0bfc6e6a2c00092cc3c35db1eed8", // same as your other sites
});

const BASE = defineChain(8453);

// Embedded user wallets (EMAIL ONLY)
const wallets = [
  inAppWallet({
    auth: { options: ["email"] },
  }),
];

// Theme (matches your Patronium vibe)
const patronCheckoutTheme = darkTheme({
  fontFamily:
    '"Cinzel", "EB Garamond", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", serif',
  colors: {
    modalBg: "#050505",
    modalOverlayBg: "rgba(0,0,0,0.85)",
    borderColor: "#3a2b16",
    separatorLine: "#3a2b16",
    mutedBg: "#050505",
    skeletonBg: "#111111",

    primaryText: "#f5eedc",
    secondaryText: "#c7b08a",
    selectedTextColor: "#111111",
    selectedTextBg: "#f5eedc",

    primaryButtonBg: "#e3bf72",
    primaryButtonText: "#181210",
    secondaryButtonBg: "#050505",
    secondaryButtonText: "#f5eedc",
    secondaryButtonHoverBg: "#111111",
    accentButtonBg: "#e3bf72",
    accentButtonText: "#181210",
    connectedButtonBg: "#050505",
    connectedButtonHoverBg: "#111111",

    secondaryIconColor: "#c7b08a",
    secondaryIconHoverColor: "#f5eedc",
    secondaryIconHoverBg: "#111111",
    danger: "#f97373",
    success: "#4ade80",
    tooltipBg: "#050505",
    tooltipText: "#f5eedc",
    inputAutofillBg: "#050505",
    scrollbarBg: "#050505",
  },
});

// Simple error boundary for CheckoutWidget
class CheckoutBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("CheckoutWidget crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <p style={{ color: "#e3bf72", marginTop: "12px" }}>
          Checkout temporarily unavailable. Please try again later.
        </p>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [usdAmount, setUsdAmount] = useState("1");

  const menuRef = useRef(null);

  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  const year = new Date().getFullYear();
  const isConnected = !!account;

  // Close 3-dot menu on outside click / Esc
  useEffect(() => {
    function handleClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const shortAddress = account?.address
    ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}`
    : "";

  const handleCopyAddress = async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      alert("Patron Wallet address copied.");
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  const handleSignOut = () => {
    if (!activeWallet || !disconnect) return;
    try {
      disconnect(activeWallet);
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  const normalizedAmount =
    usdAmount && Number(usdAmount) > 0 ? String(usdAmount) : "1";

  // Balances
  const { data: baseBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client,
  });

  // USDC on Base
  const { data: usdcBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client,
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  });

  // PATRON token on Base
  const { data: patronBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client,
    tokenAddress: "0xD766a771887fFB6c528434d5710B406313CAe03A",
  });

  // Optional: same behavior as Patronium site (tries to mint after checkout)
  const handleCheckoutSuccess = async (result) => {
    try {
      // If you have the same Netlify function in THIS repo, this will work.
      // If not, it will fail gracefully and still confirm payment succeeded.
      const resp = await fetch("/.netlify/functions/mint-patron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: account?.address,
          usdAmount: normalizedAmount,
          checkout: {
            id: result?.id,
            amountPaid: result?.amountPaid ?? normalizedAmount,
            currency: result?.currency ?? "USD",
          },
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.warn("mint-patron not available or errored:", text);
        alert(
          "Payment succeeded.\n\n" +
            "Auto-credit wasn’t available on this site yet, but we can reconcile and credit you.\n" +
            "If you need immediate credit, use PoloPatronium.com."
        );
        return;
      }

      await resp.json();
      alert("Thank you — payment received. PATRON is being credited.");
    } catch (err) {
      console.warn("Checkout success follow-up failed:", err);
      alert(
        "Payment succeeded.\n\n" +
          "Auto-credit wasn’t available on this site yet. We’ll reconcile and credit you."
      );
    }
  };

  return (
    <>
      {/* Fixed 3-dot menu */}
      <nav
        className={`usp-menu ${menuOpen ? "is-open" : ""}`}
        role="navigation"
        aria-label="Site menu"
        ref={menuRef}
      >
        <button
          className="usp-menu__btn"
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : "false"}
          aria-controls="usp-menu-list"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((open) => !open);
          }}
        >
          …
        </button>

        <div
          id="usp-menu-list"
          className="usp-menu__panel"
          role="menu"
          onClick={(e) => e.stopPropagation()}
        >
          <a className="usp-menu__link" role="menuitem" href="#content">
            USPPA
          </a>

          <div className="usp-menu__heading">Patrons</div>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://polopatronium.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polo Patronium
          </a>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://militestempli.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Milites Templi
          </a>

          <div className="usp-menu__heading">Chapters & Initiatives</div>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://charlestonpolo.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Charleston Polo
          </a>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://cowboypolo.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cowboy Polo Circuit
          </a>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://thepololife.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Polo Life
          </a>
        </div>
      </nav>

      {/* Site header with centered pill Patron Wallet button */}
      <header className="site-header">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setWalletOpen(true)}
          style={{ marginBottom: "1.25rem" }}
        >
          Patron Wallet
        </button>

        <h1 className="masthead-title">
          UNITED STATES
          <br />
          POLO PATRONS
          <br />
          ASSOCIATION
        </h1>

        <p className="est">
          FOUNDING<span className="dot">·</span>AD MMXXV · 2025
        </p>
      </header>

      {/* Main USPPA content (your full original content preserved) */}
      <main id="content" className="container">
        <hr className="rule" />
        <h2 className="sc">Announcement</h2>
        <p>
          It is with honour that we record the foundation of the United States
          Polo Patrons Association. This fellowship of patrons and players is
          inaugurated with <i>Polo Patronium</i>, a living token of support and
          tradition. Our purpose is simple: to safeguard the heritage of polo,
          encourage its growth, and open a new chapter in the life of the game.
        </p>

        <h2 className="sc">Initiative Roadmap</h2>

        <div className="notice">
          <h3 className="notice-title">Polo Patronium</h3>
          <p>
            A token and membership initiative uniting patrons, players, and
            clubs in a shared economy of sport.{" "}
            <a
              href="https://polopatronium.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more at PoloPatronium.com
            </a>
            .
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">Charleston Polo</h3>
          <p>
            The renewal of Charleston, South Carolina’s polo tradition — our
            flagship Chapter.{" "}
            <a
              href="https://charlestonpolo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit CharlestonPolo.com
            </a>
            .
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">The Polo Life</h3>
          <p>
            A platform dedicated to presenting the elegance and traditions of
            polo to new audiences in the digital age.{" "}
            <a
              href="https://thepololife.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit ThePoloLife.com
            </a>
            .
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">Cowboy Polo Circuit</h3>
          <p>
            A national endeavour to broaden the sport’s reach, nurture emerging
            talent, and encourage the next generation of American players.{" "}
            <a
              href="https://cowboypolo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more at CowboyPolo.com
            </a>
            .
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">Domain Holdings</h3>
          <p>
            In the interest of stewardship, the Association maintains a
            portfolio of polo-related domains, ensuring the preservation of
            heritage and the expansion of opportunity for clubs, schools, and
            media.
            <br />
            <br />
            6666polo.com, 6666poloclub.com
            <br />
            boonehallpolo.com, boonehallpoloclub.com
            <br />
            campitopolo.com, campitopolo.org
            <br />
            carolinapoloclub.com
            <br />
            charlestonpolo.club, charlestonpolo.com, charlestonpolo.stream
            <br />
            charlestonpoloclub.com, charlestonpoloclub.org
            <br />
            charlestonpoloclubathydepark.com, charlestonpoloclubathydepark.org
            <br />
            charlestonpoloschool.com, charlestonyouthpolo.com
            <br />
            charlestownepolo.com, charlestownepoloclub.com
            <br />
            clemsonpolo.com, clemsonpoloclub.com
            <br />
            cowboypolo.com, cowboypolo.org, cowboypolousa.com
            <br />
            greenvillepolo.com, greenvillepoloclub.com
            <br />
            hydeparkpolo.club, hydeparkpolo.com
            <br />
            kiawahpolo.com
            <br />
            palmettopolo.com, palmettopoloclub.com
            <br />
            stonoferrypolo.com, stonoferrypoloclub.com, stonopolo.com
            <br />
            thepolo.life, thepolo.stream, thepololife.com, thepolostream.com
            <br />
            uspolopatrons.com, uspolopatrons.org
            <br />
            vaqueropolo.com
          </p>
        </div>

        <hr className="rule" />
        <h2 className="sc">Patronium — Polo Patronage Perfected</h2>
        <p>
          Patronium is the living token of patronage within the United States
          Polo Patrons Association. It is the medium through which honourable
          support is recognised and shared — not through speculation, but
          through participation. Every token of Patronium represents a place
          within the fellowship of those who uphold the game, its horses, and
          its players.
        </p>
        <p>
          It serves as the bridge between patron and player: a clear record of
          contribution and belonging within a high-trust community of sport.
          When a Chapter prospers, it offers tribute to those whose support made
          that prosperity possible. This is the essence of Patronium —
          recognition earned through genuine patronage and service to the field.
        </p>

        <hr className="rule" />
        <h2 className="sc">Charleston Polo — The USPPA Chapter Test Model</h2>
        <p>
          Each USPPA Chapter is a fully integrated polo programme operating
          under the Association’s standards. A Chapter begins as a Polo
          Incubator — a local startup where horses are gathered, pasture
          secured, instruction established, and the public welcomed to learn and
          play.
        </p>
        <p>
          Once an Incubator achieves steady operations, sound horsemanship, and
          visible community benefit, it becomes a standing Chapter of the
          Association.
        </p>

        <hr className="rule" />
        <h2 className="sc">Founding, Operating, and USPPA Patrons</h2>
        <p>
          There are three forms of Patronium holder.
          <br />
          <br />
          <b>Founding Patrons</b> are the first to support the birth of a new
          Chapter. They provide the initial horses, pasture, and capital that
          make it possible for a Polo Incubator to begin. During this founding
          period, their Patronium receives the full measure of available tribute
          — a reflection of their patronage in helping to seed the future of the
          sport.
        </p>
        <p>
          <b>Operating Patrons</b> are the active stewards responsible for the
          management of each Chapter. They receive a base salary during the
          incubator period and an operating share of tribute once the incubator
          transitions to a full chapter.
        </p>
        <p>
          <b>USPPA Patrons</b> are the ongoing supporters who sustain and
          strengthen a Chapter once it is established.
        </p>

        <hr className="rule" />
        <h2 className="sc">The Tribute Framework</h2>
        <p>
          Each Chapter follows a principle of balanced and transparent
          patronage. From its net revenue (gross revenue less operational
          costs), a Chapter aims to follow this allocation:
        </p>
        <ul>
          <li>
            <strong>51 % +</strong> retained for reinvestment — horses, pasture,
            equipment, and operations.
          </li>
          <li>
            <strong>49 %</strong> max. available to the Patronium Tribute Pool,
            from which holders are recognised for their continued patronage.
          </li>
        </ul>
        <p>
          During the Polo Incubator period, the Founding Patrons are whitelisted
          for direct proportional tribute from the Polo Incubators they support
          (49 % of tribute). After the first year, or when the Incubator can
          support itself, it transitions to a full Chapter and the tribute
          returns to the standard USPPA Patron tribute.
        </p>

        <hr className="rule" />
        <h2 className="sc">Participation</h2>
        <ul>
          <li>
            Become a Founding Patron — assist in launching a new Chapter through
            contribution of capital, horses, or facilities.
          </li>
          <li>
            Become an Operating Patron — oversee the daily life of a Chapter and
            its players.
          </li>
          <li>
            Become a USPPA Patron — support the national network and share in
            ongoing tribute cycles.
          </li>
          <li>
            Provide Horses or Land — supply the physical foundation of the sport
            under insured, transparent, and fair agreements.
          </li>
        </ul>

        <hr className="rule" />
        <h2 className="sc">In Plain Terms</h2>
        <p>
          The Association seeks not to monetise polo, but to stabilise and
          decentralise it — to bring clarity, fairness, and longevity to the way
          it is taught, funded, and shared. Patronium and the Polo Incubator
          model together create a living, self-sustaining framework for the
          game’s renewal across America.
        </p>
        <p>This is how the USPPA will grow the next American 10-Goal player.</p>

        <hr className="rule" />
        <h2 className="sc">An Invitation to Patrons and Partners</h2>
        <p>
          The Association welcomes discerning patrons, landholders, and
          professionals who wish to take part in the restoration of polo as a
          sustainable, American-bred enterprise. Each Chapter is a living
          investment in horses, land, and people — structured not for
          speculation, but for legacy.
        </p>
        <p>
          Patronium ensures every act of patronage — whether a horse consigned,
          a pasture opened, or a field sponsored — is recognised and recorded
          within a transparent, honourable system that rewards those who build
          the sport. Your contribution does not vanish into expense; it lives on
          in horses trained, players formed, and fields maintained.
        </p>
        <p>
          Those who have carried the game through their own time know: it
          survives only by the strength of its patrons. The USPPA now offers a
          new way to hold that legacy — a means to see your support endure in
          the form of living tribute.
        </p>
        <p>
          To discuss founding patronage or local chapter formation, please
          contact the Founder at{" "}
          <a href="mailto:john@charlestonpoloclub.com">
            john@charlestonpoloclub.com
          </a>
          .
        </p>

        <blockquote className="motto">
          “In honour, in sport, in fellowship.”
        </blockquote>
      </main>

      <footer className="site-footer">
        <p className="fineprint">© {year} USPoloPatrons.org</p>
      </footer>

      {/* Patron Wallet + Patronium sales modal */}
      {walletOpen && (
        <div
          className="wallet-modal-backdrop"
          onClick={() => setWalletOpen(false)}
        >
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="wallet-close"
              onClick={() => setWalletOpen(false)}
              aria-label="Close Patron Wallet"
              title="Close"
            >
              ×
            </button>

            <div className="wallet-title">Patron Wallet</div>
            <div className="wallet-subtitle">
              Same email wallet experience as Polo Patronium & Cowboy Polo.
            </div>

            {!isConnected ? (
              <ConnectEmbed
                client={client}
                wallets={wallets}
                chain={BASE}
                theme={patronCheckoutTheme}
              />
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: 10 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 13 }}>
                    {shortAddress}{" "}
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#e3bf72",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                      aria-label="Copy address"
                      title="Copy address"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div className="wallet-row">
                  <div>
                    <div className="wallet-kicker">Gas</div>
                    <div className="wallet-value">
                      {baseBalance?.displayValue || "0"}{" "}
                      {baseBalance?.symbol || "ETH"}
                    </div>
                  </div>

                  <div>
                    <div className="wallet-kicker">USDC</div>
                    <div className="wallet-value">
                      {usdcBalance?.displayValue || "0"}{" "}
                      {usdcBalance?.symbol || "USDC"}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginBottom: 10 }}>
                  <div className="wallet-kicker">Patronium Balance</div>
                  <div className="wallet-balance-big">
                    {patronBalance?.displayValue || "0"}{" "}
                    {patronBalance?.symbol || "PATRON"}
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      border: "1px solid #3a2b16",
                      background: "transparent",
                      color: "#f5eedc",
                      borderRadius: 999,
                      padding: "8px 16px",
                      cursor: "pointer",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontSize: 11,
                    }}
                  >
                    Sign Out
                  </button>
                </div>

                <div className="wallet-divider" />

                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#c7b08a",
                      marginBottom: 6,
                    }}
                  >
                    Choose Your Patronage (USD)
                  </div>

                  <input
                    className="wallet-input"
                    type="number"
                    min="1"
                    step="1"
                    value={usdAmount}
                    onChange={(e) => setUsdAmount(e.target.value)}
                  />
                </div>

                <CheckoutBoundary>
                  <CheckoutWidget
                    client={client}
                    name={"USPPA — POLO PATRONIUM"}
                    description={
                      "UNITED STATES POLO PATRONS ASSOCIATION · PATRONIUM PATRONAGE"
                    }
                    currency={"USD"}
                    chain={BASE}
                    amount={normalizedAmount}
                    // USDC token used for purchase
                    tokenAddress={"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}
                    // your seller wallet (same as Patronium site)
                    seller={"0xfee3c75691e8c10ed4246b10635b19bfff06ce16"}
                    buttonLabel={"BUY PATRON (USDC on Base)"}
                    theme={patronCheckoutTheme}
                    onSuccess={handleCheckoutSuccess}
                    onError={(err) => {
                      console.error("Checkout error:", err);
                      alert(err?.message || String(err));
                    }}
                  />
                </CheckoutBoundary>

                <div style={{ marginTop: 10, fontSize: 12, color: "#c7b08a" }}>
                  Note: If auto-credit isn’t enabled on this site yet, purchases
                  can still be reconciled and credited.
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}