/**
 * Task completion sound: plays when a task is marked as done (not when unmarked).
 * Tries to play an optional MP3 from /sounds/task-done.mp3 first.
 * If the file is missing or fails, plays a short success tone using the Web Audio API
 * so the app works without any audio file.
 *
 * Usage: call playTaskDoneSound() when the user marks a task complete.
 */

const SOUND_PATH = "/sounds/task-done.mp3";

/** Play a short success tone using Web Audio (no file needed). */
function playFallbackTone(): void {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Ignore if AudioContext not supported (e.g. autoplay policy).
  }
}

/**
 * Play the task-done sound. Call this only when a task is marked done (not when unmarked).
 * Safe to call from event handlers; does nothing if audio fails.
 */
export function playTaskDoneSound(): void {
  if (typeof window === "undefined") return;

  const audio = new Audio(SOUND_PATH);
  audio.volume = 0.5;

  const onError = () => {
    playFallbackTone();
  };

  const onEnded = () => {
    audio.removeEventListener("error", onError);
    audio.removeEventListener("ended", onEnded);
  };

  audio.addEventListener("error", onError);
  audio.addEventListener("ended", onEnded);

  audio.play().catch(() => {
    playFallbackTone();
  });
}
