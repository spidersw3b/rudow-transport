# Site images (`public/images`)

### Brand logo

| File | Used in |
|------|---------|
| **`rudow-transportation-logo.png`** | Header, footer, mobile menu, customer login/signup (`RudowTransportLogo` → `components/layout/RudowTransportLogo.tsx`) |

Replace the placeholder with your **transparent** PNG (same filename) or change `RUDOW_TRANSPORT_LOGO` in that component.

---

Tiny **placeholder JPEGs** ship for page heroes so the app runs before you add real photography. Replace each file with your own image **using the same filename** (or change the path in `lib/images.ts`).

| File | Used on | Section / purpose |
|------|---------|-------------------|
| `hero-fleet.jpg` | `/` (home) | Hero — fleet / dock background |
| `desert-highway.jpg` | `/` | “Built for scale” full-bleed section |
| `warehouse-dock.jpg` | `/` | “Schedule fleet delivery” CTA |
| `fleet-relocation.jpg` | `/` | Home service card — fleet relocation |
| `dealership-flatbed.jpg` | `/` | Home service card — dealership transport |
| `jobsite-semi.jpg` | `/` | Home service card — jobsite delivery |
| `aerial-fleet.jpg` | `/contact` | Contact page hero |
| `car-hauler.jpg` | `/services` | Services page — hero / split image |

**Tips**

- Prefer **wide** assets for heroes (roughly **2000px** wide for full-bleed rows) and **1200–1600px** for cards.
- Keep filenames if you can; otherwise update `lib/images.ts` to match.
- `next/image` will optimize local files automatically; no Unsplash config required.
