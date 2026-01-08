import { useRef } from "react";

export default function useSound(src, enabled = true) {
  const audioRef = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(src);
  }

  return () => {
    if (!enabled) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };
}
