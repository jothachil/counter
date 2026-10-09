"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow, { continuous } from "@number-flow/react";
import { Confetti } from "@/components/ui/confetti";

const TARGET = 1_000_000;
const MIN_TICK_DELAY = 150;
const MAX_TICK_DELAY = 1000;
const AFTER_TARGET_TICKS = 120; // keep counting once per second for 2 minutes

const randomDelay = () =>
  MIN_TICK_DELAY + Math.random() * (MAX_TICK_DELAY - MIN_TICK_DELAY);

// Each step waits `delay` ms after the previous one starts, then rolls to `value`.
// Roll up to 999,990, pause, then tick through the last 10 numbers one by one
// with a random gap between each tick. After 1M, keep ticking once a second.
function buildSteps() {
  return [
    { value: TARGET - 10, delay: 300 },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: TARGET - 9 + i,
      delay: i === 0 ? 2000 : randomDelay(),
    })),
    ...Array.from({ length: AFTER_TARGET_TICKS }, (_, i) => ({
      value: TARGET + 1 + i,
      delay: 1000,
    })),
  ];
}

export default function BarrelCounter() {
  const [value, setValue] = useState(0);
  const confettiRef = useRef(null);

  useEffect(() => {
    let elapsed = 0;
    const timers = buildSteps().map((step) => {
      elapsed += step.delay;
      return setTimeout(() => setValue(step.value), elapsed);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Celebrate the moment the counter lands on 1M.
  useEffect(() => {
    if (value !== TARGET) return;
    const fire = confettiRef.current?.fire;
    fire?.({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
    fire?.({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } });
    fire?.({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } });
  }, [value]);

  return (
    <>
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed inset-0 z-50 size-full"
      />
      <NumberFlow
        value={value}
        plugins={[continuous]}
        trend={1}
        spinTiming={{ duration: 1000, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        transformTiming={{ duration: 800, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        className="text-center font-semibold tabular-nums tracking-tight text-black text-[clamp(3rem,14vw,10rem)]"
      />
    </>
  );
}
