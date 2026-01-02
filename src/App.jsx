// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  ThirdwebProvider,
  ConnectEmbed,
  useActiveAccount,
  darkTheme,
} from "thirdweb/react";
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
});

// ---- Inner app (hooks live here, INSIDE provider) ----
function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const menuRef = useRef(null);
  const account = useActiveAccount();
  const year = new Date().getFullYear();

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

  // Lock background scroll when wallet modal open
  useEffect(() => {
    if (walletOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [walletOpen]);

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

      {/* Site header with centered Patron Wallet button */}
      <header className="site-header">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setWalletOpen(true)}
          style={{ marginBottom: "1.25rem" }}
        >
          {account ? "Open Patron Wallet" : "Patron Wallet"}
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

      {/* Main USPPA content */}
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
            <a href="https://polopatronium.com" target="_blank" rel="noopener noreferrer">
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
            <a href="https://charlestonpolo.com" target="_blank" rel="noopener noreferrer">
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
            <a href="https://thepololife.com" target="_blank" rel="noopener noreferrer">
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
            <a href="https://cowboypolo.com" target="_blank" rel="noopener noreferrer">
              Learn more at CowboyPolo.com
            </a>
            .
          </p>
        </div>

        {/* ... keep the rest of your content exactly as you had it ... */}

        <blockquote className="motto">“In honour, in sport, in fellowship.”</blockquote>
      </main>

      <footer className="site-footer">
        <p className="fineprint">© {year} USPoloPatrons.org</p>
      </footer>

      {/* Patron Wallet modal */}
      {walletOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.82)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 2000,
          }}
          onClick={() => setWalletOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#050505",
              color: "#f5eedc",
              borderRadius: 14,
              border: "1px solid #3a2b16",
              boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
              padding: "18px 18px 22px",
              position: "relative",
              fontFamily:
                '"Cinzel", "EB Garamond", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", serif',
            }}
          >
            <button
              type="button"
              onClick={() => setWalletOpen(false)}
              aria-label="Close Patron Wallet"
              style={{
                position: "absolute",
                top: 6,
                right: 10,
                border: "none",
                background: "transparent",
                color: "#e3bf72",
                fontSize: 28,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <h2
              style={{
                marginTop: 6,
                marginBottom: 6,
                fontSize: 16,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textAlign: "center",
                color: "#c7b08a",
              }}
            >
              Patron Wallet
            </h2>

            <p
              style={{
                fontSize: 13,
                textAlign: "center",
                marginBottom: 14,
                color: "#f5eedc",
              }}
            >
              Sign in or create your Patron Wallet using email. This is the same
              wallet used on Polo Patronium and Cowboy Polo.
            </p>

            <ConnectEmbed
              client={client}
              wallets={wallets}
              chain={BASE}
              theme={walletTheme}
            />
          </div>
        </div>
      )}
    </>
  );
}

// ---- Provider wrapper (no hooks here) ----
export default function App() {
  return (
    <ThirdwebProvider client={client}>
      <AppShell />
    </ThirdwebProvider>
  );
}