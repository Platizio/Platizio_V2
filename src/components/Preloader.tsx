"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EXPO } from "@/lib/motion";

/**
 * Hard ceiling on the curtain. It used to sit on a fixed 1500ms clock plus a
 * 280ms hold plus a 900ms exit — 2.68s of latency the page invented, during
 * which scroll was locked and the counter measured nothing but its own timer.
 * Now the curtain waits on a real signal (webfonts decoded) and this is only
 * the point at which it stops waiting.
 */
const MAX_WAIT_MS = 650;
const HOLD_MS = 120;
/** Absolute backstop if rAF never runs at all — a throttled or background tab. */
const BACKSTOP_MS = MAX_WAIT_MS + 500;

/**
 * Brand curtain: drenched violet field, Fraunces monogram, brass counter.
 * Lifts like a stage curtain; onDone fires as the lift begins so the hero
 * choreography overlaps the exit.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    // If the curtain has already lifted, never lock scroll again. Without this
    // an effect re-run (an unstable onDone identity is enough) re-applies
    // overflow:hidden while finish() early-returns on doneRef — leaving the
    // page permanently unscrollable.
    if (doneRef.current) return;

    // Idempotent, and the only way the curtain ever lifts. Every path below
    // routes through it, so the page cannot end up gated behind a callback
    // that failed to fire.
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
      setVisible(false);
      document.documentElement.style.overflow = "";
    };

    if (reduce) {
      finish();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    let raf = 0;
    let ready = false;
    const start = performance.now();

    // The real signal — webfonts decoded, so the hero does not reflow under
    // the reader. Failure resolves it too: a missing font must not gate.
    document.fonts?.ready.then(
      () => { ready = true; },
      () => { ready = true; },
    );
    const cap = window.setTimeout(() => { ready = true; }, MAX_WAIT_MS);

    const tick = (now: number) => {
      const t = Math.min((now - start) / MAX_WAIT_MS, 1);
      setProgress(Math.round((t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) * 100));
      if (ready && now - start >= HOLD_MS) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const backstop = window.setTimeout(finish, BACKSTOP_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(cap);
      window.clearTimeout(backstop);
      document.documentElement.style.overflow = "";
    };
  }, [reduce, onDone]);

  return (
    <AnimatePresence>
      {/* Not `visible && !reduce`. useReducedMotion() is false during SSR, so
          gating the curtain on it rendered it on the server and omitted it on
          a reduced-motion client — the markup diverged at hydration. The
          effect above calls finish() immediately when reduce is set, so the
          curtain is dismissed on the first commit instead. `exit` is never
          serialised, so it may branch. */}
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-between bg-violet px-6 py-6 md:px-10 md:py-8"
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={
            reduce ? { duration: 0.15 } : { duration: 0.55, ease: EXPO }
          }
          aria-hidden
        >
          <div />
          <div className="flex items-end justify-center">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EXPO }}
              className="font-display italic track-display text-[clamp(7rem,22vw,13rem)] leading-none text-porcelain select-none"
            >
              P
            </motion.span>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-display track-caption text-lg text-porcelain/80">
              Platizio
            </span>
            <span className="font-sans text-sm tabular-nums text-brass">
              {progress.toString().padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
