---
name: Rivières Libres
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#43474f'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747780'
  outline-variant: '#c4c6d0'
  surface-tint: '#415f8f'
  primary: '#001431'
  on-primary: '#ffffff'
  primary-container: '#002856'
  on-primary-container: '#7490c4'
  inverse-primary: '#aac7fe'
  secondary: '#00658e'
  on-secondary: '#ffffff'
  secondary-container: '#67c5fd'
  on-secondary-container: '#005072'
  tertiary: '#00190e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00301e'
  on-tertiary-container: '#609c7e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7fe'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#284776'
  secondary-fixed: '#c7e7ff'
  secondary-fixed-dim: '#85cfff'
  on-secondary-fixed: '#001e2e'
  on-secondary-fixed-variant: '#004c6c'
  tertiary-fixed: '#b1f0ce'
  tertiary-fixed-dim: '#95d4b3'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#0e5138'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  risk-low: '#BDD5EA'
  risk-moderate: '#FFD166'
  risk-high: '#F77F00'
  risk-very-high: '#D62828'
  audience-citizen: '#E07A5F'
  audience-municipality: '#002856'
  audience-professional: '#0081A7'
  sediment: '#8D99AE'
  stone: '#4A4E69'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
  max-width: 1280px
---

## Brand & Style

The design system is built on the narrative of "The Bridge Between Science and Regulation." It serves as a credible, educational portal that translates complex hydrogeomorphological data into actionable insights for Quebec citizens and officials.

The visual style is **Corporate / Modern** with a strong emphasis on **Minimalism**. It prioritizes clarity and legibility to ensure information is non-alarmist yet authoritative. The interface uses generous whitespace and a structured grid to reflect the precision of scientific data, while incorporating soft roundedness and natural tones to maintain an approachable, community-focused feel.

## Colors

The palette is rooted in the "Deep River" aesthetic. The primary color is a deep, authoritative navy used for structural elements and institutional credibility. The secondary blue provides a vibrant, aquatic highlight for interactive elements.

**Mapping & Risk Status:**
We adhere to official Quebec conventions for flood risk visualization. Use the `risk-` named colors for map overlays and status indicators. 

**Audience Accents:**
To tailor the experience without breaking the system:
- **Citizens:** Use the warm `audience-citizen` clay tone for primary CTAs and educational highlights.
- **Municipalities:** Maintain the solid institutional `audience-municipality` navy.
- **Professionals:** Utilize the `audience-professional` technical teal for data-heavy tools and documentation links.

## Typography

This design system utilizes a tiered typographic approach to balance authority with readability. 

- **Headlines:** Montserrat is used for its geometric precision and modern institutional feel. Large display types should use tighter letter spacing to maintain a cohesive, "locked-in" look.
- **Body:** Source Sans 3 provides exceptional legibility for long-form educational content and regulatory text. Its humanist qualities ensure the text feels friendly rather than clinical.
- **Data & Labels:** Hanken Grotesk is used for UI labels, table headers, and map annotations to provide a sharp, technical contrast to the body text.

## Layout & Spacing

The system employs a **Fixed Grid** on desktop (12 columns) and a **Fluid Grid** on mobile (4 columns). 

- **Rhythm:** All spacing is based on a 4px baseline unit to ensure vertical harmony.
- **Margins:** Generous exterior margins (64px) on desktop create a "portal" effect, focusing the user's attention on the content.
- **Reflow:** On mobile, padding is reduced to 16px to maximize the viewing area for maps and diagrams. Complex data tables should transition to card-based layouts or horizontal-scroll containers on smaller screens.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. 

- **Surface Levels:** The base background is the neutral `#F6F6F6`. Content cards and containers use pure white (`#FFFFFF`) to pop against the background.
- **Shadows:** Use extremely soft, low-opacity shadows (Blur: 12px, Y: 4px, Color: `rgba(0, 40, 86, 0.08)`). The shadow color is slightly tinted with the primary navy to keep the depth feeling natural to the brand.
- **Interactivity:** Elements like buttons or active cards should increase in shadow spread slightly upon hover to simulate a physical lift, reinforcing the "tactile but professional" goal.

## Shapes

The design system uses a **Rounded** (Level 2) shape language. 

- **Components:** Standard buttons and input fields use a 0.5rem (8px) radius. 
- **Containers:** Large content cards and informational sections use a 1rem (16px) radius to soften the technical nature of the content.
- **Chips/Badges:** Risk status indicators and tags should use "Pill" shapes (Full Rounding) to distinguish them from actionable buttons.

## Components

- **Buttons:** Primary buttons use the Secondary Blue with white text. For audience-specific portals, use the specified audience accent colors. Buttons have a subtle transition effect on hover, deepening the color by 10%.
- **Input Fields:** Use "Stone" colored borders (1px) that thicken and change to Secondary Blue on focus. Labels always sit above the field in Hanken Grotesk.
- **Risk Legend:** A specialized component. Use 12px circles of the `risk-` named colors followed by Source Sans 3 text. These should be placed in a white container with a Level 2 shadow.
- **Data Cards:** Used for presenting hydrogeomorphological metrics. These feature a Secondary Blue top-border (4px) to denote importance and use a combination of Montserrat for values and Hanken Grotesk for units.
- **Educational Callouts:** Use a light tint of the Tertiary Green as a background with a solid green left-border to highlight nature-based solution tips.