'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  fallbackId: string;
};

export function MirrorBrainTunnelGate({ fallbackId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 900px)').matches;

    if (!canvas || reduce || compact) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / Math.max(canvas.clientHeight, 1), 0.1, 80);
    camera.position.z = 9;

    const geometry = new THREE.TorusGeometry(1.5, 0.01, 12, 96);
    const rings = Array.from({ length: 18 }, (_, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: index % 3 === 0 ? 0xd6a84f : 0xb9f7ef,
        transparent: true,
        opacity: index % 3 === 0 ? 0.2 : 0.32,
      });
      const mesh = new THREE.Mesh(geometry.clone(), material);
      mesh.position.z = -index * 0.42;
      mesh.rotation.z = index * 0.21;
      scene.add(mesh);
      return mesh;
    });

    let frame = 0;
    let active = true;

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
    });
    observer.observe(canvas);

    function resize() {
      const width = canvas.clientWidth;
      const height = Math.max(canvas.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    function tick(time: number) {
      frame = requestAnimationFrame(tick);
      if (!active) return;

      for (const [index, ring] of rings.entries()) {
        ring.rotation.z = time * 0.00008 + index * 0.2;
        ring.scale.setScalar(1 + Math.sin(time * 0.0005 + index) * 0.025);
      }

      renderer.render(scene, camera);
    }

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      for (const ring of rings) {
        ring.geometry.dispose();
        Array.isArray(ring.material)
          ? ring.material.forEach((entry) => entry.dispose())
          : ring.material.dispose();
      }
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-[36rem] w-full max-w-7xl rounded-mirror border border-zinc-800 bg-zinc-950/50"
      aria-hidden="true"
      data-fallback-id={fallbackId}
    />
  );
}
