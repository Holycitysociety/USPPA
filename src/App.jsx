import React, { useEffect, useRef, useState } from "react";
import {
  ConnectEmbed,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useWalletBalance,
  darkTheme
} from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";

const client = createThirdwebClient({
  clientId: "f58c0bfc6e6a2c00092cc3c35db1eed8"
});

const BASE = defineChain(8453);

const wallets = [
  inAppWallet({
    auth: { options: ["email"] }
  })
];

const patronWalletTheme = darkTheme({
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
    scrollbarBg: "#050505"
  }
});

export default function App() {
  const year = new Date().getFullYear();

  // Wallet + gating
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [hasTriggeredGate, setHasTriggeredGate] = useState(false);

  const gatedSectionRef = useRef(null);
  const walletScrollRef = useRef(null);

  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const isConnected = !!account;

  // Menu state for the fixed "…" dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Balances
  const { data: baseBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client
  });

  const { data: usdcBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client,
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  });

  const { data: patronBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client,
    tokenAddress: "0xD766a771887fFB6c528434d5710B406313CAe03A"
  });

  const shortAddress = account?.address
    ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}`
    : "";

  const openWallet = () => setIsWalletOpen(true);
  const closeWallet = () => setIsWalletOpen(false);

  const handleSignOut = () => {
    if (!activeWallet || !disconnect) return;
    try {
      disconnect(activeWallet);
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  const handleCopyAddress = async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      alert("Patron Wallet address copied.");
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  // Lock background scroll when wallet modal is open
  useEffect(() => {
    if (isWalletOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        if (walletScrollRef.current) walletScrollRef.current.scrollTop = 0;
      });
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };
    }
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }, [isWalletOpen]);

  // Escape closes wallet
  useEffect(() => {
    if (!isWalletOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeWallet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isWalletOpen]);

  // Scroll-gate: auto-open wallet when Patronium section comes into view (once)
  useEffect(() => {
    if (isConnected) {
      setHasTriggeredGate(false);
      return;
    }

    const handleScroll = () => {
      if (hasTriggeredGate) return;
      const el = gatedSectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const triggerY = 120;

      if (rect.top <= window.innerHeight && rect.top <= triggerY) {
        setHasTriggeredGate(true);
        setIsWalletOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isConnected, hasTriggeredGate]);

  // Menu: close on outside click / Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <>
      {/* Fixed "…" dropdown menu, matching your HTML */}
      <nav
        className={`usp-menu ${menuOpen ? "is-open" : ""}`}
        ref={menuRef}
        role="navigation"
        aria-label="Site menu"
      >
        <button
          className="usp-menu__btn"
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : "false"}
          aria-controls="usp-menu-list"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
        >
          …
        </button>
        <div id="usp-menu-list" className="usp-menu__panel" role="menu">
          <a className="usp-menu__link" role="menuitem" href="#content">
            USPPA
          </a>
          <div className="usp-menu__heading">PATRONS</div>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://militestempli.org"
            target="_blank"
            rel="noopener"
          >
            MILITES TEMPLI
          </a>
          <div className="usp-menu__heading">CHAPTERS</div>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://charlestonpoloclub.com"
            target="_blank"
            rel="noopener"
          >
            CHARLESTON POLO
          </a>
        </div>
      </nav>

      {/* Site header */}
      <header className="site-header">
        <div className="wallet-cta-wrap">
          <button
            type="button"
            className="btn btn-primary"
            onClick={openWallet}
          >
            Patron Wallet
          </button>
        </div>

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

      {/* Wallet modal */}
      {isWalletOpen && (
        <div
          className="wallet-modal-backdrop"
          onClick={closeWallet}
          role="dialog"
          aria-modal="true"
        >
          <div className="wallet-modal-shell">
            <div
              className="wallet-modal-card"
              onClick={(e) => e.stopPropagation()}
              ref={walletScrollRef}
            >
              <button
                className="wallet-modal-close"
                onClick={closeWallet}
                aria-label="Close Patron Wallet"
              >
                ×
              </button>

              <div className="wallet-modal-header">
                <div className="wallet-modal-title">PATRON WALLET</div>
                <div className="wallet-modal-subtitle">
                  Sign in with your email to join the Patronium network on Base.
                </div>
              </div>

              {!account ? (
                <div className="wallet-connect-wrapper">
                  <ConnectEmbed
                    client={client}
                    wallets={wallets}
                    chain={BASE}
                    theme={patronWalletTheme}
                  />
                </div>
              ) : (
                <div className="wallet-account-section">
                  <div className="wallet-address-row">
                    <span className="wallet-address-label">Address</span>
                    <span className="wallet-address-value">
                      {shortAddress}
                    </span>
                    <button
                      className="wallet-address-copy"
                      onClick={handleCopyAddress}
                      type="button"
                    >
                      📋
                    </button>
                  </div>

                  <div className="wallet-balances">
                    <div className="wallet-balance-row">
                      <span className="wallet-balance-label">Gas (Base)</span>
                      <span className="wallet-balance-value">
                        {baseBalance?.displayValue || "0"}{" "}
                        {baseBalance?.symbol || "ETH"}
                      </span>
                    </div>
                    <div className="wallet-balance-row">
                      <span className="wallet-balance-label">USDC</span>
                      <span className="wallet-balance-value">
                        {usdcBalance?.displayValue || "0"}{" "}
                        {usdcBalance?.symbol || "USDC"}
                      </span>
                    </div>
                    <div className="wallet-balance-row">
                      <span className="wallet-balance-label">
                        Patronium (PATRON)
                      </span>
                      <span className="wallet-balance-value">
                        {patronBalance?.displayValue || "0"}{" "}
                        {patronBalance?.symbol || "PATRON"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="wallet-signout-button"
                    type="button"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}

              <div className="wallet-modal-footnote">
                Patron Wallet runs on Base, the Ethereum L2 by Coinbase. Use it
                across USPPA, Polo Patronium, and Cowboy Polo sites.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main id="content" className="container">
        <hr className="rule" />

        <section className="announcement">
          <h2 className="sc">Announcement</h2>
          <p className="lede dropcap">
            It is with honour that we record the foundation of the United States
            Polo Patrons Association. This fellowship of patrons and players is
            inaugurated with <i>Polo Patronium</i>, a living token of support
            and tradition. Our purpose is simple: to safeguard the heritage of
            polo, encourage its growth, and open a new chapter in the life of
            the game.
          </p>
        </section>

        <hr className="rule" />
        <h2 className="sc">Initiative Roadmap</h2>

        <div className="notice">
          <h3 className="notice-title">
            <a
              href="https://polopatronium.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Polo Patronium
            </a>
          </h3>
          <p className="notice-text">
            A token and membership initiative uniting patrons, players, and
            clubs in a shared economy of sport.
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">
            <a
              href="https://charlestonpolo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Charleston Polo
            </a>
          </h3>
          <p className="notice-text">
            The renewal of Charleston, South Carolina’s polo tradition — our
            flagship Chapter.
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">
            <a
              href="https://thepololife.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Polo Life
            </a>
          </h3>
          <p className="notice-text">
            A platform dedicated to presenting the elegance and traditions of
            polo to new audiences in the digital age.
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">
            <a
              href="https://cowboypolo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cowboy Polo Circuit
            </a>
          </h3>
          <p className="notice-text">
            A national endeavour to broaden the sport’s reach, nurture emerging
            talent, and encourage the next generation of American players.
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">Domain Holdings</h3>
          <p className="notice-text">
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
            charlestonpoloclubathydepark.com,
            charlestonpoloclubathydepark.org
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

        {/* Gated Patronium + framework block */}
        <section
          className="patronium-section usp-gate"
          ref={gatedSectionRef}
        >
          {!isConnected && (
            <div
              className="usp-gate-overlay"
              onClick={openWallet}
              role="button"
              aria-label="Sign in to view Patronium framework"
            >
              <div className="usp-gate-overlay-inner">
                <div className="usp-gate-kicker">Patronium Framework</div>
                <div className="usp-gate-title">
                  Sign into your Patron Wallet to view the full framework.
                </div>
                <p className="usp-gate-copy">
                  Connect with your email to join the USPPA Patron network on
                  Base and see how Patronium, Chapters, and tribute cycles work
                  together.
                </p>
                <button className="usp-gate-button" type="button">
                  Open Patron Wallet
                </button>
              </div>
            </div>
          )}

          <div
            className={
              "usp-gate-content" + (!isConnected ? " usp-gate-content--blur" : "")
            }
            aria-hidden={!isConnected && true}
          >
            <h2 className="sc">Patronium — Polo Patronage Perfected</h2>
            <p>
              Patronium is the living token of patronage within the United
              States Polo Patrons Association. It is the medium through which
              honourable support is recognised and shared — not through
              speculation, but through participation. Every token of Patronium
              represents a place within the fellowship of those who uphold the
              game, its horses, and its players.
            </p>
            <p>
              It serves as the bridge between patron and player: a clear record
              of contribution and belonging within a high-trust community of
              sport. When a Chapter prospers, it offers tribute to those whose
              support made that prosperity possible. This is the essence of
              Patronium — recognition earned through genuine patronage and
              service to the field.
            </p>

            <hr className="rule" />
            <h2 className="sc">
              Charleston Polo — The USPPA Chapter Test Model
            </h2>
            <p>
              Each USPPA Chapter is a fully integrated polo programme operating
              under the Association’s standards. A Chapter begins as a Polo
              Incubator — a local startup where horses are gathered, pasture
              secured, instruction established, and the public welcomed to learn
              and play.
            </p>
            <p>
              Once an Incubator achieves steady operations, sound horsemanship,
              and visible community benefit, it becomes a standing Chapter of
              the Association.
            </p>

            <hr className="rule" />
            <h2 className="sc">Founding, Operating, and USPPA Patrons</h2>
            <p>
              There are three forms of Patronium holder.
              <br />
              <br />
              <b>Founding Patrons</b> are the first to support the birth of a
              new Chapter. They provide the initial horses, pasture, and capital
              that make it possible for a Polo Incubator to begin. During this
              founding period, their Patronium receives the full measure of
              available tribute — a reflection of their patronage in helping to
              seed the future of the sport.
            </p>
            <p>
              <b>Operating Patrons</b> are the active stewards responsible for
              the management of each Chapter. They receive a base salary during
              the incubator period and an operating share of tribute once the
              incubator transitions to a full chapter.
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
                <strong>51 % +</strong> retained for reinvestment — horses,
                pasture, equipment, and operations.
              </li>
              <li>
                <strong>49 %</strong> max. available to the Patronium Tribute
                Pool, from which holders are recognised for their continued
                patronage.
              </li>
            </ul>
            <p>
              During the Polo Incubator period, the Founding Patrons are
              whitelisted for direct proportional tribute from the Polo
              Incubators they support (49 % of tribute). After the first year,
              or when the Incubator can support itself, it transitions to a full
              Chapter and the tribute returns to the standard USPPA Patron
              tribute.
            </p>

            <hr className="rule" />
            <h2 className="sc">Participation</h2>
            <ul>
              <li>
                Become a Founding Patron — assist in launching a new Chapter
                through contribution of capital, horses, or facilities.
              </li>
              <li>
                Become an Operating Patron — oversee the daily life of a Chapter
                and its players.
              </li>
              <li>
                Become a USPPA Patron — support the national network and share
                in ongoing tribute cycles.
              </li>
              <li>
                Provide Horses or Land — supply the physical foundation of the
                sport under insured, transparent, and fair agreements.
              </li>
            </ul>

            <hr className="rule" />
            <h2 className="sc">In Plain Terms</h2>
            <p>
              The Association seeks not to monetise polo, but to stabilise and
              decentralise it — to bring clarity, fairness, and longevity to the
              way it is taught, funded, and shared. Patronium and the Polo
              Incubator model together create a living, self-sustaining
              framework for the game’s renewal across America.
            </p>
            <p>This is how the USPPA will grow the next American 10-Goal player.</p>

            <hr className="rule" />
            <h2 className="sc">An Invitation to Patrons and Partners</h2>
            <p>
              The Association welcomes discerning patrons, landholders, and
              professionals who wish to take part in the restoration of polo as
              a sustainable, American-bred enterprise. Each Chapter is a living
              investment in horses, land, and people — structured not for
              speculation, but for legacy.
            </p>
            <p>
              Patronium ensures every act of patronage — whether a horse
              consigned, a pasture opened, or a field sponsored — is recognised
              and recorded within a transparent, honourable system that rewards
              those who build the sport. Your contribution does not vanish into
              expense; it lives on in horses trained, players formed, and fields
              maintained.
            </p>
            <p>
              Those who have carried the game through their own time know: it
              survives only by the strength of its patrons. The USPPA now offers
              a new way to hold that legacy — a means to see your support endure
              in the form of living tribute.
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
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p className="fineprint">© {year} USPoloPatrons.org</p>
      </footer>
    </>
  );
}