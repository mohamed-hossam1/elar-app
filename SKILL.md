# Framer Motion + Next.js Animation — SKILL.md

## Core Philosophy (Read This First)

The root cause of animation lag in Next.js is simple:
**Framer Motion needs JavaScript to hydrate before it can animate anything.**

The first section the user sees (Hero / above-the-fold) loads before JS is ready.
So if you put Framer Motion on it → freeze → lag → bad UX.

### The Golden Rule

```
Above the fold  (Section 1 / Hero)  →  CSS animation only. Zero Framer Motion.
Below the fold  (Section 2+)        →  Framer Motion with whileInView.
```

This single rule eliminates 90% of animation lag issues in Next.js.

---

## Zone 1 — Hero / First Section (CSS Only)

Never use Framer Motion here. Use pure CSS `@keyframes`.

CSS animations run **before JS hydrates** — zero lag, zero freeze.

### The CSS to add in `globals.css`

```css
/* === Animation Keyframes === */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* === Hero Classes === */
.animate-fade-up {
  opacity: 0;
  animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

/* Stagger delays for hero children */
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.35s; }
.delay-4 { animation-delay: 0.5s; }
```

### Hero Component — No Framer Motion at all

```jsx
// components/Hero.jsx
// ✅ No "use client", no framer-motion import
// This is a Server Component — fastest possible render

export default function Hero() {
  return (
    <section>
      <h1 className="animate-fade-up">
        Main Headline
      </h1>

      <p className="animate-fade-up delay-1">
        Subtitle text here
      </p>

      <div className="animate-fade-up delay-2">
        <button>CTA Button</button>
      </div>
    </section>
  )
}
```

**Rules for Zone 1:**
- No `"use client"` directive
- No `import` from `"framer-motion"`
- No `useState`, `useEffect`
- Only CSS classes with `animation` property
- Keep it a **Server Component** — it renders instantly

---

## Zone 2+ — All Other Sections (Framer Motion)

### Which import to use — decide per component

Motion has two imports. Choose based on whether the component needs interactivity:

```jsx
// ✅ Server Component — static animations (scroll reveal, entrance)
// No "use client" needed. Rendered on the server.
import * as motion from "motion/react-client"

// ✅ Client Component — interactive animations (hover, tap, drag, useAnimation)
// Requires "use client"
"use client"
import { motion, useAnimation, useScroll } from "motion/react"
```

**Rule of thumb:**
- Does it use `onClick`, `useState`, `useEffect`, `whileHover`, `whileTap`, `drag`, `useAnimation`, `useScroll`? → Client Component (`motion/react`)
- Just `whileInView`, `initial`, `animate`, `transition`? → Server Component (`motion/react-client`)

---

### Setup — `app/page.jsx`

```jsx
// app/page.jsx — stays a Server Component
import Hero     from "@/components/Hero"      // Server Component, CSS only
import About    from "@/components/About"     // Server Component, motion/react-client
import Features from "@/components/Features"  // Server Component, motion/react-client
import Contact  from "@/components/Contact"   // Client Component, motion/react (has form state)

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Contact />
    </>
  )
}
```

No `dynamic()` needed — Server Components with `motion/react-client` don't need lazy loading.
Only use `dynamic(..., { ssr: false })` if an entire section **must** be client-only.

---

## How to Write Each Section Component

### Server Component — Basic Scroll Reveal (`motion/react-client`)

```jsx
// components/About.jsx — Server Component
import * as motion from "motion/react-client"

export default function About() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2>About</h2>
      <p>Content here</p>
    </motion.section>
  )
}
```

### Server Component — Staggered Cards / Grid (`motion/react-client`)

```jsx
// components/CardsSection.jsx — Server Component
import * as motion from "motion/react-client"

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

const card = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
}

export default function CardsSection({ items }) {
  return (
    <motion.div
      className="grid"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={card}>
          {item.title}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### Server Component — Alternating Left / Right (`motion/react-client`)

```jsx
// components/FeatureRow.jsx — Server Component
import * as motion from "motion/react-client"

export default function FeatureRow({ item, index }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {item.content}
    </motion.div>
  )
}
```

### Client Component — Interactive Elements (`motion/react`)

Only use this when you actually need interactivity:

```jsx
// components/AnimatedButton.jsx — Client Component
"use client"
import { motion } from "motion/react"

export default function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
```

---

## Only Animate GPU-Safe Properties

| ✅ Safe (GPU) | ❌ Unsafe (causes reflow) |
|---|---|
| `opacity` | `width`, `height` |
| `x`, `y` | `top`, `left`, `right`, `bottom` |
| `scale`, `scaleX`, `scaleY` | `margin`, `padding` |
| `rotate`, `skewX`, `skewY` | `fontSize`, `borderWidth` |

```jsx
// ❌ WRONG — forces layout recalculation every frame
<m.div animate={{ width: "100%", marginTop: 20 }} />

// ✅ CORRECT — GPU only, smooth 60fps
<m.div animate={{ opacity: 1, y: 0, scale: 1 }} />
```

---

## Complete File Structure

```
app/
├── page.jsx              ← Server Component, imports everything directly (no dynamic needed)
├── globals.css           ← @keyframes + .animate-* classes
components/
├── Hero.jsx              ← Server Component, CSS animation only, no motion
├── About.jsx             ← Server Component, import * as motion from "motion/react-client"
├── Features.jsx          ← Server Component, import * as motion from "motion/react-client"
├── CardsSection.jsx      ← Server Component, motion/react-client + staggerChildren
├── FeatureRow.jsx        ← Server Component, motion/react-client
└── AnimatedButton.jsx    ← Client Component "use client", import { motion } from "motion/react"
```

**The rule:** default to Server Component + `motion/react-client`. Only switch to Client Component + `motion/react` when you need hooks or gesture events (`whileHover`, `whileTap`, `drag`, `useAnimation`, `useScroll`, etc.).

---

## Complete Working Example

```css
/* app/globals.css */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up         { opacity: 0; animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
.animate-fade-up.delay-1 { animation-delay: 0.12s; }
.animate-fade-up.delay-2 { animation-delay: 0.24s; }
.animate-fade-up.delay-3 { animation-delay: 0.38s; }
```

```jsx
// components/Hero.jsx — Server Component, zero JS, CSS only
export default function Hero() {
  return (
    <section className="hero">
      <h1 className="animate-fade-up">Hello World</h1>
      <p  className="animate-fade-up delay-1">Subtitle</p>
      <a  className="animate-fade-up delay-2" href="#start">Get Started</a>
    </section>
  )
}
```

```jsx
// components/About.jsx — Server Component, motion/react-client
import * as motion from "motion/react-client"

export default function About() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2>About</h2>
    </motion.section>
  )
}
```

```jsx
// components/AnimatedButton.jsx — Client Component (needs whileHover/whileTap)
"use client"
import { motion } from "motion/react"

export default function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
```

```jsx
// app/page.jsx — Server Component, no dynamic() needed
import Hero           from "@/components/Hero"
import About          from "@/components/About"
import Features       from "@/components/Features"
import AnimatedButton from "@/components/AnimatedButton"

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <AnimatedButton>Click Me</AnimatedButton>
    </>
  )
}
```

---

## Checklist Before Shipping

- [ ] Hero is a **Server Component** (no `"use client"`)
- [ ] Hero uses **only CSS classes** for animation (no motion import)
- [ ] `globals.css` has `@keyframes fadeUp` + `.animate-fade-up` + `.delay-*` classes
- [ ] Scroll-reveal sections use `import * as motion from "motion/react-client"` (Server Components)
- [ ] Interactive components use `import { motion } from "motion/react"` + `"use client"`
- [ ] Every `motion.*` element uses `whileInView` not `animate` for scroll sections
- [ ] Every `whileInView` has `viewport={{ once: true }}`
- [ ] Only `opacity`, `x`, `y`, `scale`, `rotate` used in transitions
- [ ] No motion import at all on Hero / Section 1 — ever

---

## Common Mistakes

| Mistake | Result | Fix |
|---|---|---|
| Motion on Hero | Freeze + lag on load | Use CSS `@keyframes` instead |
| `import { motion } from "motion/react"` in Server Component | Build error / forces client bundle | Use `import * as motion from "motion/react-client"` |
| `import * as motion from "motion/react-client"` with `whileHover` | No effect (SSR only) | Switch to `motion/react` + `"use client"` |
| `animate` instead of `whileInView` on sections | Fires before visible | Use `whileInView` |
| `viewport` without `once: true` | Animation replays on scroll | Add `once: true` |
| Animating `width` / `height` | Janky reflow | Use `scaleX` / `scaleY` instead |