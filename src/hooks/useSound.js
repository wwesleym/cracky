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
  const unlockedRef = useRef(false);

  if (!audioRef.current) {
    audioRef.current = new Audio(src);
    audioRef.current.preload = "auto";
  }

  return async () => {
    if (!enabled) return;

    const ctx = getAudioContext();

    if (!unlockedRef.current && ctx.state === "suspended") {
      try {
        await ctx.resume();
        unlockedRef.current = true;
      } catch {
        return;
      }
    }

    audioRef.current.currentTime = 0;

    try {
      await audioRef.current.play();
    } catch {
      // mobile silently blocks if not unlocked yet
    }
  };
}
