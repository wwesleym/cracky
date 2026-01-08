import { useEffect, useRef } from "react";

let audioCtx;

// creates audio context which gets reused
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

export default function useSound(src, enabled = true) {
    const bufferRef = useRef(null);

    // load and decode sound per sound file
    useEffect(() => {
        const loadSound = async () => {
            const ctx = getAudioContext();

            const res = await fetch(src);
            const arrayBuffer = await res.arrayBuffer();
            bufferRef.current = await ctx.decodeAudioData(arrayBuffer);
        };

        loadSound();
    }, [src]);

    return async () => {
        // stops playback if sound is muted or sound is not loaded
        if (!enabled || !bufferRef.current) return;

        const ctx = getAudioContext();

        // required for mobile
        if (ctx.state === "suspended") {
            await ctx.resume();
        }

        // create new source for every sound
        const source = ctx.createBufferSource();
        source.buffer = bufferRef.current;
        source.connect(ctx.destination);
        source.start(0);
    };
}
