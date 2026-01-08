import { useRef } from "react";

let unlocked = false;

export default function useSound(src, enabled = true) {
  const poolRef = useRef([]);

  // create small pool
  if (poolRef.current.length === 0) {
    for (let i = 0; i < 4; i++) {
      const a = new Audio(src);
      a.preload = "auto";
      poolRef.current.push(a);
    }
  }

  return () => {
    if (!enabled) return;

    if (!unlocked) {
      const unlock = new Audio();
      unlock.play().catch(() => {});
      unlocked = true;
    }

    // find free audio
    const audio =
      poolRef.current.find(a => a.paused) || poolRef.current[0];

    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
}
