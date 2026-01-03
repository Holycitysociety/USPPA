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

// ---------------------------------------------
// Thirdweb client / chain / wallets
// ---------------------------------------------
const client = createThirdwebClient({
  clientId: "f58c0bfc6e6a2c00092cc3c35db1eed8",
});

const BASE = defineChain(8453);

const wallets = [
  inAppWallet({
    auth: { options: ["email"] },
  }),
];

// Same dark gold-on-black theme as Polo Patronium
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

// ---------------------------------------------
// Main App
// ---------------------------------------------
export default function App() {
  const year = 2026;

  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const isConnected = !!account;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [usdAmount, setUsdAmount] = useState("1");

  const menuRef = useRef(null);
  const gateRef = useRef(null);
  const walletScrollRef = useRef(null);

  const [gateActive, setGateActive] = useState(false);

  // Balances (same as Patronium site)
  const { data: baseBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client,
  });

  const { data: usdcBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client,
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
  });

  const { data: patronBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client,
    tokenAddress: "0xD766a771887fFB6c528434d5710B406313CAe03A", // PATRON
  });

  // -------------------------------------------
  // 3-dot dropdown menu: outside click / Esc
  // -------------------------------------------
  useEffect(() => {
    function handleClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  // -------------------------------------------
  // Scroll lock when wallet modal is open
  // (mobile-safe: stores scrollY and restores)
  // -------------------------------------------
  useEffect(() => {
    if (!isWalletOpen) return;

    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    // ensure wallet scroll is reset
    requestAnimationFrame(() => {
      if (walletScrollRef.current) walletScrollRef.current.scrollTop = 0;
    });

    return () => {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";

      const restoreY = top ? Math.abs(parseInt(top, 10)) : 0;
      window.scrollTo(0, restoreY);
    };
  }, [isWalletOpen]);

  // -------------------------------------------
  // Gate activation: when the Patronium section
  // (gateRef) reaches the trigger band.
  // -------------------------------------------
  useEffect(() => {
    const onScroll = () => {
      const anchor = gateRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const triggerY = 140; // px from top of viewport

      const shouldActivate = rect.top <= triggerY;
      setGateActive(shouldActivate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openWallet = () => setIsWalletOpen(true);
  const closeWallet = () => setIsWalletOpen(false);

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

  const handleCheckoutSuccess = async (result) => {
    try {
      if (!account?.address) return;

      const resp = await fetch("/.netlify/functions/mint-patron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: account.address,
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
        console.error("mint-patron error:", text);
        alert(
          "Payment succeeded, but we could not mint PATRON automatically.\n" +
            "We’ll review your transaction and credit you manually if needed."
        );
        return;
      }

      await resp.json();
      alert(
        "Thank you — your patronage payment was received.\n\n" +
          "PATRON is being credited to your wallet."
      );
    } catch (err) {
      console.error("Error in handleCheckoutSuccess:", err);
      alert(
        "Payment completed, but there was an error minting PATRON.\n" +
          "We’ll review and fix this on our side."
      );
    }
  };

  return (
    <div className="page">
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
            setMenuOpen((v) => !v);
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
          <a className="usp-menu__link" role="menuitem" href="#top">
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

      {/* Header / hero */}
      <header id="top" className="site-header">
        <div className="header-actions">
          <button
            className="btn btn-primary"
            type="button"
            onClick={openWallet}
          >
            Patron Wallet
          </button>
        </div>

        <h1 className="masthead-title">
          <span className="masthead-line">United States Polo</span>
          <br />
          <span className="masthead-line">Patrons Association</span>
        </h1>

        <p className="est">
          FOUNDING<span className="dot">·</span>MMXXVI
        </p>
      </header>

      {/* Main content */}
      <main className="container">
        <hr className="rule" />

        <h2 className="sc">Announcement</h2>
        <p>
          It is with honour that we record the foundation of the United States
          Polo Patrons Association. This fellowship of patrons and players is
          inaugurated with <i>Polo Patronium</i>, a living token of support and
          tradition. Our purpose is simple: to safeguard the heritage of polo,
          encourage its growth, and open a new chapter in the life of the game.
        </p>

        <hr className="rule rule-spaced" />

        {/* Initiative Roadmap */}
        <section className="roadmap" aria-label="Initiative Roadmap">
          <div className="roadmap-head">
            <div className="roadmap-kicker">Initiative</div>
            <div className="roadmap-title">Roadmap</div>
          </div>

          {/* POLO PATRONIUM */}
          <div className="initiative">
            <div
              className="wm wm-patronium"
              aria-label="Polo Patronium wordmark"
            >
              <div className="wm-top">Official Token</div>
              <div className="wm-main">Polo&nbsp;Patronium</div>
              <div className="wm-rule" />
              <div className="wm-sub">Symbol “PATRON” · Built on Base</div>
            </div>

            <p className="initiative-text">
              A token and membership initiative uniting patrons, players, and
              clubs in a shared economy of sport.
            </p>

            <div className="cta-row">
              <a
                className="btn btn-primary"
                href="https://polopatronium.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Polopatronium.com
              </a>
            </div>

            <div className="divider" />
          </div>

          {/* COWBOY POLO CIRCUIT */}
          <div className="initiative">
            <div
              className="wm wm-cowboy"
              aria-label="Cowboy Polo Circuit wordmark"
            >
              <div className="wm-top">League</div>
              <div className="wm-main">Cowboy&nbsp;Polo</div>
              <div className="wm-mid">
                <span className="wm-dot">·</span>Circuit
                <span className="wm-dot">·</span>
              </div>
              <div className="wm-sub">American Development Pipeline</div>
            </div>

            <p className="initiative-text">
              A national endeavour to broaden the sport’s reach, nurture
              emerging talent, and encourage the next generation of American
              players.
            </p>

            <div className="cta-row">
              <a
                className="btn btn-primary"
                href="https://cowboypolo.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cowboypolo.com
              </a>
            </div>

            <div className="divider" />
          </div>

          {/* THE POLO LIFE */}
          <div className="initiative">
            <div className="wm wm-simple" aria-label="The Polo Life wordmark">
              <div className="wm-top">Media</div>
              <div className="wm-main">The&nbsp;Polo&nbsp;Life</div>
              <div className="wm-sub">
                Stories · Horses · Players · Chapters
              </div>
            </div>

            <p className="initiative-text">
              A platform dedicated to presenting the elegance and traditions of
              polo to new audiences in the digital age.
            </p>

            <div className="cta-row">
              <a
                className="btn btn-primary"
                href="https://thepololife.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Thepololife.com
              </a>
            </div>

            <div className="divider" />
          </div>

          {/* CHARLESTON POLO */}
          <div className="initiative">
            <div
              className="wm wm-simple"
              aria-label="Charleston Polo wordmark"
            >
              <div className="wm-top">Flagship Chapter</div>
              <div className="wm-main">Charleston&nbsp;Polo</div>
              <div className="wm-sub">USPPA Chapter Test Model</div>
            </div>

            <p className="initiative-text">
              The renewal of Charleston, South Carolina’s polo tradition — our
              flagship Chapter and living test model for the USPPA incubator
              framework.
            </p>

            <div className="cta-row">
              <a
                className="btn btn-primary"
                href="https://charlestonpolo.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Charlestonpolo.com
              </a>
            </div>
          </div>

          <p className="roadmap-footnote">
            All initiatives are coordinated and supported through Polo
            Patronium — the living token of patronage within the United States
            Polo Patrons Association.
          </p>
        </section>

        <hr className="rule rule-spaced" />

        {/* ---------------------------------------------
            GATED ZONE (Patronium — Polo Patronage Perfected)
           --------------------------------------------- */}
        <section className="gate-zone" aria-label="Patronium Framework">
          <div ref={gateRef} className="gate-lock-anchor" />

          {gateActive && !isConnected && (
            <div
              className="gate-overlay"
              role="button"
              aria-label="Sign in required to continue"
              onClick={openWallet}
            >
              <div className="gate-card">
                <div className="gate-kicker">Patron Wallet Required</div>
                <div className="gate-title">Sign in to continue</div>
                <div className="gate-copy">
                  This section and everything below is reserved for signed-in
                  patrons. Tap here to open Patron Wallet.
                </div>
                <div style={{ marginTop: 14 }}>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={openWallet}
                  >
                    Open Patron Wallet
                  </button>
                </div>
              </div>
            </div>
          )}

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
            When a Chapter prospers, it offers tribute to those whose support
            made that prosperity possible. This is the essence of Patronium —
            recognition earned through genuine patronage and service to the
            field.
          </p>

          <hr className="rule" />

          <h2 className="sc">Charleston Polo — The USPPA Chapter Test Model</h2>
          <p>
            Each USPPA Chapter is a fully integrated polo programme operating
            under the Association’s standards. A Chapter begins as a Polo
            Incubator — a local startup where horses are gathered, pasture
            secured, instruction established, and the public welcomed to learn
            and play.
          </p>
          <p>
            Once an Incubator achieves steady operations, sound horsemanship,
            and visible community benefit, it becomes a standing Chapter of the
            Association.
          </p>

          <hr className="rule" />

          <h2 className="sc">Founding, Operating, and USPPA Patrons</h2>
          <p>There are three forms of Patronium holder.</p>
          <p>
            <b>Founding Patrons</b> are the first to support the birth of a new
            Chapter. They provide the initial horses, pasture, and capital that
            make it possible for a Polo Incubator to begin. During this founding
            period, their Patronium receives the full measure of available
            tribute — a reflection of their patronage in helping to seed the
            future of the sport.
          </p>
          <p>
            <b>Operating Patrons</b> are the active stewards responsible for the
            management of each Chapter. They receive a base salary during the
            incubator period and an operating share of tribute once the
            incubator transitions to a full Chapter.
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
              <strong>51%+</strong> retained for reinvestment — horses,
              pasture, equipment, and operations.
            </li>
            <li>
              <strong>49%</strong> max. available to the Patronium Tribute Pool,
              from which holders are recognised for their continued patronage.
            </li>
          </ul>
          <p>
            During the Polo Incubator period, the Founding Patrons are
            whitelisted for direct proportional tribute from the Polo Incubators
            they support (49% of tribute). After the first year, or when the
            Incubator can support itself, it transitions to a full Chapter and
            the tribute returns to the standard USPPA Patron tribute.
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
              Become a USPPA Patron — support the national network and share in
              ongoing tribute cycles.
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
            Incubator model together create a living, self-sustaining framework
            for the game’s renewal across America. This is how the USPPA will
            grow the next American 10-Goal player.
          </p>

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
            the sport. Your contribution does not vanish into expense; it lives
            on in horses trained, players formed, and fields maintained. Those
            who have carried the game through their own time know: it survives
            only by the strength of its patrons. The USPPA now offers a new way
            to hold that legacy — a means to see your support endure in the form
            of living tribute.
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
        </section>

        <footer className="site-footer">
          <p>© {year} USPoloPatrons.org</p>
        </footer>
      </main>

      {/* Patron Wallet modal — same behaviour as Patronium site */}
      {isWalletOpen && (
        <div
          className="wallet-modal-backdrop"
          onClick={closeWallet}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.86)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "14px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "380px" }}>
            <div
              ref={walletScrollRef}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1px solid #3a2b16",
                borderRadius: "14px",
                padding: "16px",
                paddingTop: "26px",
                background: "#050505",
                boxShadow: "0 18px 60px rgba(0,0,0,0.85)",
                fontFamily:
                  '"Cinzel", "EB Garamond", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", serif',
                color: "#f5eedc",
                fontSize: "13px",
                position: "relative",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                  position: "relative",
                  paddingTop: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c7b08a",
                    lineHeight: 1.1,
                    textAlign: "center",
                  }}
                >
                  U S P P A
                  <br />
                  Patron Wallet
                </div>

                <button
                  onClick={closeWallet}
                  aria-label="Close wallet"
                  title="Close"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "56px",
                    height: "56px",
                    border: "none",
                    background: "transparent",
                    color: "#e3bf72",
                    fontSize: "38px",
                    lineHeight: 1,
                    cursor: "pointer",
                    padding: 0,
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Connect / Account */}
              {!account ? (
                <div style={{ marginBottom: "14px" }}>
                  <ConnectEmbed
                    client={client}
                    wallets={wallets}
                    chain={BASE}
                    theme={patronCheckoutTheme}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: "14px", textAlign: "center" }}>
                  {/* Address + copy */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: "10px",
                      marginTop: "2px",
                    }}
                  >
                    <div style={{ fontFamily: "monospace", fontSize: "13px" }}>
                      {shortAddress}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#e3bf72",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                      aria-label="Copy Patron Wallet address"
                    >
                      📋
                    </button>
                  </div>

                  {/* Gas + USDC */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "28px",
                      marginBottom: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#9f8a64",
                          marginBottom: "2px",
                        }}
                      >
                        Gas
                      </div>
                      <div style={{ color: "#f5eedc", fontSize: "13px" }}>
                        {baseBalance?.displayValue || "0"}{" "}
                        {baseBalance?.symbol || "ETH"}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#9f8a64",
                          marginBottom: "2px",
                        }}
                      >
                        USDC
                      </div>
                      <div style={{ color: "#f5eedc", fontSize: "13px" }}>
                        {usdcBalance?.displayValue || "0"}{" "}
                        {usdcBalance?.symbol || "USDC"}
                      </div>
                    </div>
                  </div>

                  {/* Patronium balance */}
                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#c7b08a",
                        marginBottom: "4px",
                      }}
                    >
                      Patronium Balance
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        letterSpacing: "0.02em",
                        color: "#f5eedc",
                      }}
                    >
                      {patronBalance?.displayValue || "0"}{" "}
                      {patronBalance?.symbol || "PATRON"}
                    </div>
                  </div>

                  <button
                    className="btn btn-outline"
                    style={{
                      minWidth: "auto",
                      padding: "6px 18px",
                      fontSize: "11px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}

              {/* Amount + Checkout */}
              <div style={{ position: "relative" }}>
                {!isConnected && (
                  <button
                    type="button"
                    onClick={closeWallet}
                    aria-label="Close Patron Wallet"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.68)",
                      zIndex: 10,
                      borderRadius: "12px",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  />
                )}

                <div
                  style={{
                    opacity: !isConnected ? 0.75 : 1,
                    pointerEvents: isConnected ? "auto" : "none",
                    transition: "opacity 160ms ease",
                  }}
                >
                  <div style={{ marginBottom: "12px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "10px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#c7b08a",
                        marginBottom: "6px",
                      }}
                    >
                      Choose Your Patronage (USD)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={usdAmount}
                      onChange={(e) => setUsdAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid #3a2b16",
                        background: "#050505",
                        color: "#f5eedc",
                        fontSize: "16px",
                        outline: "none",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
                      }}
                    />
                  </div>

                  <CheckoutWidget
                    client={client}
                    name={"POLO PATRONIUM"}
                    description={
                      "USPPA PATRONAGE UTILITY TOKEN · THREE SEVENS 7̶7̶7̶ REMUDA · COWBOY POLO CIRCUIT · THE POLO LIFE · CHARLESTON POLO CLUB"
                    }
                    currency={"USD"}
                    chain={BASE}
                    amount={normalizedAmount}
                    tokenAddress={
                      "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
                    } // USDC
                    seller={"0xfee3c75691e8c10ed4246b10635b19bfff06ce16"}
                    buttonLabel={"BUY PATRON (USDC on Base)"}
                    theme={patronCheckoutTheme}
                    onSuccess={handleCheckoutSuccess}
                    onError={(err) => {
                      console.error("Checkout error:", err);
                      alert(err?.message || String(err));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}