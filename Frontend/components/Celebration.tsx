"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Celebration animation when a task is marked done.
 * Mixed shapes (circles, squares, strips, triangles) in button gradient colors.
 * Rendered via a portal into document.body so it is not clipped by parent overflow.
 * Does not block clicks (pointer-events: none).
 *
 * Usage: When trigger (a number) changes and is > 0, we show the animation.
 * Parent should increment trigger each time a task is completed.
 */

// Exact same colors as .btn-primary gradient (from globals.css).
const BUTTON_COLORS = [
  "rgb(156, 176, 255)",  // gradient 1 – light lavender
  "rgb(208, 173, 245)",  // gradient 2 – soft purple
  "rgb(187, 172, 255)",  // gradient 3 – lavender
];

const PIECE_COUNT = 32;

type ShapeType = "circle" | "square" | "strip" | "triangle";

const SHAPES: ShapeType[] = ["circle", "square", "strip", "triangle"];

function getShapeStyle(shape: ShapeType, color: string): React.CSSProperties {
  const base = { backgroundColor: color, animationDelay: "" };
  switch (shape) {
    case "circle":
      return { ...base, width: 12, height: 12, borderRadius: "50%" };
    case "square":
      return { ...base, width: 10, height: 10, borderRadius: 2 };
    case "strip":
      return { ...base, width: 4, height: 16, borderRadius: 1 };
    case "triangle":
      return {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderBottom: `12px solid ${color}`,
        animationDelay: "",
      };
    default:
      return { ...base, width: 10, height: 10 };
  }
}

export default function Celebration({ trigger }: { trigger: number }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(typeof document !== "undefined");
  }, []);

  useEffect(() => {
    if (trigger > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!visible || !mounted || typeof document === "undefined") return null;

  const content = (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 99999 }}
      aria-hidden
    >
      {Array.from({ length: PIECE_COUNT }, (_, i) => {
        const shape = SHAPES[i % SHAPES.length];
        const color = BUTTON_COLORS[i % BUTTON_COLORS.length];
        const shapeStyle = getShapeStyle(shape, color);
        const isTriangle = shape === "triangle";
        return (
          <div
            key={i}
            className="celebration-piece"
            style={{
              left: `${(i * 93) % 100}%`,
              ...shapeStyle,
              animationDelay: `${(i * 0.04) % 0.9}s`,
              ...(isTriangle && {
                boxShadow: "none",
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.15)) drop-shadow(0 1px 0 rgba(255,255,255,0.3))",
              }),
            }}
          />
        );
      })}
    </div>
  );

  return createPortal(content, document.body);
}
