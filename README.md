# Latina

Cinematic luxury frontend for a premium women’s shoe experience targeting Algerian women.

## Getting Started

Run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js App Router
- React Three Fiber + drei
- GSAP + ScrollTrigger + SplitText
- Lenis smooth scrolling
- Framer Motion
- next-intl (FR / EN / AR)
- Tailwind CSS with custom luxury design tokens

## Notes

- Typography uses offline-safe CSS font stacks (`Inter`, `Cormorant Garamond`, `Playfair Display`, `Noto Naskh Arabic`) to keep CI/builds stable in restricted-network environments.
- First visit shows a cinematic entry animation; returning visits skip directly to the homepage via `localStorage.hasVisited`.
