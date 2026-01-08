import { useEffect, useRef } from "react";

let audioCtx;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export default function useSound(src, enabled = true) {
  const bufferRef = useRef(null);
  const unlockedRef = useRef(false);

  useEffect(() => {
    const ctx = getAudioContext();

    fetch(src)
      .then(res => res.arrayBuffer())
      .then(data => ctx.decodeAudioData(data))
      .then(buffer => {
        bufferRef.current = buffer;
      });
  }, [src]);

  return async () => {
    if (!enabled) return;
    if (!bufferRef.current) return;

    const ctx = getAudioContext();

    if (!unlockedRef.current && ctx.state === "suspended") {
      await ctx.resume();
      unlockedRef.current = true;
    }

    const source = ctx.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(ctx.destination);
    source.start(0);
  };
}
