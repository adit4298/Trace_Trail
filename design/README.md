# TraceTrail Design System

## Overview
This design system provides comprehensive guidelines, components, and assets for the Trac

## Quick Links
- [Figma Design Files](./figma_links.md)
- [Design System Documentation](./design_system/design_system.md)
- [Component Library](./design_system/components.md)
- [Style Guide PDF](./design_system/style_guide.pdf)

## Folder Structure
design/
├── design_system/ # Core design system documentation
├── wireframes/ # Low & high fidelity wireframes
├── prototypes/ # Interactive prototypes
├── assets/ # All design assets (icons, logos, illustrations)
├── animations/ # Lottie animations & specs
└── exports/ # Final handoff assets

## Design Principles
1. **Privacy-First**: Design should reinforce trust and transparency
2. **Clear Hierarchy**: Information architecture must be intuitive
3. **Accessible**: WCAG 2.1 AA compliant
4. **Consistent**: Unified visual language across all touchpoints
5. **Performant**: Optimized assets for fast loading

## Color Philosophy
Our color palette reflects our commitment to privacy:
- **Green**: Security, trust, positive actions
- **Red**: Warnings, risks, critical alerts
- **Blue**: Information, calmness, technology
- **Gray**: Neutrality, sophistication

## Usage
All assets are production-ready and optimized for:
- Web (SVG, PNG)
- Mobile (1x, 2x, 3x density)
- Print (CMYK, 300dpi)

## Premium dashboard reference build (2025)
A complete Next.js + Tailwind implementation of the TraceTrail premium dashboard lives in
`design/ui-dashboard`. It demonstrates the latest 2025 design language (glassmorphism, soft depth,
responsive grid, adaptive typography) and can be used as the canonical reference for future product
screens. See the README in that folder for build instructions (`npm install && npm run dev`).

## Tools & Software
- **Design**: Figma (primary), Adobe XD (backup)
- **Illustration**: Adobe Illustrator
- **Animation**: LottieFiles, After Effects
- **Prototyping**: Figma, Principle
- **Version Control**: Abstract (design version control)

## Handoff Process
1. Design finalized in Figma
2. Developer mode enabled
3. Assets exported to `/exports/handoff_assets/`
4. Design tokens generated to `design_tokens.json`
5. Documentation updated
6. Handoff meeting with developers

## Contact
Design Lead: design@tracetrail.com
