import type { OnboardingStep } from './Onboarding';

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to TraceTrail',
    description: "Let's take 30 seconds to tour your security companion."
  },
  {
    id: 'menu',
    title: 'Meet the command menu',
    description: 'Tap the hamburger button anytime to reveal the workspace sidebar.',
    targetId: 'onboarding-hamburger'
  },
  {
    id: 'accounts-nav',
    title: 'Jump into Accounts',
    description: 'Use the Accounts surface to link Google, Instagram, Facebook, and X for richer insights.',
    targetId: 'onboarding-accounts-link'
  },
  {
    id: 'accounts-overview',
    title: 'Linked accounts unlock more context',
    description:
      'Each provider powers insights, telemetry, footprint tracking, and real-time signals so you see issues sooner.',
    targetId: 'onboarding-accounts-section'
  },
  {
    id: 'navigation',
    title: 'Navigate key areas quickly',
    description: 'Dashboard, Accounts, Insights, Signals, and Settings all live in the sidebar navigation.',
    targetId: 'onboarding-navigation'
  },
  {
    id: 'health',
    title: 'Monitor your digital health',
    description: 'This pane keeps an eye on footprint health, anomalies, and recommendations in one glance.',
    targetId: 'onboarding-health-section'
  },
  {
    id: 'complete',
    title: "You're all set!",
    description: 'TraceTrail will remember this tour. Reopen it anytime from Help > Tutorials.'
  }
];


