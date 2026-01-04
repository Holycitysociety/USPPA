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

  const [walletOpen, setWalletOpen] = useState(false);
  const [gateActive, setGateActive] = useState(false);

  // gate anchor just below the Patronium heading
  const gateRef = useRef(null);

  const account = useActiveAccount();
  const isConnected = !!account;

  // --- scroll lock ONLY when wallet modal open ---
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

  // --- gate trigger: when the invisible anchor passes near the top ---
  useEffect(() => {
    const onScroll = () => {
      const anchor = gateRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const triggerOffset = 40; // px from top of viewport

      const activeNow = rect.top <= triggerOffset;
      setGateActive(activeNow);

      if (!isConnected && activeNow) {
        document.body.classList.add("gate-locked");
      } else {
        document.body.classList.remove("gate-locked");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on load

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("gate-locked");
    };
  }, [isConnected]);

  const openWallet = () => setWalletOpen(true);
  const closeWallet = () => setWalletOpen(false);

  return (
    <div className={`page ${gateActive && !isConnected ? "page-gated" : ""}`}>
      {/* Header / hero */}
      <header id="top" className="site-header">
        <div className="header-actions">
          <button
            className="btn btn-primary btn-wallet"
            type="button"
            onClick={openWallet}
          >
            Patron Wallet
          </button>
        </div>

        <h1
          className="masthead-title"
          style={{
            // widen title to roughly the content column width, responsive
            maxWidth: "min(90vw, 26rem)",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          UNITED STATES POLO
          <br />
          PATRONS ASSOCIATION
        </h1>

        <p className="est">
          AD MMXXVI<span className="dot">·</span>2026
        </p>
      </header>

      <main className="container">
        {/* Announcement */}
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

        {/* Initiative Roadmap — single column, centered wordmarks + CTAs */}
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
              <div className="wm-main">POLO&nbsp;PATRONIUM</div>
              <div className="wm-rule" />
              <div className="wm-sub">Symbol “PATRON” · Built on Base</div>
            </div>

            <p className="initiative-text">
              A token and membership initiative uniting patrons, players, and
              clubs in a shared economy of sport.
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
            <div
              className="wm wm-cowboy"
              aria-label="Cowboy Polo Circuit wordmark"
            >
              <div className="wm-main">COWBOY&nbsp;POLO</div>
              <div className="wm-mid">
                <span className="wm-dot">·</span>CIRCUIT
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
            All initiatives are coordinated and supported through Polo
            Patronium — the living token of patronage within the United States
            Polo Patrons Association.
          </p>
        </section>

        <hr className="rule rule-spaced" />

        {/* -------------------------------------------------------
            GATED ZONE STARTS HERE
           ------------------------------------------------------- */}
        <div className="gate-zone" id="patronium-polo-patronage">
          {/* Blur overlay only once the anchor is past trigger & user not connected */}
          {!isConnected && gateActive && (
            <div
              className="gate-overlay"
              onClick={openWallet}
              role="button"
              aria-label="Sign in required to continue"
            >
              <div className="gate-card">
                <div className="gate-kicker">Patron Wallet Required</div>
                <div className="gate-title">Sign in to continue</div>
                <div className="gate-copy">
                  This section and everything below is reserved for signed-in
                  patrons. Tap here to open the Patron Wallet.
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

          {/* Patronium heading */}
          <h2 className="sc">Patronium — Polo Patronage Perfected</h2>

          {/* Invisible anchor moved UP: sits just under the heading now */}
          <div ref={gateRef} className="gate-anchor" aria-hidden="true" />

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
          <p>
            There are three forms of Patronium holder.
            <br />
            <br />
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
            whitelisted for direct proportional tribute from the Polo Incubators
            they support (49 % of tribute). After the first year, or when the
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
          <p>
            This is how the USPPA will grow the next American 10-Goal player.
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
            on in horses trained, players formed, and fields maintained.
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
              U S P P A
              <br />
              Patron Wallet
            </div>
            <div className="wallet-subtitle">
              Sign in or create your Patron Wallet using email.
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
