# Fixture photography

Studio packshots used by Storybook stories and the kit index page. All photos
are from [Unsplash](https://unsplash.com) under the
[Unsplash License](https://unsplash.com/license) (free to use, no attribution
required — credited here anyway). Downloaded at `w=1600&q=82`.

| File | Subject | Unsplash photo |
| --- | --- | --- |
| `shoe-aerolite-01.jpg` | White/orange athletic sneaker, floating, light studio background | [LG88A2XgIXY](https://unsplash.com/photos/LG88A2XgIXY) |
| `shoe-aerolite-02.jpg` | Same sneaker, secondary angle (same shoot) | [J2-wAQDckus](https://unsplash.com/photos/J2-wAQDckus) |
| `shoe-aerolite-03-midsole.jpg` | Loupe crop of `shoe-aerolite-01.jpg` (midsole + outsole) — derivative | same as above |
| `shoe-aerolite-04-upper.jpg` | Loupe crop of `shoe-aerolite-02.jpg` (perforated upper + lacing) — derivative | same as above |
| `shoe-aerolite-02-worn.jpg` | Demo "after 400 miles" derivative of `shoe-aerolite-02.jpg` (desaturated, darkened, vignetted) for the comparison slider | same as above |
| `shoe-tempo-01.jpg` | Gray running shoe, floating on white | [LxVxPA1LOVM](https://unsplash.com/photos/LxVxPA1LOVM) |
| `shoe-cumulus-01.jpg` | Volt training shoe on green | [kP6knT7tjn4](https://unsplash.com/photos/kP6knT7tjn4) |
| `watch-ardent-01.jpg` | Two-tone dive watch on white | [O703kpzIsQI](https://unsplash.com/photos/O703kpzIsQI) |
| `supplement-creatine-01.jpg` | Clear capsule jar with blank label, cream background | [yYZthq7bucQ](https://unsplash.com/photos/yYZthq7bucQ) |
| `supplement-creatine-02.jpg` | White supplement bottle, blank label | [EUlDhZSyMpg](https://unsplash.com/photos/EUlDhZSyMpg) |
| `portrait-marchetti.jpg` | Editorial author portrait (warm studio) | [b8d87734a5a2](https://unsplash.com/photos/1573496359142-b8d87734a5a2) |
| `portrait-raman.jpg` | Lab director portrait (white studio) | [1l6UeCc9P9o](https://unsplash.com/photos/1l6UeCc9P9o) |

Merchants are fictional; they render as monogram tiles (no wordmarks).

## Kit photography

Every product on a kit page is shown in studio photography. These are
cut-outs made for the kit (background removed with rembg’s
`isnet-general-use` model, edges and holes cleaned by hand, exported as
transparent WebP) from photographs on Unsplash
([Unsplash License](https://unsplash.com/license)) and Pexels
([Pexels License](https://www.pexels.com/license/)); neither license
requires attribution, credited here anyway.

The products on the pages are fictional, but the photographs are of real
products: several show their manufacturers’ marks (Nike shoes; Bronica,
Hamilton, Rolex and Seiko watch dials). They stand in until a publication
supplies its own packshots and must not be published as-is.

| File | Shows (stands in for) | Source |
| --- | --- | --- |
| `kit/shoe-aerolite.webp` | White/orange sneaker (Meridian Aerolite 3), from `shoe-aerolite-02.jpg` | Unsplash [J2-wAQDckus](https://unsplash.com/photos/J2-wAQDckus) |
| `kit/shoe-tempo.webp` | Gray running shoe (Halvard Tempo Pro), from `shoe-tempo-01.jpg` | Unsplash [LxVxPA1LOVM](https://unsplash.com/photos/LxVxPA1LOVM) |
| `kit/shoe-cumulus.webp` | Volt training shoe (Oriel Cumulus Max), from `shoe-cumulus-01.jpg` | Unsplash [kP6knT7tjn4](https://unsplash.com/photos/kP6knT7tjn4) |
| `kit/watch-meridian.webp` | Steel diver, red and blue bezel (Halden Meridian 40 GMT); stand removed, bracelet faded at the foot | Pexels [33684303](https://www.pexels.com/photo/33684303/) |
| `kit/watch-ardent.webp` | Rose-gold dress watch on brown leather (Lindqvist Ardent 38) | Pexels [5058216](https://www.pexels.com/photo/5058216/) |
| `kit/watch-sato.webp` | Diver on an orange rubber strap (Sato Marine 38); strap holes filled | Pexels [15649356](https://www.pexels.com/photo/15649356/) |
| `kit/watch-okada.webp` | Black diver on a steel bracelet (Okada Tide 40 Diver); table reflection trimmed | Unsplash [GaHmbqNh5q8](https://unsplash.com/photos/GaHmbqNh5q8), Patrick Langwallner |
| `kit/watch-brennan.webp` | Field watch on a navy canvas strap (Brennan Field 36) | Pexels [28261820](https://www.pexels.com/photo/28261820/) |
| `kit/supp-peak.webp` | Black-lidded tub (Peak Supply Creatine Monohydrate) | Unsplash [photo-1704650311298-4d6915d34c64](https://images.unsplash.com/photo-1704650311298-4d6915d34c64) |
| `kit/supp-ironhouse.webp` | White supplement bottle (Ironhouse Creapure Micronised); the same photograph as `supplement-creatine-02.jpg` | Unsplash [EUlDhZSyMpg](https://unsplash.com/photos/EUlDhZSyMpg) |
| `kit/supp-northlane.webp` | White 1 kg tub (Northlane Basics); scoop removed, corner repaired | Unsplash [photo-1664787020149-ebb836adcf3c](https://images.unsplash.com/photo-1664787020149-ebb836adcf3c) |
| `kit/supp-fieldwork.webp` | Clear capsule jar (Fieldwork Creatine Capsules), from `supplement-creatine-01.jpg` | Unsplash [yYZthq7bucQ](https://unsplash.com/photos/yYZthq7bucQ) |

## Kit graphics

Everything else on kit pages is generated at render time from each
product’s own numbers, as HTML: the scorecard, the telemetry rows
(chronometer strip, heavy metals, bench tests; `src/kit/ui/telemetry.tsx`)
and the lab badge. No image files, no third-party artwork.
