"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EXPO } from "@/components/ui/Reveal";

const LOAD_MS = 1500;
const HOLD_MS = 280;

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
    if (reduce) {
      const id = window.setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onDone();
        }
        setVisible(false);
      }, 0);
      return () => window.clearTimeout(id);
    }

    document.documentElement.style.overflow = "hidden";
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / LOAD_MS, 1);
      // ease-out-expo shaped counter
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          if (!doneRef.current) {
            doneRef.current = true;
            onDone();
          }
          setVisible(false);
          document.documentElement.style.overflow = "";
        }, HOLD_MS);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [reduce, onDone]);

  return (
    <AnimatePresence>
      {visible && !reduce && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-between bg-violet px-6 py-6 md:px-10 md:py-8"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EXPO }}
          aria-hidden
        >
          <div />
          <div className="flex items-end justify-center">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EXPO }}
              className="font-display italic text-[clamp(7rem,22vw,13rem)] leading-none text-porcelain select-none"
            >
              P
            </motion.span>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-display text-lg tracking-tight text-porcelain/80">
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
