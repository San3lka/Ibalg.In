// 0API TikTok ad: 1080x1920, ~19 s. Build with: higgsedit build edit.jsx
// Safe area: x 60..940, y 150..1470 (TikTok UI overlays outside).
const C = {
  bg: "#030304", card: "#0f0f13", border: "#1c1c20", text: "#ffffff",
  sec: "#a1a1aa", muted: "#71717a", ok: "#4ade80", down: "#ef4444", slow: "#facc15",
};
const SANS = "Montserrat";
const MONO = "JetBrains Mono";

// opacity in/out on a node's own timeline
const fade = (dur, inT = 0.25, outT = 0.2, start = 0) => [{
  property: "opacity",
  keyframes: [
    { at: start, value: 0 }, { at: start + inT, value: 1 },
    { at: dur - outT, value: 1 }, { at: dur, value: 0 },
  ],
}];
const rise = (start = 0, d = 0.35, px = 24) => [{ property: "offsetY", from: px, to: 0, at: start, duration: d, easing: "house" }];

export default async ({ project, text, rect, media, group }) => {
  const p = await project({ size: "1080x1920", fps: 30, background: C.bg });
  const s1 = await p.add("media/s1.mp4");
  const s2 = await p.add("media/s2.mp4");
  const s3 = await p.add("media/s3.mp4");
  const s4 = await p.add("media/s4.mp4");
  const s5 = await p.add("media/s5_slow.mp4");
  const logo = await p.add("media/logo.png");
  const mimo = await p.add("media/mimo_card.png");

  // ---- picture spine ----
  p.cut(s1, { from: 0.0, dur: 3.8, at: 0 });
  p.cut(s2, { from: 0.3, dur: 3.3, at: 3.8 });
  p.cut(s3, { from: 0.4, dur: 3.2, at: 7.1 });
  p.cut(s4, { from: 0.8, dur: 4.2, at: 10.3 });
  p.cut(s5, { from: 0.0, dur: 4.5, at: 14.5 });

  const headline = (str, y, opts = {}) => text(str, {
    x: 60, y, width: 880, align: "center", fontFamily: SANS, fontWeight: 700,
    fontSize: 92, lineHeight: 1.08, color: C.text,
    shadow: { x: 0, y: 4, blur: 24, color: "rgba(0,0,0,0.85)" }, ...opts,
  });

  // ---- captions (VO), plate above bottom safe zone ----
  const caps = [
    [0.05, 2.75, "Claude, GPT, DeepSeek, Grok…"], [2.85, 3.8, "one API."],
    [3.95, 6.9, "Seven providers. OpenAI & Anthropic compatible."],
    [7.3, 9.3, "See every model's speed. Live."],
    [10.45, 11.6, "Model down?"],
    [11.9, 14.2, "You get free tokens for the entire downtime."],
  ];
  for (const [a, b, s] of caps) {
    const d = b - a;
    p.compose(group({ animate: fade(d, 0.12, 0.1) }, [
      rect({ x: 70, y: 1300, width: 860, height: 120, radius: 22, fill: "rgba(3,3,4,0.72)" }),
      text(s, { x: 90, y: 1312, width: 820, height: 96, align: "center", fontFamily: SANS, fontWeight: 700, fontSize: 42, lineHeight: 1.1, color: C.text }),
    ]), { at: a, dur: d, name: "cap" });
  }

  // ---- S1 hook ----
  p.compose(headline("Every AI model.", 610, { motion: { by: "word", from: { y: 30, opacity: 0 }, duration: 0.45, overlap: 0.5 } }), { at: 0.25, dur: 3.45 });
  p.compose(group({ animate: rise(0, 0.3, 30) }, [headline("One API.", 720, { color: C.ok, fontSize: 104 })]), { at: 2.85, dur: 0.85 });

  // ---- S2 providers ----
  const tag = (x, y, w, label, col, dim = false) => [
    rect({ x, y, width: w, height: 64, radius: 32, fill: C.card, strokeColor: C.border, strokeWidth: 2 }),
    rect({ x: x + 22, y: y + 26, width: 12, height: 12, radius: 6, fill: col }),
    text(label, { x: x + 44, y: y + 13, width: w - 54, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: dim ? C.muted : C.text }),
  ];
  const provs = [
    ["Claude", "#f97316", 170], ["GPT", "#10b981", 128], ["DeepSeek", "#22d3ee", 210],
    ["GLM", "#a855f7", 130], ["Grok", "#e4e4e7", 136], ["Poolside", "#8b5cf6", 196], ["MiMo", "#e4e4e7", 142],
  ];
  const rows = [[0, 1, 2], [3, 4, 5], [6]];
  const tags = [];
  rows.forEach((r, ri) => {
    const tw = r.reduce((s, i) => s + provs[i][2], 0) + 16 * (r.length - 1) + (ri === 2 ? 16 + 250 : 0);
    let x = 500 - tw / 2;
    r.forEach((i, k) => {
      const [l, c, w] = provs[i];
      tags.push(group({ animate: [...rise(0.12 * (ri * 3 + k), 0.3, 20), { property: "opacity", from: 0, to: 1, at: 0.12 * (ri * 3 + k), duration: 0.25 }] }, tag(x, 330 + ri * 80, w, l, c)));
      x += w + 16;
    });
    if (ri === 2) tags.push(group({ animate: [{ property: "opacity", from: 0, to: 1, at: 0.9, duration: 0.25 }] }, tag(x, 330 + ri * 80, 250, "Gemini · soon", C.muted, true)));
  });
  p.compose(group({ animate: fade(3.2, 0.2, 0.2) }, [
    rect({ x: 60, y: 200, width: 880, height: 420, radius: 28, fill: "rgba(3,3,4,0.82)", strokeColor: C.border, strokeWidth: 2 }),
    text("ONE API · 7 PROVIDERS", { x: 60, y: 240, width: 880, align: "center", fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 2, color: C.ok }),
    ...tags,
    text("OpenAI + Anthropic compatible", { x: 60, y: 560, width: 880, align: "center", fontFamily: SANS, fontWeight: 400, fontSize: 30, color: C.sec }),
  ]), { at: 3.85, dur: 3.2 });

  // snapshot label for the UI scenes
  p.compose(group({ animate: fade(6.5, 0.2, 0.2) }, [
    rect({ x: 60, y: 160, width: 400, height: 46, radius: 23, fill: "rgba(15,15,19,0.9)", strokeColor: C.border, strokeWidth: 2 }),
    rect({ x: 80, y: 178, width: 10, height: 10, radius: 5, fill: C.ok }),
    text("Live snapshot · Oct 2026", { x: 100, y: 168, width: 350, fontFamily: MONO, fontSize: 22, color: C.sec }),
  ]), { at: 3.8, dur: 6.5 });

  // ---- S3 latency card ----
  const lat = [["gpt-5.6-luna", "2.5s"], ["laguna-xs-2.1", "3.5s"], ["claude-fable-5-1", "3.5s"]];
  p.compose(group({ animate: fade(3.1, 0.25, 0.2) }, [
    rect({ x: 60, y: 880, width: 880, height: 470, radius: 28, fill: "rgba(15,15,19,0.94)", strokeColor: C.border, strokeWidth: 2 }),
    text("LIVE LATENCY", { x: 100, y: 912, width: 400, fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: C.sec }),
    rect({ x: 556, y: 924, width: 12, height: 12, radius: 6, fill: C.ok }),
    text("26", { x: 574, y: 910, width: 60, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.text }),
    rect({ x: 642, y: 924, width: 12, height: 12, radius: 6, fill: C.slow }),
    text("0", { x: 660, y: 910, width: 40, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.text }),
    rect({ x: 704, y: 924, width: 12, height: 12, radius: 6, fill: C.down }),
    text("1 down", { x: 722, y: 910, width: 200, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.text }),
    ...lat.flatMap(([m, v], i) => [group({ animate: [...rise(0.25 + 0.18 * i, 0.3, 18), { property: "opacity", from: 0, to: 1, at: 0.25 + 0.18 * i, duration: 0.25 }] }, [
      rect({ x: 92, y: 990 + i * 110, width: 816, height: 92, radius: 18, fill: "#030304", strokeColor: C.border, strokeWidth: 2 }),
      rect({ x: 124, y: 1029 + i * 110, width: 16, height: 16, radius: 8, fill: C.ok, shadow: { x: 0, y: 0, blur: 14, color: C.ok } }),
      text(m, { x: 164, y: 1012 + i * 110, width: 520, fontFamily: MONO, fontWeight: 700, fontSize: 38, color: C.text }),
      text(v, { x: 700, y: 1012 + i * 110, width: 180, align: "right", fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.ok }),
    ])]),
  ]), { at: 7.15, dur: 3.1 });

  // ---- S4 outage ----
  p.compose(group({ animate: fade(1.9, 0.2, 0.25) }, [
    headline("Model down?", 560, { color: C.text, fontSize: 96 }),
    group({ animate: rise(0.1, 0.35, 30) }, [
      rect({ x: 60, y: 720, width: 880, height: 132, radius: 22, fill: C.card, strokeColor: C.down, strokeWidth: 3, shadow: { x: 0, y: 0, blur: 40, color: "rgba(239,68,68,0.55)" } }),
      media({ file: mimo, x: 72, y: 726, width: 856, height: 128, fit: "contain", radius: 18 }),
    ]),
  ]), { at: 10.4, dur: 1.9 });
  p.compose(group({ animate: fade(2.2, 0.25, 0.2) }, [
    group({ animate: rise(0, 0.35, 30) }, [
      headline("Free tokens for every minute of downtime.", 330, { fontSize: 78 }),
    ]),
    text("FREE TOKENS", { x: 60, y: 1172, width: 880, align: "center", fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: C.ok, shadow: { x: 0, y: 0, blur: 18, color: "rgba(0,0,0,0.9)" } }),
  ]), { at: 12.3, dur: 2.2 });

  // ---- S5 logo + CTA ----
  p.compose(group({ animate: [
    { property: "opacity", from: 0, to: 1, at: 0, duration: 0.5 },
    { property: "scale", from: 0.82, to: 1, at: 0, duration: 0.9, easing: "house" },
  ] }, [
    media({ file: logo, x: 220, y: 540, width: 560, height: 560, fit: "contain", shadow: { x: 0, y: 0, blur: 60, color: "rgba(74,222,128,0.65)" } }),
  ]), { at: 14.6, dur: 4.4 });
  p.compose(group({ animate: [...rise(0, 0.4, 26), { property: "opacity", from: 0, to: 1, at: 0, duration: 0.35 }] }, [
    headline("We fight for 100% uptime.", 1080, { fontSize: 66 }),
    text("24/7 · our own infrastructure", { x: 60, y: 1172, width: 880, align: "center", fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.ok }),
  ]), { at: 15.0, dur: 4.0 });
  p.compose(group({ animate: [...rise(0, 0.35, 20), { property: "opacity", from: 0, to: 1, at: 0, duration: 0.3 }] }, [
    rect({ x: 290, y: 1290, width: 420, height: 104, radius: 52, fill: C.ok, shadow: { x: 0, y: 0, blur: 40, color: "rgba(74,222,128,0.5)" } }),
    text("0api.tech", { x: 290, y: 1312, width: 420, align: "center", fontFamily: SANS, fontWeight: 700, fontSize: 50, color: "#030304" }),
  ]), { at: 16.6, dur: 2.4 });

  for (const t of [1.0, 3.3, 5.0, 8.6, 11.0, 13.4, 17.5]) await p.frame(t, `renders/f_${t}.png`);
  await p.render("renders/video.mp4");
};
