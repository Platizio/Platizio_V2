"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Preloader from "@/components/Preloader";

const IntroContext = createContext(true);

/** True once the preloader curtain has begun lifting. */
export function useIntroDone() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  return (
    <IntroContext.Provider value={done}>
      <Preloader onDone={() => setDone(true)} />
      {children}
    </IntroContext.Provider>
  );
}
