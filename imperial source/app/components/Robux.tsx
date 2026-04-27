"use client";

import { useState } from "react";

interface Props {
  plan: string;
  gamepassId: string;
  onClose: () => void;
}

export default function RobuxModal({ plan, gamepassId, onClose }: Props) {
  const [step, setStep] = useState<"enter" | "verify" | "done">("enter");
  const [uname, setUname] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [key, setKey] = useState("");

  const gpUrl = `https://www.roblox.com/game-pass/${gamepassId}`;
  const price = plan === "Monthly" ? "1,500" : "2,000";

  async function verify() {
    if (!uname.trim()) {
      setErr("Please enter your Roblox username.");
      return;
    }

    setBusy(true);
    setErr("");

    try {
      const res = await fetch("/api/verify-robux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uname.trim(), plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Something went wrong.");
        return;
      }

      setKey(data.key);
      setStep("done");
    } catch {
      setErr("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <p className="modal-plan-name">Robux — {plan}</p>
            <p className="modal-plan-price">{price} R$</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {step === "enter" && (
          <>
            <div className="robux-steps">
              <div className="robux-step">
                <span className="robux-step-num">1</span>
                <span>Purchase the gamepass on Roblox</span>
              </div>
              <div className="robux-step">
                <span className="robux-step-num">2</span>
                <span>Enter your Roblox username below</span>
              </div>
              <div className="robux-step">
                <span className="robux-step-num">3</span>
                <span>Click verify to receive your key</span>
              </div>
            </div>

            <button
              className="modal-submit"
              style={{ marginBottom: "1rem" }}
              onClick={() => {
                window.open(gpUrl, "_blank");
                setStep("verify");
              }}
            >
              Buy Gamepass
            </button>

            <button
              className="modal-submit"
              style={{ background: "transparent", border: "1px solid #222", color: "#fff" }}
              onClick={() => setStep("verify")}
            >
              I already bought it
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <div className="robux-steps">
              <div className="robux-step">
                <span className="robux-step-num" style={{ background: "#fff", color: "#000" }}>✓</span>
                <span style={{ color: "#555" }}>Purchase the gamepass on Roblox</span>
              </div>
              <div className="robux-step">
                <span className="robux-step-num">2</span>
                <span>Enter your Roblox username</span>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="modal-label">Roblox Username</label>
              <input
                type="text"
                value={uname}
                onChange={(e) => { setUname(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && verify()}
                placeholder="Username"
                className="modal-input"
                disabled={busy}
              />
              {err && <p className="modal-error">{err}</p>}
            </div>

            <p className="modal-hint">
              Make sure your inventory is set to public so we can verify.
            </p>

            <button onClick={verify} className="modal-submit" disabled={busy}>
              {busy ? "Verifying..." : "Verify & Get Key"}
            </button>
          </>
        )}

        {step === "done" && (
          <>
            <div className="robux-success">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>Purchase verified!</p>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="modal-label">Your Key</label>
              <div className="key-display">
                <code>{key}</code>
                <button
                  className="script-copy-btn"
                  onClick={() => navigator.clipboard.writeText(key)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <g clipPath="url(#c)">
                      <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="#fff" />
                      <path d="M17.1 2H12.9C9.81693 2 8.37099 3.09409 8.06975 5.73901C8.00673 6.29235 8.465 6.75 9.02191 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V14.9781C17.25 15.535 17.7077 15.9933 18.261 15.9303C20.9059 15.629 22 14.1831 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="#fff" />
                    </g>
                    <defs><clipPath id="c"><rect width="24" height="24" fill="white" /></clipPath></defs>
                  </svg>
                </button>
              </div>
            </div>

            <p className="modal-hint">Save this key somewhere safe. It won't be shown again.</p>

            <button onClick={onClose} className="modal-submit">Done</button>
          </>
        )}
      </div>
    </div>
  );
}