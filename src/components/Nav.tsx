"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EXPO } from "@/components/ui/Reveal";
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

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -64, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: EXPO, delay: 0.15 }}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          scrolled && !open
            ? "bg-midnight/95 border-b border-lavender/10"
            : "border-b border-transparent"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-16 transition-[padding] duration-500 ${
            scrolled ? "py-3.5" : "py-6"
          }`}
          aria-label="Primary"
        >
          <Link
            href="/"
            className="font-display text-2xl tracking-tight text-porcelain"
          >
            Platizio
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="group relative py-2 text-[0.92rem] text-lavender-dim transition-colors duration-300 hover:text-porcelain"
              >
                {l.label}
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brass transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100" />
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-full border border-brass/60 px-5 py-2 text-[0.92rem] font-medium text-brass transition-colors duration-300 hover:bg-brass hover:text-midnight"
            >
              Book Consultation
            </Link>
          </div>

          <button
            className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
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
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col justify-end bg-violet px-6 pb-16 pt-28"
            initial={reduce ? { opacity: 0 } : { y: "-100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "-100%" }}
            transition={{ duration: 0.65, ease: EXPO }}
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
                    transition={{
                      duration: 0.8,
                      ease: EXPO,
                      delay: 0.15 + i * 0.06,
                    }}
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
              Book Consultation
            </MotionLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
