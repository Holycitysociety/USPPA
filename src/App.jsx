// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import { ConnectEmbed, useActiveAccount, darkTheme } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";
import "./App.css";

// ---- Thirdweb client / chain / wallets ----
const client = createThirdwebClient({
  clientId: "f58c0bfc6e6a2c00092cc3c35db1eed8", // same as Patronium/Cowboy
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
  colors: {
    modalBg: "#050505",
    modalOverlayBg: "rgba(0,0,0,0.85)",
    borderColor: "#3a2b16",
    separatorLine: "#3a2b16",
    mutedBg: "#050505",

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

export default function App() {
  const year = new Date().getFullYear();
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const menuRef = useRef(null);
  const account = useActiveAccount();
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

  // Escape closes wallet modal
  useEffect(() => {
    if (!walletOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setWalletOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [walletOpen]);

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

          <div className="usp-menu__heading">PATRONS</div>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://polopatronium.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            POLO PATRONIUM
          </a>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://militestempli.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            MILITES TEMPLI
          </a>

          <div className="usp-menu__heading">CHAPTERS</div>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://charlestonpolo.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            CHARLESTON POLO
          </a>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://cowboypolo.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            COWBOY POLO CIRCUIT
          </a>
          <a
            className="usp-menu__link"
            role="menuitem"
            href="https://thepololife.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            THE POLO LIFE
          </a>
        </div>
      </nav>

      {/* Header */}
      <header className="site-header">
        <button
          className="btn btn-primary btn-pill"
          type="button"
          onClick={() => setWalletOpen(true)}
          style={{ marginBottom: "1.15rem" }}
        >
          {isConnected ? "OPEN PATRON WALLET" : "PATRON WALLET"}
        </button>

        <h1 className="masthead-title">
          UNITED STATES POLO
          <br />
          PATRONS ASSOCIATION
        </h1>
        <p className="est">
          FOUNDING<span className="dot">·</span>AD MMXXV · 2025
        </p>
      </header>

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

        {/* INITIATIVE ROADMAP (Wordmarks + CTA pills) */}
        <section className="roadmap-wrap">
          <div className="roadmap-title">
            <div className="roadmap-kicker">INITIATIVE</div>
            <div className="roadmap-word">ROADMAP</div>
            <div className="roadmap-rule" />
          </div>

          <div className="brand-grid">
            {/* POLO PATRONIUM (simple wordmark) */}
            <div className="logo-block">
              <div className="logo-polo-patronium">
                <span className="top">POLO</span>
                <span className="main">PATRONIUM</span>
              </div>

              <p className="initiative-text">
                A token and membership initiative uniting patrons, players, and
                clubs in a shared economy of sport.
              </p>

              <div className="cta-row">
                <a
                  className="btn btn-outline btn-pill"
                  href="https://polopatronium.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VISIT POLOPATRONIUM.COM
                </a>
              </div>
            </div>

            {/* 777 WORDMARK BLOCK (exact from Patronium App.jsx) */}
            <div className="logo-block">
              <div className="logo-usp-string-remuda">
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5em",
                    padding: "8px 16px 6px",
                    borderTop: "1px solid #c7b08a",
                    borderBottom: "1px solid #c7b08a",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#c7b08a",
                    }}
                  >
                    THREE
                  </span>
                  <span style={{ fontSize: "12px", color: "#c7b08a" }}>·</span>
                  <span
                    style={{
                      fontSize: "32px",
                      letterSpacing: "0.22em",
                      color: "#f5eedc",
                      lineHeight: 1,
                    }}
                  >
                    7̶7̶7̶
                  </span>
                  <span style={{ fontSize: "12px", color: "#c7b08a" }}>·</span>
                  <span
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#c7b08a",
                    }}
                  >
                    SEVENS
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "9px",
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: "#9f8a64",
                  }}
                >
                  STRING REMUDA
                </div>
              </div>

              <p className="initiative-text">
                Our managed herd of USPPA horses — consigned or owned by the
                Association, assigned to operating patrons, trainers and local
                players, and developed for play, exhibition and training across
                our programmes.
              </p>

              <div className="cta-row">
                <a
                  className="btn btn-outline btn-pill"
                  href="https://uspolopatrons.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  READ USPPA MODEL
                </a>
              </div>
            </div>

            {/* COWBOY POLO CIRCUIT (placed BEFORE Charleston per your request) */}
            <div className="logo-block">
              <div className="logo-cowboy-polo-circuit">
                <span>COWBOY&nbsp;POLO&nbsp;CIRCUIT</span>
              </div>

              <p className="initiative-text">
                A national endeavour to broaden Polo&apos;s reach, nurture
                emerging talent, and encourage the next generation of American
                players.
              </p>

              <div className="cta-row">
                <a
                  className="btn btn-outline btn-pill"
                  href="https://cowboypolo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VISIT COWBOYPOLO.COM
                </a>
              </div>
            </div>

            {/* THE POLO LIFE */}
            <div className="logo-block">
              <div className="logo-the-polo-life">
                <span className="top">THE</span>
                <span className="main">POLO LIFE</span>
              </div>

              <p className="initiative-text">
                A platform dedicated to presenting the elegance and traditions
                of polo to new audiences in the digital age.
              </p>

              <div className="cta-row">
                <a
                  className="btn btn-outline btn-pill"
                  href="https://thepololife.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VISIT THEPOLOLIFE.COM
                </a>
              </div>
            </div>

            {/* CHARLESTON POLO */}
            <div className="logo-block">
              <div className="logo-charleston-polo">
                <span className="top">CHARLESTON</span>
                <span className="main">POLO CLUB</span>
              </div>

              <p className="initiative-text">
                The renewal of Charleston, South Carolina&apos;s polo tradition —
                our flagship Chapter and living test model for the USPPA Polo
                Incubator.
              </p>

              <div className="cta-row">
                <a
                  className="btn btn-outline btn-pill"
                  href="https://charlestonpolo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VISIT CHARLESTONPOLO.COM
                </a>
              </div>
            </div>
          </div>

          <p className="roadmap-footnote">
            These initiatives are coordinated and supported through Polo
            Patronium — the living token of patronage within the USPPA.
          </p>
        </section>

        {/* Remaining content (your original HTML content, kept) */}
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
          Each Chapter follows a principle of balanced and transparent patronage.
          From its net revenue (gross revenue less operational costs), a Chapter
          aims to follow this allocation:
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

        <blockquote className="motto">“In honour, in sport, in fellowship.”</blockquote>
      </main>

      <footer className="site-footer">
        <p className="fineprint">© {year} USPoloPatrons.org</p>
      </footer>

      {/* Patron Wallet modal (NO screen-lock / overflow changes) */}
      {walletOpen && (
        <div className="wallet-modal-backdrop" onClick={() => setWalletOpen(false)}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="wallet-close"
              onClick={() => setWalletOpen(false)}
              aria-label="Close Patron Wallet"
            >
              ×
            </button>

            <div className="wallet-title">PATRON WALLET</div>
            <div className="wallet-sub">
              {isConnected
                ? "You are signed in."
                : "Sign in or create your Patron Wallet using email."}
            </div>

            <ConnectEmbed client={client} wallets={wallets} chain={BASE} theme={walletTheme} />
          </div>
        </div>
      )}
    </div>
  );
}