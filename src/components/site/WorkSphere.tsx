import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { websites } from "@/content/site";

// Three.js is loaded from a CDN on demand (no extra dependency in the bundle).
const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
const N = 20; // cards on the sphere (the 11 website videos repeat to fill it)
const RING = 10; // cards that open the intro on a ring

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const backOut = (t: number) => { const u = t - 1; return u * u * (2.7 * u + 1.7) + 1; };
const inQuad = (t: number) => t * t;

/**
 * The "Our Work" gallery from the inko_website showcase: ten cards appear on a ring and spin up, collapse into a
 * stack in the middle, then burst out into a draggable sphere of 20 cards. Transparent background, no labels or
 * logo: just the cards. Clicking a card opens the Our Work page.
 */
export function WorkSphere() {
  const hostRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const THREE: any = await import(/* @vite-ignore */ THREE_URL);
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      host.appendChild(renderer.domElement);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.touchAction = "pan-y";

      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.z = 12;
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);

      // One shared video per website, reused by every card that shows it
      const videos = websites.map((w) => {
        const v = document.createElement("video");
        v.src = w.video;
        v.poster = w.poster;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.crossOrigin = "anonymous";
        v.preload = "metadata";
        return v;
      });
      const textures = videos.map((v) => {
        const t = new THREE.VideoTexture(v);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      });
      // Show the poster until the first video frame arrives
      const posters = websites.map((w) => new THREE.TextureLoader().load(w.poster, (t: { colorSpace: unknown }) => { t.colorSpace = THREE.SRGBColorSpace; }));

      const geom = new THREE.PlaneGeometry(1, 1);
      const cards: { mesh: any; idx: number }[] = [];
      for (let i = 0; i < N; i++) {
        const idx = i % websites.length;
        const mat = new THREE.MeshBasicMaterial({ map: posters[idx], transparent: true, side: THREE.DoubleSide, depthWrite: false });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.userData.idx = idx;
        group.add(mesh);
        cards.push({ mesh, idx });
      }
      videos.forEach((v, i) => v.addEventListener("loadeddata", () => {
        cards.forEach((c) => { if (c.idx === i) { c.mesh.material.map = textures[i]; c.mesh.material.needsUpdate = true; } });
      }));

      let R = 3;
      let cardW = 1;
      let px2w = 0.01;
      let ringR = 2;
      let ringW = 0.5;
      let centerW = 1.4;
      const spherePos: any[] = cards.map(() => new THREE.Vector3());
      const layout = () => {
        const w = host.clientWidth, h = host.clientHeight;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const pxToWorld = (2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)) / h;
        px2w = pxToWorld;
        const base = Math.min(w, h);
        const rPx = w <= 640 ? Math.min(w * 0.36, h * 0.36) : base * 0.38;
        R = rPx * pxToWorld;
        const cardPx = w <= 640 ? 96 : Math.max(120, Math.min(190, base * 0.2));
        cardW = cardPx * pxToWorld;
        ringR = Math.min(w <= 640 ? 150 : 240, base * 0.4) * pxToWorld;
        ringW = (w <= 640 ? 56 : 70) * pxToWorld;
        centerW = cardW * 1.46;
        cards.forEach((_c, i) => {
          const y = i * (2 / N) - 1 + 1 / N;
          const r = Math.sqrt(Math.max(0, 1 - y * y));
          const a = Math.PI * (3 - Math.sqrt(5)) * i;
          spherePos[i].set(Math.cos(a) * r * R, y * R, Math.sin(a) * r * R);
        });
      };
      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(host);

      // Rotation state: drag with inertia, slow idle spin
      let yaw = 0, pitch = -0.25, vYaw = 0, vPitch = 0;
      let down = false, moved = 0, lastX = 0, lastY = 0, inside = false;
      const pointer = new THREE.Vector2(9, 9);
      const raycaster = new THREE.Raycaster();
      let hovered: any = null;

      const toNdc = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      };
      const onDown = (e: PointerEvent) => { if (phase !== "live") return; down = true; moved = 0; lastX = e.clientX; lastY = e.clientY; toNdc(e); };
      const onMove = (e: PointerEvent) => {
        toNdc(e);
        if (!down) return;
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        lastX = e.clientX; lastY = e.clientY;
        vYaw = dx * 0.006; vPitch = dy * 0.004;
        yaw += vYaw; pitch = Math.max(-1.1, Math.min(1.1, pitch + vPitch));
      };
      const onUp = () => {
        if (!down) return;
        down = false;
        if (moved < 6 && hovered) navigate({ to: "/work" });
      };
      const onEnter = () => { inside = true; };
      const onLeave = () => { inside = false; pointer.set(9, 9); };
      host.addEventListener("pointerdown", onDown);
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);

      // Only play the videos while the sphere is on screen
      let visible = false;
      const io = new IntersectionObserver(([e]) => {
        visible = !!e?.isIntersecting;
        videos.forEach((v) => { if (visible) v.play().catch(() => {}); else v.pause(); });
      }, { rootMargin: "120px" });
      io.observe(host);

      // Intro (as in the inko_website gallery): ring that spins up -> stack in the middle -> burst into the sphere.
      // It starts once the "Our Work" heading has settled in the middle and the cards scroll into view.
      type Phase = "idle" | "ring" | "collapse" | "explode" | "live";
      let phase: Phase = "idle";
      let t0 = 0;
      let ringOff = 0;
      let lastNow = performance.now();
      const stackStart = cards.map(() => new THREE.Vector3());
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Hold the page still while the ring -> stack -> sphere intro plays, then let it scroll again
      let locked = false;
      let lockTimer = 0;
      const stop = (e: Event) => e.preventDefault();
      const stopKeys = (e: KeyboardEvent) => { if ([" ", "PageUp", "PageDown", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) e.preventDefault(); };
      const lockScroll = () => {
        if (locked) return;
        locked = true;
        window.addEventListener("wheel", stop, { passive: false });
        window.addEventListener("touchmove", stop, { passive: false });
        window.addEventListener("keydown", stopKeys);
        lockTimer = window.setTimeout(unlockScroll, 12000); // safety net
      };
      const unlockScroll = () => {
        if (!locked) return;
        locked = false;
        window.clearTimeout(lockTimer);
        window.removeEventListener("wheel", stop);
        window.removeEventListener("touchmove", stop);
        window.removeEventListener("keydown", stopKeys);
      };
      const start = () => {
        if (phase !== "idle") return;
        phase = reduced ? "live" : "ring";
        t0 = performance.now();
        if (!reduced) { host.scrollIntoView({ block: "start", behavior: "smooth" }); lockScroll(); }
      };
      const startIo = new IntersectionObserver(([e]) => { if (e?.isIntersecting) start(); }, { rootMargin: "0px 0px -45% 0px" });
      startIo.observe(host);

      cards.forEach((c) => { c.mesh.scale.set(0.001, 0.001, 1); c.mesh.material.opacity = 0; });

      const wp = new THREE.Vector3();
      const setCard = (i: number, x: number, y: number, z: number, w: number, o: number) => {
        const m = cards[i]!.mesh;
        m.position.set(x, y, z);
        m.scale.set(Math.max(0.001, w), Math.max(0.001, w * (9 / 16)), 1);
        m.material.opacity = o;
        m.quaternion.identity();
        m.renderOrder = Math.round(z * 10 + 500);
      };

      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const now = performance.now();
        const dt = Math.min(64, now - lastNow);
        lastNow = now;
        if (!visible || phase === "idle") { renderer.render(scene, camera); return; }
        const t = now - t0;

        if (phase === "ring") {
          const speedDeg = t < 1300 ? 0.5 : 0.5 + (3.65 - 0.5) * inQuad(clamp01((t - 1300) / 1000));
          ringOff += ((speedDeg * Math.PI) / 180) * (dt / 16.67);
          for (let i = 0; i < N; i++) {
            if (i >= RING) { setCard(i, 0, 0, 0, 0.001, 0); continue; }
            const ang = ((-90 + i * 36) * Math.PI) / 180 + ringOff;
            const k = clamp01((t - i * 100) / 1000);
            setCard(i, Math.cos(ang) * ringR, Math.sin(ang) * ringR, 0, ringW * backOut(k), outCubic(k));
          }
          group.rotation.set(0, 0, 0);
          if (t >= 2100) {
            for (let i = 0; i < RING; i++) stackStart[i]!.copy(cards[i]!.mesh.position);
            phase = "collapse"; t0 = now;
          }
        } else if (phase === "collapse") {
          for (let i = 0; i < N; i++) {
            if (i >= RING) { setCard(i, 0, 0, 0, 0.001, 0); continue; }
            const k = easeInOut(clamp01((t - i * 50) / 1250));
            const s0 = stackStart[i]!;
            const sz = (i - 4.5) * px2w * 1.5;
            setCard(i, s0.x * (1 - k), s0.y * (1 - k), s0.z * (1 - k) + sz * k, ringW + (centerW - ringW) * k, 1);
          }
          if (t >= 1250 + 9 * 50 + 200) { for (let i = 0; i < RING; i++) stackStart[i]!.copy(cards[i]!.mesh.position); phase = "explode"; t0 = now; }
        } else if (phase === "explode") {
          const k = outCubic(clamp01(t / 1000));
          const over = 1 + 0.1 * Math.sin(Math.PI * k);
          for (let i = 0; i < N; i++) {
            const sp = spherePos[i]!;
            if (i < RING) {
              const s0 = stackStart[i]!;
              setCard(i, s0.x + (sp.x * over - s0.x) * k, s0.y + (sp.y * over - s0.y) * k, s0.z + (sp.z * over - s0.z) * k, centerW + (cardW - centerW) * k, 1);
            } else {
              setCard(i, sp.x * k * over, sp.y * k * over, sp.z * k * over, cardW, Math.min(1, k * 1.5));
            }
          }
          if (t >= 1000) { phase = "live"; unlockScroll(); }
        } else {
          if (!down) {
            yaw += vYaw + 0.0028;
            pitch = Math.max(-1.1, Math.min(1.1, pitch + vPitch));
            vYaw *= 0.95; vPitch *= 0.93;
          }
          group.rotation.set(pitch, yaw, 0);
          group.updateMatrixWorld(true);
          const inv = group.quaternion.clone().invert();
          cards.forEach((c, i) => {
            c.mesh.position.copy(spherePos[i]!);
            c.mesh.quaternion.copy(inv); // always face the viewer
            c.mesh.getWorldPosition(wp);
            const depth = (wp.z + R) / (2 * R); // 0 (back) .. 1 (front)
            c.mesh.material.opacity = 0.28 + 0.72 * depth;
            const hov = hovered === c.mesh ? 1.12 : 1;
            c.mesh.scale.set(cardW * hov, cardW * (9 / 16) * hov, 1);
            c.mesh.renderOrder = Math.round(depth * 100);
          });
          hovered = null;
          if (inside && !down) {
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects(cards.map((c) => c.mesh))[0];
            if (hit) hovered = hit.object;
          }
          renderer.domElement.style.cursor = down ? "grabbing" : hovered ? "pointer" : "grab";
        }
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        startIo.disconnect();
        unlockScroll();
        host.removeEventListener("pointerdown", onDown);
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        videos.forEach((v) => { v.pause(); v.removeAttribute("src"); v.load(); });
        textures.forEach((t) => t.dispose());
        posters.forEach((t: { dispose: () => void }) => t.dispose());
        cards.forEach((c) => c.mesh.material.dispose());
        geom.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, [navigate]);

  return <div ref={hostRef} aria-label="Our work: draggable sphere of website previews" className="relative h-[100svh] min-h-[560px] w-full cursor-grab select-none" />;
}
