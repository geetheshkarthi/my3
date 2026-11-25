import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { websites } from "@/content/site";

// Three.js is loaded from a CDN on demand (no extra dependency in the bundle).
const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
const N = 20; // cards on the sphere (the 11 website videos repeat to fill it)

/**
 * A draggable sphere of rotating website-video cards (the "Our Work" gallery from the inko_website showcase).
 * Transparent background, no labels or logo: just the cards. Clicking a card opens the Our Work page.
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
      const layout = () => {
        const w = host.clientWidth, h = host.clientHeight;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const pxToWorld = (2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)) / h;
        const base = Math.min(w, h);
        const rPx = w <= 640 ? Math.min(w * 0.36, h * 0.36) : base * 0.38;
        R = rPx * pxToWorld;
        const cardPx = w <= 640 ? 96 : Math.max(120, Math.min(190, base * 0.2));
        cardW = cardPx * pxToWorld;
        cards.forEach((c, i) => {
          const y = i * (2 / N) - 1 + 1 / N;
          const r = Math.sqrt(Math.max(0, 1 - y * y));
          const a = Math.PI * (3 - Math.sqrt(5)) * i;
          c.mesh.position.set(Math.cos(a) * r * R, y * R, Math.sin(a) * r * R);
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
      const onDown = (e: PointerEvent) => { down = true; moved = 0; lastX = e.clientX; lastY = e.clientY; toNdc(e); };
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

      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        if (!down) {
          yaw += vYaw + 0.0028;
          pitch = Math.max(-1.1, Math.min(1.1, pitch + vPitch));
          vYaw *= 0.95; vPitch *= 0.93;
        }
        group.rotation.set(pitch, yaw, 0);
        group.updateMatrixWorld(true);
        const inv = group.quaternion.clone().invert();
        const wp = new THREE.Vector3();
        cards.forEach((c) => {
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
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
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
