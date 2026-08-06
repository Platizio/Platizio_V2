"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CROSSFADE, SPRING_ENTER, SPRING_SHEET } from "@/lib/motion";
import { useIntroDone } from "@/components/IntroProvider";

const LINKS = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Insights", href: "/insights" },
];

const MotionLink = motion.create(Link);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ready = useIntroDone();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  /**
   * The sheet covers the page and blocks scroll, so it has to behave like a
   * dialog: Escape closes it, focus moves inside on open and returns to the
   * trigger on close, and the page behind is made inert so Tab cannot walk
   * into links hidden underneath.
   */
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const main = document.querySelector("main");

    if (!open) {
      main?.removeAttribute("inert");
      return;
    }

    main?.setAttribute("inert", "");
    // Focus the first link in the sheet rather than the container.
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
      main?.removeAttribute("inert");
    };
  }, [open]);

  // Return focus to the hamburger once the sheet is gone, so keyboard users
  // land back where they left rather than at the top of the document.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -64, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ ...SPRING_ENTER, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-40"
      >
        {/* The material is its own layer so that opacity is what animates.
            Fading the layer keeps this on the compositor and lets the
            backdrop-filter stop applying entirely at zero, instead of
            transitioning a blur radius. Over the hero there is nothing to
            separate from, so no material shows until content scrolls under. */}
        <div
          aria-hidden
          className={`material-chrome material-edge absolute inset-0 transition-opacity duration-500 ${
            scrolled && !open ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Gutter outside the 1400 container so the brand shares a left rail
            with the hero and every content section below. */}
        <nav
          className={`relative px-6 md:px-10 lg:px-16 transition-[padding] duration-500 ${
            scrolled ? "py-3.5" : "py-6"
          }`}
          aria-label="Primary"
        >
          <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Link
            href="/"
            className="font-display track-caption text-2xl text-porcelain"
          >
            Platizio
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="group relative py-2 text-[0.92rem] text-vibrant text-lavender transition-colors duration-300 hover:text-porcelain"
              >
                {l.label}
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brass transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100" />
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-full border border-brass/60 px-5 py-2 text-[0.92rem] font-medium text-brass transition-colors duration-300 hover:bg-brass hover:text-midnight"
            >
              Book a consultation
            </Link>
          </div>

          <button
            ref={triggerRef}
            className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span
              className={`h-px w-6 bg-porcelain transition-transform duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-porcelain transition-transform duration-300 ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={sheetRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="material-sheet fixed inset-0 z-30 flex flex-col justify-end px-6 pb-16 pt-28"
            initial={reduce ? { opacity: 0 } : { y: "-100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "-100%" }}
            // Bounce on an opacity cross-fade would overshoot past 1 and flicker.
            transition={reduce ? CROSSFADE : SPRING_SHEET}
          >
            <ul className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <li key={l.label} className="overflow-hidden">
                  <MotionLink
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block font-display text-[clamp(2.5rem,10vw,4rem)] leading-[1.1] text-porcelain"
                    initial={reduce ? {} : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ ...SPRING_ENTER, delay: 0.15 + i * 0.06 }}
                  >
                    {l.label}
                  </MotionLink>
                </li>
              ))}
            </ul>
            <MotionLink
              href="/contact"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-10 inline-flex w-fit items-center rounded-full bg-brass px-7 py-3.5 font-medium text-midnight"
            >
              Book a consultation
            </MotionLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
