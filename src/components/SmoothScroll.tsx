"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // The preference is read from a live MediaQueryList and *subscribed to*,
    // not sampled once on mount. It used to be sampled: an early return on
    // `.matches` meant the setting was only ever consulted at the moment this
    // component mounted, so a reader who turned "reduce motion" on partway
    // through a visit kept the hijacked scroll until they reloaded — and a
    // reader who turned it off got nothing back until they reloaded either.
    // That is the exact failure WCAG 2.3.3 / the reduce-motion contract is
    // meant to prevent, and it is a plausible sequence rather than a
    // theoretical one: the OS toggle is often what someone reaches for
    // *because* the page they are on is moving too much.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Both handles live out here so `stop` can tear down whatever `start`
    // built, however many times the preference is flipped. `lenis` doubles as
    // the "is it running?" flag, which keeps start/stop idempotent — a change
    // event that reports the state we are already in must not spawn a second
    // rAF loop or destroy an instance twice.
    let lenis: Lenis | null = null;
    let raf = 0;

    const start = () => {
      if (lenis) return;
      // Held in a const as well so the loop closes over the instance directly
      // rather than over the mutable `lenis` binding: after `stop` nulls that
      // binding, an in-flight frame would otherwise read null and throw.
      const instance = new Lenis({ lerp: 0.105, anchors: true });
      lenis = instance;
      const loop = (time: number) => {
        instance.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!lenis) return;
      // Cancel before destroy, so no frame can be queued against a torn-down
      // instance. `destroy()` also puts the document's scroll handling back,
      // which is what actually returns the reader to native scrolling.
      cancelAnimationFrame(raf);
      raf = 0;
      lenis.destroy();
      lenis = null;
    };

    const sync = () => (reduceMotion.matches ? stop() : start());

    sync();
    reduceMotion.addEventListener("change", sync);

    return () => {
      // Listener first: unsubscribing before tearing down means a change that
      // fires during unmount cannot start a Lenis instance this cleanup has
      // already run past and would therefore leak, rAF loop and all.
      reduceMotion.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return <>{children}</>;
}
