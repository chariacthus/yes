"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    Komerza: {
      open: (options: {
        items: { productId: string; variantId: string; quantity: number }[];
        theme?: string;
        email?: string;
      }) => void;
    };
  }
}

interface PurchaseModalProps {
  plan: {
    name: string;
    price: string;
    productId: string;
    variantId: string;
  } | null;
  onClose: () => void;
}

export default function PurchaseModal({ plan, onClose }: PurchaseModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = document.getElementById("komerza-embed");
    if (existing) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.komerza.com/embed/embed.iife.js";
    script.id = "komerza-embed";
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  if (!plan) return null;

  async function handleSubmit() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!ready || !window.Komerza) {
      setError("Checkout not ready yet, please try again.");
      return;
    }

    setLoading(true);

    onClose();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.Komerza.open({
          items: [
            {
              productId: plan!.productId,
              variantId: plan!.variantId,
              quantity: 1,
            },
          ],
          theme: "dark",
          email,
        });

        setLoading(false);
      });
    });
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <p className="modal-plan-name">{plan.name}</p>
            <p className="modal-plan-price">{plan.price}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div>
          <label className="modal-label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="you@example.com"
            className="modal-input"
            disabled={loading}
          />
          {error && <p className="modal-error">{error}</p>}
        </div>

        <p className="modal-hint">
          Your key will be delivered to this email after purchase.
        </p>

        <button
          onClick={handleSubmit}
          className="modal-submit"
          disabled={loading || !ready}
        >
          {loading ? "Loading..." : "Continue to Checkout"}
        </button>
      </div>
    </div>
  );
}
