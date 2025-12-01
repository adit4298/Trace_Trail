# TraceTrail Color Palette

## Primary Colors

### Green (Primary Brand Color)
Represents security, privacy, positive actions

| Name       | Hex       | RGB           | Usage                         |
|-----------|-----------|---------------|-------------------------------|
| `green-50`  | `#f0fdf4` | `240, 253, 244` | Light backgrounds            |
| `green-100` | `#dcfce7` | `220, 252, 231` | Hover states                 |
| `green-500` | `#22c55e` | `34, 197, 94`   | **Primary** (buttons, accents) |
| `green-600` | `#16a34a` | `22, 163, 74`   | Hover states                 |
| `green-700` | `#15803d` | `21, 128, 61`   | Active states                |
| `green-900` | `#14532d` | `20, 83, 45`    | Dark text                    |

### Blue (Secondary)
Information, trust, technology

| Name       | Hex       | RGB           | Usage                   |
|-----------|-----------|---------------|-------------------------|
| `blue-50`  | `#eff6ff` | `239, 246, 255` | Info backgrounds       |
| `blue-100` | `#dbeafe` | `219, 234, 254` | Subtle highlights      |
| `blue-500` | `#3b82f6` | `59, 130, 246`  | **Info** (alerts, links) |
| `blue-600` | `#2563eb` | `37, 99, 235`   | Hover                  |
| `blue-700` | `#1d4ed8` | `29, 78, 216`   | Active                 |

## Semantic Colors

### Error / Danger

| Name       | Hex       | RGB           | Usage                  |
|-----------|-----------|---------------|------------------------|
| `red-50`  | `#fef2f2` | `254, 242, 242` | Error backgrounds     |
| `red-500` | `#ef4444` | `239, 68, 68`   | **Error** (validation, alerts) |
| `red-600` | `#dc2626` | `220, 38, 38`   | Hover                  |
| `red-700` | `#b91c1c` | `185, 28, 28`   | Active                 |

### Warning

| Name        | Hex        | RGB           | Usage                    |
|------------|-----------|---------------|--------------------------|
| `yellow-50`  | `#fefce8` | `254, 252, 232` | Warning backgrounds      |
| `yellow-500` | `#eab308` | `234, 179, 8`   | **Warning** (caution alerts) |
| `yellow-600` | `#ca8a04` | `202, 138, 4`   | Hover                    |

### Success

| Name          | Hex         | RGB           | Usage                  |
|---------------|------------|---------------|------------------------|
| `emerald-50`  | `#ecfdf5`  | `236, 253, 245` | Success backgrounds   |
| `emerald-500` | `#10b981`  | `16, 185, 129`  | **Success** (completion) |
| `emerald-600` | `#059669`  | `5, 150, 105`   | Hover                  |

## Neutral Colors

### Gray Scale

| Name       | Hex       | RGB           | Usage                  |
|-----------|-----------|---------------|------------------------|
| `gray-50`  | `#f9fafb` | `249, 250, 251` | Background            |
| `gray-100` | `#f3f4f6` | `243, 244, 246` | Card backgrounds       |
| `gray-200` | `#e5e7eb` | `229, 231, 235` | Borders                |
| `gray-300` | `#d1d5db` | `209, 213, 219` | Disabled               |
| `gray-400` | `#9ca3af` | `156, 163, 175` | Placeholder text       |
| `gray-500` | `#6b7280` | `107, 114, 128` | Secondary text         |
| `gray-600` | `#4b5563` | `75, 85, 99`    | Body text              |
| `gray-700` | `#374151` | `55, 65, 81`    | Headings               |
| `gray-800` | `#1f2937` | `31, 41, 55`    | Dark backgrounds       |
| `gray-900` | `#111827` | `17, 24, 39`    | Darkest                |

## Dark Mode Colors

### Background
- Primary: `#0f172a` (slate-900)  
- Secondary: `#1e293b` (slate-800)  
- Tertiary: `#334155` (slate-700)  

### Text
- Primary: `#f1f5f9` (slate-100)  
- Secondary: `#cbd5e1` (slate-300)  
- Tertiary: `#94a3b8` (slate-400)  

## Color Usage Guidelines

### Text on Backgrounds
✅ **Good Contrast**
```css
/* Light Mode */
color: #111827; /* gray-900 */
background: #ffffff;
/* Contrast: 16.05:1 ✅ */

/* Dark Mode */
color: #f9fafb; /* gray-50 */
background: #111827; /* gray-900 */
/* Contrast: 16.05:1 ✅ */
