"use client";

import Image from "next/image";
import Background from "./components/Background";
import RobuxModal from "./components/Robux";
import { useState } from "react";

const gameList = [
  {
    name: "Phantom Forces",
    img: "/pf.png",
    feats: ["Aimbot","ESP","Silent Aim","No Recoil","Wallhack","Triggerbot","Ragebot","Third Person","Fly Hack","Speed Hack"],
  },
  {
    name: "One Tap",
    img: "/onetap.png",
    feats: ["Aimbot","ESP","Silent Aim","Gun Mods","Fly","Noclip","Inf Jump","Bunny Hop","Skin Changer","Magnet"],
  },
  {
    name: "Bloxstrike",
    img: "/bloxstrike.png",
    feats: ["Aimbot","ESP","Ragebot","Magic Bullet","Skin Changer","Knife Changer","Kill All","Rapid Fire","No Spread","Backtrack"],
  },
];

const scriptStr = `loadstring(game:HttpGet("https://imperial.tech/cutescript.lua"))()`;

export default function Home() {
  const [flipped, setFlipped] = useState<number | null>(null);
  const [toast, setToast] = useState(false);
  const [rbxModal, setRbxModal] = useState<{ plan: string; gpId: string } | null>(null);

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(scriptStr);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="main-wrapper">
      <div className="canvas-container">
        <Background />
        <div className="canvas-fade" />
      </div>

      <section className="hero">
        <div className="hero-content">
          <h1 className="title">Imperial</h1>
          <p className="subtitle">Experience unparalleled performance. The new standard is here.</p>
          <div className="button-group">
            <a href="#purchase" className="btn btn-primary">Purchase Key</a>
            <a href="https://discord.gg/YKz3235zNU" className="btn btn-secondary">Join Discord</a>
          </div>
        </div>
      </section>

      <div className="script-wrapper-compact">
        <div className="script-pill">
          <code className="script-code">
            <span className="script-function">loadstring</span>
            <span className="script-paren">(</span>
            <span className="script-game">game</span>
            <span className="script-color">:</span>
            <span className="script-method">HttpGet</span>
            <span className="script-paren">(</span>
            <span className="script-url">"https://imperial.tech/cutescript.lua"</span>
            <span className="script-paren">)</span>
            <span className="script-paren">)</span>
            <span className="script-paren">(</span>
            <span className="script-paren">)</span>
          </code>
          <button className="script-copy-btn" onClick={copyScript}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <g clipPath="url(#cp)">
                <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="#fff" />
                <path d="M17.1 2H12.9C9.81693 2 8.37099 3.09409 8.06975 5.73901C8.00673 6.29235 8.465 6.75 9.02191 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V14.9781C17.25 15.535 17.7077 15.9933 18.261 15.9303C20.9059 15.629 22 14.1831 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="#fff" />
              </g>
              <defs><clipPath id="cp"><rect width="24" height="24" fill="white" /></clipPath></defs>
            </svg>
          </button>
        </div>
      </div>

      {toast && (
        <div className="toast-notification">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Script copied!</span>
        </div>
      )}

      <section id="games" className="games-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Supported Games</h2>
            <div className="section-divider" />
          </div>
          <div className="games-grid">
            {gameList.map((g, i) => (
              <div
                key={i}
                className={`game-card ${flipped === i ? "flipped" : ""}`}
                onClick={() => setFlipped(flipped === i ? null : i)}
              >
                <div className="game-card-inner">
                  <div className="game-front">
                    <div className="game-image-wrapper">
                      <Image src={g.img} alt={g.name} fill className="game-image" />
                      <div className="image-overlay" />
                    </div>
                    <div className="game-number">0{i + 1}</div>
                    <div className="game-content">
                      <h3 className="game-name">{g.name}</h3>
                      <div className="game-divider" />
                      <div className="feature-preview">
                        {g.feats.slice(0, 3).map((f, j) => (
                          <span key={j} className="feature-preview-item">{f}</span>
                        ))}
                        <span className="feature-preview-more">+{g.feats.length - 3} more</span>
                      </div>
                    </div>
                    <div className="flip-prompt">
                      <span>CLICK TO FLIP</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="game-back">
                    <div className="back-header">
                      <h3 className="back-title">{g.name}</h3>
                      <div className="back-divider" />
                      <p className="back-subtitle">Features:</p>
                    </div>
                    <div className="features-grid">
                      {g.feats.map((f, j) => (
                        <div key={j} className="feature-item-back">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flip-back-prompt">CLICK TO CLOSE</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="purchase" className="pricing">
        <div className="container">
          <h2 className="section-title">Purchase Your Key</h2>
          <p className="section-desc">Instant delivery. 24/7 Premium support.</p>
          <div className="grid">
            <div className="card">
              <div className="card-header">Monthly</div>
              <div className="price-row">
                <span className="price-text">$5</span>
              </div>
              <ul className="card-features">
                <li>30 Days Access</li>
                <li>Full Features</li>
                <li>Premium Support</li>
              </ul>
              <button
                className="btn btn-outline full-width"
                data-kmrza-product-id="8ac31b07-472a-4bbb-bd24-9174fb7fffc5"
                data-kmrza-variant-id="85f6242f-d246-457e-a35e-26786d7d9293"
                data-kmrza-quantity="1"
                data-kmrza-theme="dark"
              >
                Purchase Key
              </button>
            </div>

            <div className="card popular">
              <div className="badge">Most Popular</div>
              <div className="card-header">Lifetime</div>
              <div className="price-row">
                <span className="price-text">$7</span>
              </div>
              <ul className="card-features">
                <li>Permanent Access</li>
                <li>Full Features</li>
                <li>Premium Support</li>
              </ul>
              <button
                className="btn btn-white full-width"
                data-kmrza-product-id="215708a3-a482-4022-accf-e02478ef1ffb"
                data-kmrza-variant-id="d9884ea3-b218-413f-abb8-750c6f613714"
                data-kmrza-quantity="1"
                data-kmrza-theme="dark"
              >
                Purchase Key
              </button>
            </div>

            <div className="card">
              <div className="card-header">Monthly</div>
              <div className="price-row">
                <Image src="/robux.png" alt="Robux" width={28} height={28} className="robux-icon" />
                <span className="price-text">1,500</span>
              </div>
              <ul className="card-features">
                <li>30 Days Access</li>
                <li>Full Features</li>
                <li>Premium Support</li>
              </ul>
              <button
                className="btn btn-outline full-width"
                onClick={() => setRbxModal({ plan: "Monthly", gpId: "1814506361" })}
              >
                Purchase Key
              </button>
            </div>

            <div className="card">
              <div className="card-header">Lifetime</div>
              <div className="price-row">
                <Image src="/robux.png" alt="Robux" width={28} height={28} className="robux-icon" />
                <span className="price-text">2,000</span>
              </div>
              <ul className="card-features">
                <li>Permanent Access</li>
                <li>Full Features</li>
                <li>Premium Support</li>
              </ul>
              <button
                className="btn btn-outline full-width"
                onClick={() => setRbxModal({ plan: "Lifetime", gpId: "1814506361" })}
              >
                Purchase Key
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-brand">
                <Image src="/moon.png" alt="Imperial Logo" width={40} height={40} className="logo-image" />
                <span className="footer-logo">Imperial</span>
              </div>
              <p className="footer-copyright">© 2026 Imperial. All rights reserved.</p>
            </div>
            <div className="footer-right">
              <a href="#purchase" className="footer-btn footer-btn-primary">Purchase</a>
              <a href="https://discord.gg/YKz3235zNU" className="footer-btn footer-btn-primary">Discord</a>
            </div>
          </div>
        </div>
      </footer>

      {rbxModal && (
        <RobuxModal
          plan={rbxModal.plan}
          gamepassId={rbxModal.gpId}
          onClose={() => setRbxModal(null)}
        />
      )}
    </main>
  );
}