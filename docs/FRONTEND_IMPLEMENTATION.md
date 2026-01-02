# Frontend Implementation Details

**Purpose**: Comprehensive documentation of the TraceTrail frontend implementation, architecture, components, and data flows.

**Location**: `frontend/`  
**Framework**: Next.js 14 with App Router  
**Deployment**: Vercel at `https://app.tracetrail.in`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Routing System](#routing-system)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Styling System](#styling-system)
8. [Build and Deployment](#build-and-deployment)

---

## Architecture Overview

### Next.js App Router

The frontend uses **Next.js 14 App Router**, which provides:
- **Server Components**: Default for data fetching (no JavaScript sent to client)
- **Client Components**: Marked with `'use client'` for interactivity
- **Server Actions**: For mutations (future use)
- **File-based Routing**: Routes defined by file structure

### Key Architectural Decisions

1. **Server-First**: Data fetching happens on the server by default
2. **Progressive Enhancement**: Works without JavaScript, enhanced with it
3. **Type Safety**: Full TypeScript coverage
4. **Component Composition**: Reusable, composable components
5. **Error Boundaries**: Graceful error handling

---

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (ThemeProvider)
│   ├── page.tsx                 # Dashboard home page
│   ├── [section]/               # Dynamic route for sections
│   │   └── page.tsx             # Section pages (signals, investigations, etc.)
│   ├── dashboard/
│   │   └── accounts/
│   │       └── page.tsx         # Connected accounts page
│   └── settings/
│       ├── page.tsx             # Settings page
│       └── preferences/
│           └── page.tsx         # Preferences page
│
├── components/                   # React components
│   ├── AppShell.tsx             # Main app shell wrapper
│   ├── layout/
│   │   ├── TopNavbar.tsx        # Top navigation bar
│   │   ├── SidebarDrawer.tsx    # Mobile sidebar drawer
│   │   ├── SidebarContext.tsx   # Sidebar state management
│   │   └── AnimatedBackground.tsx
│   ├── dashboard/
│   │   └── DashboardOverview.tsx  # Main dashboard component
│   ├── accounts/
│   │   ├── ConnectedAccounts.tsx   # Account management
│   │   └── ProviderCard.tsx         # Individual provider card
│   ├── system-health/
│   │   ├── SystemHealthAvatar.tsx   # 3D health widget
│   │   ├── HealthModal.tsx
│   │   └── useHealthStatus.ts
│   ├── cards/
│   │   ├── MetricCard.tsx
│   │   └── TrendCard.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Tooltip.tsx
│       └── Modal.tsx
│
├── lib/                          # Utilities and types
│   ├── api.ts                   # Server-side API client
│   └── types.ts                 # TypeScript type definitions
│
├── src/                          # Additional source files
│   └── services/
│       └── api.ts               # Client-side API service
│       └── accountService.ts    # Account management service
│
├── styles/
│   └── globals.css              # Global styles and Tailwind
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── package.json
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## Routing System

### Route Structure

| Route | File | Type | Description |
|-------|------|------|-------------|
| `/` | `app/page.tsx` | Server | Dashboard home |
| `/signals` | `app/[section]/page.tsx` | Server | Signals section |
| `/investigations` | `app/[section]/page.tsx` | Server | Investigations section |
| `/insights` | `app/[section]/page.tsx` | Server | Insights section |
| `/activity` | `app/[section]/page.tsx` | Server | Activity section |
| `/dashboard/accounts` | `app/dashboard/accounts/page.tsx` | Server | Connected accounts |
| `/settings` | `app/settings/page.tsx` | Dynamic | Settings page |
| `/settings/preferences` | `app/settings/preferences/page.tsx` | Dynamic | Preferences page |

### Dynamic Routes

**`[section]` Route**: Handles multiple section pages dynamically
- Reads `params.section` to determine which section to render
- Uses `SECTION_CONTENT` mapping for section-specific data
- All sections share the same layout and structure

### Route Configuration

**Dynamic Rendering**: Settings pages use `export const dynamic = 'force-dynamic'` to prevent build-time API calls

**Static Generation**: Dashboard and section pages can be statically generated with fallback to API data

---

## Component Architecture

### Component Hierarchy

```
AppShell (Server Component)
├── SidebarProvider (Client Context)
│   ├── TopNavbar (Client Component)
│   │   ├── Search
│   │   ├── Theme Toggle
│   │   ├── Notifications
│   │   └── Profile Menu
│   ├── SidebarDrawer (Client Component)
│   │   └── NavSidebar
│   └── Main Content (Server/Client Components)
│       ├── DashboardOverview
│       │   ├── MetricCard[]
│       │   ├── TrendChart
│       │   ├── LiveActivityList
│       │   └── SystemHealthAvatar
│       └── Page-Specific Components
```

### Key Components

#### 1. AppShell

**Location**: `components/AppShell.tsx`  
**Type**: Server Component  
**Purpose**: Main application wrapper

**Responsibilities**:
- Provides layout structure
- Wraps content with SidebarProvider
- Includes TopNavbar and SidebarDrawer
- Handles navigation items and user data

**Props**:
```typescript
interface AppShellProps {
  navItems: NavItem[];
  notifications: number;
  user: UserProfile;
  children: ReactNode;
}
```

#### 2. TopNavbar

**Location**: `components/layout/TopNavbar.tsx`  
**Type**: Client Component  
**Purpose**: Top navigation bar with search, theme toggle, notifications, and profile menu

**Features**:
- Hamburger menu toggle (opens sidebar)
- Global search (placeholder)
- Theme toggle (dark/light)
- Notifications badge
- Profile dropdown menu with navigation

**State Management**:
- `profileOpen`: Controls profile dropdown visibility
- Uses `useRouter` for navigation
- Uses `useTheme` hook for theme switching

#### 3. SidebarDrawer

**Location**: `components/layout/SidebarDrawer.tsx`  
**Type**: Client Component  
**Purpose**: Mobile/tablet sidebar drawer

**Features**:
- Slides in from left on mobile
- Overlay backdrop
- Closes on outside click or Escape key
- Contains NavSidebar component

**State Management**:
- Uses `SidebarContext` for open/close state
- Handles body scroll lock when open

#### 4. DashboardOverview

**Location**: `components/dashboard/DashboardOverview.tsx`  
**Type**: Client Component  
**Purpose**: Main dashboard view

**Features**:
- Welcome section with quick actions
- Accounts overview section
- Metrics grid (4 metric cards)
- Trend chart
- Live activity list
- System health avatar (3D widget)

**State Management**:
- `selectedMetric`: Currently selected metric for detail panel
- `selectedActivity`: Currently selected activity for drawer
- `chartRange`: Time range for trend chart

#### 5. ConnectedAccounts

**Location**: `components/accounts/ConnectedAccounts.tsx`  
**Type**: Client Component  
**Purpose**: Account connection management

**Features**:
- Lists all OAuth providers (Google, Instagram, Facebook, Twitter)
- Shows connection status for each
- Connect/disconnect buttons
- Sync functionality
- Error handling and user feedback

**State Management**:
- `accounts`: Array of account connections
- `loading`: Loading state
- `actions`: Per-provider action states (connect, disconnect, sync)
- `error`: Error message state
- `infoMessage`: Success/info message state

**API Integration**:
- Uses `accountService.ts` for API calls
- Handles OAuth redirect flow
- Manages sync operations

#### 6. ProviderCard

**Location**: `components/accounts/ProviderCard.tsx`  
**Type**: Client Component  
**Purpose**: Individual OAuth provider card

**Features**:
- Provider icon and branding
- Connection status display
- Last sync timestamp
- Connect/disconnect/sync buttons
- Loading states for actions

**Props**:
```typescript
interface ProviderCardProps {
  provider: Provider;
  connected: boolean;
  username?: string;
  email?: string;
  lastSyncedAt?: string | null;
  isConnecting?: boolean;
  isDisconnecting?: boolean;
  isSyncing?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync?: () => void;
}
```

#### 7. SystemHealthAvatar

**Location**: `components/system-health/SystemHealthAvatar.tsx`  
**Type**: Client Component  
**Purpose**: 3D health score visualization widget

**Features**:
- Fixed position (bottom-left on desktop)
- Health score display (0-100)
- Color-coded status (green/yellow/red)
- Hover tooltip
- Click to open detailed modal
- Responsive (hidden on mobile/tablet)

**Positioning**:
- Uses `fixed` positioning
- `max-lg:hidden` to hide on mobile/tablet
- Prevents layout issues on smaller screens

---

## State Management

### Server State

**Data Fetching**: Server Components fetch data using `fetchDashboardSnapshot()`

**Location**: `lib/api.ts`

**Implementation**:
```typescript
export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  // During build time, use mock data
  if (process.env.NEXT_PHASE === 'phase-production-build' || !API_BASE_URL) {
    return mockDashboardSnapshot;
  }

  // Runtime: Fetch from API with fallback to mock
  try {
    return await fetchJson<DashboardSnapshot>(dashboardSummaryUrl, {
      revalidate: 60,
      tags: ['dashboard']
    });
  } catch (error) {
    return mockDashboardSnapshot;
  }
}
```

**Features**:
- Build-time safety (uses mock data during build)
- Runtime fallback (uses mock if API unavailable)
- Revalidation every 60 seconds
- Tag-based cache invalidation

### Client State

**React Context**: Used for global client state

**Contexts**:
1. **SidebarContext**: Manages sidebar open/close state
2. **ThemeContext**: Manages dark/light theme (via `useTheme` hook)

**Local State**: Component-level state using `useState`

**Examples**:
- `ConnectedAccounts`: Manages account list and action states
- `DashboardOverview`: Manages selected items and chart range
- `TopNavbar`: Manages profile menu visibility

### API State Management

**Client-Side API Calls**: Uses custom hooks and services

**Location**: `src/services/accountService.ts`

**Pattern**:
```typescript
// Service function
export const getAccounts = async (): Promise<AccountConnection[]> => {
  const response = await request<AccountDto[]>(accountsEndpoint());
  // Transform and return
};

// Component usage
const [accounts, setAccounts] = useState<AccountConnection[]>([]);
useEffect(() => {
  getAccounts().then(setAccounts).catch(handleError);
}, []);
```

---

## API Integration

### Server-Side API Client

**Location**: `lib/api.ts`  
**Usage**: Server Components only

**Functions**:
- `fetchJson<T>()`: Generic fetch with Next.js caching
- `fetchDashboardSnapshot()`: Fetches dashboard data

**Features**:
- Automatic caching with revalidation
- Error handling with fallback
- Type-safe responses

### Client-Side API Client

**Location**: `src/services/api.ts`  
**Usage**: Client Components

**Functions**:
- `apiGet<T>()`: GET request
- `apiPost<T>()`: POST request
- `apiPut<T>()`: PUT request
- `apiPatch<T>()`: PATCH request
- `apiDelete<T>()`: DELETE request
- `apiFileUpload<T>()`: File upload

**Features**:
- Automatic base URL resolution
- Token handling
- Error handling
- Type safety

### Account Service

**Location**: `src/services/accountService.ts`  
**Purpose**: OAuth account management

**Functions**:
- `getAccounts()`: Get all connected accounts
- `getOAuthRedirectUrl(provider)`: Get OAuth redirect URL
- `disconnectAccount(provider)`: Disconnect an account
- `syncProvider(provider)`: Sync a specific provider
- `syncAll()`: Sync all connected accounts

**Error Handling**:
- Network errors caught and displayed to user
- API unavailability handled gracefully
- Buttons disabled when API unavailable

---

## Styling System

### Tailwind CSS

**Configuration**: `tailwind.config.js`

**Features**:
- Custom color system (primary, success, danger, muted, etc.)
- Dark mode support
- Custom spacing and typography
- Responsive breakpoints

### Design System

**Colors**:
- Primary: Brand color
- Success: Green for positive states
- Danger: Red for errors/warnings
- Muted: Gray for secondary text
- Surface: Background colors
- Border: Border colors

**Typography**:
- Font: Space Grotesk (Google Fonts)
- Headings: Semibold, various sizes
- Body: Regular, readable sizes

**Components**:
- Rounded corners: `rounded-2xl`, `rounded-xl`
- Shadows: `shadow-soft`, `shadow-lg`
- Borders: `border-border/60` (semi-transparent)

### Dark Theme

**Implementation**: ThemeProvider with `useTheme` hook

**Toggle**: TopNavbar theme toggle button

**Storage**: Theme preference stored in localStorage

**CSS Variables**: Colors defined as CSS variables for theme switching

---

## Build and Deployment

### Build Process

**Command**: `npm run build`

**Steps**:
1. Type checking (`tsc --noEmit`)
2. Linting (`next lint`)
3. Next.js build:
   - Compiles TypeScript
   - Optimizes images
   - Generates static pages
   - Creates production bundles
   - Outputs to `.next/` directory

**Build-Time Safety**:
- Pages that need API data use `dynamic = 'force-dynamic'`
- `fetchDashboardSnapshot()` uses mock data during build
- No build-time API calls that could timeout

### Deployment (Vercel)

**Platform**: Vercel  
**URL**: `https://app.tracetrail.in`

**Configuration**:
- **Framework**: Next.js (auto-detected)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)

**Environment Variables**:
- `NEXT_PUBLIC_API_URL=https://api.tracetrail.in`

**Deployment Flow**:
1. Push to `main` branch
2. Vercel detects changes
3. Runs `npm run build`
4. Deploys to production
5. SSL certificate auto-provisioned

**Features**:
- Automatic deployments
- Preview deployments for PRs
- Global CDN
- Automatic SSL
- Analytics and logs

---

## Error Handling

### Build-Time Errors

**Problem**: API unavailable during build  
**Solution**: Use mock data during build phase

**Implementation**:
```typescript
if (process.env.NEXT_PHASE === 'phase-production-build' || !API_BASE_URL) {
  return mockDashboardSnapshot;
}
```

### Runtime Errors

**API Unavailable**:
- Falls back to mock data
- Shows user-friendly message
- Buttons disabled with "Coming Soon" text

**Network Errors**:
- Caught in try-catch blocks
- Displayed to user with clear messages
- Auto-dismiss after 5 seconds

**Component Errors**:
- Error boundaries (future)
- Graceful degradation
- Fallback UI

---

## Performance Optimizations

### Code Splitting

- Next.js automatically code-splits by route
- Dynamic imports for heavy components
- Lazy loading for non-critical features

### Image Optimization

- Next.js Image component
- Automatic format conversion (WebP, AVIF)
- Responsive images
- Lazy loading

### Caching

- Static pages cached at CDN
- API responses cached with revalidation
- Browser caching for assets

### Bundle Size

- Tree shaking
- Dynamic imports
- Optimized dependencies

---

## Testing

### Type Checking

**Command**: `npm run typecheck`  
**Tool**: TypeScript compiler

### Linting

**Command**: `npm run lint`  
**Tool**: ESLint with Next.js config

### Unit Tests (Future)

**Framework**: Jest + React Testing Library  
**Location**: `__tests__/` directories

---

## Development Workflow

### Local Development

```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:3000
```

### Environment Setup

**File**: `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Hot Reload

- Next.js Fast Refresh enabled
- Changes reflect immediately
- State preserved during updates

---

## Key Features Implementation

### 1. OAuth Flow

**User Journey**:
1. User clicks "Connect" on provider card
2. Frontend calls `getOAuthRedirectUrl(provider)`
3. Backend returns OAuth authorization URL
4. Frontend redirects user to OAuth provider
5. User authorizes on provider site
6. Provider redirects to `/auth/{provider}/callback`
7. Backend processes callback and stores tokens
8. Backend redirects to frontend `/oauth/callback?status=success`
9. Frontend shows success message

**Error Handling**:
- API unavailable: Button disabled, shows "Coming Soon"
- OAuth error: Error message displayed
- Network error: User-friendly error message

### 2. Account Management

**Features**:
- View all connected accounts
- See last sync time
- Manual sync per provider
- Sync all accounts
- Disconnect accounts

**State Management**:
- Real-time updates after actions
- Loading states for all operations
- Success/error feedback

### 3. Dashboard

**Data Sources**:
- Server Component fetches on page load
- Client Components can refresh data
- Real-time updates (future: WebSocket)

**Visualization**:
- Metric cards with trends
- Trend charts (Recharts)
- Activity timeline
- Health score widget

---

## Accessibility

### Features

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus management
- Screen reader support

### WCAG Compliance

- Color contrast ratios
- Focus indicators
- Skip links
- Alt text for images

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

---

## Future Enhancements

1. **Server Actions**: Use Next.js Server Actions for mutations
2. **Real-time Updates**: WebSocket integration
3. **Offline Support**: Service workers and caching
4. **Advanced Analytics**: Enhanced tracking
5. **Performance Monitoring**: Web Vitals tracking

---

**Document Version**: 1.0  
**Last Updated**: 2025

