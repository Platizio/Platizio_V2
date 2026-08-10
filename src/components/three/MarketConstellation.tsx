"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Line } from "@react-three/drei";

/**
 * MarketConstellation — WebGL hero background for Platizio.
 * A "midnight observatory": a breathing points terrain of market topography
 * in deep violet, crossed by one ascending brass index line whose key
 * vertices pulse like stars. Rendered on a transparent canvas over the
 * page's #171129 violet-black.
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

/**
 * Shape of the index line as [u, h] stops: u runs left -> right, h rises from
 * 0 at the opening level to 1 at the closing high. An early rally into a top,
 * a correction back to the opening level, then a sustained climb to new highs.
 * Plotted as straight segments between stops — a market chart joins ticks with
 * lines, it never curves through them.
 *
 * The first and last stops sit past the viewport so the line bleeds off both
 * edges rather than terminating in frame; each is collinear with the segment
 * it extends, so the bleed reads as a continuation rather than a kink.
 */
const PROFILE: [number, number][] = [
  [-0.07, -0.31111], // lead-in, collinear with the opening segment
  [0.0, 0.0],
  [0.045, 0.2],
  [0.08, 0.28],
  [0.12, 0.46],
  [0.165, 0.565],
  [0.2, 0.612],
  [0.235, 0.68],
  [0.285, 0.715],
  [0.34, 0.7],
  [0.38, 0.655],
  [0.42, 0.575],
  [0.45, 0.475],
  [0.485, 0.3],
  [0.52, 0.2],
  [0.56, 0.02],
  [0.595, 0.045],
  [0.63, 0.0],
  [0.67, 0.055],
  [0.71, 0.175],
  [0.735, 0.222],
  [0.755, 0.275],
  [0.8, 0.385],
  [0.85, 0.575],
  [0.89, 0.7],
  [0.93, 0.865],
  [0.965, 0.955],
  [1.0, 1.0],
  [1.07, 1.09], // lead-out, collinear with the closing segment
];

/**
 * Indices of the PROFILE stops that carry a marker — the four turning points
 * plus the leading print. Deliberately none in the headline's column: a marker
 * there reads as a grabbable control sitting on the type.
 */
const STAR_STOPS = [9, 13, 17, 21, 25];

// Span chosen so u 0->1 crosses the hero edge to edge and h 0->1 covers the
// full drop from the headline down to the stat row.
const X_AT_U0 = -6.92;
const X_AT_U1 = 7.4;
const Y_BASE = 1.25;
const Y_SPAN = 3.38;
const Z_AT_U0 = 0.8;
const Z_AT_U1 = -1.1;

/**
 * Marker geometry, in world units. Sized to read as quiet chart ticks behind
 * the headline, not as controls in front of it — roughly a third of the area
 * they had before.
 */
const NODE_R = 0.052;
const NODE_STROKE = 0.014;
const GOAL_R = 0.072;
const GLOW_SIZE = 0.34;

/** The aspect the chart's framing was art-directed against. */
const REF_ASPECT = 1906 / 947;

/** Below this aspect the whole profile cannot fit; start panning instead. */
const PAN_FROM_ASPECT = 1.2;
/** Aspect by which the pan is complete (roughly a phone held upright). */
const PAN_TO_ASPECT = 0.6;
/** The stop to centre once panning is complete — the middle of the recovery. */
const PAN_TO_U = 0.72;

type ChartFit = { fit: number; shift: number };

/**
 * Horizontal framing. The camera's vertical FOV is fixed, so its horizontal FOV
 * — and with it how much of the chart sits in frame — narrows as the viewport
 * gets less wide. Scaling the span by that ratio holds every marker at a
 * constant fraction of the frame width instead of letting the right-hand end
 * slide off on smaller laptops.
 *
 * The scale alone is not enough on a phone. Clamping it (so the trace does not
 * become a near-vertical spike) leaves the chart wider than the frame, and what
 * a centred window then shows is the middle of the profile — which is the
 * drawdown. A phone was rendering the crash and nothing else, on an investment
 * firm's landing page. So once the clamp starts to bite we also pan, until the
 * visible window is the trough, the recovery and the leading print: the part
 * that argues the same thing the headline does.
 */
function useChartFit(): ChartFit {
  const aspect = useThree(({ size }) =>
    // A container measured at zero (hidden tab, first paint) would give NaN and
    // poison every vertex — fall back to the reference framing until it settles.
    size.width > 0 && size.height > 0 ? size.width / size.height : REF_ASPECT,
  );

  const fit = THREE.MathUtils.clamp(aspect / REF_ASPECT, 0.58, 1.3);
  const pan = THREE.MathUtils.clamp(
    (PAN_FROM_ASPECT - aspect) / (PAN_FROM_ASPECT - PAN_TO_ASPECT),
    0,
    1,
  );
  // Translate so PAN_TO_U sits at frame centre when the pan is complete.
  const shift = -pan * (X_AT_U0 + PAN_TO_U * (X_AT_U1 - X_AT_U0)) * fit;
  return { fit, shift };
}

/** Lift a [u, h] profile stop into the terrain's world space. */
function profilePoint(
  [u, h]: [number, number],
  { fit, shift }: ChartFit,
): THREE.Vector3 {
  return new THREE.Vector3(
    (X_AT_U0 + u * (X_AT_U1 - X_AT_U0)) * fit + shift,
    Y_BASE + h * Y_SPAN,
    Z_AT_U0 + u * (Z_AT_U1 - Z_AT_U0), // slight diagonal into depth
  );
}

/**
 * Brightness of the trace along its length, 0..1. The line has to cross the
 * headline's column, so instead of fighting the type it recedes there and only
 * resolves into full brass out in the open space toward the leading print.
 * Depth through material weight, rather than one flat foreground stroke.
 */
function traceBrightness(u: number): number {
  const t = THREE.MathUtils.clamp(u / 0.93, 0, 1);
  const eased = t * t * (3 - 2 * t); // smoothstep
  const b = 0.15 + 0.85 * eased;
  // Fall away sharply past the leading print, so the eye lands there and stops
  // rather than being led off the top corner.
  return u > 0.93 ? b * (1 - 0.72 * Math.min((u - 0.93) / 0.14, 1)) : b;
}

/** Radial-gradient bloom for the leading marker — generated, no asset fetch. */
function useGlowTexture(brass: string): THREE.CanvasTexture | null {
  const texture = useMemo(() => {
    const S = 128;
    const canvas = document.createElement("canvas");
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    // Same brass as the trace, so the bloom cannot drift from the line it
    // belongs to. Hex + two-digit alpha is the shortest form the 2D context
    // parses without another colour-space round trip.
    g.addColorStop(0, `${brass}e6`);
    g.addColorStop(0.25, `${brass}4d`);
    g.addColorStop(0.55, `${brass}14`);
    g.addColorStop(1, `${brass}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    return new THREE.CanvasTexture(canvas);
  }, [brass]);

  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

function IndexLine({ reduced }: { reduced: boolean }) {
  const palette = usePalette();
  const fit = useChartFit();
  const nodesRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const glow = useGlowTexture(palette.brass);

  const { linePoints, lineColors, nodePoints, goalPoint } = useMemo(() => {
    const stops = STAR_STOPS.map((i) => profilePoint(PROFILE[i], fit));
    return {
      linePoints: PROFILE.map((stop) => profilePoint(stop, fit)),
      // Greyscale ramp; the material's brass multiplies through it.
      lineColors: PROFILE.map(([u]) => {
        const b = traceBrightness(u);
        return new THREE.Color(b, b, b);
      }),
      // Markers ride the same ramp, so none of them out-weigh the headline.
      nodePoints: stops.slice(0, -1).map((point, i) => ({
        point,
        opacity: 0.28 + 0.5 * traceBrightness(PROFILE[STAR_STOPS[i]][0]),
      })),
      goalPoint: stops[stops.length - 1],
    };
  }, [fit]);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();

    const nodes = nodesRef.current;
    if (nodes) {
      for (let i = 0; i < nodes.children.length; i++) {
        nodes.children[i].scale.setScalar(1 + 0.09 * Math.sin(t * 1.3 + i * 1.7));
      }
    }

    const sprite = glowRef.current;
    if (sprite) {
      const s = GLOW_SIZE * (1 + 0.1 * Math.sin(t * 0.85));
      sprite.scale.set(s, s, 1);
      (sprite.material as THREE.SpriteMaterial).opacity =
        0.72 + 0.28 * Math.sin(t * 0.85);
    }
  });

  return (
    <group>
      <Line
        points={linePoints}
        vertexColors={lineColors}
        color={palette.brass}
        lineWidth={1.4}
        transparent
        opacity={0.85}
        renderOrder={1}
      />

      {/* Prior prints — hollow rings, filled with the page dark so the line
          reads as terminating at each marker rather than passing through. */}
      <group ref={nodesRef}>
        {nodePoints.map(({ point, opacity }, i) => (
          <group key={i} position={point}>
            <Billboard>
              <mesh renderOrder={2}>
                <circleGeometry args={[NODE_R - NODE_STROKE + 0.003, 24]} />
                <meshBasicMaterial
                  color={palette.space}
                  transparent
                  opacity={opacity * 0.9}
                  depthWrite={false}
                />
              </mesh>
              <mesh renderOrder={3}>
                <ringGeometry args={[NODE_R - NODE_STROKE, NODE_R, 32]} />
                <meshBasicMaterial
                  color={palette.brass}
                  transparent
                  opacity={opacity}
                  depthWrite={false}
                />
              </mesh>
            </Billboard>
          </group>
        ))}
      </group>

      {/* Leading print — the one solid marker, haloed and blooming. */}
      <group position={goalPoint}>
        {glow && (
          <sprite ref={glowRef} scale={[GLOW_SIZE, GLOW_SIZE, 1]} renderOrder={4}>
            <spriteMaterial
              map={glow}
              transparent
              opacity={0.85}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        )}
        <Billboard>
          <mesh renderOrder={5}>
            <ringGeometry args={[GOAL_R * 1.9, GOAL_R * 2.05, 48]} />
            <meshBasicMaterial
              color={palette.brass}
              transparent
              opacity={0.32}
              depthWrite={false}
            />
          </mesh>
          <mesh renderOrder={6}>
            <circleGeometry args={[GOAL_R, 32]} />
            <meshBasicMaterial color={palette.brass} depthWrite={false} />
          </mesh>
        </Billboard>
      </group>
    </group>
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
      <IndexLine reduced={reduced} />
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
