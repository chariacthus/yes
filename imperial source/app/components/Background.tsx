"use client";

import { useRef, useEffect } from "react";

export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sz = 40;
      const cols = Math.ceil(canvas.width / sz);
      const rows = Math.ceil(canvas.height / sz);
      const off = (t * 0.2) % sz;

      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;

      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * sz + off, 0);
        ctx.lineTo(i * sz + off, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * sz + off);
        ctx.lineTo(canvas.width, i * sz + off);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(255,255,255,0.02)";
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          ctx.beginPath();
          ctx.arc(i * sz + off, j * sz + off, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      t += 0.3;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="background-canvas" />;
}