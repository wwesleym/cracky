import { useRef } from "react";

let audioCtx;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export default function useSound(src, enabled = true) {
  const audioRef = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(src);
    audioRef.current.preload = "auto";
  }

  return async () => {
    if (!enabled) return;

    const ctx = getAudioContext();

    // REQUIRED for mobile
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };
}
