import { useRef } from "react";

let audioCtx;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export default function useSound(src, enabled = true) {
  const bufferRef = useRef(null);
  const loadingRef = useRef(false);
  const unlockedRef = useRef(false);

  async function loadBuffer() {
    if (bufferRef.current || loadingRef.current) return;
    loadingRef.current = true;

    const ctx = getAudioContext();
    const res = await fetch(src);
    const arrayBuffer = await res.arrayBuffer();
    bufferRef.current = await ctx.decodeAudioData(arrayBuffer);
  }

  return async () => {
    if (!enabled) return;

    const ctx = getAudioContext();

    if (!unlockedRef.current) {
      await ctx.resume();
      unlockedRef.current = true;
    }

    if (!bufferRef.current) {
      await loadBuffer();
      if (!bufferRef.current) return;
    }

    const source = ctx.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(ctx.destination);
    source.start();
  };
}
