import type { Transition } from "motion/react";

/**
 * Motion vocabulary, in Apple's terms.
 *
 * Apple describes a spring with two dials rather than the mass/stiffness/
 * damping triplet: **damping ratio** (overshoot — 1.0 settles flat, below that
 * bounces) and **response** (how quickly it reaches the target, in seconds).
 * Motion's `bounce` and `visualDuration` are those same two dials —
 * `visualDuration` is the time the value takes to visually arrive, which is
 * exactly `response`, and `bounce: 0` is critically damped.
 *
 * These are springs rather than tweens because a spring animates from wherever
 * the value currently sits. That is what makes them interruptible: re-target
 * mid-flight and the motion stays continuous instead of snapping back to a
 * start value and replaying. Every transition a pointer can reach should be one
 * of these.
 *
 * Bounce is spent only where a gesture actually carried momentum. Overshoot on
 * a menu that merely appeared reads as noise.
 */

/** Default. Critically damped — for anything not carrying momentum. */
export const SPRING: Transition = {
  type: "spring",
  bounce: 0,
  visualDuration: 0.4,
};

/** Press and hover feedback. Same flat settle, much quicker response. */
export const SPRING_SNAP: Transition = {
  type: "spring",
  bounce: 0,
  visualDuration: 0.22,
};

/** Release of a gesture that carried momentum — overshoot is earned here. */
export const SPRING_MOMENTUM: Transition = {
  type: "spring",
  bounce: 0.2,
  visualDuration: 0.4,
};

/** Panels and sheets. Apple ships damping 0.8 / response 0.3 for drawers. */
export const SPRING_SHEET: Transition = {
  type: "spring",
  bounce: 0.2,
  visualDuration: 0.3,
};

/** Entrances. Critically damped, slower response so large moves read calmly. */
export const SPRING_ENTER: Transition = {
  type: "spring",
  bounce: 0,
  visualDuration: 0.62,
};

/**
 * Reduced motion: a short cross-fade, never a slide or a spring. Not "no
 * feedback" — a gentler, non-vestibular equivalent.
 */
export const CROSSFADE: Transition = { duration: 0.2, ease: "easeOut" };

/**
 * Easing kept for the few transitions no pointer can interrupt — the preloader
 * curtain, and CSS-side colour fades that need to match it.
 */
export const EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

/** Spring config for `useSpring` motion values (same dials, config-shaped). */
export const SPRING_CONFIG = { bounce: 0, visualDuration: 0.35 } as const;
