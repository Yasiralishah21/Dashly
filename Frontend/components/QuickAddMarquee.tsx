"use client";

import { useState } from "react";

/**
 * Two scrolling rows of task name chips. User can click a chip to add that task.
 * On hover the row pauses so the chip is easy to click. Uses CSS for the scroll animation.
 * When a chip is selected, it gets a short pulse animation (optional selectedTitle prop).
 */
interface QuickAddMarqueeProps {
  tasks: string[];
  isAdded: (title: string) => boolean;
  onSelect: (title: string) => void;
  /** If set, the chip with this title gets a pulse animation (e.g. after click). */
  selectedTitle?: string | null;
}

function Chip({
  title,
  added,
  onSelect,
  isPulsing,
}: {
  title: string;
  added: boolean;
  onSelect: () => void;
  isPulsing: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !added && onSelect()}
      disabled={added}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
        added
          ? "cursor-default bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
          : "btn-primary rounded-full"
      } ${isPulsing ? "chip-pulse" : ""}`}
    >
      {added ? "✓ " : ""}
      {title}
    </button>
  );
}

export default function QuickAddMarquee({ tasks, isAdded, onSelect, selectedTitle = null }: QuickAddMarqueeProps) {
  const duplicated = [...tasks, ...tasks];
  const [leftPaused, setLeftPaused] = useState(false);
  const [rightPaused, setRightPaused] = useState(false);

  return (
    <div className="w-full">
      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        Quick add:
      </p>
      <div className="space-y-2">
        <div
          className="marquee-row py-1 min-h-[2.5rem]"
          onMouseEnter={() => setLeftPaused(true)}
          onMouseLeave={() => setLeftPaused(false)}
        >
          <div
            className={`marquee-track marquee-track-left gap-2 ${leftPaused ? "marquee-paused" : ""}`}
          >
            {duplicated.map((title, i) => (
              <Chip
                key={`left-${i}-${title}`}
                title={title}
                added={isAdded(title)}
                onSelect={() => onSelect(title)}
                isPulsing={selectedTitle === title}
              />
            ))}
          </div>
        </div>
        <div
          className="marquee-row py-1 min-h-[3rem]"
          onMouseEnter={() => setRightPaused(true)}
          onMouseLeave={() => setRightPaused(false)}
        >
          <div
            className={`marquee-track marquee-track-right gap-2 ${rightPaused ? "marquee-paused" : ""}`}
          >
            {duplicated.map((title, i) => (
              <Chip
                key={`right-${i}-${title}`}
                title={title}
                added={isAdded(title)}
                onSelect={() => onSelect(title)}
                isPulsing={selectedTitle === title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
