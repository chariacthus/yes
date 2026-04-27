"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link href="#" className="navbar-brand">
          <Image src="/moon.png" alt="Imperial Logo" width={40} height={40} className="logo-image" />
          <span className="logo-text">Imperial</span>
        </Link>
        <div className="nav-links">
          <Link href="#script" className="nav-link">Script</Link>
          <Link href="#games" className="nav-link">Games</Link>
          <Link href="#purchase" className="nav-link">Purchase</Link>
          <a href="https://discord.gg/YKz3235zNU" className="nav-link-discord">Discord</a>
        </div>
      </div>
    </nav>
  );
}