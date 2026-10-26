"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";

const POINTS = 2000;
const NODES = 16;
const RADIUS = 1.75;

type Theme = { fg: string; accent: string };

function readTheme(): Theme {
  const css = getComputedStyle(document.documentElement);
  return {
    fg: css.getPropertyValue("--fg").trim() || "#edebe4",
    accent: css.getPropertyValue("--accent").trim() || "#f2a93b",
  };
}

/** Evenly spread points on a sphere (Fibonacci lattice). */
function buildSphere() {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points = new Float32Array(POINTS * 3);
  for (let i = 0; i < POINTS; i++) {
    const y = 1 - (i / (POINTS - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.set(
      [Math.cos(theta) * r * RADIUS, y * RADIUS, Math.sin(theta) * r * RADIUS],
      i * 3,
    );
  }

  // Brighter nodes spread across the lattice, each linked to its two nearest.
  const nodes = new Float32Array(NODES * 3);
  const nodeVecs: THREE.Vector3[] = [];
  for (let k = 0; k < NODES; k++) {
    const i = Math.floor(((k + 0.5) / NODES) * POINTS + ((k * 137) % 41));
    const v = new THREE.Vector3().fromArray(points, i * 3).multiplyScalar(1.01);
    nodeVecs.push(v);
    v.toArray(nodes, k * 3);
  }
  const pairs = new Set<string>();
  const lines: number[] = [];
  nodeVecs.forEach((a, i) => {
    nodeVecs
      .map((b, j) => ({ j, d: a.distanceTo(b) }))
      .filter(({ j }) => j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (pairs.has(key)) return;
        pairs.add(key);
        lines.push(...a.toArray(), ...nodeVecs[j].toArray());
      });
  });

  return { points, nodes, lines: new Float32Array(lines) };
}

/** A soft round sprite so points render as dots, not squares. */
function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function Network({
  theme,
  pointer,
}: {
  theme: Theme;
  pointer: RefObject<{ x: number; y: number }>;
}) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const { points, nodes, lines } = useMemo(() => buildSphere(), []);
  const dot = useMemo(() => makeDotTexture(), []);

  useEffect(() => () => dot.dispose(), [dot]);

  useFrame((state, delta) => {
    if (!tilt.current || !spin.current) return;
    spin.current.rotation.y += delta * 0.06;
    // Ease toward the cursor.
    const p = pointer.current;
    const k = 1 - Math.exp(-delta * 3);
    tilt.current.rotation.x += (p.y * 0.3 - tilt.current.rotation.x) * k;
    tilt.current.rotation.y += (p.x * 0.4 - tilt.current.rotation.y) * k;
    // Drift back as the hero scrolls away.
    const hero = state.gl.domElement.closest("section");
    const height = hero?.clientHeight ?? window.innerHeight;
    const progress = Math.min(window.scrollY / (height * 0.8), 1);
    tilt.current.position.z = -progress * 3;
  });

  return (
    <group ref={tilt}>
      <group ref={spin} rotation={[0.35, 0, 0.12]}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[points, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            map={dot}
            color={theme.fg}
            transparent
            opacity={0.55}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[nodes, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.13}
            map={dot}
            color={theme.accent}
            transparent
            depthWrite={false}
            sizeAttenuation
          />
        </points>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lines, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={theme.accent}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </group>
  );
}

/**
 * The hero's 3D network sphere. Only ever loaded on the client, after the
 * page is interactive (see HeroScene).
 */
export default function PointSphere({
  active,
  onReady,
  onFallback,
}: {
  active: boolean;
  onReady: () => void;
  onFallback: () => void;
}) {
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.75]);
  const [theme, setTheme] = useState<Theme>(readTheme);
  const pointer = useRef({ x: 0, y: 0 });

  // Follow the light/dark toggle.
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Tilt toward the cursor (pointer devices only).
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      flat
      camera={{ position: [0, 0, 6.2], fov: 40 }}
      gl={{ antialias: false, alpha: true }}
      onCreated={() => requestAnimationFrame(onReady)}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr([1, 1.75])}
        flipflops={3}
        onFallback={onFallback}
      />
      <Network theme={theme} pointer={pointer} />
    </Canvas>
  );
}
