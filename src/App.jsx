// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import { ConnectEmbed, useActiveAccount, darkTheme } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";
import "./App.css";

// ---- Thirdweb client / chain / wallets ----
const client = createThirdwebClient({
  clientId: "f58c0bfc6e6a2c00092cc3c35db1eed8",
});

const BASE = defineChain(8453);

const wallets = [
  inAppWallet({
    auth: { options: ["email"] },
  }),
];

const walletTheme = darkTheme({
  fontFamily:
    '"Cinzel", "EB Garamond", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", serif',
});

// ---- Main App ----
export default function App() {
  const year = 2026;

  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  // Gate starts at: “Patronium — Polo Patronage Perfected”
  const gateRef = useRef(null);
  const hasTriggeredGateRef = useRef(false);

  const menuRef = useRef(null);
  const account = useActiveAccount();
  const isConnected = !!account;

  const openWallet = () => setWalletOpen(true);
  const closeWallet = () => setWalletOpen(false);

  // --- dropdown menu: outside click / Esc ---
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

  // --- scroll lock ONLY when wallet modal open (mobile-safe; avoids white screen) ---
  useEffect(() => {
    if (!walletOpen) return;

    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

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
  }, [walletOpen]);

  // --- auto-open wallet once when gate hits viewport (if not connected) ---
  useEffect(() => {
    if (isConnected) {
      hasTriggeredGateRef.current = false; // allow again if they sign out later
      return;
    }

    const onScroll = () => {
      if (hasTriggeredGateRef.current) return;
      const el = gateRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const triggerY = 120; // px from top

      if (rect.top <= triggerY) {
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

          <div className="usp-menu__heading">Chapters &amp; Initiatives</div>
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

      {/* Header */}
      <header id="top" className="site-header">
        <div className="header-actions">
          <button className="btn btn-gold" type="button" onClick={openWallet}>
            Patron Wallet
          </button>
        </div>

        <h1 className="masthead-title">
          UNITED STATES POLO
          <br />
          PATRONS ASSOCIATION
        </h1>

        <p className="est">
          FOUNDING<span className="dot">·</span>2026
        </p>
      </header>

      {/* Main */}
      <main className="container">
        <hr className="rule rule-spaced" />

        <h2 className="sc">Announcement</h2>
        <p>
          It is with honour that we record the foundation of the United States Polo
          Patrons Association. This fellowship of patrons and players is inaugurated
          with <i>Polo Patronium</i>, a living token of support and tradition. Our
          purpose is simple: to safeguard the heritage of polo, encourage its growth,
          and open a new chapter in the life of the game.
        </p>

        <hr className="rule rule-spaced" />

        {/* Initiative Roadmap — single column, centered CTAs */}
        <section className="roadmap" aria-label="Initiative Roadmap">
          <div className="roadmap-head">
            <div className="roadmap-kicker">Initiative</div>
            <div className="roadmap-title">Roadmap</div>
          </div>

          {/* POLO PATRONIUM */}
          <div className="initiative">
            <div className="wm wm-patronium" aria-label="Polo Patronium wordmark">
              <div className="wm-top">Official Token</div>
              <div className="wm-main">POLO&nbsp;PATRONIUM</div>
              <div className="wm-rule" />
              <div className="wm-sub">Symbol “PATRON” · Built on Base</div>
            </div>

            <p className="initiative-text">
              A token and membership initiative uniting patrons, players, and clubs in a
              shared economy of sport.
            </p>

            <div className="cta-row">
              <a
                className="btn"
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
            <div className="wm wm-cowboy" aria-label="Cowboy Polo Circuit wordmark">
              <div className="wm-main">COWBOY&nbsp;POLO</div>
              <div className="wm-mid">
                <span className="wm-dot">·</span>
                CIRCUIT
                <span className="wm-dot">·</span>
              </div>
              <div className="wm-sub">American Development Pipeline</div>
            </div>

            <p className="initiative-text">
              A national endeavour to broaden the sport’s reach, nurture emerging talent,
              and encourage the next generation of American players.
            </p>

            <div className="cta-row">
              <a
                className="btn"
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
              <div className="wm-main">THE&nbsp;POLO&nbsp;LIFE</div>
              <div className="wm-sub">Stories · Horses · Players · Chapters</div>
            </div>

            <p className="initiative-text">
              A platform dedicated to presenting the elegance and traditions of polo to new
              audiences in the digital age.
            </p>

            <div className="cta-row">
              <a
                className="btn"
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
            <div className="wm wm-simple" aria-label="Charleston Polo wordmark">
              <div className="wm-top">Flagship Chapter</div>
              <div className="wm-main">CHARLESTON&nbsp;POLO</div>
              <div className="wm-sub">USPPA Chapter Test Model</div>
            </div>

            <p className="initiative-text">
              The renewal of Charleston, South Carolina’s polo tradition — our flagship Chapter
              and living test model for the USPPA incubator framework.
            </p>

            <div className="cta-row">
              <a
                className="btn"
                href="https://charlestonpolo.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Charlestonpolo.com
              </a>
            </div>
          </div>

          <p className="roadmap-footnote">
            All initiatives are coordinated and supported through Polo Patronium — the living
            token of patronage within the United States Polo Patrons Association.
          </p>
        </section>

        <hr className="rule rule-spaced" />

        {/* -------------------------------------------------------
            GATED ZONE STARTS HERE (blur overlay begins here)
           ------------------------------------------------------- */}
        <div ref={gateRef} className="gate-zone" id="patronium-polo-patronage">
          {!isConnected && (
            <div
              className="gate-overlay"
              onClick={openWallet}
              role="button"
              aria-label="Sign in required"
            >
              <div className="gate-card" onClick={(e) => e.stopPropagation()}>
                <div className="gate-kicker">Patron Wallet Required</div>
                <div className="gate-title">Sign in to continue</div>
                <div className="gate-copy">
                  This section and everything below is reserved for signed-in patrons.
                  Tap below to open USPPA Patron Wallet.
                </div>
                <div className="gate-cta">
                  <button className="btn btn-gold" type="button" onClick={openWallet}>
                    Open Patron Wallet
                  </button>
                </div>
              </div>
            </div>
          )}

          <h2 className="sc">Patronium — Polo Patronage Perfected</h2>
          <p>
            Patronium is the living token of patronage within the United States Polo Patrons
            Association. It is the medium through which honourable support is recognised and
            shared — not through speculation, but through participation. Every token of Patronium
            represents a place within the fellowship of those who uphold the game, its horses, and
            its players.
          </p>
          <p>
            It serves as the bridge between patron and player: a clear record of contribution and
            belonging within a high-trust community of sport. When a Chapter prospers, it offers
            tribute to those whose support made that prosperity possible.
          </p>

          <hr className="rule rule-spaced" />

          <h2 className="sc">Charleston Polo — The USPPA Chapter Test Model</h2>
          <p>
            Each USPPA Chapter is a fully integrated polo programme operating under the
            Association’s standards. A Chapter begins as a Polo Incubator — a local startup where
            horses are gathered, pasture secured, instruction established, and the public welcomed
            to learn and play.
          </p>
          <p>
            Once an Incubator achieves steady operations, sound horsemanship, and visible community
            benefit, it becomes a standing Chapter of the Association.
          </p>

          <hr className="rule rule-spaced" />

          <h2 className="sc">Founding, Operating, and USPPA Patrons</h2>
          <p>There are three forms of Patronium holder.</p>
          <p>
            <b>Founding Patrons</b> are the first to support the birth of a new Chapter. They provide
            the initial horses, pasture, and capital that make it possible for a Polo Incubator to begin.
          </p>
          <p>
            <b>Operating Patrons</b> are the active stewards responsible for the management of each Chapter.
          </p>
          <p>
            <b>USPPA Patrons</b> are the ongoing supporters who sustain and strengthen a Chapter once it is established.
          </p>

          <hr className="rule rule-spaced" />

          <h2 className="sc">The Tribute Framework</h2>
          <p>
            Each Chapter follows a principle of balanced and transparent patronage. From its net revenue
            (gross revenue less operational costs), a Chapter aims to follow this allocation:
          </p>
          <ul>
            <li>
              <strong>51%+</strong> retained for reinvestment — horses, pasture, equipment, and operations.
            </li>
            <li>
              <strong>49%</strong> max. available to the Patronium Tribute Pool, from which holders are recognised
              for their continued patronage.
            </li>
          </ul>

          <hr className="rule rule-spaced" />

          <h2 className="sc">Participation</h2>
          <ul>
            <li>Become a Founding Patron — assist in launching a new Chapter through contribution of capital, horses, or facilities.</li>
            <li>Become an Operating Patron — oversee the daily life of a Chapter and its players.</li>
            <li>Become a USPPA Patron — support the national network and share in ongoing tribute cycles.</li>
            <li>Provide Horses or Land — supply the physical foundation of the sport under insured, transparent, and fair agreements.</li>
          </ul>

          <hr className="rule rule-spaced" />

          <h2 className="sc">In Plain Terms</h2>
          <p>
            The Association seeks not to monetise polo, but to stabilise and decentralise it — to bring clarity,
            fairness, and longevity to the way it is taught, funded, and shared.
          </p>

          <hr className="rule rule-spaced" />

          <h2 className="sc">An Invitation to Patrons and Partners</h2>
          <p>
            The Association welcomes discerning patrons, landholders, and professionals who wish to take part in the
            restoration of polo as a sustainable, American-bred enterprise.
          </p>
          <p>
            To discuss founding patronage or local chapter formation, please contact the Founder at{" "}
            <a href="mailto:john@charlestonpoloclub.com">john@charlestonpoloclub.com</a>.
          </p>

          <blockquote className="motto">“In honour, in sport, in fellowship.”</blockquote>
        </div>

        <footer className="site-footer">
          <p className="fineprint">© {year} USPoloPatrons.org</p>
        </footer>
      </main>

      {/* Patron Wallet modal */}
      {walletOpen && (
        <div className="wallet-backdrop" onClick={closeWallet}>
          <div className="wallet-shell" onClick={(e) => e.stopPropagation()}>
            <button
              className="wallet-close"
              type="button"
              onClick={closeWallet}
              aria-label="Close Patron Wallet"
            >
              ×
            </button>

            <div className="wallet-title">
              USPPA
              <br />
              PATRON WALLET
            </div>

            <div className="wallet-subtitle">
              Sign in or create your USPPA Patron Wallet using email.
            </div>

            <ConnectEmbed
              client={client}
              wallets={wallets}
              chain={BASE}
              theme={walletTheme}
            />
          </div>
        </div>
      )}
    </div>
  );
}