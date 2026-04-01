// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import {
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
// Thirdweb client + chain
// ---------------------------------------------
const client = createThirdwebClient({
  clientId: "f58c0bfc6e6a2c00092cc3c35db1eed8",
});

const BASE = defineChain(8453);

// Embedded user wallets (EMAIL ONLY)
// NOTE:
// Keeping this local wallet setup in place for later, even though
// the current public UX routes users directly to Cowboy Polo wallet.
const wallets = [
  inAppWallet({
    auth: {
      options: ["email"],
    },
  }),
];

// ---------------------------------------------
// Themed local wallet modal (kept for future USPPA member area use)
// NOTE:
// This styling remains available for when USPPA gets its own
// member-only / private patron area again.
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

  // NOTE:
  // Kept for future USPPA private member area.
  // Currently not triggered by public UI.
  const [walletOpen, setWalletOpen] = useState(false);

  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const isConnected = !!account;

  const walletScrollRef = useRef(null);

  // NOTE:
  // Kept for future gated/member section use.
  // No visible gate is currently rendered.
  const gateRef = useRef(null);
  const hasTriggeredGateRef = useRef(false);

  // Native ETH on Base (gas)
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

  // PATRON on Base
  const { data: patronBalance } = useWalletBalance({
    address: account?.address,
    chain: BASE,
    client,
    tokenAddress: "0xD766a771887fFB6c528434d5710B406313CAe03A",
  });

  // NOTE:
  // Preserved for future USPPA local wallet usage.
  const openWallet = () => setWalletOpen(true);
  const closeWallet = () => setWalletOpen(false);

  const handleSignOut = () => {
    if (!activeWallet || !disconnect) return;
    try {
      disconnect(activeWallet);
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

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

  // ---------------------------------------------
  // Local modal behavior retained for later reuse
  // ---------------------------------------------

  useEffect(() => {
    if (!walletOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

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
      const y = top ? Math.abs(parseInt(top, 10)) : 0;
      window.scrollTo(0, y);
    };
  }, [walletOpen]);

  useEffect(() => {
    if (!walletOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeWallet();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [walletOpen]);

  useEffect(() => {
    hasTriggeredGateRef.current = false;
  }, [isConnected]);

  // NOTE:
  // Auto-open gate logic preserved, but since no visible gated overlay
  // is rendered right now, it is effectively dormant.
  useEffect(() => {
    if (isConnected) return;

    const onScroll = () => {
      if (hasTriggeredGateRef.current) return;
      const el = gateRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const triggerY = 120;

      if (rect.top <= triggerY && rect.bottom > 0) {
        hasTriggeredGateRef.current = true;
        setWalletOpen(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [isConnected]);

  return (
    <div className="page">
      {/* Header / hero */}
      <header id="top" className="site-header">
        <div className="header-actions">
          {/* 
            PUBLIC CTA:
            For now, route all sign-in / sign-up traffic straight to the
            Cowboy Polo wallet experience.
            
            LOCAL USPPA MODAL:
            Hidden from public UX for now, but code remains below for later
            reuse when USPPA gets its own private member area.
          */}
          <a
            className="btn btn-primary"
            href="https://cowboypolo.com/#/wallet"
          >
            Sign In / Sign Up
          </a>
        </div>

        <h1 className="masthead-title">
          <span className="masthead-line">United States Polo</span>
          <span className="masthead-line">Patrons Association</span>
        </h1>

        <p className="est">
          FOUNDING<span className="dot">·</span>AD MMXXVI · 2026
        </p>
      </header>

      {/* Main content */}
      <main className="container">
        <hr className="rule" />

        <h2 className="sc">Announcement</h2>
        <p>
          It is with honour that we record the foundation of the United States
          Polo Patrons Association. This fellowship of patrons and players is
          inaugurated with <i>Patronium</i>, a living token of support and
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

          {/* PATRONIUM */}
          <div className="initiative">
            <div
              className="wm wm-patronium"
              aria-label="Polo Patronium wordmark"
            >
              <div className="wm-top">Official Polo Patronage Token</div>
              <div className="wm-main">PATRONIUM</div>
              <div className="wm-rule" />
              <div className="wm-sub">Symbol “PATRON” · Built on Base</div>
            </div>

            <p className="initiative-text">
              A token and membership initiative uniting patrons, players, and
              clubs in a shared economy of sport.
            </p>

            <div className="cta-row">
              <a
                className="btn btn-outline"
                href="https://polopatronium.com"
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
              <div className="wm-main">COWBOY&nbsp;POLO CIRCUIT</div>

              <div className="wm-sub">American Development Pipeline</div>
            </div>

            <p className="initiative-text">
              A national endeavour to broaden the sport’s reach, nurture
              emerging talent, and encourage the next generation of American
              players.
            </p>

            <div className="cta-row">
              <a
                className="btn btn-outline"
                href="https://cowboypolo.com"
              >
                Cowboypolo.com
              </a>
            </div>

            <div className="divider" />
          </div>

          {/* THREE SEVENS REMUDA */}
          <div className="initiative">
            <div
              className="wm wm-three-sevens"
              aria-label="Three Sevens Remuda wordmark"
            >
              <div className="wm-top">Remuda</div>
              <div className="three-sevens-mark">
                <div className="three-sevens-numeral">7̶7̶7̶</div>
                <div className="three-sevens-text">THREE SEVENS</div>
              </div>
            </div>

            <p className="initiative-text">
              The managed herd of USPPA horses — consigned or owned by the
              Association, assigned to operating patrons, trainers and local
              players, and developed for play, exhibition and training across
              our programmes.
            </p>

            <div className="divider" />
          </div>

          {/* THE POLO WAY */}
          <div className="initiative">
            <div className="wm wm-simple" aria-label="The Polo Way wordmark">
              <div className="wm-top">Media</div>
              <div className="wm-main">THE&nbsp;POLO&nbsp;WAY</div>
              <div className="wm-sub">Stories · Horses · Players · Chapters</div>
            </div>

            <p className="initiative-text">
              A platform dedicated to presenting the elegance and traditions of
              polo to new audiences in the digital age.
            </p>

            <div className="cta-row">
              <a
                className="btn btn-outline"
                href="https://thepoloway.com"
              >
                Thepoloway.com
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
              <div className="wm-main">CHARLESTON&nbsp;POLO</div>
              <div className="wm-sub">USPPA Chapter Test Model</div>
            </div>

            <p className="initiative-text">
              The renewal of Charleston, South Carolina’s polo tradition — our
              flagship Chapter and living test model for the USPPA incubator
              framework.
            </p>

            <div className="cta-row">
              <a
                className="btn btn-outline"
                href="https://charlestonpoloclub.com"
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

        {/* 
          NOTE:
          Former gated zone remains as a normal content section for now.
          Visible blur gate / lockout has been removed until USPPA has a real
          private members area worth protecting.
        */}
        <div
          className="gate-zone"
          id="patronium-polo-patronage"
          ref={gateRef}
        >
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
            Each USPPA Chapter is a fully integrated programme operating under
            the Association’s standards. Charleston Polo, as the flagship
            Chapter, serves as the organisational hub for the Cowboy Polo
            Circuit — coordinating local Cowboy Polo clinics, sanctioned
            chukkers at member barns and arenas, and the first pool of chapter
            horses.
          </p>
          <p>
            In its early life a Chapter begins as a Polo Incubator: a local
            startup where the “bring your own horse” model allows riders and
            stables to join the Circuit quickly, while a shared remuda is
            trained for exhibitions, league play, and new riders. Once an
            Incubator demonstrates steady operations, sound horsemanship, and
            visible benefit to our community, it is recognised as a standing
            Chapter of the USPPA.
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
            for the game’s renewal across America.
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
            Patronium ensures every act of patronage — whether a horse
            consigned, a pasture opened, or a field sponsored — is recognised
            and recorded within a transparent, honourable system that rewards
            those who build the sport. Your contribution does not vanish into
            expense; it lives on in horses trained, players formed, and fields
            maintained.
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
        </div>

        <footer className="site-footer">
          <p className="fineprint">© {year} USPoloPatrons.org</p>
        </footer>
      </main>

      {/* 
        LOCAL USPPA MODAL WALLET
        ------------------------------------------------
        This modal is intentionally kept in the codebase
        even though it is not currently the primary public
        flow. It can be re-enabled later for:

        - USPPA private member area
        - local patron-only content
        - steward/admin access
        - chapter dashboards
        - internal forms or reports

        For now, the public CTA routes users directly to:
        https://cowboypolo.com/#/wallet
      */}
      {walletOpen && (
        <div
          className="wallet-backdrop"
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
          <div style={{ width: "100%", maxWidth: 380 }}>
            <div
              ref={walletScrollRef}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1px solid #3a2b16",
                borderRadius: 14,
                padding: "16px",
                paddingTop: "26px",
                background: "#050505",
                boxShadow: "0 18px 60px rgba(0,0,0,0.85)",
                fontFamily:
                  '"Cinzel", "EB Garamond", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", serif',
                color: "#f5eedc",
                fontSize: 13,
                position: "relative",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  position: "relative",
                  paddingTop: 4,
                  textAlign: "center",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "#9f8a64",
                  }}
                >
                  U&nbsp;S&nbsp;P&nbsp;P&nbsp;A
                </div>
                <div
                  style={{
                    fontSize: 16,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c7b08a",
                    lineHeight: 1.1,
                  }}
                >
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
                    width: 56,
                    height: 56,
                    border: "none",
                    background: "transparent",
                    color: "#e3bf72",
                    fontSize: 38,
                    lineHeight: 1,
                    cursor: "pointer",
                    padding: 0,
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  ×
                </button>
              </div>

              <p
                style={{
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 14,
                  color: "#f5eedc",
                  fontFamily: '"EB Garamond", serif',
                }}
              >
                Sign in or create your Patron Wallet using email. This is the
                same wallet used on Polo Patronium and Cowboy Polo.
              </p>

              {!account ? (
                <div style={{ marginBottom: 14 }}>
                  <ConnectEmbed
                    client={client}
                    wallets={wallets}
                    chain={BASE}
                    theme={patronCheckoutTheme}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 14, textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                      marginTop: 2,
                    }}
                  >
                    <div style={{ fontFamily: "monospace", fontSize: 13 }}>
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
                        fontSize: 14,
                      }}
                      aria-label="Copy Patron Wallet address"
                    >
                      📋
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 28,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#9f8a64",
                          marginBottom: 2,
                        }}
                      >
                        Gas
                      </div>
                      <div style={{ color: "#f5eedc", fontSize: 13 }}>
                        {baseBalance?.displayValue || "0"}{" "}
                        {baseBalance?.symbol || "ETH"}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#9f8a64",
                          marginBottom: 2,
                        }}
                      >
                        USDC
                      </div>
                      <div style={{ color: "#f5eedc", fontSize: 13 }}>
                        {usdcBalance?.displayValue || "0"}{" "}
                        {usdcBalance?.symbol || "USDC"}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#c7b08a",
                        marginBottom: 4,
                      }}
                    >
                      Patronium Balance
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        letterSpacing: "0.02em",
                        color: "#f5eedc",
                      }}
                    >
                      {patronBalance?.displayValue || "0"}{" "}
                      {patronBalance?.symbol || "PATRON"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <a
                      href="https://cowboypolo.com/#/wallet"
                      className="btn btn-primary"
                      style={{
                        minWidth: "auto",
                        padding: "6px 18px",
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      Open Full Patron Wallet
                    </a>

                    <button
                      className="btn btn-outline"
                      style={{
                        minWidth: "auto",
                        padding: "6px 18px",
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}