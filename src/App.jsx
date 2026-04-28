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
const wallets = [
  inAppWallet({
    auth: {
      options: ["email"],
    },
  }),
];

// ---------------------------------------------
// Themed checkout / wallet (same spec as Patronium)
// ---------------------------------------------
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

  const [walletOpen, setWalletOpen] = useState(false);

  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const isConnected = !!account;

  const walletScrollRef = useRef(null);

  // Kept in place for future private/member gating use
  const gateRef = useRef(null);

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
      alert("Patrón Wallet address copied.");
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  // Scroll lock while wallet modal is open (mobile-safe)
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

  // Escape key closes wallet
  useEffect(() => {
    if (!walletOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeWallet();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [walletOpen]);

  return (
    <div className="page">
      {/* Header / hero */}
      <header id="top" className="site-header">
        <div className="header-actions">
          <a
            className="btn btn-primary"
            href="https://cowboypolo.com/#/wallet"
          >
            Sign In / Sign Up
          </a>
        </div>

        <h1 className="masthead-title">
          <span className="masthead-line">U S  ⋆  A R  ⋆  C A  ⋆  U K</span>
          <span className="masthead-line">Polo Patróns</span>
          <span className="masthead-line">Association</span>
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
          It is with honour that we record the foundation of the Polo Patróns
          Association. This fellowship of patrons and players is inaugurated
          with <i>Patronium</i>, a patronage token of support and tradition. Our
          purpose is simple: to safeguard the heritage of polo, encourage its
          growth, and open a new chapter in the life of the game.
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
              <div className="wm-sub">Symbol "PATRON" · Built on Base</div>
            </div>

            <p className="initiative-text">
              A token and membership initiative uniting patrons, players, and
              clubs in a shared patronage system for the sport.
            </p>

            <div className="cta-row">
              <a className="btn btn-outline" href="https://polopatronium.com">
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
              A national endeavour to broaden the sport's reach, nurture
              emerging talent, and encourage the next generation of American
              players.
            </p>

            <div className="cta-row">
              <a className="btn btn-outline" href="https://cowboypolo.com">
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
              <div className="wm-top">POLO PATRONS</div>
              <div className="three-sevens-mark">
                <div className="three-sevens-numeral">POLOBRED STRINGPOOL</div>
                <div className="three-sevens-text"></div>
              </div>
            </div>

            <p className="initiative-text">
              The managed herd of PPA horses — consigned or owned by the
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
              <a className="btn btn-outline" href="https://thepoloway.com">
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
              <div className="wm-sub">PPA Chapter Test Model</div>
            </div>

            <p className="initiative-text">
              The renewal of Charleston, South Carolina's polo tradition — our
              flagship Chapter and living test model for the PPA incubator
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
            Patronium — the patronage token of the Polo Patróns Association.
          </p>
        </section>

        <hr className="rule rule-spaced" />

        {/* -------------------------------------------------------
            GATED ZONE KEPT IN PLACE BUT CURRENTLY UNGATED
           ------------------------------------------------------- */}
        <div
          className="gate-zone"
          id="patronium-polo-patronage"
          ref={gateRef}
        >
          <h2 className="sc">The Patronium Framework</h2>

          <p>
            <b>PATRONIUM — THE PATRÓN TOKEN OF THE PPA</b>
          </p>
          <p>
            Patronium is the patronage token of the Polo Patróns Association.
          </p>
          <p>
            It gives patrons a clear way to enter the ecosystem, participate in
            real initiatives, and direct support where it is needed most —
            especially horses, teams, events, and long-term polo
            infrastructure.
          </p>
          <p>
            Patronium is the utility layer of the Association. Patrons acquire
            PATRON, then use that position to engage with initiatives, access
            opportunities, and designate support within the Association.
          </p>
          <p>
            Patron support may be acknowledged through discretionary patron
            recognition determined in light of the needs of the Association. Any
            patron-facing benefits, tribute, or related recognitions remain
            discretionary and are determined in light of operational needs,
            long-term stewardship, and the good of the mission.
          </p>

          <hr className="rule" />

          <h2 className="sc">Charleston Polo — The PPA Chapter Test Model</h2>
          <p>
            Each PPA Chapter is a fully integrated programme operating under the
            Association's standards. Charleston Polo, as the flagship Chapter,
            serves as the organisational hub for the Cowboy Polo Circuit —
            coordinating local Cowboy Polo clinics, sanctioned chukkers at
            member barns and arenas, and the first pool of chapter horses.
          </p>
          <p>
            In its early life a Chapter begins as a Polo Incubator: a local
            startup where the "bring your own horse" model allows riders and
            stables to join the Circuit quickly, while a shared remuda is
            trained for exhibitions, league play, and new riders.
          </p>
          <p>
            Once an Incubator achieves steady operations, sound horsemanship,
            and visible community benefit, it becomes a standing Chapter of the
            Association.
          </p>

          <hr className="rule" />

          <h2 className="sc">Horse Syndicates and the Association Remuda</h2>
          <p>
            One of the most important uses of the system is the creation of
            dedicated association horses and a managed remuda.
          </p>
          <p>
            Rather than leaving new players to navigate the sport through
            overpriced horse sales, fragmented advice, or one-off arrangements,
            the Association can build and manage its own horse structure through
            dedicated syndicates and association-backed mounts. That creates a
            cleaner and more trustworthy entry into the sport, with sound
            horses, clearer financial pathways, and a less painful early
            experience for new players.
          </p>
          <p>
            This allows the Association to support the full ladder of the game.
            At the entry level, it helps provide reliable horses for lessons,
            practices, and early development. At the higher end, it supports the
            maintenance of stronger strings for exhibitions, featured events,
            and tournament play.
          </p>
          <p>
            Each horse has its own ERC-1155 token ID, so support can be recorded
            and tracked horse by horse over the course of that horse's career.
            This makes it possible to organize horse-specific support, preserve
            the history of who helped bring a horse along, and reserve funds for
            old age, turnout, and retirement care.
          </p>
          <p>
            The goal is not to treat horses as disposable expenses or one-time
            transactions, but to create a more stable and enduring relationship
            between horses, patrons, players, and the Association itself.
          </p>

          <hr className="rule" />

          <h2 className="sc">Founding, Operating, and PPA Patróns</h2>
          <p>There are several ways to participate in the life of a Chapter.</p>
          <p>
            <b>Founding Patrons</b> are the first to support the birth of a new
            Chapter, horse initiative, or major programme. They help provide the
            horses, land, facilities, and early support that make it possible
            for a Polo Incubator to begin.
          </p>
          <p>
            <b>Operating Patrons</b> are the active stewards responsible for
            helping sustain the daily life, health, continuity, and long-term
            stewardship of a Chapter in service to the Association's mission.
          </p>
          <p>
            <b>PPA Patróns</b> are the broader body of supporters who strengthen
            the Association and its network of Chapters over time.
          </p>
          <p>
            These are roles of participation within the ecosystem, not separate
            classes of economic entitlement.
          </p>

          <hr className="rule" />

          <h2 className="sc">The Patronage Framework</h2>
          <p>
            Each Chapter follows a principle of balanced and transparent
            patronage. Resources are directed first toward the health,
            continuity, and responsible stewardship of the Association's horses,
            land, equipment, operations, and local programmes.
          </p>
          <p>
            Any patron-facing benefits, recognition, or discretionary tribute
            are determined by the Association in light of operational needs,
            long-term stewardship, and the good of the broader mission. No
            benefit is fixed, automatic, or guaranteed by token ownership alone.
          </p>
          <p>
            During the Polo Incubator period, the Association may offer special
            recognition or discretionary benefits to early supporters whose
            patronage helped bring a Chapter, horse, or initiative into being.
            As an Incubator matures into a standing Chapter, all patron
            recognition remains subject to the needs of the mission and the
            responsible judgment of the Association.
          </p>

          <hr className="rule" />

          <h2 className="sc">How Patronium Works</h2>
          <p>
            Patronium begins at the association level, then flows toward
            specific initiatives.
          </p>
          <p>
            A patron may use PATRON to support a horse syndicate, a team, an
            event, a chapter, a training property, a clubhouse initiative, or
            another approved project within the Association.
          </p>
          <p>
            This allows support to be directed toward a defined purpose and
            tracked over time.
          </p>
          <p>
            Direct allocation is a utility action within the ecosystem, similar
            to governance or designation, not a claim on proceeds.
          </p>

          <hr className="rule" />

          <h2 className="sc">Participation</h2>
          <ul>
            <li>
              Become a Founding Patron — assist in launching a new Chapter,
              horse initiative, or major programme through contribution of
              capital, horses, land, or facilities.
            </li>
            <li>
              Become an Operating Patron — help steward the daily life of a
              Chapter, its horses, and its players.
            </li>
            <li>
              Become a PPA Patrón — support the broader network and take part
              in the ongoing life of the Association.
            </li>
            <li>
              Provide Horses or Land — supply the physical foundation of the
              sport under insured, transparent, and fair agreements.
            </li>
            <li>
              Use Patronium to engage with initiatives, access opportunities,
              and designate support within the Association.
            </li>
          </ul>

          <hr className="rule" />

          <h2 className="sc">In Plain Terms</h2>
          <p>
            The Association seeks not to financialize polo, but to stabilize and
            decentralize it — to bring clarity, fairness, and longevity to the
            way it is taught, funded, and shared.
          </p>
          <p>
            Patronium is a utility token for organized patron participation. It
            gives patrons a cleaner way to support real horses, teams, chapters,
            events, and long-term infrastructure without reducing the sport to
            one-off donations or scattered sponsorships.
          </p>
          <p>
            This is how the PPA intends to help build the next generation of
            American players, ponies, and patrons.
          </p>

          <hr className="rule" />

          <h2 className="sc">An Invitation to Patrons and Partners</h2>
          <p>
            The Association welcomes discerning patrons, landholders,
            horsemen, and professionals who wish to take part in the
            restoration of polo as a more stable and sustainable American
            enterprise.
          </p>
          <p>
            Each Chapter is a long-term patronage model for horses, land, and
            people — structured not for speculation, but for stewardship,
            participation, and legacy.
          </p>
          <p>
            Patronium helps ensure that each act of patronage — whether a horse
            consigned, a pasture opened, or a field sponsored — can be
            recognised and recorded within a transparent and honourable system.
            Your support does not vanish into abstraction; it lives on in horses
            trained, players formed, and fields maintained.
          </p>
          <p>
            Those who have carried the game through their own time know that
            polo survives only by the strength of its patrons. The PPA now
            offers a new way to hold that legacy — a means to see your support
            endure through participation in the continued life of the
            Association.
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
            "In honour, in sport, in fellowship."
          </blockquote>
        </div>

        <footer className="site-footer">
          <p className="fineprint">© {year} PoloPatrons.org</p>
        </footer>
      </main>

      {/* Local Patrón Wallet modal kept for future member-area use, currently not triggered */}
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
                  P&nbsp;P&nbsp;A
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
                  Patrón Wallet
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
                Sign in or create your Patrón Wallet using email. This is the
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
                      aria-label="Copy Patrón Wallet address"
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
                      BUY PATRON
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
