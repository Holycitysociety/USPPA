// src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    function handleClick(e) {
      const menu = document.querySelector(".usp-menu");
      if (menu && !menu.contains(e.target)) {
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

  return (
    <>
      <header className="site-header">
        <nav
          className={`usp-menu ${menuOpen ? "is-open" : ""}`}
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
              setMenuOpen((open) => !open);
            }}
          >
            …
          </button>
          <div
            id="usp-menu-list"
            className="usp-menu__panel"
            role="menu"
          >
            <a className="usp-menu__link" role="menuitem" href="#content">
              USPPA
            </a>
            <div className="usp-menu__heading">PATRONS</div>
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
              href="https://charlestonpoloclub.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              CHARLESTON POLO
            </a>
          </div>
        </nav>

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
          <p className="notice-text">
            A token and membership initiative uniting patrons, players, and
            clubs in a shared economy of sport.
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">Charleston Polo</h3>
          <p className="notice-text">
            The renewal of Charleston, South Carolina’s polo tradition — our
            flagship Chapter.
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">The Polo Life</h3>
          <p className="notice-text">
            A platform dedicated to presenting the elegance and traditions of
            polo to new audiences in the digital age.
          </p>
        </div>

        <div className="notice">
          <h3 className="notice-title">Cowboy Polo Circuit</h3>
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
            <strong>51 % +</strong> retained for reinvestment — horses,
            pasture, equipment, and operations.
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
        <p className="fineprint">© 2025 USPoloPatrons.org</p>
      </footer>
    </>
  );
}