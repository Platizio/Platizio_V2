"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/**
 * MarketConstellation — WebGL hero background for Platizio.
 * A "midnight observatory": a breathing points terrain of market topography
 * in deep violet, on a transparent canvas over the page dark.
 *
 * The brass index line that used to cross this was removed. Its aspect-fit
 * and portrait-pan machinery is recoverable from git at d6f4103 if a future
 * hero element needs the same framing behaviour.
 */

/**
 * The canvas has to speak the same palette as the DOM. These used to be three
 * hardcoded hexes that were near-misses of the tokens they were named after —
 * #8f7bff against a --color-violet-bright of oklch(0.7 0.16 283), and so on —
 * so the two could drift apart with nobody noticing.
 *
 * three.js cannot parse oklch(), and the palette is authored in it, so the
 * tokens are resolved through a canvas: assigning any CSS colour syntax to
 * fillStyle and reading the pixel back gives true sRGB. Falls back to the
 * previous literals if the properties are missing.
 */
function resolveToken(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!value) return fallback;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return fallback;
  ctx.fillStyle = "#000";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function usePalette() {
  return useMemo(
    () => ({
      violet: resolveToken("--color-violet-bright", "#8f7bff"),
      brass: resolveToken("--color-brass", "#d8a94e"),
      space: resolveToken("--color-midnight", "#171129"),
    }),
    [],
  );
}

const COLS = 110;
const ROWS = 55;
const TERRAIN_W = 24;
const TERRAIN_D = 12;

/** Layered sine/cos displacement — calm, breathing market topography. */
function waveY(x: number, z: number, t: number): number {
  return (
    0.42 * Math.sin(x * 0.32 + t * 0.35) * Math.cos(z * 0.45 - t * 0.22) +
    0.22 * Math.sin(x * 0.78 + z * 0.52 - t * 0.16) +
    0.1 * Math.cos(z * 1.15 + x * 0.12 + t * 0.28)
  );
}

function Terrain({ reduced }: { reduced: boolean }) {
  const palette = usePalette();
  const { geometry, baseX, baseZ } = useMemo(() => {
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const baseX = new Float32Array(count);
    const baseZ = new Float32Array(count);
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c / (COLS - 1) - 0.5) * TERRAIN_W;
        const z = (r / (ROWS - 1) - 0.5) * TERRAIN_D;
        baseX[i] = x;
        baseZ[i] = z;
        positions[i * 3] = x;
        positions[i * 3 + 1] = waveY(x, z, 0); // static frame for reduced motion
        positions[i * 3 + 2] = z;
        i++;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry, baseX, baseZ };
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < baseX.length; i++) {
      arr[i * 3 + 1] = waveY(baseX[i], baseZ[i], t);
    }
    attr.needsUpdate = true;
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color={palette.violet}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

function SceneRig({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((state) => {
    if (reduced) return;
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    // Mouse parallax (±0.04 rad) plus a very slow autonomous sway.
    const targetX = pointer.current.y * 0.04;
    const targetY = pointer.current.x * 0.04 + 0.015 * Math.sin(t * 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.045);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.045);
  });

  return (
    <group ref={groupRef} position={[0, -1.6, 0]}>
      <Terrain reduced={reduced} />
    </group>
  );
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export default function MarketConstellation({ className = "" }: { className?: string }) {
  const palette = usePalette();
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  return (
    <div className={"absolute inset-0 " + className} aria-hidden>
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        frameloop={reduced ? "demand" : "always"}
        camera={{ position: [0, 2.1, 9.2], fov: 42, near: 0.1, far: 60 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.2, 0)}
      >
        {/* Fog toward the page background fades the far edge of the terrain. */}
        <fog attach="fog" args={[palette.space, 8, 22]} />
        <SceneRig reduced={reduced} />
      </Canvas>
    </div>
  );
}
